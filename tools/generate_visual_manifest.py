#!/usr/bin/env python3
"""Manifesto de PRODUÇÃO de arte; não afirma que assets existem.

Usar na raiz do repositório: python tools/generate_visual_manifest.py [--check]
Apenas lê data/*.json e phaser/assets/review.json; escreve arquivos gerados
no catálogo de produção, sem tocar nos assets originais.
"""
from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path

GROUPS = {
    'items': ('itens', 'items'),
    'recipes': ('receitas', 'recipes'),
    'spells': ('magias', 'spells'),
    'monsters': ('monstros', 'monsters'),
    'cities': ('cidades', 'cities'),
    'regions': ('expedicoes', 'regions'),
    'quests': ('missoes', 'quests'),
}
MENU_IDS = [
    'mundo','mercado','oficinas','grimorio','peren','missoes','viagem',
    'exploracao','combate','recompensas','tutores','alquimia','forja',
    'encantamento','curtume','joalheria','cozinha','escrita'
]
CLIPS = {
    'character': ['idle','walk_n','walk_s','walk_e','walk_w','run','attack','cast','hurt','down','gather','interact','craft'],
    'monster': ['idle','move','attack','hurt','death','special','windup'],
    'npc': ['idle','talk','greet','gesture'],
    'spell': ['charge','cast','travel','impact','fade'],
    'item': ['drop','pickup','use'],
    'recipe': ['prepare','process','complete'],
    'city': ['ambient','menu_enter','menu_exit'],
    'region': ['ambient','weather','interact'],
    'quest': ['intro','objective','resolution'],
    'menu': ['open','close','focus','activate'],
}
DIRECTORIES = {
    'monster':'monsters','character':'characters','npc':'npcs','spell':'spells',
    'item':'items','recipe':'recipes','city':'cities','region':'regions','quest':'quests','menu':'ui'
}

def entry(kind, ident, name, **more):
    # Kind, diretório e clips vêm do catálogo/manifesto mestre, por isso não
    # repetimos os mesmos metadados em cada um dos 5.774 registros.
    more.pop('clips',None)
    more.pop('source',None)
    return {'id':str(ident), 'name':str(name), 'status':'planejado', **{k:v for k,v in more.items() if v is not None}}

def read_json(p):
    with p.open(encoding='utf-8') as stream:
        return json.load(stream)

def put(path, value, check):
    if isinstance(value,list):
        text='[\n'+',\n'.join('  '+json.dumps(row,ensure_ascii=False,separators=(',',':')) for row in value)+'\n]\n'
    else:
        text=json.dumps(value,ensure_ascii=False,indent=2)+'\n'
    if check:
        if not path.exists() or path.read_text(encoding='utf-8').rstrip('\r\n') != text.rstrip('\r\n'):
            raise AssertionError(f'Manifesto desatualizado: {path}; execute novamente o gerador')
    else:
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(text, encoding='utf-8')


def build(root: Path, check: bool=False):
    catalogs={k:read_json(root/'data'/f'{file}.json') for k,(file,_) in GROUPS.items()}
    ids={k:{r['id'] for r in values} for k,values in catalogs.items()}
    for k,v in catalogs.items():
        if len(ids[k])!=len(v):
            raise AssertionError(f'IDs duplicados em {k}')
    for recipe in catalogs['recipes']:
        if recipe['resultado'] not in ids['items'] or any(x['item'] not in ids['items'] for x in recipe['ingredientes']):
            raise AssertionError(f'Receita com vínculo inválido: {recipe["id"]}')
    npc_ids=[m['id'] for c in catalogs['cities'] for m in c['mercadores']]
    if len(set(npc_ids))!=len(npc_ids):
        raise AssertionError('NPCs duplicados')
    registry={
        'characters':[entry('character','peren','Peren, o Bruxo',clips=CLIPS['character'])],
        'monsters':[entry('monster',m['id'],m['nome'],source='monstros.json',category=m.get('categoria'),clips=CLIPS['monster']) for m in catalogs['monsters']],
        'spells':[entry('spell',m['id'],m['nome'],source='magias.json',school=m.get('escola'),clips=CLIPS['spell']) for m in catalogs['spells']],
        'items':[entry('item',m['id'],m['nome'],source='itens.json',category=m.get('categoria'),clips=CLIPS['item']) for m in catalogs['items']],
        'recipes':[entry('recipe',m['id'],m['nome'],source='receitas.json',station=m.get('estacao'),product=m['resultado'],clips=CLIPS['recipe']) for m in catalogs['recipes']],
        'cities':[entry('city',c['id'],c['nome'],source='cidades.json',clips=CLIPS['city']) for c in catalogs['cities']],
        'regions':[entry('region',x['id'],x['nome'],source='expedicoes.json',city=x['cidade'],clips=CLIPS['region']) for x in catalogs['regions']],
        'npcs':[entry('npc',m['id'],m['nome'],city=c['id'],role=m.get('perfil'),clips=CLIPS['npc']) for c in catalogs['cities'] for m in c['mercadores']],
        'quests':[entry('quest',q['id'],q['nome'],source='missoes.json',clips=CLIPS['quest']) for q in catalogs['quests']],
        'menus':[entry('menu',f'ui-{name}',name,clips=CLIPS['menu']) for name in MENU_IDS],
    }
    found=sum(map(len,registry.values()))
    review=root/'phaser/assets/review.json'
    reviews=read_json(review) if review.exists() else {}
    known={r['id'] for v in registry.values() for r in v}
    unknown=sorted(set(reviews)-known)
    if unknown:
        raise AssertionError(f'Entradas de revisão para IDs desconhecidos: {unknown[:10]}')
    for group,entries in registry.items():
        for row in entries:
            if row['id'] in reviews:
                overlay=reviews[row['id']]
                if not isinstance(overlay,dict) or 'id' in overlay or 'kind' in overlay:
                    raise AssertionError(f'Revisão inválida: {row["id"]}')
                row.update(overlay)
        put(root/f'phaser/assets/catalog/{group}.json', entries, check)
    index={
        'purpose':'production_tracking_not_runtime',
        'source':'data/*.json from original Peren game',
        'status_rule':'planejado != asset existente; aprovado requer revisão e QA',
        'required_clips_by_kind':CLIPS,
        'asset_directories_by_kind':DIRECTORIES,
        'totals':{group:len(rows) for group,rows in registry.items()},
        'total_records':found,
        'catalog_files':{group:f'phaser/assets/catalog/{group}.json' for group in registry}
    }
    put(root/'phaser/assets/manifest.generated.json',index,check)
    return index

if __name__=='__main__':
    p=argparse.ArgumentParser()
    p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1])
    p.add_argument('--check',action='store_true')
    args=p.parse_args()
    output=build(args.root.resolve(),args.check)
    print(('Verified' if args.check else 'Generated'),output['total_records'],'entries:',output['totals'])
