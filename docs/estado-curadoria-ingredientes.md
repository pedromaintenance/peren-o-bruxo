# Estado da curadoria de ingredientes — cobertura ecológica integral

**Atualizado em 03/11/2026.** Esta é a referência de status vigente. A revisão individual terminou no Ciclo 124 e os 25 ciclos históricos (14–38) foram retroauditados ecologicamente sem reenumeração; os estados anteriores permanecem no histórico Git. Escopo: **curadoria editorial e confrontação com Monstros da Carcaça**, sem promover modificações ao catálogo jogável, receitas ou interface.

## Indicadores comprovados

| Indicador | Estado | Interpretação |
|---|---:|---|
| Ingredientes no catálogo | **111** | IDs distintos na curadoria ativa |
| Revisões individuais por ID | **111/111** | 25 históricos + 86 dos Ciclos 39–124, sem repetição |
| Matriz ecológica detalhada | **111/111** | 25 retroauditorias 14–38 + 86 fichas 39–124 |
| Retroauditorias ecológicas pendentes | **0** | Os 25 IDs históricos dos Ciclos 14–38 foram registrados |
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

## Retroauditoria ecológica dos 25 históricos — concluída

Estes ingredientes **já haviam sido revisados individualmente** e agora receberam registros de proveniência ecológica, limites das fontes, pares alquímicos e pendências na matriz estruturada. As decisões históricas não foram revogadas e as fichas ativas continuam idênticas.

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

**Marco alcançado:** 25 registros adicionados a `data/auditoria_ecologica_ingredientes.json`, com `ciclo_historico` e `status_revisao` próprios. Todos os ciclos históricos foram mantidos, sem duplicação. QA: 111/111 IDs, 111 comparações exatas de atributos/intensidades, 53 efeitos distintos, 0 isolados, 0 atributos inválidos e 0 ingredientes faltantes. **Fonte Monstros da Carcaça no lote retroativo:** commit `9514fef2a7f22be2bccfad58bd50b983878ad000`.

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
- **Próximo objetivo editorial:** deliberar sobre três descrições, o campo de **proveniência** do Betta (distinto de habitat), os dois Ovos de Tordo, dois rótulos de efeitos e cinco sinergias prioritárias. [Pacote editorial](pacote-pendencias-editoriais-ingredientes.md) e [parecer de oito combos](parecer-editorial-sinergias-8-candidatos.md) publicados, **sem alteração de dados ativos**.

## Auditoria territorial dos ingredientes — 05/11/2026

- **111/111 ingredientes** reconciliados com a fórmula de distribuição `CITIES[(i * 7) % 9]` do gerador original e com a matriz ecológica.
- **1** registro com override explícito de zona e exclusividade: **Pena de Gaivota — Portomonte**.
- **4** registros de localizações mantidas no README de Peren: **Carapaça de Caranguejo — Além Sul**, **Pó de Vampiro — Boca do Abismo**, **Couro de Rato — Garganta** e **Penas de Falcão — Thargrid**. Esses locais são decisões de continuidade de Peren, não comprovação de ecologia regional da espécie.
- **106** ingredientes sem aprovação territorial individual identificada nas fontes desta passagem; seus locais reconstruídos decorrem da distribuição procedural. As nove zonas ficam com **12 ou 13** ingredientes por efeito da fórmula, não por inventário de fauna/flora.
- [Matriz por ID](../data/auditoria_territorial_ingredientes.json) e [relatório de proveniência territorial](auditoria-proveniencia-territorial-ingredientes.md) publicados, preservando os 111 IDs e toda a curadoria ativa.
- **Limite de verificação:** a matriz representa a **projeção estática do gerador + overrides**; `data/itens.json` não foi comparado integralmente nesta passagem. O chat de mecânicas deve conferir a base publicada antes de mudar zonas, loot, comércio e interface.

## Continuidade territorial — fila de investigação dos 106 (05/11/2026)

- [Fila estruturada](../data/fila-investigacao-territorial-ingredientes.json) com **106/106** registros procedurais e referências por ingrediente; os cinco registros de localizações historicamente preservadas em Peren permanecem fora da fila e não foram revogados.
- Triagem por risco de extrapolação: **P0: 11; P1: 25; P2: 16; P3: 54**. Os marcadores de risco podem coexistir no mesmo ingrediente e não representam balanceamento de jogo.
- **11/11 P0** receberam um **parecer documental preliminar**, sem comprovação nova de habitat e sem autorização de procedência/loot: quatro materiais de pessoa/povo potencialmente sapiente, quatro resíduos/identidades de fonte e três textos com ausência ou discrepância de efeito.
- Os textos candidatos de Betta do Rio, Beladona e Escamas de Piranha continuam **não aprovados** e não foram aplicados.
- [Relatório da fila e pareceres P0](fila-investigacao-ecologica-ingredientes-v1.md): fontes efetivamente verificadas, guardas de cânone, tabela dos 25 P1 e critérios de aceite.
- **Nenhuma alteração** em curadoria ativa, zonas, atributos, receitas, combos, loot, economia, código, saves ou PWA. A comparação integral com o JSON compilado `data/itens.json` continua pendente.

## Continuidade — 25 pareceres P1 (07/11/2026)

