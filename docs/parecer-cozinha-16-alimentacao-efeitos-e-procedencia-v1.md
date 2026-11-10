# Cozinha de Peren — pareceres das 16 receitas e alimentação na Carcaça

**Data:** 09/11/2026. **Estado:** auditoria editorial, não executável. Nenhuma alteração de nomes, insumos, efeitos, mercados, loot, receitas ou saves.

**Fonte de detalhe:** [matriz estruturada](../data/auditoria-cozinha-16-v1.json), [gerador](../ferramentas/build_data.py), [motor clássico](../game.js), [cidades](../data/cidades.json), [curadoria](../data/curadoria_ingredientes.json) e [ecologia](../data/auditoria_ecologica_ingredientes.json).

## Inventário e mecânica vigente

- **16 receitas; 23 ingredientes diferentes; 32 unidades de insumo no conjunto** (uma fabricação de cada receita).
- Todas usam **dois insumos, uma unidade de cada**, e produzem **duas porções**.
- Todas as refeições restauram Vida (`Restore Health`) com potência linear **10 a 25**, seguindo a ordem do gerador, não a técnica ou valor nutritivo do prato.
- Exigências: **cinco** receitas de Cozinha 8, **cinco** de Cozinha 13, **cinco** de Cozinha 18 e **uma** de Cozinha 23.
- Peren começa com Cozinha 12 em Portomonte, podendo fabricar as primeiras cinco caso possua os insumos.
- Oficinas de Cozinha: **Portomonte, Drakport e Além Sul**. Nenhuma receita exige explicitamente Água Purificada.
- Usar um prato no clássico restaura PV, não reduz fadiga ou fome; os efeitos alquímicos dos ingredientes não passam automaticamente à comida.
- Fabricar gasta uma ação, mas comer não chama `actionSpend()`; consumir durante combate pode, entretanto, acionar o turno inimigo.
- `travel()` consome apenas `ger-racoes-de-viagem` ou cobra 20 moedas. A **Ração dos Vigias não substitui** essa ração.

**Prioridades dos pareceres:** 4 casos P0 de contradição material ou preparação sensível; 6 P1 de correspondência, função ou processo; 6 P2 de especificação de preparo e proveniência. A prioridade não comprova toxicidade real nem nega uma culinária mágica intencional.

## Comparativo completo dos 16 pratos

| Prato | Prioridade | Insumos atuais | Lacuna comprovável / questão aberta |
|---|---|---|---|
| Ensopado de Rio | P2 | Carpa de Pedra + Alho | Carpa e alho são alimentos plausíveis, mas o preparo de ensopado não especifica caldo, água, cozedura nem utensílio; Rio não identifica bacia de pesca. |
| Pão de Mel da Foz | P2 | Favo de Mel + Trigo | Favo de Mel e Trigo sustentam um pão doce, mas o gerador não modela moagem, massa, água, fermentação ou cocção; 'Foz' não comprova local de origem. |
| Caldo da Montanha | P2 | Mirra da Geada + Bagas de Zimbro | Mirra da Geada e Bagas de Zimbro fornecem aromas, mas não descrevem líquido, veículo alimentar ou finalidade nutritiva. Montanha não confirma proveniência. |
| Guisado de Caatinga | P0 | Presa de Javali + Alho | A receita consome Presa de Javali (dente) e Alho; não consome carne ou vegetal equivalente a proteína. A ficha da presa a descreve como parte triturada para tônicos. |
| Peixe com Sal do Mar | P1 | Ovas de Salmão + Sal do Sangue | Ovas de Salmão e Sal do Sangue podem ser concebidos como prato de ovas, mas não representam filé de peixe. O sal é descrito como extraído do Mar de Sangue e não há validação alimentar. |
| Cogu-sopa de Ironwood | P2 | Cogumelo Luminescente + Chapéu Branco | Dois cogumelos sustentam uma sopa, mas não há caldo ou água registrados. Não está comprovada ocorrência de ambos em Ironwood nem processamento para consumo. |
| Ração dos Vigias | P1 | Trigo + Flor Azul da Montanha | Trigo e Flor Azul da Montanha compõem um alimento nominal, porém não há técnica de conservação/rações. No clássico não substitui ger-racoes-de-viagem no deslocamento. |
| Chá de Lavanda | P2 | Lavanda Selvagem + Bagas de Zimbro | Lavanda Selvagem e Bagas de Zimbro são aromáticas, mas a infusão não explicita água; a descrição de lavanda 'acalma' não é um quarto efeito mecânico. |
| Prato dos Anões | P0 | Chifres de Alce + Uvas de Jasmim | Chifres de Alce e Uvas de Jasmim não fornecem preparação culinária explicitamente definida; Chifres são moídos para tônicos, não identificados como alimento. A receita não estabelece uma tradição de todos os anões. |
| Banquete de Portomonte | P1 | Flor Violeta + Ovas de Salmão | Duas unidades de insumos (Flor Violeta e Ovas de Salmão) geram duas porções; não demonstram escala de banquete nem captura local de salmão ou produção em Portomonte. |
| Pescado Defumado | P1 | Perca Prateada + Alho | Perca Prateada e Alho permitem um prato de pescado, mas nenhum combustível, tempo, técnica ou estação de defumação aparece no processo. |
| Compota das Montanhas | P2 | Bagas da Neve + Uvas de Jasmim | Bagas da Neve e Uvas de Jasmim formam base frutal, mas o método de conservação/aquecimento não consta; extrato concentrado de Uvas de Jasmim é nocivo na descrição de Peren, sem transposição automática para a fruta preparada. |
| Torta de Mel | P1 | Ovo de Galinha + Favo de Mel | Ovo de Galinha e Favo de Mel não descrevem massa ou crosta de torta; não há trigo, farinha, forno ou técnica de panificação nos insumos registrados. |
| Pão de Deméter | P1 | Trigo + Sal do Sangue | Trigo e Sal do Sangue não especificam massa/água/fermentação; o templo de Deméter ajuda agricultura em Portomonte, mas não garante que o sal marítimo seja seguro ou a receita seja institucional. |
| Chá dos Sonhos | P0 | Cogumelo de Raiz + Açúcar Lunar | Cogumelo de Raiz possui Dano à Saúde I entre atributos da curadoria; Açúcar Lunar é cristal arcano. A receita de chá não documenta extração, neutralização ou segurança do consumo; no motor cura como os demais. |
| Ensopado de Algas | P0 | Vagem da Charneca + Craca de Rio | Vagem da Charneca e Craca de Rio não são identificadas como algas na curadoria; nenhuma alga aparece entre os dois insumos. Caldo e preparação da craca não são descritos. |

