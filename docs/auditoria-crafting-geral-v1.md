# Auditoria do crafting de Peren — além dos ingredientes alquímicos

**Data:** 07/11/2026 · **Natureza:** investigação documental + reconstrução do gerador da versão pública. **Estado:** nenhuma mudança no runtime, nos materiais, nas receitas publicadas ou nos saves.

## Por que a auditoria precisava ser ampliada

A revisão anterior acompanhou **111 ingredientes**, seus **53 efeitos** e a ecologia. Mas o jogo possui sete ofícios, materiais que não são ingredientes alquímicos, dezenas de formas de equipamento, comidas, grimórios e itens mágicos. A Constituição do jogo trata crafting e coleta como pilares do sandbox, e os demais ofícios têm regras materiais próprias — não é correto reduzir tudo ao mecanismo de correspondência de efeitos alquímicos.

O catálogo declara **2785 itens e 2316 receitas**. A reconstrução das fontes atuais fecha a contagem inteira de receitas:

| Ofício / origem da fórmula | Receitas | Modo atual de geração |
|---|---:|---|
| Alquimia — pares legados | **1.740** | Dois ingredientes com pelo menos um efeito legado compartilhado |
| Alquimia — quatro fórmulas diretas | **4** | Preparados específicos de equipamento inicial |
| Escrita | **320** | Grimórios por magia de D&D com limite de nível |
| Encantamento | **113** | Seleção de itens mágicos pela posição na extração e pelo nível |
| Forja | **89** | 84 equipamentos de linhagem + 5 lingotes |
| Curtume | **20** | Quatro materiais × cinco formas de vestimenta/bolsa |
| Cozinha | **16** | Fórmulas binárias de refeições |
| Joalheria | **14** | Dois acessórios por sete linhagens |
| **Total** | **2.316** | Todas as chamadas `rec()` representadas |

**Resultado:** **572 receitas não alquímicas** e **1.744 receitas alquímicas**. As matrizes detalhadas e auditáveis são [139 receitas de produção tradicional](../data/auditoria-crafting-nao-alquimico-v1.json) e [433 receitas de Escrita/Encantamento](../data/auditoria-crafting-escrita-encantamento-v1.json).

A reconstrução também permite conciliar, **por contagem e categorias de origem**, os 2.785 itens: 111 ingredientes, 33 matérias-primas gerais, 1.740 poções combinatórias, 139 produtos tradicionais, 354 grimórios, 253 relíquias, 20 equipamentos/suprimentos iniciais e **135 objetos PHB residuais inferidos por diferença**. O total bate em 2.785, mas a última classe foi inferida pela fórmula e pelo manifesto; **não auditamos individualmente os 135 objetos**.

Os **469 itens sem receita**, nessa reconstrução, são: 111 ingredientes, 33 materiais gerais, 16 itens iniciais sem receita direta, 34 grimórios de magias mais elevadas, 140 relíquias não selecionadas pelo gerador e 135 objetos PHB. **Ausência de receita não implica erro:** muitos são matérias-primas, mercadorias, recompensas ou bens não fabricáveis intencionalmente.

## 1. Defeitos objetivos e grandes riscos

### P0 — Encantamento: 102 quantidades inválidas

O gerador produz **113 receitas de Encantamento**. Para **102**, registra o campo `mat-cristal-de-alma-maior` com quantidade **0**, embora todas usem 1 Cristal de Alma Menor, Pó de Gema e Tinta Rúnica.

- No [gerador](../ferramentas/build_data.py), a expressão `1 if lvl>=4 else 0` cria um **insumo de quantidade zero** para níveis 2–3.
- O [Laboratório de Itens](../laboratorio-itens/app.js) marca `quantidade<=0` como **Quantidade inválida**.
- O [motor clássico](../game.js) só verifica estoque `qty>=quantidade` e pode considerar um requisito zero satisfeito sem objeto possuído. Isso é incoerência estrutural entre os contratos de dados.

**Parecer:** corrigir o *formato da receita* em branch de engenharia, mediante coordenação: se o cristal maior não for obrigatório nesses níveis, sua linha deve ser omitida; **não** mudar 0 para 1 indiscriminadamente, pois isso altera custo e progressão. Testar Livro de Receitas, mercado, saves e produções anteriores à atualização.

### P0 — Slots de equipamento incompletos para as famílias geradas

