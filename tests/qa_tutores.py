"""Regressão de tutores de crafting: UI, custos crescentes, save e ações."""
import json, os, collections
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
KEYS=['itens','receitas','magias','monstros','cidades','expedicoes','missoes','manifesto_dados','reliquias_dnd']
DATA={k:json.loads((ROOT/'data'/f'{k}.json').read_text()) for k in KEYS}
JS=(ROOT/'game.js').read_text(); CSS=(ROOT/'style.css').read_text()
assert "peren-mercador-carcaca-0.1.3-peren-oficial-offline" in (ROOT/'sw.js').read_text()
errors=[]; counts=collections.Counter()
with sync_playwright() as p:
 chromium=__import__('shutil').which('chromium') or __import__('shutil').which('google-chrome')
 browser=p.chromium.launch(headless=True,executable_path=chromium,args=['--no-sandbox','--disable-dev-shm-usage'])
 context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 def boot(saved=None):
  page=context.new_page();page.on('pageerror',lambda exc:errors.append(str(exc)))
  page.set_content('<!doctype html><html><body><main id="app"></main></body></html>')
  page.add_style_tag(content=CSS)
  page.evaluate('''({data,saved})=>{window.__data=data;window.__mem={};window.__saved=saved;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__saved||window.__mem[k]||null,setItem:(k,v)=>window.__mem[k]=v}});window.fetch=async u=>({ok:true,json:async()=>window.__data[String(u).split('/').pop().replace('.json','')]});}''',{'data':DATA,'saved':saved})
  page.add_script_tag(content=JS)
  page.wait_for_function('typeof S!=="undefined"&&S!==null',timeout=30000)
  return page
 page=boot()
 ev=lambda s:page.evaluate(s)
 assert ev('Object.keys(TUTOR_OFICIOS).length')==7
 for c in DATA['cidades']:
  skills=ev(f'''() => {{S.city={json.dumps(c['id'])};UI.tab='oficinas';render();return [...document.querySelectorAll('[data-act=trainTutor]')].map(x=>x.dataset.id)}}''')
  assert set(skills)==set(c['estacoes']),(c['id'],skills)
  assert 0<len(skills)<=3
  counts['cities_checked']+=1
 assert ev('!tutorAvailable("combate")')
 assert ev('!tutorAvailable("arcanismo")')
 ev("S=fresh();UI.tab='oficinas';render()")
 assert page.locator('[data-act=trainTutor]').count()==3
 # Precificação estritamente crescente mesmo em níveis altos.
 prices=ev('''() => {let old=S.skills.alquimia;let result=[];for(const lv of [1,10,30,40,60,90,99]){S.skills.alquimia=Math.ceil((lv-1)**2/4);result.push({lv:skl('alquimia'),cost:tutorCost('alquimia')})}S.skills.alquimia=old;return result}''')
 assert [x['lv'] for x in prices]==[1,10,30,40,60,90,99],prices
 assert all(prices[i+1]['cost']>prices[i]['cost'] for i in range(len(prices)-1))
 counts['price_levels_checked']=len(prices)
 # Aula na interface: consome uma ação, cobra valor exato e progride dois níveis.
 before=ev('''() => ({cost:tutorCost('alquimia'),lv:skl('alquimia'),gold:S.gold,actions:S.actions})''')
 page.locator('[data-act=trainTutor][data-id=alquimia]').click()
 after=ev('''() => ({lv:skl('alquimia'),gold:S.gold,actions:S.actions,nextCost:tutorCost('alquimia'),saved:localStorage.getItem('peren_carcaca_save_v1')})''')
 assert after['lv']==before['lv']+2,(before,after)
 assert after['gold']==before['gold']-before['cost']
 assert after['actions']==before['actions']-1 and after['nextCost']>before['cost']
 assert json.loads(after['saved'])['skills']['alquimia']>20
 assert page.locator('.toast').count()==1
 counts['ui_training']=1
 # Chamar tutor inexistente naquela cidade não cobra dinheiro.
 before=ev('''() => ({gold:S.gold,actions:S.actions,lv:skl('forja')})''')
 ev('trainTutor("forja")')
 assert ev('''() => S.gold''')==before['gold'] and ev('S.actions')==before['actions']
 assert ev('skl("forja")')==before['lv']
 counts['wrong_city']=1
 # Sem dinheiro, sem ações e no nível 100, custos e XP são preservados.
 ev('''() => {S.gold=0;S.actions=3;render()}''')
 lv=ev('skl("alquimia")'); ev('trainTutor("alquimia")')
 assert ev('skl("alquimia")')==lv and ev('S.actions')==3
 ev('''() => {S.gold=100000;S.actions=0;render()}''')
 ev('trainTutor("alquimia")')
 assert ev('skl("alquimia")')==lv and ev('S.gold')==100000
 ev('''() => {S.skills.alquimia=2451;S.actions=3;render()}''')
 assert ev('skl("alquimia")')==100
 ev('trainTutor("alquimia")')
 assert ev('S.gold')==100000 and ev('S.actions')==3
 assert page.locator('[data-act=trainTutor][data-id=alquimia]').is_disabled()
 counts['guards']=3
 # Multiplicadores de XP não ultrapassam 100 ou congelam próximo ao final.
 ev('''() => {S.skills.alquimia=Math.ceil(49**2/4);S.gold=100000;S.actions=3;render()}''')
 current=ev('skl("alquimia")');ev('trainTutor("alquimia")')
 assert current==50 and ev('skl("alquimia")')==51
 counts['high_level_progression']=1
 # Link na ficha abre tutores e não perde seleção; salvar e recarregar mantém nível.
 ev('''() => {UI.tab='peren';render()}''')
 page.locator('[data-act=tutors]').click()
 assert ev('UI.tab')=='oficinas'
 assert page.locator('#tutores').count()==1
 saved=ev('JSON.stringify(S)')
 lvl=ev('skl("alquimia")'); page.close();page=boot(saved)
 assert ev('skl("alquimia")')==lvl
 counts['save_compat']=1
 # Checar todas as larguras móveis.
 for width in [360,375,390,430]:
  page.set_viewport_size({'width':width,'height':780})
  ev('''() => {S.city='portomonte';S.actions=3;UI.tab='oficinas';render()}''')
  overflow=ev('document.documentElement.scrollWidth-document.documentElement.clientWidth')
  assert overflow<=2,(width,overflow)
  counts['mobile_widths']+=1
 assert not errors,errors
 browser.close()
print('QA TUTORES PASSED',dict(counts))
