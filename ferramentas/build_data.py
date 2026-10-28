import fitz,re,json,unicodedata,hashlib,random,collections,os
from pathlib import Path
P=Path('/mnt/data/Peren_Bruxo_Mercador_da_Carcaca'); D=P/'data'; D.mkdir(exist_ok=True,parents=True)
ROOT=Path('/mnt/data')
rand=random.Random(20261013)
def slug(s):
 s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().lower();return re.sub('-+','-',re.sub('[^a-z0-9]+','-',s)).strip('-')
def dump(fname,items): (D/fname).write_text(json.dumps(items,ensure_ascii=False,indent=1),encoding='utf8')
CITIES=[
 ('portomonte','Portomonte','Costa Sul','Refúgio de marinheiros e camponeses protegido pelo templo de Deméter.','alquimia','🍃',1, ['alquimia','cozinha','curtume']),
 ('thargrid','Thargrid','Montanhas do Norte','Reino Sob a Montanha: as forjas alimentam a resistência.','forja','⚒️',2,['forja','curtume','joalheria']),
 ('ironwood','Ironwood','Floresta do Norte','Enclave dos rangers, druidas e informantes de Elara Stormoak.','madeira','🌲',2,['alquimia','curtume','escrita']),
 ('garganta','Garganta','Extremo Leste','Cidade no crânio de Golzdov, ocupada pela Corte; minas e ruínas yokai.','minerio','💀',3,['forja','encantamento','escrita']),
 ('drakport','Drakport','Rio Ancestral','Porto escravista da Corte; comércio perigoso, contrabando e informação.','comercio','⚓',3,['forja','alquimia','cozinha']),
 ('boca-abismo','Boca do Abismo','Extremo Oeste','Fortaleza de Ulorian sobre Gualápoles; guerras contra demônios.','essencia','🌀',4,['encantamento','alquimia','escrita']),
 ('shadar-riverie','Shadar-Riverie','Rio Ancestral','Capital aristocrática dos shadow fey, sob vigilância da Casa Uln-Shayr.','magia','🌙',5,['encantamento','joalheria','escrita']),
 ('alem-sul','Além Sul','Caatinga','Povos dispersos, contrabandistas e guerreiros da Caatinga.','couros','🏜️',2,['curtume','forja','cozinha']),
 ('eldroth','Eldroth','Asa de Golzdov','Floresta envenenada governada por Lady Sylara Nightwhisper.','ervas','🍂',5,['alquimia','encantamento','escrita'])]
