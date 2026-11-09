# Parecer editorial da Forja — 89 receitas, sete linhagens e cadeias de metalurgia

**Data:** 08/11/2026 · **Estado:** auditoria **documental e estática**, sem homologação de materiais, alteração de gameplay, refino, preços ou saves.

**Matriz individualizada:** [`data/auditoria-forja-89-v1.json`](../data/auditoria-forja-89-v1.json). Fonte-base: [auditoria do crafting geral](auditoria-crafting-geral-v1.md) e [matriz de 139 receitas](../data/auditoria-crafting-nao-alquimico-v1.json). Foram conferidos `ferramentas/build_data.py` e `game.js` da branch `main` no momento desta rodada.

## 1. Inventário consolidado

O gerador contém **sete linhagens**, cada uma com **doze formas da Forja**, e mais cinco lingotes, totalizando **84 equipamentos + 5 lingotes = 89 receitas**. Duas outras formas por linhagem — Anel e Colar — geram as **14 receitas de Joalheria**, tratadas em auditoria separada.

| Linhagem | Equipamentos da Forja | Produz lingote? | Proficiência mínima para as 12 peças | Insumo principal do molde |
|---|---:|---|---:|---|
| **Ferrugem** | 12 | Sim | 12 | mat-ferro-bruto |
| **Prata** | 12 | Sim | 24 | mat-minerio-de-prata |
| **Ouro Rúnico** | 12 | Sim | 36 | mat-minerio-de-ouro |
| **Mitral** | 12 | Sim | 48 | mat-minerio-de-mitral |
| **Adamante** | 12 | Sim | 60 | mat-minerio-de-adamante |
| **Osso Ancestral** | 12 | Não | 60 | mat-osso-de-golzdov |
| **Escama Dracônica** | 12 | Não | 60 | mat-escama-de-dragao |

**Contagens adicionais:** 49 armas, 7 broquéis e 28 peças de armadura (Peitoral, Elmo, Botas e Luvas por linhagem). As sete receitas de Arco consomem **Madeira de Ironwood ×1**, além do material principal. Escudos e armaduras consomem Couro Curtido ×1 por peça.

**Ponto de progressão:** Peren começa com Forja **10**, enquanto uma arma de Ferrugem exige **12**. Lingote de Ferrugem exige apenas **6**, mas não entra em nenhuma receita de equipamento. A primeira cidade, Portomonte, não disponibiliza uma estação Forja no cadastro inicial. O fato de ser possível viajar ou treinar não resolve a ausência de uma cadeia entre refino e equipamento.

## 2. Fechamento indevido da cadeia produtiva

Os cinco lingotes são fabricados com **duas unidades de minério e uma de Carvão de Forja**, produzindo dois lingotes por operação. **Nenhuma das 572 receitas não alquímicas** consome os lingotes produzidos. Em vez disso, **60 equipamentos da Forja** — e outros **10 da Joalheria** — consomem minério bruto diretamente.

| Lingote produzido | Nível de Forja | Insumos registrados | Rendimento | Saldo hipotético de compra/venda em Thargrid |
|---|---:|---|---:|---:|
| Lingote de Ferrugem | 6 | mat-ferro-bruto ×2 + mat-carvao-de-forja ×1 | 2 | -4 |
| Lingote de Prata | 12 | mat-minerio-de-prata ×2 + mat-carvao-de-forja ×1 | 2 | -12 |
| Lingote de Ouro Rúnico | 18 | mat-minerio-de-ouro ×2 + mat-carvao-de-forja ×1 | 2 | -100 |
| Lingote de Mitral | 24 | mat-minerio-de-mitral ×2 + mat-carvao-de-forja ×1 | 2 | -132 |
| Lingote de Adamante | 30 | mat-minerio-de-adamante ×2 + mat-carvao-de-forja ×1 | 2 | -388 |

Todos os cinco lingotes têm **raridade `comum`**, independentemente do nível da matéria-prima. A inexistência de consumo posterior é uma lacuna **observável no grafo de receitas do gerador**; interpretar o uso direto do minério como defeito absoluto **exige decisão de design**. Um sistema simplificado de forja direta pode ser intencional, mas então a função dos lingotes precisaria ser justificada (venda, contratos, reparos, encantamentos, estoque estratégico).

### Três alternativas a submeter ao criador — nenhuma aprovada

**A. Manter forja direta.** Preserva o jogo e a compatibilidade das 89 receitas. Exige decidir o papel comercial dos lingotes. Menor custo de migração; menor profundidade material.

**B. Tornar refino uma etapa obrigatória.** Minério → lingote → arma/armadura. Traz uma cadeia produtiva visível; afeta os insumos das 70 receitas de Forja/Joalheria que hoje usam minérios, valores, tutoriais, estoques, coleções, saves e testes.

**C. Fluxo híbrido de qualidade.** Manter a receita direta como fabricação básica, mas oferecer projetos avançados com lingotes, tratamento, reparo e acabamento. Mantém a compatibilidade inicial, porém exige novos requisitos e atenção ao risco de duplicar produtos ou permitir conversão econômica abusiva.

