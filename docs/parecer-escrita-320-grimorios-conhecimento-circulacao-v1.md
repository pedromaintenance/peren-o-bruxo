# Escrita de Peren — auditoria dos 320 grimórios, conhecimento e circulação

**10/11/2026 · Parecer editorial.** Nenhuma mudança nas 320 receitas, nos 354 grimórios, na progressão, nos materiais, na engine ou no cânone.

**Matriz estruturada:** [320 pareceres por ID e 34 grimórios sem receita](../data/auditoria-escrita-320-v1.json). **Confronto documental:** [dados de 320 receitas de Escrita](../data/auditoria-crafting-escrita-encantamento-v1.json), [354 magias](../data/magias.json), [gerador](../ferramentas/build_data.py), [motor clássico](../game.js), [cidades](../data/cidades.json) e [materiais-base](../data/auditoria-crafting-nao-alquimico-v1.json).

## 1. Contagem reconciliada e regra de fabricação

O gerador importa metadados de **354 magias de D&D 5e** como **354 itens da categoria `grimorio`**, com nomes e níveis adaptados ao jogo. Cria receita de Escrita somente quando `max(1, nivel_dnd+1) <= 8`. Resultado: **320 fórmulas** para magias de nível D&D **0–7** e **34 itens sem fórmula** para magias de nível **8–9**.

A fabricação é invariável por escola, conteúdo, origem histórica ou natureza ritual:

- **Linho de Deméter ×2** em toda receita;
- **Tinta Rúnica ×1 a 4**, determinada exclusivamente pelo nível do grimório;
- uma ação de fabricação, **um grimório por receita**, XP de Escrita pelo nível do projeto;
- perícia exigida: `10 × max(1, nível D&D + 1)`, com teto de **80** para as receitas existentes;
- um grimório **pode ser fabricado sem conhecer a magia nem possuir Arcanismo suficiente para aprendê-la**;
- o uso/leitura consome o livro e exige Arcanismo, cuja regra na fonte é `4 + 10 × nível D&D`.

| Nível D&D | Magias no catálogo | Receitas de Escrita | Escrita mínima | Arcanismo para aprender |
|---|---:|---:|---:|---:|
| 0 | 26 | 26 | 10 | 4 |
| 1 | 62 | 62 | 20 | 14 |
| 2 | 57 | 57 | 30 | 24 |
| 3 | 48 | 48 | 40 | 34 |
| 4 | 34 | 34 | 50 | 44 |
| 5 | 42 | 42 | 60 | 54 |
| 6 | 31 | 31 | 70 | 64 |
| 7 | 20 | 20 | 80 | 74 |
| 8 | 18 | 0 | — | 84 |
| 9 | 16 | 0 | — | 94 |
| **Total** | **354** | **320** | — | — |

A quantidade para fabricar **uma unidade de cada um dos 320 grimórios** seria **640 de Linho de Deméter e 608 de Tinta Rúnica**. Não é uma previsão de demanda, mas uma soma de insumos.

### Distribuição por escola da fonte

| Escola | Magias catalogadas | Receitas disponíveis | Sem receita |
|---|---:|---:|---:|
| Abjuração | 45 | 40 | 5 |
| Adivinhação | 31 | 29 | 2 |
| Conjuração | 59 | 52 | 7 |
| Encantamento | 32 | 27 | 5 |
| Evocação | 72 | 67 | 5 |
| Ilusão | 28 | 27 | 1 |
| Necromancia | 26 | 23 | 3 |
| Transmutação | 61 | 55 | 6 |
| **Total** | **354** | **320** | **34** |

Essas escolas são **metadados importados**. A correspondência de escolas não demonstra que os povos da Carcaça as ensinem, reconheçam ou pratiquem da mesma forma que D&D.

## 2. Materiais: o mesmo suporte para todas as tradições

**Linho de Deméter** tem nível cadastral 1, valor 8 e zona técnica Portomonte. A [auditoria da purificação de Portomonte](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/ATLAS_DEMETER_PORTOMONTE_CICLO51.md) documenta agricultura possibilitada pelo templo, **não plantio de linho, preparação de tecido, exportação de suporte mágico, monopólio sacerdotal ou propriedade da escrita**.

**Tinta Rúnica** tem nível cadastral 3, valor 30 e zona técnica Garganta. O [manuscrito indexado da Carcaça](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/LORE_HACK_CARCACA_DW.md) relata inscrições de poder, kanji e a tradição dos antigos elfos Yokai nos ossos de Golzdov. Isso **não** demonstra que toda magia deva usar tais inscrições, que a Tinta Rúnica da loja seja a mesma matéria dessas marcas ou que um povo monopolize as técnicas.

