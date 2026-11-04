# Estado da curadoria de ingredientes — após o Ciclo 124

**Consolidado em 03/11/2026.** Esta é a referência de status vigente; a versão anterior (após o Ciclo 111) permanece no histórico Git. Escopo: **curadoria editorial e confrontação com Monstros da Carcaça**, sem promover modificações ao catálogo jogável, receitas ou interface.

## Indicadores comprovados

| Indicador | Estado | Interpretação |
|---|---:|---|
| Ingredientes no catálogo | **111** | IDs distintos na curadoria ativa |
| Revisões individuais por ID | **111/111** | 25 históricos + 86 dos Ciclos 39–124, sem repetição |
| Matriz ecológica detalhada | **86/111** | Fichas de Ciclos 39–124 |
| Retroauditorias ecológicas pendentes | **25** | Os 25 IDs históricos dos Ciclos 14–38 |
| Efeitos distintos | **53** | Todos têm pelo menos dois ingredientes como fonte |
| Efeitos isolados | **0** | Não há efeitos sem parceiro |
| Fichas com menos de três atributos | **0** | Conformidade com mínimo canônico |
| Intensidades inválidas ou IDs de efeitos repetidos na mesma ficha | **0** | QA estrutural |
| Nomes de ingredientes duplicados | **1 par** | Dois IDs de Ovo de Tordo, não equivalente |
| IDs de efeito com nomes alternativos | **2** | `curar_doenca` e `voar` |
| Campos de descrição/origem ausentes | **2** | Ambos em `ing-river-betty` |

**Raridades do catálogo ativo:** comum 54, incomum 31, raro 22, épico 4. **Blob do catálogo analisado:** `57cf86f623ecabb4c30eb3a052384d627b615aa8`. **Publicação:** nenhuma alteração no catálogo foi necessária para documentar a auditoria.

## Ciclos 112–124 — lacunas individuais encerradas

| Ciclo | Ingrediente | ID | Parceiros |
|---:|---|---|---:|
| 112 | Algodão da Tundra | `ing-tundra-cotton` | 33 |
| 113 | Escamas de Piranha | `ing-slaughterfish-scales` | 33 |
| 114 | Favo de Mel | `ing-honeycomb` | 33 |
| 115 | Líquen Gigante | `ing-giant-lichen` | 33 |
| 116 | Trigo | `ing-wheat` | 34 |
| 117 | Alho | `ing-garlic` | 34 |
| 118 | Libélula Laranja | `ing-orange-dartwing` | 35 |
| 119 | Espinho-da-Morte | `ing-scathecraw` | 36 |
| 120 | Pérola | `ing-pearl` | 39 |
| 121 | Raiz Botulínica | `ing-jarrin-root` | 42 |
| 122 | Cauda de Rato | `ing-skeever-tail` | 42 |
| 123 | Ovas de Piranha | `ing-slaughterfish-egg` | 42 |
| 124 | Cogumelo de Raiz | `ing-mora-tapinella` | 48 |

As decisões anteriores dos Ciclos 4 e 5 — **Curar Doença II no Alho** e **Infligir Doença II na Cauda de Rato** — foram preservadas. A Raiz Botulínica mantém seus quatro efeitos de intensidade III, sem balanceamento redutor. O cruzamento com a Carcaça não comprova ocorrência regional de piranhas, apiários, plantas de tundra ou fungos específicos.

## A próxima fila: retroauditoria ecológica dos 25 históricos

Estes ingredientes **já foram revisados individualmente** e não estão em atraso de atributos. O que falta é colocar sua **proveniência ecológica, evidência e lacunas** na matriz estruturada, sem revogar decisões históricas.