**Encaminhamento sugerido:** comparar A/C em protótipo isolado. **Não promover B por padrão** nem reescrever receitas canônicas antes de verificar migração, economia e capacidade técnica.

## 3. Equipamentos e atributos: campo gravado ≠ bônus real

O gerador atribui a todos os equipamentos da linhagem `defesa = tier*2 + (2 se armadura)`. As 49 armas recebem defesa positiva. O motor clássico (`game.js`) soma ataque de `weapon` e defesa de `armor`, mas não soma `defesa` de `weapon`.

**Os 7 broquéis + 28 armaduras = 35 peças ocupam o mesmo slot `armor`.** Equipar elmo ou botas, por exemplo, substitui a peça anterior naquele slot. Não existe no clássico uma malha completa de slots por parte do corpo.

| Forma | Parecer específico |
|---|---|
| Adaga | A Defesa calculada não é aplicada pelo slot de arma no clássico; revisar se o campo é decorativo ou efeito de postura. |
| Espada | A Defesa calculada não entra no combate por arma; decidir se existe defesa de aparo e como integrá-la. |
| Machado | A Defesa calculada não é usada pelo slot weapon; validar bônus reais e escala de nível. |
| Martelo | Poder de ataque e preço são escalonados, sem massa/densidade por linhagem ou custo de ferramental. |
| Arco | Uma unidade de Madeira de Ironwood é exigida em todas as sete linhagens; o material principal varia, mas não há corda, projeto ou regra de montagem. |
| Lança | A ficha dispensa haste/madeira ou outro suporte explicitamente listado; não provar arma impossível apenas pela omissão do componente. |
| Cajado | O molde fornece cajado a partir de minério/osso/escama sem núcleo de madeira, inscrição ou outro processo especificado. |
| Broquel | Ocupa o mesmo slot armor que Peitoral, Elmo, Botas e Luvas, sem regra para escudo secundário. |
| Peitoral | Recebe Couro Curtido x1 além da matéria principal; constitui o slot armor único no jogo clássico. |
| Elmo | Recebe Couro Curtido x1, mas ao equipar troca o peitoral por usar o mesmo slot armor. |
| Botas | Recebem Couro Curtido x1 e também substituem o peitoral por usar o slot armor. |
| Luvas | Recebem Couro Curtido x1 e também substituem o peitoral por usar o slot armor. |

A ficha de um objeto pode manter estatísticas não utilizadas como dados legados; o problema é **como o jogador interpreta o benefício**. Não recalcular valores sem demonstrar quais campos são aplicados no combate, nos menus e nos saves. A Joalheria sofre problema análogo: anéis e colares são tratados como `relic` no clássico.

### Alternativas para slots

**Mínima (interface):** rotular a abstração atual como um único equipamento de proteção e expor quais bônus entram de fato; preserva saves, mas reduz a especialização.

**Estrutural (equipamento completo):** slots separados de elmo, armadura, botas, luvas e escudo, com regras de compatibilidade, pesos e soma de atributos; exige migração explícita e testes de regressão.

**Híbrida:** um slot de armadura principal e melhorias anexáveis por forma, sem empilhar livremente todos os bônus. Ainda requer contrato mecânico e persistência.

Nenhuma solução foi autorizada neste documento.

## 4. Sete linhagens: problemas de significado e proveniência

**Ferrugem.** Ferrugem é uma denominação cultural de acabamento, defeito metalúrgico deliberado ou deveria referir-se a Ferro? O catálogo inicia a linhagem com Ferro bruto, não óxido refino.

**Prata.** Quais armas e armaduras de prata têm aplicações materiais/rituais? Nem toda forma precisa ter performance igual à de aço; nenhuma mudança de resistência aprovada.

**Ouro Rúnico.** Onde ocorre a inscrição ou ativação rúnica se só se usa Minério de Ouro, Couro e/ou Ironwood? Não há Tinta Rúnica ou operação de Escrita/Encantamento na receita.

**Mitral.** Qual a composição, processo e ocorrência do Mitral na Carcaça? As minas de Thargrid não demonstram jazidas desta substância individual.

**Adamante.** A zona técnica Garganta não comprova extração de Adamante. Que regra de qualidade/processamento justifica uma linhagem mais cara e rara?

**Osso Ancestral.** Osso de Golzdov é referência ao dragão morto que dá forma à Carcaça. Qual osso, tamanho, situação jurídica e rito permitem trabalhar essa matéria sem equipará-la ao corpo de Kindau?

**Escama Dracônica.** Escama de qual dragão ou linhagem, obtida por muda, troca, legado, combate ou outro meio? Eldroth no gerador não comprova habitat.

**Correção cosmológica importante:** **Golzdov não é Kindau**. A Carcaça se organiza sobre a ossatura de Golzdov, segundo o manuscrito; Kindau é outro ser primordial cuja história aparece na cosmologia. Portanto, falar em **Osso de Golzdov** não autoriza aplicar automaticamente os ritos, propriedades ou condições do cadáver de Kindau.