## Encaminhamento individualizado

### P0

**Guisado de Caatinga** — `rec-guisado-de-caatinga` · Cozinha 8 · cura 13 PV · 2 porções.
- **Achado:** A receita consome Presa de Javali (dente) e Alho; não consome carne ou vegetal equivalente a proteína. A ficha da presa a descreve como parte triturada para tônicos.
- **Decisão necessária:** Resolver contradição entre guisado e matéria-prima rígida; não inventar descarte de caça nem converter presa em carne por renomeação silenciosa.
- **Alternativas não aprovadas:** `preservar_receita_e_assumir_preparo_fantastico_explicito`, `propor_insumo_comestivel_proprio`, `alterar_nome_do_prato_com_migracao`.

**Prato dos Anões** — `rec-prato-dos-anoes` · Cozinha 13 · cura 18 PV · 2 porções.
- **Achado:** Chifres de Alce e Uvas de Jasmim não fornecem preparação culinária explicitamente definida; Chifres são moídos para tônicos, não identificados como alimento. A receita não estabelece uma tradição de todos os anões.
- **Decisão necessária:** Resolver papel dos chifres no prato e caráter cultural do nome, sem criar costume anão universal ou trocar ingredientes silenciosamente.
- **Alternativas não aprovadas:** `uso_culinario_fantastico_documentado`, `substituir_insumo_por_alimento_adequado_com_aprovacao`, `renomear_preparo_com_compatibilidade`.

**Chá dos Sonhos** — `rec-cha-dos-sonhos` · Cozinha 18 · cura 24 PV · 2 porções.
- **Achado:** Cogumelo de Raiz possui Dano à Saúde I entre atributos da curadoria; Açúcar Lunar é cristal arcano. A receita de chá não documenta extração, neutralização ou segurança do consumo; no motor cura como os demais.
- **Decisão necessária:** Decidir se chá é remédio, ritual, risco deliberado ou bebida com preparação própria, sem copiar o efeito Dano à Saúde como dano automático.
- **Alternativas não aprovadas:** `receita_fantastica_com_preparo_de_seguranca`, `efeito_misto_autorizado_e_testado`, `substituicao_de_insumo_apos_deliberacao`.

