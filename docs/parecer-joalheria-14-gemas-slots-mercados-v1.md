# Joalheria de Peren — auditoria de 14 receitas, gemas, slots e mercados

**08/11/2026 · Auditoria editorial não executável.** Fonte individualizada: [`data/auditoria-joalheria-14-v1.json`](../data/auditoria-joalheria-14-v1.json). A análise compara [gerador/matriz de crafting](../data/auditoria-crafting-nao-alquimico-v1.json), [motor clássico](../game.js), [cadastro das cidades](../data/cidades.json) e [roadmap dos sete ofícios](roadmap-crafting-mecanicas-menus.md). Não foi executado jogo nem feita leitura integral do `data/receitas.json` compilado.

## 1. Mapa das 14 receitas

Existem **7 linhagens** com **2 formas** cada — Anel e Colar. Em cada par da mesma linhagem, **ID/nome/tipo** são distintos, mas os dois usam os **mesmos insumos, nível, raridade, valor, ataque e defesa**. Cada receita requer uma unidade de material principal e uma unidade indiferenciada de Pó de Gema, gerando uma joia.

| Linhagem (anel e colar) | Perícia exigida | Insumos de cada peça | Valor cadastral por peça | Defesa cadastrada | Saldo hipotético em Thargrid | Saldo hipotético em Shadar-Riverie |
|---|---:|---|---:|---:|---:|---:|
| **Ferrugem** | 12 | Ferro bruto ×1 + Pó de Gema ×1 | 20 | 2 | -19 | -15 |
| **Prata** | 24 | Minério de prata ×1 + Pó de Gema ×1 | 32 | 4 | -21 | -24 |
| **Ouro Rúnico** | 36 | Minério de ouro ×1 + Pó de Gema ×1 | 44 | 6 | -64 | -41 |
| **Mitral** | 48 | Minério de mitral ×1 + Pó de Gema ×1 | 56 | 8 | -78 | -68 |
| **Adamante** | 60 | Minério de adamante ×1 + Pó de Gema ×1 | 68 | 10 | -205 | -139 |
| **Osso Ancestral** | 60 | Osso de Golzdov ×1 + Pó de Gema ×1 | 68 | 10 | -287 | -199 |
| **Escama Dracônica** | 60 | Escama de Dragão ×1 + Pó de Gema ×1 | 68 | 10 | -323 | -226 |

**Leitura da tabela:** saldos são **reprodução das fórmulas de compra/venda do clássico**, Comércio 9, comprando todos os insumos no local e vendendo o produto no mesmo mercado, **sem confirmar disponibilidade de estoque ou considerar custos de tempo/treinamento, deslocamento e risco**. Não são lucros reais.

A partir do nível 5, **Adamante, Osso Ancestral e Escama Dracônica** têm os mesmos valores e poderes de joia, apesar de custos de matéria-prima muito diferentes. A distinção de material existe no nome e insumo, não em comportamento de peça.

## 2. A contradição mais grave — joia comum vira relíquia conjuradora

O clássico possui apenas `weapon`, `armor`, `relic`. A função `equip()` coloca automaticamente qualquer `acessorio` no slot `relic`, substituindo uma relíquia já equipada.

O motor usa `relic().nivel` para conceder bônus de ataque (`+2 × nível`) e defesa (`+1 × nível`), **não a `defesa` cadastrada em cada joia**. A função `useRelic()` apresenta um botão de ativação com `2 + nível` cargas por combate. Como nenhum dos 14 nomes contém palavras-chave como Fogo, Cura, Proteção, Gelo ou Invisibilidade, **todos caem no ataque arcano padrão**, com dano calculado por `13 + 7 × nível + rand(0,8)`.

Isso é confirmado pela lógica do clássico; **não prova** que a intenção autoral fosse fornecer magia gratuita ao fabricar anéis e colares de qualquer material. A receita não exige Encantamento ou cristal de alma.

**Possíveis decisões, não aprovadas:** (A) joia não encantada é ornamento com efeitos econômicos/sociais, sem disparo arcano; (B) a magia é propriedade natural de determinados materiais, com lógica de lore escrita; (C) joia recebe encantamento depois da manufatura, tornando joia e relíquia etapas distintas. Qualquer mudança no slot precisa migrar saves para preservar artefatos.

## 3. Pedras individualizadas ausentes do processo

Embora **Pó de Gema** seja usado em **14 receitas de Joalheria + 113 de Encantamento = 127 receitas**, **nenhuma** das seis pedras abaixo é consumida com quantidade positiva nas **572 receitas não alquímicas** reconstruídas.