**Pergaminho Vazio** já existe como `ger-pergaminho-vazio`, com categoria material, valor 9 e nível 1, **mas nenhuma das 320 receitas o consome**. Não converter automaticamente as 320 fórmulas para pergaminho sem decidir se Grimório é livro, códice, rolo de linho, cópia ritual ou outro suporte.

**Decisão ESC-01/02/03:** distinguir cópia de conhecimento, escrita criativa, transcrição de feitiço, tradução entre tradições e preparação física do suporte. Essa gramática pode ser unificada para simplicidade ou plural por cultura, mas não deve ser inventada por um nome de insumo.

## 3. A fabricação não é a aprendizagem

O motor clássico possui **dois caminhos de aprendizagem**:

1. Usar um grimório pelo inventário, após passar pelo requisito de Arcanismo: consome o livro e concede **9 XP** na progressão de Arcanismo.
2. Selecionar **Aprender** na tela de magias, também com o requisito de Arcanismo e consumo do livro: concede **12 XP**.

Nenhum desses fluxos cobra ação diária. A diferença de XP entre duas formas de aprender a mesma magia é uma inconsistência de interface/progressão a analisar; não significa que a autoria decidiu recompensar métodos diferentes. A fabricação consome uma ação e insumos, mas **não exige que o escriba já conheça o feitiço ou possua Arcanismo para entendê-lo**.

Isso pode ser um projeto interessante de sociedade: copistas, pesquisadores, escribas, instrutores e conjuradores não precisam ser a mesma pessoa. Mas ainda falta decidir como se transmite um conhecimento mágico, como se valida a cópia e o que torna uma inscrição perigosa.

Peren começa em **Portomonte**, com **Escrita 6** e **Arcanismo 18**. Portomonte **não possui estação de Escrita** no cadastro clássico. Há cinco oficinas em **Ironwood, Garganta, Boca do Abismo, Shadar-Riverie e Eldroth**; treino, deslocamento e insumos compõem barreiras materiais reais, não a mera disponibilidade de um menu.

## 4. O problema da tradução mecânica

O gerador preserva o nome, nível e escola de 354 magias, mas atribui a cada uma um `tipo` de combate adaptado. O motor clássico lida com tipos genéricos (por exemplo: `arcane`, `fire`, `drain`, `heal`, `root`) e **não reproduz todos os usos descritos na fonte D&D**.

Dentre as **320 magias fabricáveis**, **29 têm função classificada como `utilidade` e tipo adaptado `arcane`**. O clássico resolve `arcane` como dano no confronto. *Adivinhação*, *Compreender Idiomas* e *Clarividência*, por exemplo, não obtêm automaticamente suas ações extracombate só porque o grimório existe.

A auditoria marcou **24 casos P0**, **205 P1** e **91 P2** por palavras-chave e metadados. P0 concentra perguntas sobre coerção, autonomia, memória de mortos e criaturas invocadas; P1 sobretudo diferenças entre função declarada e uso como dano genérico; P2 corresponde a fichas sem essas sinalizações. **É triagem semântica, não parecer sobre a descrição completa de cada magia nem homologação de efeitos.**

A [proposta do ciclo LXIX sobre memória dos mortos](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/MEMORIA_DOS_MORTOS_RITOS_E_HERANCA_CICLO69.md) discute testemunhos, consentimento e autonomia, mas está expressamente **não homologada**. Ela não autoriza instituir ritos, academias, formas de invocação ou técnicas necromânticas no jogo.

## 5. Os 34 grimórios sem receita — aquisição sem via ordinária demonstrada

São **18 magias de D&D nível 8** e **16 de nível 9**. Seus grimórios têm itens gerados no catálogo, mas não receitas. No clássico examinado:

- `vendorStock()` limita a oferta normal a objetos de nível até `max(3, perigo+2)`. A cidade mais perigosa possui perigo 5, logo o máximo de loja é **7**, enquanto esses grimórios são nível **9 ou 10**.
- As recompensas de missão cadastradas não entregam grimórios. A rotina examinada de combate concede ingredientes e materiais, e às missões lendárias pode acrescentar relíquias, não grimórios.
- Portanto, **não foi identificada rota ordinária de obtenção desses 34 itens no clássico inspecionado**. Não significa que eles sejam impossíveis em outra versão, evento futuro ou no Phaser.

Entre os casos estão *Desejo*, *Aprisionamento*, *Dominar Monstro*, *Ressurreição Verdadeira*, *Portal*, *Parar o Tempo* e *Tsunami*. Transformá-los em venda comum, drops ou receitas de Escrita 90–100 seria uma **nova decisão de progressão**, e não simples reparo da ausência de receita.

## 6. Economia: simulação de compra e venda, não de rentabilidade

A matriz usa `cost()` e `sellprice()` do clássico, **Comércio 9**, hipoteticamente comprando Linho/Tinta e vendendo a unidade criada na mesma cidade com oficina. **Não considera trabalho, disponibilidade efetiva, quantidades, custos de viagem, acesso do personagem nem concorrência com escrita de grimórios comprados.**