**Ensopado de Algas** — `rec-ensopado-de-algas` · Cozinha 23 · cura 25 PV · 2 porções.
- **Achado:** Vagem da Charneca e Craca de Rio não são identificadas como algas na curadoria; nenhuma alga aparece entre os dois insumos. Caldo e preparação da craca não são descritos.
- **Decisão necessária:** Resolver a contradição nominal sem atribuir vegetais costeiros a algas ou inventar alga canônica.
- **Alternativas não aprovadas:** `renomear_para_prato_de_vagem_e_craca`, `adicionar_alga_com_cadeia_de_ingrediente_aprovada`, `uso_de_alga_indireto_apenas_se_descrito`.

### P1

**Peixe com Sal do Mar** — `rec-peixe-com-sal-do-mar` · Cozinha 8 · cura 14 PV · 2 porções.
- **Achado:** Ovas de Salmão e Sal do Sangue podem ser concebidos como prato de ovas, mas não representam filé de peixe. O sal é descrito como extraído do Mar de Sangue e não há validação alimentar.
- **Decisão necessária:** Distinguir prato de ovas de pescado; decidir tratamento e segurança do Sal do Sangue.
- **Alternativas não aprovadas:** `titulo_especifico_para_ovas`, `ficcao_de_preparo_que_torna_sal_comestivel`, `ajustar_insumos_apos_aprovacao`.

**Ração dos Vigias** — `rec-racao-dos-vigias` · Cozinha 13 · cura 16 PV · 2 porções.
- **Achado:** Trigo e Flor Azul da Montanha compõem um alimento nominal, porém não há técnica de conservação/rações. No clássico não substitui ger-racoes-de-viagem no deslocamento.
- **Decisão necessária:** Definir se é comida curativa, ração durável ou ambos, sem alterar implicitamente os custos de viagem.
- **Alternativas não aprovadas:** `manter_cura_e_nome_tematico`, `criar_funcao_de_viagem_com_teste`, `especificar_conservacao_e_peso`.

**Banquete de Portomonte** — `rec-banquete-de-portomonte` · Cozinha 13 · cura 19 PV · 2 porções.
- **Achado:** Duas unidades de insumos (Flor Violeta e Ovas de Salmão) geram duas porções; não demonstram escala de banquete nem captura local de salmão ou produção em Portomonte.
- **Decisão necessária:** Distinguir banquete como título festivo de refeição pequena e autorizar ou não o vínculo regional.
- **Alternativas não aprovadas:** `titulo_ritual_festivo_sem_quantidade_maior`, `composicao_de_banquete_aprovada`, `ajustar_nome_sem_criar_pesca`.

**Pescado Defumado** — `rec-pescado-defumado` · Cozinha 18 · cura 20 PV · 2 porções.
- **Achado:** Perca Prateada e Alho permitem um prato de pescado, mas nenhum combustível, tempo, técnica ou estação de defumação aparece no processo.
- **Decisão necessária:** Decidir se 'Defumado' descreve técnica implícita da estação ou demanda trabalho/ferramenta adicional.
- **Alternativas não aprovadas:** `defumacao_abstrata_na_estacao`, `procedimento_com_tempo_e_ferramenta`, `renomear_se_nao_houver_defumacao`.

**Torta de Mel** — `rec-torta-de-mel` · Cozinha 18 · cura 22 PV · 2 porções.
- **Achado:** Ovo de Galinha e Favo de Mel não descrevem massa ou crosta de torta; não há trigo, farinha, forno ou técnica de panificação nos insumos registrados.
- **Decisão necessária:** Decidir se 'torta' é nome de sobremesa sem massa, se farinha é insumo implícito ou se receita deve ser revista.
- **Alternativas não aprovadas:** `nome_regional_de_sobremesa`, `processo_abstrato_com_farinha_ambiental`, `ajustar_insumo_mediante_aprovacao`.

**Pão de Deméter** — `rec-pao-de-demeter` · Cozinha 18 · cura 23 PV · 2 porções.
- **Achado:** Trigo e Sal do Sangue não especificam massa/água/fermentação; o templo de Deméter ajuda agricultura em Portomonte, mas não garante que o sal marítimo seja seguro ou a receita seja institucional.
- **Decisão necessária:** Separar simbolismo religioso, alimentação e purificação das águas; escolher processo de panificação e status do sal.
- **Alternativas não aprovadas:** `pao_cerimonial_apenas_nome`, `processamento_ficcional_do_sal_com_aprovacao`, `reestruturar_receita_com_teste`.

### P2

**Ensopado de Rio** — `rec-ensopado-de-rio` · Cozinha 8 · cura 10 PV · 2 porções.
- **Achado:** Carpa e alho são alimentos plausíveis, mas o preparo de ensopado não especifica caldo, água, cozedura nem utensílio; Rio não identifica bacia de pesca.
- **Decisão necessária:** Decidir se água/caldo e preparo são abstrações da estação ou componentes da receita.
- **Alternativas não aprovadas:** `manter_receita_abstrata_e_descrever_cozimento`, `adicionar_processo_sem_insumo_novo`, `propor_insumo_auxiliar_apos_aprovacao`.