TOWNS=[dict(id=i,nome=n,regiao=r,descricao=x,especialidade=sp,emblema=icon,perigo=lv,estacoes=st,mercadores=[{'id':i+'-mercador','nome':('Mestre' if i=='thargrid' else 'Mercadora')+' de '+n,'perfil':sp},{'id':i+'-oculto','nome':'Correspondente das Sombras','perfil':'raridades'}]) for i,n,r,x,sp,icon,lv,st in CITIES]
NPCS={
'portomonte':[('Sofia do Porto Seguro','alquimia','Tônicos e ervas para os refugiados.'),('Jonathan, o Taberneiro','provisoes','Suprimentos e notícias da costa.'),('Alina das Conchas','oculto','Relíquias retiradas de recifes profanados.')],
'thargrid':[('Borek Martelo-Fundo','forja','Metalurgia dos clãs livres.'),('Hilda das Veias','mineracao','Minério e pedras escolhidas na montanha.'),('Eirik dos Selos','oculto','Grimórios e selos de resistência.')],
'ironwood':[('Snoop Bog','alquimia','Seivas e fungos conhecidos da mata.'),('Leira Caçadora','forja','Arcos e couro para os patrulheiros.'),('Ara Menestrela','oculto','Escrituras de druidas e mensageiros.')],
'garganta':[('Íssara da Bigorna','forja','Ferros, ligas e armas tributadas à Corte.'),('Narin do Crânio','mineracao','Pedras dos ossos de Golzdov.'),('O Escriba Sem Nome','oculto','Tradições arqueológicas e objetos proibidos.')],
'drakport':[('Rodrigo, o Contrabandista','oculto','Mercadorias ilegais e contratos sem perguntas.'),('Dorra Sete-Tranças','provisoes','Mantimentos para barcos de rio.'),('Ferreiro Nohm','forja','Armas e reparos para os cais.')],
'boca-abismo':[('Janka da Foz','alquimia','Remédios para os mergulhadores.'),('O Vigia de Ulorian','forja','Ferragens e lâminas da fortaleza.'),('Mãe das Marés','oculto','Memórias e magia de água profunda.')],
'shadar-riverie':[('Lázaro da Casa Uln-Shayr','oculto','Artigos arcanos negociados em segredo.'),('Dama Corven','forja','Aço ornamental, facas e correntes.'),('Líria das Velas','alquimia','Perfumes, venenos e preparados feéricos.')],
'alem-sul':[('Cida da Estrada','provisoes','Comida e tecidos das caravanas.'),('Tamar Ferro Seco','forja','Armas e utensílios para os povos exilados.'),('Zulmira das Raízes','alquimia','Raízes e antídotos contra os venenos da caatinga.')],
'eldroth':[('O Mercador de Máscara','oculto','Relíquias saqueadas das ruínas.'),('Nerin das Folhas','alquimia','Ingredientes retirados sob risco mortal.'),('Artesão dos Ossos','forja','Armas feitas de matéria corrompida.')]
}
for town in TOWNS:town['mercadores']=[dict(id=town['id']+'-'+slug(name),nome=name,perfil=perfil,descricao=desc) for name,perfil,desc in NPCS[town['id']]]
dump('cidades.json',TOWNS)
# Corpus: 111 standard Skyrim alchemy ingredient names, based on the publicly listed vebyast/skyrim_alchemy Skyrim vanilla + DLC table. Effects transcribed as curated subset where available; NOT canonical physical material or recipes.
INGREDIENT_DATA='''Felsaad Tern Feathers|Restore Health;Cure Disease;Fortify Light Armor;Resist Magic
Mudcrab Chitin|Resist Poison;Resist Fire;Restore Stamina;Cure Disease
Vampire Dust|Regenerate Health;Invisibility;Cure Disease;Restore Magicka
Charred Skeever Hide|Resist Poison;Restore Stamina;Cure Disease;Restore Health
Hawk Feathers|Fortify Sneak;Cure Disease;Fortify One-handed;Fortify Light Armor
Jarrin Root|Damage Magicka;Damage Health;Damage Stamina;Damage Magicka Regen
River Betty|Damage Health;Fortify Alteration;Slow;Fortify Carry Weight
Emperor Parasol Moss|Regenerate Health;Damage Health;Fortify Two-handed;Fortify Magicka
Nirnroot|Invisibility;Damage Health;Damage Stamina;Resist Magic
Crimson Nirnroot|Invisibility;Damage Health;Damage Stamina;Resist Magic
Deathbell|Damage Health;Ravage Stamina;Weakness to Poison;Slow
Poison Bloom|Fortify Carry Weight;Damage Health;Slow;Fear
Ectoplasm|Fortify Destruction;Damage Health;Fortify Magicka;Restore Magicka
Falmer Ear|Resist Poison;Damage Health;Fortify Lockpicking;Frenzy
Human Flesh|Fortify Sneak;Damage Health;Restore Magicka;Paralysis
Human Heart|Damage Magicka;Damage Health;Frenzy;Damage Magicka Regen
Imp Stool|Damage Health;Restore Health;Lingering Damage Health;Paralysis
Nightshade|Fortify Destruction;Damage Health;Damage Magicka Regen;Lingering Damage Stamina
Red Mountain Flower|Restore Magicka;Damage Health;Fortify Magicka;Ravage Magicka
Skeever Tail|Damage Health;Ravage Health;Fortify Light Armor;Damage Stamina Regen
Small Antlers|Damage Health;Weakness to Poison;Fortify Restoration;Lingering Damage Stamina
Troll Fat|Resist Poison;Damage Health;Fortify Two-handed;Frenzy
Void Salts|Damage Health;Fortify Magicka;Weakness to Shock;Resist Magic
Butterfly Wing|Damage Magicka;Fortify Barter;Restore Health;Lingering Damage Stamina
Chaurus Eggs|Damage Magicka;Invisibility;Fortify Stamina;Weakness to Poison
Daedra Heart|Damage Magicka;Fear;Restore Health;Damage Stamina Regen
Eye of Sabre Cat|Damage Magicka;Restore Stamina;Restore Health;Ravage Health
Glow Dust|Damage Magicka;Fortify Destruction;Damage Magicka Regen;Resist Shock
Hagraven Feathers|Damage Magicka;Frenzy;Weakness to Shock;Fortify Conjuration
Hanging Moss|Damage Magicka;Fortify One-handed;Damage Magicka Regen;Fortify Health
Luna Moth Wing|Damage Magicka;Invisibility;Regenerate Health;Fortify Light Armor
Namira's Rot|Damage Magicka;Fortify Lockpicking;Regenerate Health;Fear
Nordic Barnacle|Damage Magicka;Fortify Pickpocket;Regenerate Health;Waterbreathing
Trama Root|Damage Magicka;Slow;Weakness to Shock;Fortify Carry Weight
Ancestor Moth Wing|Fortify Enchanting;Damage Stamina;Damage Magicka Regen;Fortify Conjuration
Bear Claws|Restore Stamina;Fortify One-handed;Damage Magicka Regen;Fortify Health
Blue Butterfly Wing|Fortify Enchanting;Damage Stamina;Damage Magicka Regen;Fortify Conjuration
Blue Mountain Flower|Restore Health;Damage Magicka Regen;Fortify Health;Fortify Conjuration
Burnt Spriggan Wood|Slow;Fortify Alteration;Weakness to Fire;Damage Magicka Regen
Chaurus Hunter Antennae|Fortify Enchanting;Damage Stamina;Damage Magicka Regen;Fortify Conjuration
Chicken's Egg|Resist Magic;Damage Magicka Regen;Waterbreathing;Lingering Damage Stamina
Hawk's Egg|Resist Magic;Damage Magicka Regen;Waterbreathing;Lingering Damage Stamina
Spider Egg|Fortify Lockpicking;Damage Stamina;Damage Magicka Regen;Fortify Marksman
Spriggan Sap|Fortify Enchanting;Fortify Alteration;Fortify Smithing;Damage Magicka Regen
Ash Creep Cluster|Fortify Destruction;Resist Fire;Damage Stamina;Invisibility
Berit's Ashes|Resist Fire;Ravage Stamina;Damage Stamina;Fortify Conjuration
Blisterwort|Restore Health;Frenzy;Damage Stamina;Fortify Smithing
Bone Meal|Resist Fire;Ravage Stamina;Damage Stamina;Fortify Conjuration
Canis Root|Damage Stamina;Paralysis;Fortify Marksman;Fortify One-handed
Cyrodilic Spadetail|Ravage Health;Damage Stamina;Fortify Restoration;Fear
Giant's Toe|Fortify Carry Weight;Damage Stamina;Fortify Health;Damage Stamina Regen
Rock Warbler Egg|Restore Health;Damage Stamina;Weakness to Magic;Fortify One-handed
Creep Cluster|Fortify Carry Weight;Restore Magicka;Weakness to Magic;Damage Stamina Regen
Frost Mirriam|Fortify Sneak;Resist Frost;Ravage Magicka;Damage Stamina Regen
Histcarp|Restore Stamina;Fortify Magicka;Waterbreathing;Damage Stamina Regen
Juniper Berries|Regenerate Health;Weakness to Fire;Fortify Marksman;Damage Stamina Regen
Large Antlers|Restore Stamina;Slow;Fortify Stamina;Damage Stamina Regen
Silverside Perch|Restore Stamina;Resist Frost;Ravage Health;Damage Stamina Regen
Wheat|Lingering Damage Magicka;Restore Health;Fortify Health;Damage Stamina Regen
Yellow Mountain Flower|Resist Poison;Fortify Restoration;Fortify Health;Damage Stamina Regen
Blue Dartwing|Resist Shock;Fortify Pickpocket;Restore Health;Fear
Gleamblossom|Regenerate Health;Resist Magic;Paralysis;Fear
Netch Jelly|Fortify Carry Weight;Restore Stamina;Paralysis;Fear
Powdered Mammoth Tusk|Restore Stamina;Fortify Sneak;Weakness to Fire;Fear
Grass Pod|Resist Poison;Fortify Alteration;Restore Magicka;Ravage Magicka
Dragon's Tongue|Fortify Barter;Fortify Two-handed;Resist Fire;Fortify Illusion
Hagraven Claw|Fortify Barter;Fortify Enchanting;Lingering Damage Magicka;Resist Magic
Tundra Cotton|Fortify Barter;Fortify Block;Fortify Magicka;Resist Magic
Bleeding Crown|Fortify Block;Weakness to Fire;Weakness to Poison;Resist Magic
Boar Tusk|Fortify Block;Fortify Stamina;Frenzy;Fortify Health
Pearl|Restore Stamina;Resist Shock;Fortify Block;Restore Magicka
Slaughterfish Scales|Fortify Heavy Armor;Fortify Block;Lingering Damage Health;Resist Frost
Briar Heart|Restore Magicka;Fortify Block;Fortify Magicka;Paralysis
Honeycomb|Restore Stamina;Ravage Stamina;Fortify Block;Fortify Light Armor
Hawk Beak|Restore Stamina;Resist Shock;Resist Frost;Fortify Carry Weight
Scaly Pholiota|Fortify Illusion;Regenerate Stamina;Weakness to Magic;Fortify Carry Weight
Wisp Wrappings|Resist Magic;Fortify Destruction;Restore Stamina;Fortify Carry Weight
Frost Salts|Resist Frost;Weakness to Fire;Restore Magicka;Fortify Conjuration
Lavender|Resist Magic;Fortify Stamina;Ravage Magicka;Fortify Conjuration
Beehive Husk|Resist Poison;Fortify Destruction;Fortify Light Armor;Fortify Sneak
Glowing Mushroom|Fortify Destruction;Fortify Smithing;Resist Shock;Fortify Health
Snowberries|Resist Fire;Fortify Enchanting;Resist Shock;Resist Frost
Spawn Ash|Resist Fire;Fortify Enchanting;Ravage Stamina;Ravage Magicka
Ice Wraith Teeth|Invisibility;Fortify Heavy Armor;Weakness to Fire;Weakness to Frost
Sabre Cat Tooth|Restore Stamina;Fortify Heavy Armor;Fortify Smithing;Weakness to Poison
Thistle Branch|Resist Poison;Fortify Heavy Armor;Ravage Stamina;Resist Frost
White Cap|Fortify Heavy Armor;Restore Magicka;Ravage Magicka;Weakness to Frost
Dwarven Oil|Regenerate Magicka;Restore Magicka;Weakness to Magic;Fortify Illusion
Mora Tapinella|Regenerate Stamina;Restore Magicka;Lingering Damage Health;Fortify Illusion
Taproot|Regenerate Magicka;Restore Magicka;Weakness to Magic;Fortify Illusion
Ash Hopper Jelly|Resist Shock;Weakness to Frost;Restore Health;Fortify Light Armor
Ashen Grass Pod|Fortify Sneak;Fortify Lockpicking;Resist Fire;Weakness to Shock
Pine Thrush Egg|Restore Stamina;Resist Shock;Fortify Lockpicking;Weakness to Poison
Jazbay Grapes|Regenerate Magicka;Fortify Magicka;Ravage Health;Weakness to Magic
Salmon Roe|Restore Stamina;Regenerate Magicka;Fortify Magicka;Waterbreathing
Elves Ear|Resist Fire;Weakness to Frost;Restore Magicka;Fortify Marksman
Small Pearl|Restore Stamina;Resist Frost;Fortify One-handed;Fortify Restoration
Orange Dartwing|Ravage Magicka;Restore Stamina;Fortify Pickpocket;Lingering Damage Health
Slaughterfish Egg|Resist Poison;Fortify Pickpocket;Fortify Stamina;Lingering Damage Health
Abecean Longfin|Fortify Sneak;Weakness to Frost;Weakness to Poison;Fortify Restoration
Salt Pile|Regenerate Magicka;Slow;Fortify Restoration;Weakness to Magic
Purple Mountain Flower|Restore Stamina;Fortify Sneak;Resist Frost;Lingering Damage Magicka
Garlic|Regenerate Health;Regenerate Magicka;Fortify Stamina;Resist Poison
Torchbug Thorax|Restore Stamina;Lingering Damage Magicka;Fortify Stamina;Weakness to Magic
Fly Amanita|Resist Fire;Fortify Two-handed;Frenzy;Regenerate Stamina
Scathecraw|Ravage Magicka;Ravage Health;Ravage Stamina;Lingering Damage Health
Swamp Fungal Pod|Lingering Damage Magicka;Restore Health;Paralysis;Resist Shock
Giant Lichen|Restore Magicka;Ravage Health;Weakness to Poison;Weakness to Shock
Bee|Restore Stamina;Ravage Stamina;Weakness to Shock;Regenerate Stamina
Fire Salts|Regenerate Magicka;Weakness to Frost;Restore Magicka;Resist Fire
Moon Sugar|Regenerate Magicka;Resist Frost;Weakness to Fire;Restore Magicka'''
NAMES='''Pena de Gaivota de Portomonte|Quitina de Caranguejo Carmesim|Pó de Vampiro de Vandar|Couro de Rato Carbonizado|Penas de Falcão das Montanhas|Raiz do Juramento Quebrado|Betty do Rio Ancestral|Musgo Parassol de Eldroth|Raiz Velada|Raiz Velada Rubra|Sino da Morte|Flor Venenosa da Garganta|Ectoplasma de Vandar|Orelha de Troglodita|Carne de Proscrito|Coração Proibido|Cogumelo do Imp|Beladona Negra|Flor Vermelha de Thargrid|Cauda de Rato das Docas|Chifres Jovens|Gordura de Troll|Sais do Vazio|Asa de Borboleta da Foz|Ovos de Verme Quitinoso|Coração de Demônio|Olho de Felino das Ilhas|Poeira Luminosa|Penas de Bruxa das Sombras|Musgo Suspenso|Asa de Mariposa Lunar|Fungo de Gualápoles|Craca do Rio Ancestral|Raiz de Trama|Asa de Mariposa Ancestral|Garras de Urso|Asa de Borboleta Azul|Flor Azul da Montanha|Madeira de Ent Carbonizado|Antena do Caçador Quitinoso|Ovo de Galinha|Ovo de Falcão|Ovo de Aranha|Seiva de Guardião Arbóreo|Cachos de Cinza|Cinzas de Um Escriba|Fungo de Bolha|Farinha de Ossos|Raiz Canina|Peixe de Escamas Finas|Dedo de Gigante|Ovo de Tordo|Cachos Rastejantes|Mirra da Geada|Carpa de Pedra|Bagas de Zimbro|Chifres Grandes|Perca Prateada|Trigo da Costa|Flor Amarela da Montanha|Libélula Azul|Flor de Brilho|Gelatina de Netch|Presa de Mamute em Pó|Vagem da Charneca|Língua de Dragão|Garra de Bruxa|Algodão da Tundra|Coroa Sangrenta|Presa de Javali|Pérola da Costa Sul|Escamas de Peixe Carniceiro|Coração de Espinheiros|Favo de Mel|Bico de Falcão|Cogumelo Escamoso|Faixas de Espírito|Sais da Geada|Lavanda Selvagem|Casca de Colmeia|Cogumelo Luminescente|Frutas da Neve|Cinzas de Criatura|Dentes de Espectro Gelado|Dente de Felino|Ramo de Cardo|Chapéu Branco|Óleo de Autômato Anão|Cogumelo de Raiz|Raiz Mestra|Gelatina de Saltador das Cinzas|Vagem Cinzenta|Ovo de Tordo da Costa|Uvas de Jasmim|Ovas de Salmão|Orelha de Elfo|Pérola Pequena|Libélula Alaranjada|Ovas de Peixe Carniceiro|Peixe da Costa Escarlate|Pilha de Sal do Mar de Sangue|Flor Violeta|Alho das Hortas|Tórax de Inseto-lanterna|Amanita Rubra|Espinho-da-Morte|Fungo do Pântano|Líquen Gigante|Abelha|Sais Ígneos|Açúcar Lunar'''.split('|')
rows=[x.split('|') for x in INGREDIENT_DATA.splitlines() if x.strip()];print('Skyrim lines',len(rows),'Carcaca mapped',len(NAMES));assert len(rows)==len(NAMES)
MATERIALS=[]
for i,(base,effects) in enumerate(rows):
 src=base.strip();e=effects.split(';');tier=1+(i%5);zone=CITIES[(i*7)%len(CITIES)][0]; it={'id':'ing-'+slug(src),'nome':NAMES[i],'categoria':'ingrediente','tipo':'alquimia','origem':'adaptado_skyrim_alquimia','referencia':src,'efeitos':e,'raridade':(['comum','comum','incomum','raro','epico'][tier-1]),'valor':4+tier*5,'peso':0.1,'zona':zone,'nivel':tier,'icone':'🌿' if i%4==0 else ('🦋' if i%4==1 else ('🧪' if i%4==2 else '🍄'))}
 MATERIALS.append(it)