O [Hack Carcaça, auditado em Monstros](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/LORE_HACK_CARCACA_DW.md) confirma minas e forjas em Thargrid, mas **não confirma jazidas específicas de Mitral/Adamante, mineração em Garganta nem escala de extração de osso ou escama**. O [ciclo LXII de engenharia das forjas](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/ENGENHARIA_POLITICA_DA_FORJA_THARGRID_CICLO62.md) está expressamente **não homologado**: suas comunidades e ofícios são propostas de trabalho, não instalações oficialmente existentes em Thargrid.

A metalurgia possui sujeitos sociais: mineiros, fundidores, ferramenteiros, transportadores e usuários. Definir quem produz, quem controla insumos, que peças atendem a agricultura ou à guerra e quem sofre o risco da extração fortalece a ambientação. **Mas nada disso pode ser escrito como instituição ou personagem canônico só a partir de uma receita procedural.**

## 5. Mercado: cálculo exploratório com as fórmulas atuais do clássico

Para evitar comparar só valores-base, repliquei `cost()` e `sellprice()` de `game.js` para um cenário fixo: **Thargrid, perigo 2, Comércio 9, Forja suficiente, compra hipotética de todos os materiais e venda do produto na mesma cidade**. Produtos não possuem campo `zona` no gerador, enquanto matérias-primas possuem; portanto, nesse modelo, o produto recebe o multiplicador de venda sem origem local. Esse desequilíbrio também precisa de decisão.

| Nível da peça/produto | Receitas | Saldo positivo | Saldo zero | Saldo negativo |
|---|---:|---:|---:|---:|
| 1 | 13 | 9 | 1 | 3 |
| 2 | 13 | 9 | 0 | 4 |
| 3 | 13 | 0 | 0 | 13 |
| 4 | 13 | 0 | 0 | 13 |
| 5 | 37 | 0 | 0 | 37 |
| **Total** | **89** | **18** | **1** | **70** |

| Exemplo de fabricação | Compra hipotética de insumos | Venda hipotética da produção | Diferença |
|---|---:|---:|---:|
| Espada de Ferrugem | 14 | 29 | 15 |
| Lingote de Ferrugem | 18 | 14 | -4 |
| Lingote de Mitral | 190 | 58 | -132 |
| Peitoral de Escama Dracônica | 1397 | 202 | -1195 |

**Limites rigorosos:** isso **não é lucro operacional**. `vendorStock()` aplica filtros de nível e cotas por mercador, e não garante que esses materiais sejam compráveis em Thargrid. O cenário ignora estoque, coleta gratuita, trabalho, combustível adicional, ferramentas, rota de transporte, risco, fabricação de missão, treinamento, descontos futuros e alternativas de venda. Trata-se apenas de um *teste de stress* da curva de preços, não de um relatório econômico definitivo.

Observação: a venda do produto fabricado é tratada no clássico como venda de item sem `zona`, o que ajuda a explicar a queda do valor percebido de equipamentos de alto nível. **70 saldos negativos sob hipótese comum** justificam teste em economia, não um reajuste automático.

## 6. Plano de decisão e QA para a engenharia

| Ordem | Decisão | Prova de aceite antes de alterar algo |
|---|---|---|
| **FOR-01** | Qual papel real dos cinco lingotes? | Não criar ciclo de fabricação infinito; confirmar IDs, conversões, saves, custos e disponibilidades |
| **FOR-02** | Qual é a estrutura de slots? | Migrar save antigo com armor/weapon/relic intactos e testar todas as 12 formas |
| **FOR-03** | Atributos e desempenho físico | Confirmar aplicação de `ataque`, `defesa`, `peso` e `nivel`; não descrever bônus que não atuam |
| **FOR-04** | Nome Ferrugem e Ouro Rúnico | Documentar se são acabamento, liga, história cultural ou operação separada |
| **FOR-05** | Osso de Golzdov e Escama de Dragão | Validar fonte, método e impacto social sem inventar loot nem produzir pessoas como recurso |
| **FOR-06** | Economia e trabalho | Testar compra, coleta, refino, fabricação, venda, XP e tempo em cada cidade com estoques e mercado reais |

O documento de dados registra **89 pareceres individuais por receita**, com campos de insumos, produto, risco da linhagem, risco da forma, requisitos e cenários de decisão que **não foram aprovados**.

## 7. Escopo congelado e próximos ciclos

Não houve alteração de `data/itens.json`, `data/receitas.json`, `data/curadoria_ingredientes.json`, `game.js`, Phaser, skills, preços, loot, equipamentos ativos ou saves. Os JSONs compilados de cerca de 1,2 MB não foram lidos integralmente; os 89 registros são uma **reconstrução estática auditável** do gerador e da matriz geral. Não foi feito playtest nem build de mecânicas.

**Próxima auditoria recomendada:** Joalheria (14 receitas, materiais, formas, slot `relic` e gemas), em paralelo com decisão autoral sobre FOR-01 e FOR-02. Depois Curtume e Cozinha, antes de novas mecânicas abertas de fabricação.