| Pedra existente no catálogo | ID | Zona do cadastro — não comprovada como jazida | Valor cadastral | Consumo em receita |
|---|---|---|---:|---:|
| **Pérola Negra** | `mat-perola-negra` | portomonte | 88 | 0 |
| **Rubi do Sangue** | `mat-rubi-do-sangue` | boca-abismo | 84 | 0 |
| **Safira Lunar** | `mat-safira-lunar` | shadar-riverie | 66 | 0 |
| **Esmeralda da Floresta** | `mat-esmeralda-da-floresta` | ironwood | 66 | 0 |
| **Topázio Solar** | `mat-topazio-solar` | portomonte | 65 | 0 |
| **Quartzo da Montanha** | `mat-quartzo-da-montanha` | thargrid | 10 | 0 |

**Não presumir** que `Rubi do Sangue` seja produzido do Mar de Sangue, que `Safira Lunar` venha do Templo da Lua, que `Esmeralda da Floresta` tenha jazida em Ironwood ou que `Topázio Solar` seja produto de culto solar. O cadastro não é evidência geológica.

A própria transformação **gema → Pó de Gema** não possui receita documentada. `Pó de Gema` é um insumo independente, de origem não homologada. Tampouco há diferenciação de encaixe, lapidação, qualidade ou efeito por pedra.

**Hipóteses para deliberar:** (A) Pó de Gema continua como abrasivo ou catalisador genérico de acabamento e gemas inteiras entram somente em projetos especiais; (B) cada pedra recebe usos próprios conforme decisões de lore; (C) a lapidação e a moagem tornam-se etapas produtivas com ferramenta, rendimento e perda. Nenhuma hipótese deve apagar os seis IDs existentes nem criar gemas ilimitadas.

## 4. A Joalheria não possui circuito de mercadorias completo

O cadastro tem **oficinas e tutores de Joalheria em Thargrid e Shadar-Riverie**. Peren começa com **Joalheria 0**, mas o primeiro projeto exige **nível 12**; o jogo permite treino pago no ofício quando a estação local existe.

Os cinco perfis de mercador do clássico têm quotas por categoria. Nenhum perfil inclui `acessorio`, então as 14 joias **não entram na seleção normal de itens à venda** pela rotina `vendorStock()`. Isso não impede que o jogador venda uma joia do inventário por `sellprice()`, nem prova ausência de aquisições excepcionais em missões.

**Problema de design:** Joalheria está posicionada como ofício de fabricação de peças que podem ser vendidas, mas não tem categoria de abastecimento entre os mercadores, clientes ou encomendas específicas. Uma economia de ouro e gemas precisa distinguir joias de uso, artefatos mágicos, reservas de valor e objetos com significado social. Isso é questão de conteúdo e mecânicas, não justificativa para instituir um comércio, casta ou monopólio em Thargrid sem aprovação.

## 5. Simulação econômica condicionada

A simulação da matriz usa `cost()` e `sellprice()`, **Comércio 9**, a tabela vigente de perigos (**Thargrid 2** e **Shadar-Riverie 5**) e os materiais/valores catalogados. Produtos não têm zona declarada, portanto entram na venda como não locais (`0,72 × valor`, antes do bônus de Comércio). Os materiais têm zona técnica, que pode alterar o custo da compra local.

Resultado:

| Cidade com oficina | Receitas examinadas | Saldo positivo | Saldo nulo | Saldo negativo |
|---|---:|---:|---:|---:|
| Thargrid | 14 | 0 | 0 | **14** |
| Shadar-Riverie | 14 | 0 | 0 | **14** |

Exemplos: um Anel de Ferrugem exigiria comprar insumos por **33** moedas em Thargrid e poderia ser vendido por **14** (saldo hipotético **−19**). Um Colar de Escama Dracônica exigiria insumos por **373** e venda por **50** (saldo **−323**). A soma de receitas não representa a economia do mundo — estoques e acesso não foram validados, e o próprio caminho até nível 12 tem custos.

A hipótese material confirmada é apenas que **não há incentivo à manufatura comercial por compra integral dos insumos nesse cenário**; não existe evidência de que obter pedras por exploração, receber encomendas ou vender em outra cidade tenha o mesmo resultado. Não recalibrar preços diretamente deste exercício.

## 6. Parecer de Carcaça: trabalho, matéria e poder

As minas, oficinas e relações de resistência em Thargrid estão documentadas no [resumo do Hack Carcaça](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/LORE_HACK_CARCACA_DW.md), mas não confirmam uma associação de ourives, produção de gemas ou jazida de Mitral. O [ciclo LXII de engenharia política da forja](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/ENGENHARIA_POLITICA_DA_FORJA_THARGRID_CICLO62.md) é explicitamente **proposta não homologada**.