RAW='''Ferro bruto|minerio|1|5|garganta|⛏️
Carvão de forja|mineral|1|4|thargrid|⚫
Madeira de Ironwood|madeira|2|12|ironwood|🪵
Madeira de Vandar|madeira|4|35|eldroth|🪵
Couro curtido|couro|1|7|alem-sul|🧵
Linha de seda|tecido|2|14|portomonte|🧶
Linho de Deméter|tecido|1|8|portomonte|🧶
Minério de prata|minerio|2|18|thargrid|⛏️
Minério de ouro|minerio|3|38|garganta|⛏️
Minério de mitral|minerio|4|65|thargrid|💎
Minério de adamante|minerio|5|125|garganta|💎
Osso de Golzdov|osso|5|170|garganta|🦴
Escama de Dragão|escama|5|190|eldroth|🐉
Fibra de Aranha Yokai|tecido|4|70|boca-abismo|🕸️
Fragmento de Gelo Eterno|essencia|3|37|thargrid|❄️
Brasa Feérica|essencia|4|60|eldroth|🔥
Essência do Vazio|essencia|5|110|boca-abismo|🌌
Seiva Vital|essencia|2|21|ironwood|💚
Água Purificada|agua|1|7|portomonte|💧
Tinta Rúnica|tinta|3|30|garganta|✒️
Pó de Gema|gema|2|21|shadar-riverie|💠
Cristal de Alma Menor|alma|2|22|garganta|🔮
Cristal de Alma Maior|alma|4|95|shadar-riverie|🔮
Fragmento de Juramento|reliquia|5|240|boca-abismo|📜
Pérola Negra|gema|4|88|portomonte|⚫
Rubi do Sangue|gema|4|84|boca-abismo|🔻
Safira Lunar|gema|3|66|shadar-riverie|🔷
Esmeralda da Floresta|gema|3|66|ironwood|💚
Topázio Solar|gema|3|65|portomonte|✨
Quartzo da Montanha|gema|1|10|thargrid|💠
Pederneira|mineral|1|3|alem-sul|🪨
Sal de Maré|sal|2|13|portomonte|🧂
Vapor de Éter|essencia|5|110|shadar-riverie|💨'''
for line in RAW.splitlines():
 name,cat,tier,val,zone,icon=line.split('|');MATERIALS.append({'id':'mat-'+slug(name),'nome':name,'categoria':'material','tipo':cat,'origem':'original_carcaca','raridade':['comum','incomum','raro','epico','lendario'][int(tier)-1],'valor':int(val),'peso':.4,'zona':zone,'nivel':int(tier),'icone':icon})