**Pão de Mel da Foz** — `rec-pao-de-mel-da-foz` · Cozinha 8 · cura 11 PV · 2 porções.
- **Achado:** Favo de Mel e Trigo sustentam um pão doce, mas o gerador não modela moagem, massa, água, fermentação ou cocção; 'Foz' não comprova local de origem.
- **Decisão necessária:** Escolher o nível de abstração da panificação e o estatuto cultural do topônimo, sem instalar moinho/forno canônico.
- **Alternativas não aprovadas:** `modelo_abstrato`, `etapas_de_moagem_cozimento_na_estacao`, `processo_e_cadeia_apenas_apos_decisao`.

**Caldo da Montanha** — `rec-caldo-da-montanha` · Cozinha 8 · cura 12 PV · 2 porções.
- **Achado:** Mirra da Geada e Bagas de Zimbro fornecem aromas, mas não descrevem líquido, veículo alimentar ou finalidade nutritiva. Montanha não confirma proveniência.
- **Decisão necessária:** Definir se é infusão ou caldo e o papel do líquido/serviço.
- **Alternativas não aprovadas:** `reclassificar_preparo_em_texto_sem_regras`, `manter_caldo_com_processamento_abstrato`, `especificar_componente_apos_teste`.

**Cogu-sopa de Ironwood** — `rec-cogu-sopa-de-ironwood` · Cozinha 13 · cura 15 PV · 2 porções.
- **Achado:** Dois cogumelos sustentam uma sopa, mas não há caldo ou água registrados. Não está comprovada ocorrência de ambos em Ironwood nem processamento para consumo.
- **Decisão necessária:** Definir se líquidos e cozimento são abstraídos e se Ironwood é referência cultural ou procedência real.
- **Alternativas não aprovadas:** `sopa_com_cozimento_abstrato`, `descrever_base_de_caldo`, `verificar_fonte_sem_relocalizacao`.

**Chá de Lavanda** — `rec-cha-de-lavanda` · Cozinha 13 · cura 17 PV · 2 porções.
- **Achado:** Lavanda Selvagem e Bagas de Zimbro são aromáticas, mas a infusão não explicita água; a descrição de lavanda 'acalma' não é um quarto efeito mecânico.
- **Decisão necessária:** Decidir se a água é recurso implícito da cozinha e se chás devem ter efeitos além da cura.
- **Alternativas não aprovadas:** `agua_abstrata_na_estacao`, `processo_infusao_descritivo`, `efeito_especifico_apos_design`.

**Compota das Montanhas** — `rec-compota-das-montanhas` · Cozinha 18 · cura 21 PV · 2 porções.
- **Achado:** Bagas da Neve e Uvas de Jasmim formam base frutal, mas o método de conservação/aquecimento não consta; extrato concentrado de Uvas de Jasmim é nocivo na descrição de Peren, sem transposição automática para a fruta preparada.
- **Decisão necessária:** Definir conservação e se processamento altera risco ficcional, sem criar toxicologia numérica nem origem montanhosa.
- **Alternativas não aprovadas:** `conservacao_abstrata`, `processamento_com_descricoes`, `seguranca_ficcional_com_aprovacao`.

## Principais tensões de mundo

**Guisado de Caatinga e Prato dos Anões.** Presa de Javali e Chifres de Alce são descritos nos ingredientes como partes usadas em tônicos; nenhuma técnica de preparação gastronômica foi definida. É possível uma culinária fantástica, mas o catálogo precisa explicitá-la. Não inferir caça autorizada na Caatinga nem tradição culinária universal de povos anões.

**Ensopado de Algas.** Vagem da Charneca e Craca de Rio não são algas segundo a descrição atual. O nome contradiz os componentes identificados. Não converter a vagem em alga nem criar uma espécie sem decisão.

**Chá dos Sonhos.** Cogumelo de Raiz tem `Dano à Saúde I` entre efeitos alquímicos; Açúcar Lunar é um cristal fantástico. A infusão não define segurança ou neutralização e o motor a trata como cura genérica. Os efeitos alquímicos não são prova automática de dano após cozimento, mas exigem decisão antes de afirmar uma bebida segura.

**Sal do Sangue.** Peren o descreve como extraído do Mar de Sangue, mas o [atlas de hidrografia](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md) não homologa salinidade, processamento, potabilidade ou cadeia alimentar; não tratar o nome como certificação de consumo.

