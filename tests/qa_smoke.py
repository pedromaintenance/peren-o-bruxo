import os, threading, http.server, socketserver, time, json, collections
from playwright.sync_api import sync_playwright
from functools import partial
ROOT=str(__import__('pathlib').Path(__file__).resolve().parent.parent)
errors=[]
counts=collections.Counter()
with sync_playwright() as p:
  chromium=__import__('shutil').which('chromium') or __import__('shutil').which('google-chrome')
  browser=p.chromium.launch(headless=True,executable_path=chromium,args=['--no-sandbox','--disable-dev-shm-usage'])
  context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True,accept_downloads=True)
  page=context.new_page();page.on('pageerror',lambda e: errors.append(str(e)))
  data={fn:json.load(open(f'{ROOT}/data/{fn}.json')) for fn in ['itens','receitas','magias','monstros','cidades','expedicoes','missoes','manifesto_dados','reliquias_dnd']}
  game_js=open(f'{ROOT}/game.js').read();game_css=open(f'{ROOT}/style.css').read()
  def boot(saved=None):
    global page
    page.close()
    page=context.new_page()
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.set_content('<!doctype html><html><body><main id="app"></main></body></html>')
    page.add_style_tag(content=game_css)
    page.evaluate(r"""({data,saved})=>{window.__testData=data;window.__saved=saved;window.__mem={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:(k)=>window.__saved||window.__mem[k]||null,setItem:(k,v)=>window.__mem[k]=v,removeItem:(k)=>delete window.__mem[k]}});window.fetch=async u=>({ok:true,json:async()=>window.__testData[String(u).replace(/^.*\//,'').replace(/\.json$/,'')]});}""",{'data':data,'saved':saved})
    page.add_script_tag(content=game_js)
    page.wait_for_function('typeof S!=="undefined"&&S!==null',timeout=45000)
  # print('STEP','boot()',flush=True)
  boot()
  def ev(js):return page.evaluate(js)
  assert ev('DB.itens.length')==2785
  assert ev('DB.reliquias_dnd.length')==253
  # print('STEP',"counts['boot']=1",flush=True)
  counts['boot']=1
  # every shop stock check
  rr=ev('''() => {let r=[];for(const c of DB.cidades)for(const v of c.mercadores){let stock=vendorStock(c,v);r.push({city:c.id,profile:v.perfil,n:stock.length,ingredients:stock.filter(x=>x.categoria==='ingrediente').length,basic:stock.filter(x=>x.categoria==='ingrediente'&&x.nivel<=2).length,ids:stock.map(x=>x.id)})}return r}''')
  assert len(rr)==27 and all(0<r['n']<=18 for r in rr)
  assert all(r['ingredients']>=7 for r in rr if r['profile']=='alquimia')
  assert all(r['ingredients']>=7 for r in rr if r['profile']=='provisoes')
  for r in rr:
    assert len(set(r['ids']))==len(r['ids'])
  # print('STEP',"counts['vendors']=len(rr)",flush=True)
  counts['vendors']=len(rr)
  ev("UI.tab='mercado';render()")
  assert page.locator('button[data-act=buy]').count()<=18
  page.get_by_role('button',name='Vender',exact=True).click()
  assert page.locator('button[data-act=sell]').count()>0
  # print('STEP',"counts['market_views']=2",flush=True)
  counts['market_views']=2
  # toast spam and click anywhere
  ev("() => {for(let i=0;i<180;i++)goodMsg('Nível '+i+'!');return document.querySelectorAll('.toast').length}")
  assert page.locator('.toast').count()==1
  page.locator('.hero').click(position={'x':15,'y':20})
  assert page.locator('.toast').count()==0
  # print('STEP',"counts['toast_dismiss']=1",flush=True)
  counts['toast_dismiss']=1
  # large XP award no infinite message loop
  ev('xp(250000)')
  assert page.locator('.toast').count()==1
  assert ev('S.level')>10
  page.locator('.hero').click(position={'x':15,'y':20})
  assert page.locator('.toast').count()==0
  # print('STEP',"counts['xp']=1",flush=True)
  counts['xp']=1
  # normalized low-level test mission, persistence
  ev('''() => {S=fresh();UI.tab='mundo';const q=DB.missoes.find(q=>q.tipo!=='lendaria');S.city=q.cidade;S.currentQuest=q.id;S.actions=3;render();questGo()}''')
  assert ev('S.battle&&S.battle.foes.length>0')
  ev('''() => {S.battle.foes.forEach(x=>x.hp=0);enemyTurn()}''')
  assert ev('S.battle===null&&S.currentQuest===null&&S.completed.length===1')
  saved=ev('JSON.stringify(S)');boot(saved)
  assert ev('S.completed.length')==1
  # print('STEP',"counts['mission_regular']=1",flush=True)
  counts['mission_regular']=1
  # legendary mission (previous TypeError)
  ev('''() => {let q=DB.missoes.find(q=>q.tipo==='lendaria');S.city=q.cidade;S.currentQuest=q.id;S.actions=3;S.hp=maxhp();questGo();S.battle.foes.forEach(x=>x.hp=0);enemyTurn()}''')
  assert ev('S.battle===null&&S.currentQuest===null&&S.completed.length===2')
  assert 'Artefato:' in ' '.join(ev('S.battleResult.loot'))
  # print('STEP',"counts['mission_legendary']=1",flush=True)
  counts['mission_legendary']=1
  # all available missions distinct across cities, after unlocking / no black screens
  ev('''() => {S=fresh();for(const q of DB.missoes){S.city=q.cidade;S.actions=3;S.hp=maxhp();S.currentQuest=q.id;questGo();if(!S.battle)throw Error('Missing battle for '+q.id);S.battle.foes.forEach(f=>f.hp=0);enemyTurn();if(S.battle)throw Error('Battle stuck for '+q.id)}return S.completed.length}''')
  assert ev('S.completed.length')==len(ev('DB.missoes'))
  assert ev('S.level')>=2
  # print('STEP',"counts['all_quests']=len(ev('DB.missoes'))",flush=True)
  counts['all_quests']=len(ev('DB.missoes'))
  assert page.locator('.toast').count()<=1
  # battle with large grimorio
  ev('''() => {S=fresh();S.learned=DB.magias.map(m=>m.id);let z=DB.expedicoes[0];startBattle(z,2,'QA batalha com magias');S.battle.menu='spells';UI.battleSpellPage=0;render()}''')
  # print('BATTLE_DEBUG',ev('JSON.stringify({tab:UI.tab,menu:S.battle?.menu,learned:S.learned.length,html:document.querySelector("#view")?.innerText.slice(-1200)})'),flush=True)
  assert 0<page.locator('[data-act=cast]').count()<=6
  page.locator('[data-id=battleSpellNext]').click()
  assert ev('UI.battleSpellPage')==1
  page.locator('[data-act=battleSpells]').click()
  assert ev('S.battle.menu===null')
  # print('STEP',"counts['battle_spells_pagination']=1",flush=True)
  counts['battle_spells_pagination']=1
  # Combat actions flow / manually preserve health; use magic, potion, attack
  ev('''() => {S.hp=2000;S.battle.foes.forEach(f=>f.hp=400);render()}''')
  page.locator('[data-act=attack]').click()
  assert ev('S.battle.round')==2
  page.locator('[data-act=battleSpells]').click()
  assert page.locator('[data-act=cast]').count()<=6
  page.locator('[data-act=cast]').first.click()
  assert ev('S.battle.round')==3
  page.locator('[data-act=potions]').click()
  assert page.locator('[data-act=battleUse]').count()>0
  page.locator('[data-act=battleUse]').first.click()
  assert ev('S.battle.round')==4
  # print('STEP',"counts['combat_turns']=3",flush=True)
  counts['combat_turns']=3
  # exit no stuck combat; modal confirm
  page.on('dialog',lambda d:d.accept())
  page.locator('[data-act=retreat]').click()
  assert ev('S.battle===null')
  # print('STEP',"counts['retreat']=1",flush=True)
  counts['retreat']=1
  # recover in-progress victory save after reload
  ev('''() => {let z=DB.expedicoes[0];startBattle(z,1,'QA recuperação de missão');S.battle.foes.forEach(f=>f.hp=0);save()}''')
  saved=ev('JSON.stringify(S)');boot(saved)
  assert ev('S.battle.pendingVictory===true')
  page.locator('[data-act=finishBattle]').click()
  assert ev('S.battle===null')
  # print('STEP',"counts['save_recovery']=1",flush=True)
  counts['save_recovery']=1
  # Validate complete recipe graph and all 354 combat spells without UI rerender noise.
  quality=ev("""() => {let broken=[];for(const r of DB.receitas){if(!item(r.resultado))broken.push(r.id+':result');for(const ing of r.ingredientes)if(!item(ing.item))broken.push(r.id+':'+ing.item)}return {total:DB.receitas.length,broken,unknownSpells:DB.magias.filter(m=>!m.tipo||!Number.isFinite(m.potencia)||!Number.isFinite(m.mana)).length}}""")
  assert quality['total']>=2000 and not quality['broken'] and quality['unknownSpells']==0,quality
  counts['recipes_validated']=quality['total']
  all_spell_test=ev("""() => {let oldRender=render,oldEnemyTurn=enemyTurn;try{render=()=>{};enemyTurn=()=>{};S=fresh();S.learned=DB.magias.map(m=>m.id);S.mp=1e8;const z=DB.expedicoes[0];startBattle(z,1,'spell QA');S.battle.foes[0].hp=1e9;S.battle.foes[0].maxHp=1e9;let count=0;for(const sp of DB.magias){cast(sp.id);count++}return {count,battle:!!S.battle}}finally{render=oldRender;enemyTurn=oldEnemyTurn;S.battle=null;render()}}""")
  assert all_spell_test['count']==354 and all_spell_test['battle']
  counts['all_spells_cast']=all_spell_test['count']
  # realistic turns and fatal defeat
  ev("""() => {S=fresh();let z=DB.expedicoes[0];startBattle(z,1,'derrota QA');S.hp=1;S.battle.foes[0].ataque=99999;enemyTurn()}""")
  assert ev('S.battle===null&&S.hp>0&&S.battleResult.title.includes("Derrota")')
  counts['loss_recovery']=1
  # viewport checks, prevent horizontal overflow
  for width in [360,375,390,430]:
    page.set_viewport_size({'width':width,'height':780})
    ev("UI.tab='mercado';render()")
    overflow=ev('document.documentElement.scrollWidth - document.documentElement.clientWidth')
    assert overflow<=2,(width,overflow)
    counts['mobile_viewports']+=1
  # PWA checks via offline asset manifest (browser policy prevents local HTTP navigation)
  sw=open(f'{ROOT}/sw.js').read();assert 'peren-mercador-carcaca-0.1.1-offline' in sw
  assert 'reliquias_dnd' in sw and 'caches.open(CACHE)' in sw
  for f in ['index.html','game.js','style.css','manifest.webmanifest','sw.js','data/reliquias_dnd.json']:
    assert os.path.exists(f'{ROOT}/{f}')
  counts['offline_manifest_verified']=1
  if errors: print('JS_ERRORS',errors)
  assert not errors,errors
  # Screenshot optional in local QA
  browser.close()
print('QA PASSED:',dict(counts))