ITEMS=list(MATERIALS); RECIPES=[]
def add_item(it):
 if not any(x['id']==it['id'] for x in ITEMS):ITEMS.append(it)
def rec(name,station,skill,lv,inputs,out,outqty=1):
 rid='rec-'+slug(name)
 RECIPES.append({'id':rid,'nome':name,'estacao':station,'pericia':skill,'nivel':lv,'ingredientes':[{'item':k,'quantidade':v} for k,v in inputs.items()],'resultado':out,'quantidade':outqty,'origem':'receita_original_carcaca'})
# Alchemy: SKyrim ingredient property matches; each pair creates an original 2-ingredient recipe with ALL shared effects. No claim it is a verbatim Skyrim official potion recipe.
for i,a in enumerate(MATERIALS[:len(rows)]):
 for b in MATERIALS[i+1:len(rows)]:
  common=[k for k in a['efeitos'] if k in b['efeitos']]
  if not common:continue
  name='Elixir de '+a['nome']+' e '+b['nome']
  rid='pot-'+slug(a['referencia'])+'-'+slug(b['referencia'])
  eff=common[0];level=max(a['nivel'],b['nivel'])
  potion={'id':rid,'nome':name,'categoria':'pocao','tipo':'veneno' if ('Damage' in eff or 'Ravage' in eff or 'Weakness' in eff or 'Fear' in eff) else 'pocao','efeitos':common,'efeito':eff,'potencia':5+3*level,'origem':'receita_original_baseada_em_correspondencia_de_efeitos_skyrim','raridade':['comum','incomum','raro','epico','lendario'][level-1],'valor':12+9*level+4*len(common),'peso':.2,'nivel':level,'icone':'☠️' if 'Damage' in eff or 'Weakness' in eff else '🧪'}
  add_item(potion);rec(name,'alquimia','alquimia',max(1,level*8),{a['id']:1,b['id']:1},rid)
print('potions recipes',len(RECIPES))
# Smithing lineages and equipment archetypes
lineages=[('Ferrugem','mat-ferro-bruto',1),('Prata','mat-minerio-de-prata',2),('Ouro Rúnico','mat-minerio-de-ouro',3),('Mitral','mat-minerio-de-mitral',4),('Adamante','mat-minerio-de-adamante',5),('Osso Ancestral','mat-osso-de-golzdov',5),('Escama Dracônica','mat-escama-de-dragao',5)]
forms=[('Adaga','arma','adaga',5,1),('Espada','arma','espada',9,2),('Machado','arma','machado',11,2),('Martelo','arma','martelo',12,3),('Arco','arma','arco',8,2),('Lança','arma','lanca',8,2),('Cajado','arma','cajado',7,2),('Broquel','escudo','escudo',0,2),('Peitoral','armadura','armadura',0,4),('Elmo','armadura','elmo',0,2),('Botas','armadura','botas',0,1),('Luvas','armadura','luvas',0,1),('Anel','acessorio','anel',0,1),('Colar','acessorio','colar',0,1)]
for prefix,mat,tier in lineages:
 for form,cat,kind,atk,ing in forms:
  name=f'{form} de {prefix}';id='eq-'+slug(name)
  add_item({'id':id,'nome':name,'categoria':cat,'tipo':kind,'origem':'craft_original_inspirado_skyrim_e_dnd','raridade':['comum','incomum','raro','epico','lendario'][tier-1],'valor':(tier*12+8)*ing,'peso':round(.5+ing*.65,2),'nivel':tier,'ataque':atk+tier*3 if atk else 0,'defesa':tier*2+(2 if cat=='armadura' else 0),'icone':'⚔️' if cat=='arma' else '🛡️' if cat in ('armadura','escudo') else '💍'})
  need={mat:ing}
  if cat in ('armadura','escudo'):need['mat-couro-curtido']=1
  if kind=='arco':need['mat-madeira-de-ironwood']=1
  if cat=='acessorio':need['mat-po-de-gema']=1
  rec(name,'forja' if cat not in ('acessorio',) else 'joalheria','forja' if cat!='acessorio' else 'joalheria',max(1,tier*12),need,id)