| Cidade com Escrita | Saldos positivos / 320 | Nulos | Negativos | Linho e Tinta no sortimento reconstruído do dia 1 |
|---|---:|---:|---:|---|
| Ironwood | 57 | 0 | 263 | Linho, sem Tinta |
| Garganta | 294 | 0 | 26 | Linho e Tinta |
| Boca do Abismo | 232 | 0 | 88 | Nenhum dos dois |
| Shadar-Riverie | 122 | 0 | 198 | Nenhum dos dois |
| Eldroth | 122 | 0 | 198 | Nenhum dos dois |

O sortimento foi reconstruído a partir de `vendorStock()` usando os **41 objetos da categoria material** oriundos do gerador (33 gerais, cinco lingotes e três suprimentos), dia 1 e mercadores cadastrados. **Garganta é o único dos cinco polos que oferece os dois insumos no sortimento inicial projetado.** Isso não demonstra monopólio territorial nem garante quantidade para produzir, sobretudo grimórios de nível alto; outros dias, coleta ou inventário prévio permanecem possíveis.

A forte diferença econômica entre Garganta e outras cidades é **uma hipótese de estrutura de preço por zona do material**, não uma prova de que escribas da resistência ou da Corte possuem margens reais, clientes ou renda. Sem testar estoque, trabalho e venda efetiva, não reajustar valores ou desenhar rota comercial canônica.

## 7. Oito decisões para revisão autoral

| ID | Tema | Pergunta |
|---|---|---|
| **ESC-01** | Operação de Escrita | Cópia, pesquisa, tradução ou invenção são o mesmo trabalho? |
| **ESC-02** | Suporte | Por que Linho de Deméter e nenhum Pergaminho Vazio? |
| **ESC-03** | Inscrição | Toda magia é rúnica ou existem sistemas distintos? |
| **ESC-04** | Aprendizagem | Como relacionar Escrita, Arcanismo, leitura, consumo e XP? |
| **ESC-05** | Alto nível | Como obter os 34 grimórios sem receita? |
| **ESC-06** | Conteúdo | Como preservar efeitos de conhecimento/utilidade além do dano? |
| **ESC-07** | Responsabilidade | Que limites têm feitiços sobre memória, mortos e autonomia alheia? |
| **ESC-08** | Economia | Quem produz o suporte, copia, distribui, ensina e remunera o trabalho? |

**Sequência recomendada:** decidir **ESC-01 e ESC-04** primeiro (o que significa produzir e aprender); **ESC-02/03** em seguida (material e técnica); **ESC-05/06/07** para raridade, função e limites; finalizar com **ESC-08** usando dados de mercado reais.

## 8. Integridade, limites e continuidade

- **320 IDs e produtos únicos** conciliados com os 320 registros da matriz anterior e 354 magias; todos os níveis e quantidades previstos pela fórmula foram conferidos. As 34 magias restantes foram catalogadas por ID e requisito de Arcanismo.
- O **arquivo de dados** fornece parecer individual por receita, sinalizadores semânticos, relação com os dois materiais, projeção de item e cálculos condicionais nas cinco cidades. Nenhum desses sinalizadores é decisão autoral.
- Foi feita leitura do **código clássico**, não execução em navegador ou teste do Phaser/prealfa. Os compilados grandes `data/itens.json` e `data/receitas.json` não foram comparados integralmente registro a registro.
- **0** alterações em `data/magias.json`, `data/receitas.json`, `data/itens.json`, `game.js`, gerador, catálogos curatoriais, loot, saves ou cânone do mundo.

**Próxima frente:** Encantamento — **113 receitas** e seus **102 requisitos de Cristal de Alma Maior com quantidade zero**, além de fonte física do objeto, diferença entre ritual e artefato e custo social/cosmológico dos materiais.

## Atualização de QA compilado — 10/11/2026

Posteriormente a esta análise, a leitura por **SHA de blob Git** conseguiu acessar integralmente os arquivos `data/itens.json` e `data/receitas.json` que o conector de arquivos antes não retornava completos. **As 320 receitas de Escrita foram cotejadas com os registros publicados e não houve divergência de IDs, insumos, níveis, resultado, rendimento ou nome; seus 320 produtos foram conferidos com o catálogo.** Todos os 34 grimórios sem receita também estão no catálogo de itens e não aparecem como resultado de receita. Veja o [QA direto dos compilados](qa-crafting-compilado-2026-11-10.md) e os [102 requisitos inválidos encontrados no Encantamento](../data/qa-crafting-compilado-2026-11-10.json).

A ressalva anterior sobre **impossibilidade de ler os compilados** ficou superada pela nova verificação. Permanecem pendentes testes de execução real, Phaser/prealfa, saves, mercados e decisões autorais.