A forja produz luvas, botas, elmos, peitorais, arcos, etc. O curtume também produz capuzes, mantos e braçadeiras; a joalheria produz **14 anéis/colares**. Mas o clássico usa apenas três slots de equipamento: **weapon**, **armor** e **relic**. O código `equip()` envia armas ao primeiro, armaduras/escudos ao segundo e **acessórios ao slot de relíquia**.

- **49 armas** recebem `defesa>0` pela fórmula, embora a função `def()` só use a Defesa do item no slot armor.
- **14 joias** recebem Defesa calculada, mas ao ocuparem o slot relic a Defesa armazenada não entra diretamente no cálculo; o motor usa `nivel` da relíquia.
- **Quatro Bolsas de Coleta** recebem Defesa, mas são categorizadas como `utilitario` e não podem ser equipadas pelo fluxo normal.

**Parecer:** distinguir campos descritivos/legados dos efetivamente aplicados no motor, definir slots próprios e revisar persistência do save **antes** de alterar atributos ou inventar bônus.

### P0 — Cadeia de metalurgia interrompida

Há cinco receitas de lingotes e **zero receitas tradicionais** que os consomem. As armas, joias e armaduras de cinco linhagens utilizam minério bruto diretamente: **70 receitas**, sendo **60 de Forja** e **10 de Joalheria**. Os 139 produtos tradicionais também não são usados como insumos em nenhuma outra dessas receitas, evidenciando ausência de progressão produtiva por etapas.

**Ajuste proposto para deliberação:** matéria-prima → tratamento/refino → componente ou lingote → projeto → peça acabada. Essa sequência **ainda não é cânone**, e migrá-la requer proteger saves, itens existentes, mercados e custos.

Além disso, a primeira linhagem chama-se **Ferrugem**, embora parta de Ferro bruto; convém decidir se Ferrugem é designação cultural/estética ou nome indevido de liga.

### P1 — Economia nominal dos lingotes

| Receita (2 lingotes por preparo) | Valor cadastral dos insumos | Valor cadastral das saídas | Diferença |
|---|---:|---:|---:|
| Lingote de Ferrugem | 14 | 20 | +6 |
| Lingote de Prata | 40 | 40 | +0 |
| Lingote de Ouro Rúnico | 80 | 60 | -20 |
| Lingote de Mitral | 134 | 80 | -54 |
| Lingote de Adamante | 254 | 100 | -154 |

Valores **não incluem custo de trabalho, tributos, oferta/escassez ou fórmula real de compra e venda do motor**. Portanto são **sinais de inconsistência de valoração nominal**, não demonstração de lucro/prejuízo efetivo.

## 2. Escrita e Encantamento: investigação adicional

**Escrita — 320 fórmulas:** usa **Linho de Deméter ×2** e **Tinta Rúnica** (1 a 4 unidades, conforme nível) para gerar um grimório. O gerador deixa **34 magias de nível 8–9 sem receita**. Embora exista `ger-pergaminho-vazio`, ele não entra nessas fórmulas. A escolha de escrever em linho **pode ser válida culturalmente**, mas precisa ser aprovada em vez de presumida. O atlas confirma agricultura em Portomonte, não a produção de linho ou controle da escrita pelo templo.

**Encantamento — 113 fórmulas:** a seleção depende da **posição par** da relíquia na leitura do Guia do Mestre, desde que tenha nível menor que 5. **140 das 253 relíquias ficam sem receita**. Isso não é uma regra de artesão baseada na Carcaça, e sim um filtro técnico de geração. Todas as 113 fórmulas usam cristais de alma, pó de gema e tinta; nenhuma exige equipamento-base identificado como objeto a encantar. Há ainda perda da distinção física de vários tipos de relíquias em `tipo: item_magico`.

**Decisões pendentes:** quais objetos admitem encantamento, o que exatamente é criado/reencantado, como se estabelece a fonte do poder, o lugar de cristais de alma e o papel de perícia, qualidade, componentes, ferramentas e trabalho. **Não** tratar almas de seres sapientes como combustível gratuito ou automático de loot sem regra de mundo.

## 3. Cozinha: revisão das 16 receitas

Todas as 16 refeições recebem `efeito: Restore Health`, com potência de 10 a 25 pelo índice de inserção e **saída de duas porções**, independentemente da natureza dos ingredientes. As receitas usam exatamente dois ingredientes cada. Isso pode ser um *placeholder* de gameplay, mas não representa automaticamente conteúdo culinário coerente.