O [Templo da Lua](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/TEMPLO_LUA_SEVERINA_CICLO29.md) existe na ilha do Rio Ancestral, mas o título não legitima procedência de Safira Lunar, preços rituais ou tributação da gema pela Corte.

`Osso de Golzdov` e `Escama de Dragão` merecem **protocolo de proveniência** próprio. A simples existência do material no catálogo não determina que se possa coletar fragmentos de Golzdov nem obter escamas por caça. **Golzdov e Kindau são seres distintos** nas fontes do cenário. Não transformar criaturas com agência ou ossatura sagrada em recurso de loot indiscriminado.

A dimensão social da joalheria pode ser potente: quem trabalha as pedras, quem detém as minas, quem estabelece o preço, quem compra adornos de prestígio e quem pode usar símbolos ritualizados? Mas só poderá tornar-se cânone após fontes e escolhas do criador.

## 7. Caderno de decisões JOI-01 a JOI-08 — todas pendentes

| ID | Frente | Questão |
|---|---|---|
| **JOI-01** | slots e beneficios | Anéis e colares usam relic, concedem ataque/defesa por nivel e competem com relíquias; defesa própria não é aplicada. |
| **JOI-02** | magia | Joia fisica sem encantamento ativado age como relíquia que projeta magia arcana. |
| **JOI-03** | gemas e lapidacao | Seis gemas específicas não entram em nenhuma receita; todas joias usam Pó de Gema. |
| **JOI-04** | lingotes | 10 joias de cinco linhagens usam minério bruto, sem lingote intermediário. |
| **JOI-05** | formas | Pares Anel/Colar são indistinguíveis em requisitos/atributos, variando apenas nome, ID e tipo. |
| **JOI-06** | mercados e trabalho | Joias não entram nas cotas de mercador como categoria acessorio; duas oficinas oferecem tutores, mas fabricar exige nivel >=12. |
| **JOI-07** | lore e procedencia | Gemas Lunar, Sangue, Floresta, Solar e Joias de Osso/Escama não possuem habitats/fornecimento homologados. |
| **JOI-08** | economia | Nos dois polos de Joalheria, todos os 14 produtos têm saldo negativo sob compra hipotética de materiais no mercado e venda do produto. |

**Ordem editorial sugerida:** JOI-01 e JOI-02 primeiro, pois determinam o que uma joia realmente faz; JOI-03 e JOI-04 depois, pois estabelecem insumos e processos; JOI-05 define função de forma; JOI-06 e JOI-08 estabelecem oferta e preço; JOI-07 decide proveniências sensíveis apenas onde há justificativa de conteúdo.

### Condições para eventual integração

1. Preservar os 14 IDs, os seis IDs de pedras e os itens existentes nos saves, a menos que uma migração explícita e testada seja aprovada.
2. Testar equipar/retirar joia, substituir relíquia, carregamento de save antigo, ataque/defesa e uso do botão de ativação mágica no clássico; mapear separadamente a implementação Phaser.
3. Não inserir `acessorio` em todas as lojas automaticamente: definir perfil de comerciante, seleção, risco econômico e cobertura regional.
4. Não transformar pó em pedra lapidada sem custo, processo ou consenso sobre o papel de gemas.
5. Não alterar fontes de `Osso de Golzdov`, `Escama de Dragão` ou gemas regionais por analogias de nome.
6. Usar testes com compra/estoque real e tempo de trabalho antes de decidir balanço monetário.

## 8. Controles de integridade e limites

- **14/14** receitas analisadas, **7/7 pares** equivalentes em insumos e estatísticas, **6/6 gemas específicas** sem receita positiva no conjunto do gerador.
- **14/14** acessórios competem com `relic` no clássico e ativam o ataque arcano padrão conforme sua lógica atual.
- **0** lingotes usados; **10** joias feitas diretamente de ferro/minérios; **127** receitas com Pó de Gema incluindo Encantamento.
- **0** mudanças no catálogo ativo, recipes, preços, motor clássico, Phaser, saves ou disponibilidades regionais.
- Conclusões derivadas de dados e código fonte; **não** foi feito teste dinâmico em navegador, execução de gerador ou inspeção integral dos JSONs compilados de mais de 1 MB.

**Próxima frente de auditoria:** Curtume — 20 receitas de vestimentas e bolsas, quatro classes de matéria-prima, divisão entre curtimento e tecelagem/costura e interação com slots de proteção.