**Deméter e Portomonte.** O [dossiê do templo](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/ATLAS_DEMETER_PORTOMONTE_CICLO51.md) confirma purificação localizada voltada à agricultura, sem demonstrar água potável para todos, plantações específicas, monopólio do trigo ou fabricação do Pão de Deméter.

**Trabalho culinário.** O jogo modela preço dos insumos, uma ação de preparo e rendimento fixo, mas não etapas de moagem, defumação, secagem, cozimento, fermentação ou conservação. Uma gramática simplificada pode ser legítima; precisa ser consciente e consistente com nomes e funções dos pratos. Não institucionalizar restaurantes, cozinheiros ou mercados regionais só a partir de nomes.

## Economia e disponibilidade: cenário condicional

Reproduzidas as fórmulas `cost()` e `sellprice()` do clássico para Comércio 9, com compra hipotética de todos os insumos no polo de Cozinha e venda das duas porções na mesma cidade. A análise usa preços base reconstruídos das 111 linhas de ingredientes, com overrides quando existentes. Não verifica possibilidade de comprar cada item, quantidade em estoque, custos de trabalho, transporte, utensílios ou coleta.

| Cidade | Saldo positivo | Nulo | Negativo | Receitas com ambos os ingredientes no sortimento inicial reconstruído |
|---|---:|---:|---:|---:|
| portomonte | 5 | 0 | 11 | 0 |
| drakport | 7 | 0 | 9 | 0 |
| alem-sul | 6 | 0 | 10 | 0 |

O sortimento do **dia 1** foi projetado a partir de `vendorStock()` e dos mercadores cadastrados. Não encontramos uma receita com **ambos** os ingredientes simultaneamente nos perfis de loja das três cidades. Isso não prova impossibilidade de cozinhar: a mochila inicial, expedições, outros dias e outras cidades não foram simulados, nem se conferiram quantidades ou o JSON compilado integral.

## Decisões pendentes COZ-01 a COZ-08

| Código | Tema | Pergunta |
|---|---|---|
| COZ-01 | consumo e sobrevivencia | Alimentação deve reduzir fadiga, sustentar viagem, prover saciedade ou continuar como cura simples? |
| COZ-02 | coerencia de ingredientes | Como resolver Guisado de Caatinga, Prato dos Anões e Ensopado de Algas sem apagar IDs antigos? |
| COZ-03 | seguranca alimentar ficcional | Como tratar Sal do Sangue, Cogumelo de Raiz e Uvas de Jasmim, cujas descrições levantam risco ou incerteza? |
| COZ-04 | tecnica culinaria | Água, moagem, fermentação, defumação, conservas e cocção são operações implícitas da estação ou consumos explícitos? |
| COZ-05 | variedade nutritiva | Todas as 16 receitas devem restaurar apenas Vida, com potência indexada de 10 a 25? |
| COZ-06 | rendimento e tempo | Chás, ração, pão e banquete devem sempre gerar duas porções por uma ação? |
| COZ-07 | proveniencia e cultura | Como distinguir prato com nome de região/povo de prato efetivamente tradicional ou produzido ali? |
| COZ-08 | economia e trabalho | Qual valor social e econômico da cozinha profissional, do cultivo, da pesca e da conservação dos alimentos? |

**Ordem sugerida:** COZ-02 e COZ-03 (coerência material e segurança ficcional), COZ-01/COZ-05 (comida, viagem e efeitos), COZ-04/COZ-06 (processo e rendimento), COZ-07/COZ-08 (cultura, procedência e economia). Todas são alternativas de curadoria **sem aprovação autoral**, não implementações.

## Controles de integridade

- **16/16** registros reconciliados por ID com o gerador e a matriz de crafting; **16** produtos de comida; **23** ingredientes ligados à curadoria e auditoria ecológica; **0** habitats ou receitas homologadas.
- O sistema de comidas foi inspecionado por leitura de `game.js`, não por execução de testes, Phaser, save ou integração de navegador.
- Os arquivos grandes `data/itens.json` e `data/receitas.json` não foram lidos integralmente; não afirmar que a projeção estática constitui prova campo a campo da publicação ativa.
- Nenhuma alteração em itens, receitas, atributos, engine, economia, loot, mercados, saves e cânone.

**Próxima etapa:** Escrita — 320 receitas de grimórios, suportes de inscrição, Linho de Deméter e Tinta Rúnica. Depois Encantamento, incluindo a revisão dos 102 insumos de quantidade zero.