| Receita | Insumos registrados | Parecer de consistência |
|---|---|---|
| **Ensopado de Rio** | ing-histcarp + ing-garlic | Carpa e alho não descrevem caldo nem processo. |
| **Pão de Mel da Foz** | ing-honeycomb + ing-wheat | Favo e trigo sem massa/água/forno cadastrados; nome Foz não é procedência. |
| **Caldo da Montanha** | ing-frost-mirriam + ing-juniper-berries | Ervas aromáticas sem água/caldo ou nutrição demonstrada. |
| **Guisado de Caatinga** | ing-boar-tusk + ing-garlic | Presa de Javali e alho; falta ingrediente equivalente à carne. |
| **Peixe com Sal do Mar** | ing-salmon-roe + ing-salt-pile | Ovas de Salmão não são filé; Sal do Sangue requer avaliação de segurança. |
| **Cogu-sopa de Ironwood** | ing-glowing-mushroom + ing-white-cap | Cogumelos sem base de sopa; Ironwood não prova origem. |
| **Ração dos Vigias** | ing-wheat + ing-blue-mountain-flower | Trigo e flor medicinal não descrevem fabricação da ração. |
| **Chá de Lavanda** | ing-lavender + ing-juniper-berries | Sem água ou operação de infusão cadastrada. |
| **Prato dos Anões** | ing-large-antlers + ing-jazbay-grapes | Chifres de Alce e uvas, sem alimento proteico descrito; não atribuir a tradição a todos os anões. |
| **Banquete de Portomonte** | ing-purple-mountain-flower + ing-salmon-roe | Flor e ovas, sem escopo de banquete nem prova regional do peixe. |
| **Pescado Defumado** | ing-silverside-perch + ing-garlic | Perca e alho sem etapa de defumação. |
| **Compota das Montanhas** | ing-snowberries + ing-jazbay-grapes | Bagas e uvas sem processo de conservação. |
| **Torta de Mel** | ing-chicken-s-egg + ing-honeycomb | Ovo e favo, sem farinha/massa. |
| **Pão de Deméter** | ing-wheat + ing-salt-pile | Trigo e Sal do Sangue, sem água/fermento; bênção não prova segurança do sal. |
| **Chá dos Sonhos** | ing-mora-tapinella + ing-moon-sugar | Fungo de Raiz e Açúcar Lunar sem água; não presumir inocuidade. |
| **Ensopado de Algas** | ing-grass-pod + ing-nordic-barnacle | Vagem da Charneca e Craca de Rio: nenhum dos dois é identificado como alga. |

**Critério de revisão:** preservar nomes aprovados quando houver, separar ingrediente culinário de insumo alquímico, distinguir preparo de ingrediente, verificar toxicidade/adequação alimentar na ficção e exigir aprovação antes de substituir itens ou alterar efeitos.

## 4. Matérias-primas gerais: 33/33 rastreadas

A auditoria individual dos 33 materiais identifica nome, tipo, nível, valor nominal, zona do cadastro, receitas que os consomem e dúvidas de proveniência. Contando **todas as 572 receitas não alquímicas**, **16 materiais** não são consumidos com quantidade positiva. Um deles, **Água Purificada**, aparece em **três das quatro** receitas alquímicas específicas; portanto **15 dos 33** não aparecem como insumo positivo em nenhuma receita reconstruída do gerador.