| Histórico | Ingrediente | ID | Parceiros atuais |
|---:|---|---|---:|
| 14 | Penas de Falcão | `ing-hawk-feathers` | 3 |
| 15 | Raiz de Trama | `ing-trama-root` | 9 |
| 16 | Seiva de Ent | `ing-spriggan-sap` | 9 |
| 17 | Cogumelo Escamoso | `ing-scaly-pholiota` | 9 |
| 18 | Cogumelo Luminescente | `ing-glowing-mushroom` | 10 |
| 19 | Couro de Rato | `ing-charred-skeever-hide` | 11 |
| 20 | Pó de Vampiro | `ing-vampire-dust` | 12 |
| 21 | Língua-de-Dragão | `ing-dragon-s-tongue` | 12 |
| 22 | Coração de Demônio | `ing-daedra-heart` | 13 |
| 23 | Musgo Pendente | `ing-hanging-moss` | 14 |
| 24 | Penas de Bruxa | `ing-hagraven-feathers` | 15 |
| 25 | Peixe-Espada do Sangue | `ing-abecean-longfin` | 15 |
| 26 | Craca de Rio | `ing-nordic-barnacle` | 16 |
| 27 | Fungo de Bolha | `ing-blisterwort` | 16 |
| 28 | Mirra da Geada | `ing-frost-mirriam` | 16 |
| 29 | Dentes de Espectro Gelado | `ing-ice-wraith-teeth` | 17 |
| 30 | Poeira Luminosa | `ing-glow-dust` | 18 |
| 31 | Asa de Mariposa Lunar | `ing-luna-moth-wing` | 18 |
| 32 | Madeira de Ent Carbonizado | `ing-burnt-spriggan-wood` | 18 |
| 33 | Tufo Rastejante | `ing-creep-cluster` | 18 |
| 34 | Gelatina de Gafanhoto | `ing-ash-hopper-jelly` | 18 |
| 35 | Sais Ígneos | `ing-fire-salts` | 18 |
| 36 | Fungo de Gualápoles | `ing-namira-s-rot` | 19 |
| 37 | Asa de Borboleta Azul | `ing-blue-butterfly-wing` | 19 |
| 38 | Vagem Cinzenta | `ing-ashen-grass-pod` | 19 |

**Critério do próximo marco:** adicionar 25 registros ecológicos a `data/auditoria_ecologica_ingredientes.json`, com `ciclo_historico` e `status_revisao` próprios, SEM reenumerar os Ciclos 14–38 e SEM criar registros duplicados. Finalizar com matriz 111/111 e testar todos os atributos e IDs.

## Pendências editoriais não concluídas

1. **Betta do Rio (`ing-river-betty`):** faltam `descricao` e `origem`; descrição candidata registrada, origem não presumida.
2. **Beladona (`ing-nightshade`):** descrição sugere recuperação mágica, mas os três efeitos vigentes não a representam.
3. **Escamas de Piranha (`ing-slaughterfish-scales`):** a descrição cita antídotos, enquanto os efeitos são Defesa II, Resistência ao Gelo II e Dano à Saúde I. Há redação candidata registrada na matriz; não adicionar efeitos por causa do texto.
4. **Ovos de Tordo:** nome idêntico para `ing-rock-warbler-egg` (restauração) e `ing-pine-thrush-egg` (agilidade). Rótulos funcionais são propostas não canônicas, não nomes taxonômicos.
5. **Dois rótulos por efeito:** `curar_doenca` = Curar doença/Curar Doença; `voar` = Voar/Voo. Padronizar somente texto, mantendo IDs.
6. **Proveniência de materiais sapientes:** Carne Humana, Coração Humano, Dedo de Gigante e a potencial Orelha de Troglodita. A existência de pessoas, povos e territórios não justifica fontes genéricas de loot ou práticas de obtenção não documentadas.
7. **Classificação da Gelatina de Medusa:** criatura flutuante de origem indeterminada; não deduzir górgona ou água-viva.
8. **Cosmologia e região:** Vazio, templos, Vandar, Thargrid e Mar de Sangue não são origens automáticas de itens com nomes parecidos.

## Entrega para o outro chat

- **Fonte canônica atual:** `data/curadoria_ingredientes.json` — usar IDs e atributos nela registrados.
- **Evidência ecológica e textos candidatos:** `data/auditoria_ecologica_ingredientes.json` — somente informativo, não integrar como regras de obtenção sem avaliação.
- **Precedentes de decisão:** `docs/auditoria-alquimia-peren.md`; política de proveniência em `docs/curadoria-itens-consistencia-carcaca.md`.
- **Risco de sincronização:** edições da curadoria ativa podem disparar workflow que replica dados para runtimes. Este chat **não implementa mecânica, menus, saves, loot, economia ou receitas**; coordenar alterações de dados ativos antes de qualquer integração.
- **Próximo objetivo editorial:** terminar as 25 retroauditorias ecológicas; depois preparar um pacote de correções textuais com diff, impacto e decisão de integração explícita.