# Wood, leather, textiles craft
for mat,tier in [('mat-couro-curtido',1),('mat-linho-de-demeter',1),('mat-linha-de-seda',2),('mat-fibra-de-aranha-yokai',4)]:
 for form,kind,qty in [('Traje','armadura',3),('Capuz','elmo',2),('Manto','capa',3),('Bolsa de Coleta','bolsa',2),('Braçadeiras','luvas',2)]:
  mn=next(x for x in MATERIALS if x['id']==mat)['nome'];nm=f'{form} de {mn}';id='eq-'+slug(nm)
  add_item({'id':id,'nome':nm,'categoria':'armadura' if kind not in ('bolsa',) else 'utilitario','tipo':kind,'origem':'original_carcaca','raridade':'incomum' if tier<=2 else 'epico','valor':20*tier*qty,'nivel':tier,'defesa':tier+1,'icone':'🧥'});rec(nm,'curtume','curtume',8*tier,{mat:qty},id)
# Ingot conversion (recipes yield ingots) 
for prefix,mat,tier in lineages[:5]:
 nm='Lingote de '+prefix;id='mat-'+slug(nm)
 add_item({'id':id,'nome':nm,'categoria':'material','tipo':'lingote','origem':'original_carcaca','raridade':'comum','valor':10*tier,'nivel':tier,'icone':'🪙'});rec(nm,'forja','forja',tier*6,{mat:2,'mat-carvao-de-forja':1},id,2)
# Tavern cooking: fully original, practical rations made from regionally collected plants and meat substitutes.
FOODS=[('Ensopado de Rio','ing-histcarp','ing-garlic'),('Pão de Mel da Foz','ing-honeycomb','ing-wheat'),('Caldo da Montanha','ing-frost-mirriam','ing-juniper-berries'),('Guisado de Caatinga','ing-boar-tusk','ing-garlic'),('Peixe com Sal do Mar','ing-salmon-roe','ing-salt-pile'),('Cogu-sopa de Ironwood','ing-glowing-mushroom','ing-white-cap'),('Ração dos Vigias','ing-wheat','ing-blue-mountain-flower'),('Chá de Lavanda','ing-lavender','ing-juniper-berries'),('Prato dos Anões','ing-large-antlers','ing-jazbay-grapes'),('Banquete de Portomonte','ing-purple-mountain-flower','ing-salmon-roe'),('Pescado Defumado','ing-silverside-perch','ing-garlic'),('Compota das Montanhas','ing-snowberries','ing-jazbay-grapes'),('Torta de Mel','ing-chicken-s-egg','ing-honeycomb'),('Pão de Deméter','ing-wheat','ing-salt-pile'),('Chá dos Sonhos','ing-mora-tapinella','ing-moon-sugar'),('Ensopado de Algas','ing-grass-pod','ing-nordic-barnacle')]
for ix,(name,a,b) in enumerate(FOODS):
 id='food-'+slug(name);tier=1+ix//5
 add_item({'id':id,'nome':name,'categoria':'comida','tipo':'refeicao','valor':12+ix*3,'nivel':tier,'raridade':'comum' if tier==1 else 'incomum','origem':'original_carcaca','icone':'🥘','efeito':'Restore Health','potencia':10+ix})
 rec(name,'cozinha','cozinha',3+tier*5,{a:1,b:1},id,2)
# D&D PHB spells structured with source page and original gameplay adaptation metadata.
PHB=fitz.open(ROOT/'D&D 5E - Livro do Jogador (Fundo Colorido) - Biblioteca Élfica.pdf')
SCHOOL={'abjuração':'defesa','adivinhação':'utilidade','conjuração':'invocacao','encantamento':'controle','evocação':'ofensiva','ilusão':'controle','necromancia':'necromancia','transmutação':'alteracao'}
spell_names=set();SPELLS=[]
manual_tags={'RAIO DE FOGO':('fire',8,'unico'),'RAIO DE GELO':('ice',7,'unico'),'BOLA DE FOGO':('fire',18,'todos'),'MÍSSEIS MÁGICOS':('arcane',9,'unico'),'CURA FERIMENTOS':('heal',18,'aliado'),'PALAVRA CURATIVA':('heal',12,'aliado'),'CURAR FERIMENTOS':('heal',16,'aliado'),'RELÂMPAGO':('lightning',20,'todos'),'ARMA ESPIRITUAL':('arcane',12,'unico'),'TOQUE CHOCANTE':('lightning',9,'unico'),'TEIA':('root',0,'todos'),'EMARANHAR':('root',0,'todos'),'RAIO ARDENTE':('fire',14,'unico'),'NÉVOA OBSCURECENTE':('fog',0,'todos'),'ESCUDO ARCANO':('shield',0,'aliado'),'ARMADURA ARCANA':('shield',0,'aliado'),'IMOBILIZAR PESSOA':('root',0,'unico'),'DRENAR VIDA':('drain',15,'unico'),'SONO':('sleep',0,'todos'),'INVISIBILIDADE':('invisible',0,'aliado'),'MÃO MÁGICA':('arcane',3,'unico'),'MÃOS FLAMEJANTES':('fire',12,'todos'),'LÂMINA FLAMEJANTE':('fire',12,'unico'),'CRESCER ESPINHOS':('root',8,'todos'),'ORBE CROMÁTICO':('arcane',14,'unico'),'REPREENSÃO INFERNAL':('fire',12,'unico'),'FALAR COM MORTOS':('arcane',0,'unico'),'RAJADA MÍSTICA':('arcane',10,'unico'),'PROTEÇÃO CONTRA ENERGIA':('shield',0,'aliado'),'METEOROS INSTANTÂNEOS DE MELF':('fire',22,'todos')}
for pi in range(215,290):
 t=PHB[pi].get_text()
 for m in re.finditer(r'(?m)^([A-ZÁÉÍÓÚÃÕÂÊÔÀÜÇ0-9][A-ZÁÉÍÓÚÃÕÂÊÔÀÜÇ0-9 /()\-+,´’]{2,74})\s*\n((?:Truque|[0-9][°º] nível) de ([a-zçãôéâ]+))',t):
  name=m.group(1).strip();school=m.group(3); lvl=0 if m.group(2).startswith('Truque') else int(m.group(2)[0]);
  if name in spell_names or school not in SCHOOL:continue
  spell_names.add(name); key=slug(name);typ,power,target=manual_tags.get(name,('heal' if ('CURA' in name or 'RESTAURA' in name) else 'shield' if ('PROTEÇÃO' in name or 'ESCUDO' in name or 'ARMADURA' in name) else 'sleep' if ('SONO' in name or 'HIPNÓTICO' in name) else 'root' if ('IMOBILIZAR' in name or 'TEIA' in name or 'EMARANHAR' in name) else 'fire' if ('FOGO' in name or 'CHAMA' in name or 'INCEND' in name) else 'ice' if ('GELO' in name or 'FRIO' in name or 'NEVE' in name) else 'lightning' if ('RELÂMPAGO' in name or 'RAIO' in name or 'TROVÃO' in name or 'CHOQUE' in name) else 'drain' if school=='necromancia' else 'arcane',max(2,5+lvl*3),'todos' if ('MASSA' in name or 'TEMPESTADE' in name or 'NUVEM' in name or 'BOLA' in name) else 'unico'))
  SPELLS.append({'id':'mag-'+key,'nome':name.title(),'nivel_dnd':lvl,'escola':school,'funcao':SCHOOL[school],'tipo':typ,'potencia':power,'alvo':target,'mana':3+lvl*4,'poder_requerido':4+lvl*10,'origem':'D&D_5e_Livro_do_Jogador_usuario','pagina_pdf':pi+1,'mecanica':'adaptacao_original_por_categoria' if name not in manual_tags else 'adaptacao_original_curada','icone':'🔥' if typ=='fire' else '❄️' if typ=='ice' else '✨' if typ=='arcane' else '💚' if typ=='heal' else '🛡️' if typ=='shield' else '🌩️' if typ=='lightning' else '🌿'})