| Material de base | Zona do cadastro (não homologada) | Receitas não alquímicas com consumo positivo | Nas quatro receitas alquímicas? | Limite principal |
|---|---|---:|---|---|
| `mat-ferro-bruto` — Ferro bruto | garganta | 15 | Não | Procedência e cadeia ainda sem validação específica |
| `mat-carvao-de-forja` — Carvão de forja | thargrid | 5 | Não | combustivel_sem_fonte_ou_processamento_documentado |
| `mat-madeira-de-ironwood` — Madeira de Ironwood | ironwood | 7 | Não | nome_da_regiao_nao_e_prova_de_qualidade_ou_especie_de_madeira |
| `mat-madeira-de-vandar` — Madeira de Vandar | eldroth | 0 | Não | ruinas_de_vandar_nao_confirmam_madeira_ou_extracao |
| `mat-couro-curtido` — Couro curtido | alem-sul | 40 | Não | Procedência e cadeia ainda sem validação específica |
| `mat-linha-de-seda` — Linha de seda | portomonte | 5 | Não | Procedência e cadeia ainda sem validação específica |
| `mat-linho-de-demeter` — Linho de Deméter | portomonte | 325 | Não | agricultura_em_portomonte_nao_confirma_plantio_de_linho_ou_monopolio |
| `mat-minerio-de-prata` — Minério de prata | thargrid | 15 | Não | Procedência e cadeia ainda sem validação específica |
| `mat-minerio-de-ouro` — Minério de ouro | garganta | 15 | Não | Procedência e cadeia ainda sem validação específica |
| `mat-minerio-de-mitral` — Minério de mitral | thargrid | 15 | Não | metal_fantastico_sem_localizacao_geologica_demonstrada |
| `mat-minerio-de-adamante` — Minério de adamante | garganta | 15 | Não | metal_fantastico_sem_localizacao_geologica_demonstrada |
| `mat-osso-de-golzdov` — Osso de Golzdov | garganta | 14 | Não | cosmologia_primordial_e_ossatura_sensivel |
| `mat-escama-de-dragao` — Escama de Dragão | eldroth | 14 | Não | dragao_individuo_ou_especie_fonte_nao_identificada |
| `mat-fibra-de-aranha-yokai` — Fibra de Aranha Yokai | boca-abismo | 5 | Não | yokai_povo_ou_tipo_nao_identifica_especie_de_aranha |
| `mat-fragmento-de-gelo-eterno` — Fragmento de Gelo Eterno | thargrid | 0 | Não | Procedência e cadeia ainda sem validação específica |
| `mat-brasa-feerica` — Brasa Feérica | eldroth | 0 | Não | origem_feerica_indeterminada |
| `mat-essencia-do-vazio` — Essência do Vazio | boca-abismo | 0 | Não | vazio_nome_nao_comprova_extracao_cosmologica |
| `mat-seiva-vital` — Seiva Vital | ironwood | 0 | Não | ser_vegetal_produtor_indeterminado |
| `mat-agua-purificada` — Água Purificada | portomonte | 0 | Sim | purificacao_para_agricultura_nao_confirma_potabilidade_ou_disponibilidade_comercial |
| `mat-tinta-runica` — Tinta Rúnica | garganta | 433 | Não | nao_confundir_inscricao_yokai_com_material_da_tinta |
| `mat-po-de-gema` — Pó de Gema | shadar-riverie | 127 | Não | Procedência e cadeia ainda sem validação específica |
| `mat-cristal-de-alma-menor` — Cristal de Alma Menor | garganta | 113 | Sim | conteudo_da_alma_e_forma_de_obtencao_nao_documentados |
| `mat-cristal-de-alma-maior` — Cristal de Alma Maior | shadar-riverie | 11 | Não | conteudo_da_alma_e_forma_de_obtencao_nao_documentados |
| `mat-fragmento-de-juramento` — Fragmento de Juramento | boca-abismo | 0 | Não | juramento_nao_tem_forma_material_documentada |
| `mat-perola-negra` — Pérola Negra | portomonte | 0 | Não | Procedência e cadeia ainda sem validação específica |
| `mat-rubi-do-sangue` — Rubi do Sangue | boca-abismo | 0 | Não | nome_sangue_nao_identifica_origem_maritima |
| `mat-safira-lunar` — Safira Lunar | shadar-riverie | 0 | Não | nome_lunar_nao_identifica_templo |
| `mat-esmeralda-da-floresta` — Esmeralda da Floresta | ironwood | 0 | Não | floresta_nao_comprova_jazida_de_esmeralda |
| `mat-topazio-solar` — Topázio Solar | portomonte | 0 | Não | nome_solar_nao_e_prova_de_culto_ou_origem |
| `mat-quartzo-da-montanha` — Quartzo da Montanha | thargrid | 0 | Não | Procedência e cadeia ainda sem validação específica |
| `mat-pederneira` — Pederneira | alem-sul | 0 | Não | Procedência e cadeia ainda sem validação específica |
| `mat-sal-de-mare` — Sal de Maré | portomonte | 0 | Não | nao_fundir_automaticamente_com_sal_do_sangue |
| `mat-vapor-de-eter` — Vapor de Éter | shadar-riverie | 0 | Não | eter_nao_necessariamente_conceito_cosmologico_de_corau |