- **25/25 P1** revisados documentalmente e registrados em [`data/fila-investigacao-territorial-ingredientes.json`](../data/fila-investigacao-territorial-ingredientes.json), sem homologação de habitat. Os P1 foram organizados em cinco eixos: substâncias/cosmologia (**5**); fontes fantásticas, restos e fósseis (**11**); plantas, clima e topônimos (**6**); nomes duplicados (**2**); fauna costeira (**1**).
- A fila agora contém **36 pareceres iniciais/106** (**11 P0 + 25 P1**). Restam **70** (**16 P2 + 54 P3**) para primeira análise.
- [Relatório individualizado dos P1](pareceres-p1-taxonomia-habitats-ingredientes.md): fatos documentados, lacunas, inferências proibidas e recomendações por ID, com fontes e compromisso de manter a zona procedural como não homologada.
- Regras de proteção reforçadas: `abissal_marinho` não é `demonio`; o Vazio não é um campo de mineração; nomes Luna/Gualápoles não provam fabricação/habitat; Pó de Presa de Mamute permanece fóssil descrito em Peren; os dois Ovos de Tordo são IDs distintos, sem novas espécies estabelecidas.
- **0** habitats, drops ou nomes de ingredientes aprovados nesta rodada. **Nenhuma mudança** nos 111 ingredientes ativos, atributos, intensidades, custos, receitas, zonas, motor, PWA ou saves. Não foi feita auditoria integral de `data/itens.json` servido no jogo.

## Continuidade — 16 pareceres P2 (07/11/2026)

- **16/16 P2** avaliados individualmente na [fila territorial estruturada](../data/fila-investigacao-territorial-ingredientes.json): **8** itens de produção agrícola/criação/manufatura e **8** de origem aquática, pesca, desova ou concreção.
- Total de **52/106** ingredientes com primeiro parecer (**11 P0 + 25 P1 + 16 P2**). Pendentes de primeiro parecer: **54 P3**. Os **5** ingredientes com regiões preservadas historicamente seguem fora da fila procedural, sem revisão de cânone.
- [Relatório de pareceres P2](pareceres-p2-producao-hidrografia-ingredientes.md) publicado com conclusão documental por ID, limites de afirmação, conexões não homologadas entre ingredientes e modelo editorial sugerido para futura integração.
- Atenção às relações **Abelha/Favo/Casca de Colmeia**, **Pérola/Pérola Pequena** e **Ovas/Escamas de Piranha**: sem demonstração de espécie, origem ou cadeia de fornecimento única.
- Agricultura em Portomonte e Grama-Cortada e ofícios em Thargrid **não comprovam** os cultivos, criações ou substâncias individuais da lista. A hidrografia não comprova bacias, afluentes ou áreas de desova.
- **0** habitats ou modos de obtenção homologados. **0** mudanças em ingredientes, zonas, atributos, receitas, combos, engines, loot, menus, saves ou PWA. A comparação integral com o JSON de itens compilado segue pendente.

## Fechamento da primeira passagem territorial — 07/11/2026

**106/106** ingredientes com zonas procedurais receberam primeiro parecer documental: **11 P0 + 25 P1 + 16 P2 + 54 P3**. Os cinco ingredientes com localizações preservadas por decisão/documentação de Peren continuam identificados separadamente na matriz dos **111/111**.

- [Dossiê dos 54 P3](pareceres-p3-primeira-passagem-ecologica.md): 13 fungos/musgos/líquens, 21 plantas/ervas/raízes/vagens, 10 artrópodes/ovos, nove partes de fauna terrestre e um cristal especial.
- [Fechamento e decisões pós-auditoria](fechamento-primeira-passagem-territorial-ingredientes.md): verificação de IDs, efeitos, atributos, níveis de evidência e próximos gates de decisão autoral.
- Verificação complementar de espelhos: `data/itens.json`, `phaser-demo/data/itens.json` e `phaser-demo-m1hf/data/itens.json` apresentam **blob SHA igual**, mas a leitura integral do conteúdo compilado não foi possível pelo conector. **Não** considerar isso conferência dos campos contra o override.
- **0 habitats homologados na fila; 0 alterações em atributos, efeitos, zona, receitas, combos, loot, engines ou saves** por este chat. As propostas não foram transferidas para execução. A próxima etapa é deliberação editorial por decisão, não mais uma rodada de preenchimento procedural.

## Fronteira de escopo — os outros seis ofícios (07/11/2026)

Este arquivo continua limitado aos **111 ingredientes alquímicos**. A auditoria geral foi aberta separadamente em [**Estado da Curadoria de Crafting**](estado-curadoria-crafting-geral.md) e no [**relatório dos sete ofícios**](auditoria-crafting-geral-v1.md). O catálogo declara **2.785 itens / 2.316 receitas**; a revisão do restante reconstruiu **572 receitas não alquímicas** (Forja 89, Joalheria 14, Curtume 20, Cozinha 16, Escrita 320 e Encantamento 113) e **33 matérias-primas gerais**, sem mexer no catálogo ativo. Atenção ao achado P0 de **102 receitas de Encantamento com insumo de quantidade zero**. A revisão dos ingredientes e a revisão de crafting geral devem permanecer distintas, mas interoperáveis.