print('spells',len(SPELLS));dump('magias.json',SPELLS)
for sp in SPELLS:
 sid='scroll-'+slug(sp['nome']);lv=max(1,sp['nivel_dnd']+1)
 add_item({'id':sid,'nome':'Grimório: '+sp['nome'],'categoria':'grimorio','tipo':'livro_magia','magia':sp['id'],'origem':'receita_original_baseada_em_magia_dnd','raridade':'raro' if lv>=4 else 'incomum','valor':25+lv*28,'nivel':lv,'icone':'📜'})
 if lv<=8:rec('Grimório: '+sp['nome'],'escrita','escrita',lv*10,{'mat-tinta-runica':max(1,lv//2),'mat-linho-de-demeter':2},sid)
# D&D DMG magic items (names rarity source, not descriptions) ; curated smithing-like recipes for a subset
DMG=fitz.open(ROOT/'D&D 5E - Guia do Mestre - Biblioteca Élfica.pdf');found=set();MAGIC=[]
for pi in range(150,233):
 t=DMG[pi].get_text()
 for m in re.finditer(r'(?m)^([A-ZÁÉÍÓÚÃÕÂÊÔÀÜÇ0-9][A-ZÁÉÍÓÚÃÕÂÊÔÀÜÇ0-9 /()\-+,´’]{2,76})\s*\n((?:Arma|Item maravilhoso|Poção|Anel|Cajado|Varinha|Pergaminho|Armadura)[^\n]{0,130})',t):
  name=m.group(1).strip();typ=m.group(2).strip();
  if name in found or len(name)>58 or name in ['LOCALIZAÇÃO','DURAÇÃO','RECARGA']:continue
  if not any(k in typ.lower() for k in ['comum','rara','raro','lendári','artefato']):continue
  found.add(name);rar='lendario' if 'lendária' in typ or 'lendário' in typ else 'epico' if 'muito rara' in typ else 'raro' if 'rara' in typ else 'incomum';lvl={'incomum':2,'raro':3,'epico':4,'lendario':5}[rar];id='dmg-'+slug(name)
  it={'id':id,'nome':name.title(),'categoria':'reliquia','tipo':'item_magico','raridade':rar,'valor':lvl*135,'nivel':lvl,'origem':'D&D_5e_Guia_do_Mestre_usuario','referencia':name,'pagina_pdf':pi+1,'icone':'🔮' if name.startswith('ANEL') else '📿' if name.startswith('AMULETO') else '✨','efeito':'Poder arcano reinterpretado no cenário. Efeito específico depende da categoria.'}
  MAGIC.append(it);add_item(it)
  if lvl<5 and len(MAGIC)%2==0:
   rec('Forjar '+name.title(),'encantamento','encantamento',lvl*16,{'mat-cristal-de-alma-maior':1 if lvl>=4 else 0,'mat-cristal-de-alma-menor':1,'mat-po-de-gema':lvl,'mat-tinta-runica':1},id)
print('magic items',len(MAGIC));dump('reliquias_dnd.json',MAGIC)
# monster cards with rough balanced game values derived from challenge rating; descriptions fully original
MM=fitz.open(ROOT/'D&D 5E - Manual dos Monstros - Biblioteca Élfica.pdf');MONSTERS=[];seen=set();types='Aberração|Besta|Celestial|Constructo|Dragão|Elemental|Feérico|Fera|Gigante|Humanoide|Ínfero|Limo|Monstruosidade|Morto-vivo|Planta|Demônio|Diabo'
for pi in range(11,316):
 t=MM[pi].get_text()
 for m in re.finditer(r'(?m)^([A-ZÁÉÍÓÚÃÕÂÊÔÀÜÇ0-9][A-ZÁÉÍÓÚÃÕÂÊÔÀÜÇ0-9 /()\-,+’]{2,69})\s*\n((?:'+types+')[^\n]{0,75})',t):
  name=m.group(1).strip();typ=m.group(2).strip()
  if name.startswith('AÇÕES') or len(name)>50 or name in seen or name=='DIABOS' or ('personificam' in typ.lower() or 'servem' in typ.lower()):continue
  section=t[m.end():m.end()+1100];cm=re.search(r'Nível de Desafio\s+([0-9/]+)',section)
  if not cm:continue
  cs=cm.group(1);cr=float(cs.split('/')[0])/float(cs.split('/')[1]) if '/' in cs else float(cs)
  seen.add(name);mob={'id':'mob-'+slug(name),'nome':name.title(),'categoria':typ.split()[0].lower(),'referencia':name,'nivel_desafio_dnd':cs,'nivel_jogo':max(1,min(18,round(cr*0.62+1))),'hp':int(23+cr*14),'ataque':int(5+cr*1.8),'defesa':int(1+cr*.85),'xp':int(11+cr*19),'ouro':int(6+cr*16),'origem':'D&D_5e_Manual_dos_Monstros_usuario','pagina_pdf':pi+1,'icone':'🐉' if 'Dragão' in typ else '💀' if 'Morto-vivo' in typ else '👹' if 'Humanoide' in typ else '🐺','drop_tipo':'essencia' if cr>8 else 'ingrediente'}
  MONSTERS.append(mob)
# originals in Carcaça scenario
ORIGINALS=[('Caçador de Escravos da Corte',3,'humanoide','drakport'),('Kappa-Escriba Desgarrado',6,'feérico','boca-abismo'),('Akaname do Espelho Fundo',10,'feérico','boca-abismo'),('Guardião de Ossos de Golzdov',12,'constructo','garganta'),('Sirênide da Costa Maldita',5,'monstruosidade','portomonte'),('Sacerdote Kuo-Toa de Daegon',8,'humanoide','portomonte'),('Druida Traidor de Eldroth',9,'humanoide','eldroth'),('Saqueador da Caatinga',2,'humanoide','alem-sul'),('Aranha dos Sonhos Afogados',14,'feérico','boca-abismo'),('Arauto Sombrio da Corte',18,'feérico','shadar-riverie'),('Sentinela de Drakport',4,'humanoide','drakport'),('Espírito das Costelas',7,'morto-vivo','garganta'),('Verme do Mar de Sangue',13,'monstruosidade','portomonte'),('Lobisomem de Ironwood',8,'monstruosidade','ironwood')]
for name,lv,typ,zone in ORIGINALS:
 MONSTERS.append({'id':'mob-'+slug(name),'nome':name,'categoria':typ,'nivel_desafio_dnd':str(lv),'nivel_jogo':lv,'hp':22+lv*16,'ataque':5+lv*3,'defesa':2+lv,'xp':17+lv*20,'ouro':5+lv*12,'origem':'original_carcaca','zona':zone,'icone':'👹','drop_tipo':'material'})
print('monsters',len(MONSTERS));dump('monstros.json',MONSTERS)
# PHB equipment seeds (game adapt originals, not verbatim lists)
GEAR='''Rações de Viagem|comida|7|1|🥖
Água de Cantil|consumivel|4|1|💧
Pão de Trigo|comida|5|1|🥖
Kit de Aventureiro|utilitario|30|1|🎒
Ferramentas de Ferreiro|ferramenta|80|1|⚒️
Ferramentas de Alquimista|ferramenta|85|1|🧪
Ferramentas de Ladrão|ferramenta|45|1|🗝️
Ferramentas de Joalheiro|ferramenta|85|1|💍
Frasco de Vidro|material|5|1|⚗️
Pergaminho Vazio|material|9|1|📜
Tocha|utilitario|3|1|🔥
Corda|utilitario|11|1|🪢
Poção Restauradora|pocao|32|1|💚
Poção de Foco|pocao|36|1|🔷
Antídoto|pocao|44|2|🧪
Bomba de Fumaça|consumivel|40|2|💨
Elixir de Proteção|pocao|55|3|🛡️
Kit de Acampamento|utilitario|52|2|⛺
Vela Rúnica|material|15|2|🕯️
Pergaminho de Mapa|utilitario|27|1|🗺️'''
for x in GEAR.splitlines():
 nm,typ,val,tier,icon=x.split('|');id='ger-'+slug(nm);add_item({'id':id,'nome':nm,'categoria':typ,'tipo':typ,'raridade':'comum','valor':int(val),'nivel':int(tier),'origem':'adaptacao_original_equipamento_dnd','icone':icon})
for nm,inputs in [('Poção Restauradora',{'ing-blue-mountain-flower':1,'mat-agua-purificada':1}),('Poção de Foco',{'ing-red-mountain-flower':1,'mat-agua-purificada':1}),('Antídoto',{'ing-mudcrab-chitin':1,'mat-agua-purificada':1}),('Elixir de Proteção',{'ing-snowberries':1,'mat-cristal-de-alma-menor':1})]:
 rec(nm,'alquimia','alquimia',5 if nm=='Poção Restauradora' else 18,inputs,'ger-'+slug(nm))
# Per-city quests and exploration nodes include always area lore & rewards
REGIONS=[
 ('costa-sangue','Recifes do Mar de Sangue','portomonte',2,'Pescadores sumiram. Corais luminosos escondem cavernas tomadas por kuo-toa.'),
 ('floresta-murin','Floresta de Mürin','portomonte',2,'O druida Snoop Bog conhece caminhos cuja seiva cura a terra.'),
 ('minas-thargrid','Minas de Thargrid','thargrid',3,'Os anões dividem minério e vigília com a resistência; monstros vagam pelas galerias.'),
 ('trilha-ironwood','Caminhos de Ironwood','ironwood',3,'Mensageiros de Elara Stormoak precisam de guardas para escapar das patrulhas feéricas.'),
 ('ruinas-vandar','Ruínas de Vandar','eldroth',5,'Damaris Blackthorn coleciona relíquias entre servos mortos-vivos.'),
 ('cranio-golzdov','Escavações do Crânio','garganta',6,'Nas mandíbulas fossilizadas do ancestral, cada fragmento vale mais que uma vida.'),
 ('docas-drakport','Docas de Drakport','drakport',5,'Manifestos de navios registram nomes apagados e cargas que a Corte prefere ocultar.'),
 ('lama-da-foz','Foz de Gualápoles','boca-abismo',7,'O Arquivo dos Mortos Afogados guarda tessituras de nomes e ouro submerso.'),
 ('corte-riverie','Jardins da Corte','shadar-riverie',8,'Uma pedra de encantamento é exibida enquanto prisioneiros a alimentam.'),
 ('deserto-ossos','Areias do Além Sul','alem-sul',3,'Caravanas transportam suprimentos dos povoados para defender a costa.')]
ZONES=[{'id':i,'nome':n,'cidade':c,'perigo':lv,'descricao':ds,'min_nivel':lv} for i,n,c,lv,ds in REGIONS];dump('expedicoes.json',ZONES)
QUESTS=[]
for i,z in enumerate(ZONES):
 for k in range(3):
  names=['Contrato dos Mercadores','Rastro de Desaparecidos','Relíquia do Velho Mundo'];qname=f"{names[k]}: {z['nome']}";lv=z['perigo']+k
  QUESTS.append({'id':'q-'+slug(qname),'nome':qname,'tipo':'trabalho' if k==0 else 'historia' if k==1 else 'lendaria','cidade':z['cidade'],'zona':z['id'],'nivel':lv,'inimigos':1+(lv//4),'recompensa_ouro':35+lv*32,'recompensa_xp':22+lv*18,'lore':z['descricao']+' '+['Uma associação oferece pagamento por materiais recuperados.','Uma família procura prova do destino de seus companheiros.','Escondido na área, um artefato pode transformar a reputação de um bruxo.'][k],'item_recompensa':'mat-fragmento-de-juramento' if k==2 else None})
QUESTS+= [{'id':'q-peren-promessa','nome':'A Dívida do Bruxo','tipo':'pessoal','cidade':'portomonte','zona':'floresta-murin','nivel':2,'inimigos':2,'recompensa_ouro':100,'recompensa_xp':80,'lore':'Peren recebe uma carta de uma antiga curandeira: o primeiro pacto ainda pode ser desfeito.','item_recompensa':'mat-cristal-de-alma-menor'}, {'id':'q-peren-voz','nome':'A Voz no Osso','tipo':'pessoal','cidade':'garganta','zona':'cranio-golzdov','nivel':7,'inimigos':3,'recompensa_ouro':300,'recompensa_xp':360,'lore':'Trelohim deixou inscrições que respondem a quem não pertence à Corte. Peren encontra rastros da língua sagrada.','item_recompensa':'mat-osso-de-golzdov'}]
dump('missoes.json',QUESTS)
# Reference gear from PHB equipment/weapon tables (metadata only; names are adapted in the world when appropriate).
text=PHB[151].get_text('text').splitlines()+PHB[152].get_text('text').splitlines()
for j in range(len(text)-2):
 name=text[j].strip();cost=text[j+1].strip()
 mprice=re.match(r'^(\d[\d.,]*)\s*(po|pp|pc)$',cost)
 if not mprice:continue
 if len(name)<3 or len(name)>45 or name in ('Item','Custo','Armas Simples Corpo-a-Corpo','Armas Marciais Corpo-a-Corpo','Armas Simples à Distância','Armas Marciais à Distância') or re.match(r'^\d',name):continue
 if name.endswith('.') or name in ('Nome','Peso','Dano','Propriedades','Ábaco') and name=='Nome':continue
 val=float(mprice.group(1).replace('.','').replace(',','.'));coin=mprice.group(2);price=max(1,round(val*(1 if coin=='po' else .1 if coin=='pp' else .01)*10));
 cat='arma' if j < len(PHB[151].get_text('text').splitlines()) else 'utilitario'
 nm=name if cat=='arma' else name+' da Carcaça'
 id='phb-'+slug(name)
 add_item({'id':id,'nome':nm,'categoria':cat,'tipo':'equipamento','valor':price,'nivel':min(5,max(1,round(price/115)+1)),'origem':'D&D_5e_Livro_do_Jogador_usuario','pagina_pdf':152 if cat=='arma' else 153,'referencia':name,'raridade':'comum','icone':'⚔️' if cat=='arma' else '🧰','ataque':5+int(price**.42) if cat=='arma' else 0})
# Curadoria autoral do jogo. Aplicada APÓS geração combinatória para manter IDs estáveis
# e permitir migrar os ingredientes um a um sem recalcular receitas antigas automaticamente.
curadoria_path = Path(__file__).resolve().parent.parent/'data'/'curadoria_ingredientes.json'
if curadoria_path.is_file():
 curadoria = json.loads(curadoria_path.read_text(encoding='utf-8'))
 regra = curadoria['politica']
 revisados = 0
 for item in ITEMS:
  override = curadoria.get('itens', {}).get(item['id'])
  if override:
   attrs = override.get('atributos', [])
   assert len(attrs) >= regra['minimo_por_ingrediente'], item['id']
   assert all(isinstance(a.get('intensidade'), int) and regra['intensidade_minima'] <= a['intensidade'] <= regra['intensidade_maxima'] for a in attrs), item['id']
   item.update(override)
   revisados += 1
  for anterior, atual in curadoria.get('renomeacoes_textuais', {}).items():
   if anterior in item.get('nome', ''):
    item['nome'] = item['nome'].replace(anterior, atual)
 for receita in RECIPES:
  for anterior, atual in curadoria.get('renomeacoes_textuais', {}).items():
   if anterior in receita.get('nome', ''):
    receita['nome'] = receita['nome'].replace(anterior, atual)
  revisados_na_receita = [x['item'] for x in receita['ingredientes'] if x['item'] in curadoria.get('receitas_a_revisar_por_insumo', [])]
  if revisados_na_receita:
   receita['revisao_alquimica_pendente'] = True
   receita['insumos_revisados'] = revisados_na_receita
   receita['nota_revisao'] = ('Receita herdada da geração combinatória anterior à curadoria dos atributos. '
                            'Reavaliar compatibilidade alquímica, efeitos e intensidades conforme os demais ingredientes '
                            'forem revisados, preservando os IDs.')
 print('curadoria aplicada', revisados, 'ingrediente(s) revisado(s)')
else:
 raise FileNotFoundError('Curadoria de ingredientes ausente: '+str(curadoria_path))
# Validate links
ids={x['id'] for x in ITEMS}; recids={r['id'] for r in RECIPES};assert len(ids)==len(ITEMS);assert len(recids)==len(RECIPES)
for r in RECIPES:
 assert r['resultado'] in ids,(r['id'],r['resultado'])
 for x in r['ingredientes']:assert x['item'] in ids,(r['id'],x['item'])
 assert len(r['ingredientes'])>0
for q in QUESTS:
 if q['item_recompensa']:assert q['item_recompensa'] in ids
print('items',len(ITEMS),'recipes',len(RECIPES),'quests',len(QUESTS));dump('itens.json',ITEMS);dump('receitas.json',RECIPES)
manifest={'versao':'0.1.0','projeto':'Peren, o Bruxo — Mercador da Carcaça','observacao':'Base jogável original; NÃO é inventário completo de Skyrim nem reprodução integral de conteúdo de D&D. Registros de alquimia são derivados e reinventados. Magias e monstros provêm das obras fornecidas pelo usuário; apenas metadados e mecânicas originais são publicados.','contagens':{'itens':len(ITEMS),'receitas':len(RECIPES),'magias':len(SPELLS),'monstros':len(MONSTERS),'cidades':len(TOWNS),'expedicoes':len(ZONES),'missoes':len(QUESTS)},'fontes':[{'nome':'vebyast/skyrim_alchemy','url':'https://github.com/vebyast/skyrim_alchemy','uso':'111 ingredientes e propriedades, nomes adaptados; receitas NÃO originais do Skyrim','escopo':'lista vanilla + DLC no arquivo skyrim_vanilla.csv'}, {'nome':'D&D 5e Livro do Jogador','uso':'extração local de títulos, níveis e escolas; efeitos de jogo reprogramados'}, {'nome':'D&D 5e Guia do Mestre','uso':'referência nominal e de raridade de itens, sem reprodução das descrições'}, {'nome':'D&D 5e Manual dos Monstros','uso':'nomes, categorias e nível de desafio; estatísticas de combate adaptadas'}, {'nome':'Carcaça Lore','uso':'geografia, política e facções do cenário original'}]};dump('manifesto_dados.json',manifest)