**Casos a proteger do uso literal de nome/local:**

- **Osso de Golzdov:** a cosmologia registra o corpo de Kindau como continente. Isso não estabelece extração de partes primordiais como minério genérico, nem acesso livre a relíquias de sua ossatura.
- **Fibra de Aranha Yokai:** Yokai designa tanto uma tradição/povo antigo quanto um tipo de criatura em registros diferentes. O nome não identifica espécie de aranha nem autoriza exploração de um povo.
- **Linho de Deméter e Água Purificada:** Portomonte possui agricultura e tratamento localizado de águas, mas não prova especificamente linho, potabilidade do produto ou monopólio do templo.
- **Madeira de Vandar:** a existência das ruínas não prova que se colha madeira naquele território; nem que a madeira proceda dos edifícios, das árvores ou de comércio.
- **Cristais de Alma, Essência do Vazio e Fragmento de Juramento:** nomes não bastam para definir recipiente de alma, matéria cosmológica extraível ou juramento materializado. Decisão autoral necessária antes de normalizar produção/mercados.

## 5. Consequências para o projeto e ordem de trabalho

O [roadmap dos ofícios](roadmap-crafting-mecanicas-menus.md) já estabelece que os sete sistemas devem ter gramáticas próprias e que seus menus não devem despejar milhares de receitas em uma lista plana. O clássico atualmente lista receitas conhecidas sem a camada completa de descobertas e trabalha com **estação, proficiência e quantidades**, sem contrato próprio de ferramenta, processo, perda, qualidade ou fabricação livre dos demais ofícios.

**Fases recomendadas:**

1. **Correção estrutural P0 (engenharia):** insumos de quantidade zero, teste de integridade de IDs, contratos de slot/equipamento e comportamento das 102 receitas.
2. **Metalurgia e joalheria:** decidir se usar lingotes é exigência real e como preservar 98 equipamentos, cinco lingotes, 14 joias e os saves anteriores.
3. **Cozinha:** revisar as 16 fórmulas e a coerência entre ingredientes, denominação do prato e preparo. Não corrigir sem aprovação.
4. **Escrita e encantamento:** definir suporte de grimório, substrato de relíquia, disponibilidade de cristal de alma, variantes e quais itens são artesanais ou encontrados.
5. **Curtume e vestuário:** separar pele, corte, costura, tecelagem e bolsas; decidir slots e funções de Capuz, Manto, Braçadeiras e Bolsa de Coleta.
6. **Proveniência de materiais:** decidir apenas onde houver fonte e objetivo concreto de exploração/mercado; não inventar 33 regiões produtoras.
7. **Economia:** comparar preços de compra e venda reais, custos e rendimento; acrescentar qualidade e mão de obra apenas mediante decisão.
8. **QA e publicação:** executar compilação e testes das sete estações no ambiente do agente de mecânicas. O laboratório de dados funciona como inspetor, **não** como motor de autorização.

## Estado dos arquivos e limitações

Estas entregas são **somente arquivos editoriais novos** e não alteram `data/curadoria_ingredientes.json`, `data/itens.json`, `data/receitas.json`, engine clássico ou Phaser, loot, inventário, economia ou saves.

A reconstrução das **2.316 receitas** combina `ferramentas/build_data.py`, `data/magias.json`, `data/reliquias_dnd.json` e manifesto. O conector não permitiu leitura integral dos dois JSONs compilados de 1,2 MB; por isso **não certificamos que cada registro compilado espelhe exatamente a fórmula do gerador**, embora a contagem reconciliada e o Git blob das três cópias de itens tenham sido conferidos em ciclos anteriores.

As observações sobre biome, origem e cultura provêm da consulta ao atlas de [Monstros da Carcaça](https://github.com/pedromaintenance/monstros-carcaca). Propostas desse repositório permanecem não homologadas quando assim identificadas; as interpretações de metalurgia e culinária acima são **pareceres editoriais**, não novos fatos do cenário.

**Próximo passo editorial:** pactuar o tratamento das **102 receitas estruturalmente inválidas** com o agente de mecânicas e preparar um pacote de decisão autoral, ofício por ofício, sem aplicar mutações automáticas.
