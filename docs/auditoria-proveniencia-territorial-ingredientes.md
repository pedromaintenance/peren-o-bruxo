# Auditoria de proveniência territorial — 111 ingredientes de Peren

**Data:** 05/11/2026 · **Estado:** auditoria documental, sem alteração de mecânicas, zonas de coleta, receitas, drops, economia ou saves.

**Matriz por ID:** [`data/auditoria_territorial_ingredientes.json`](../data/auditoria_territorial_ingredientes.json) · **Ecologia por ID:** [`data/auditoria_ecologica_ingredientes.json`](../data/auditoria_ecologica_ingredientes.json).

## Resultado central

O gerador inicial (`ferramentas/build_data.py`) atribui a cada ingrediente da lista importada uma localização por:

```python
zona = CITIES[(indice_original * 7) % len(CITIES)][0]
```

Como há nove cidades, o ciclo percorre todas e deixa cada zona com **12 ou 13 ingredientes**. A distribuição é um efeito matemático do algoritmo, **não** uma conclusão de que nove regiões possuem populações parecidas de fauna ou plantas. O gerador usa nomes e efeitos importados como ponto de partida; os 111 nomes e propriedades foram posteriormente curados para a Carcaça.

A curadoria ativa `data/curadoria_ingredientes.json` sobrescreve `zona` e `zona_exclusiva` **em apenas uma ficha: Pena de Gaivota em Portomonte**. Existem ainda **quatro localidades mantidas expressamente no README de Peren** sem overrides individuais de zona. Os demais **106 ingredientes** não possuem, nas fontes desta verificação, aprovação territorial individual que substitua o cálculo inicial.

| Natureza do registro territorial | Quantidade | Interpretação |
|---|---:|---|
| Exclusividade aprovada em override curatorial | **1** | Pena de Gaivota → Portomonte (Peren) |
| Local retido na documentação histórica de Peren | **4** | Registro de continuidade do jogo, sem comprovação zoológica/botânica no atlas |
| Zona procedural, sem validação territorial individual identificada | **106** | Localização técnica de base, não evidência de habitat |
| **Total** | **111** | IDs conciliados com a curadoria e a matriz ecológica |

## Distribuição produzida pelo gerador

| Zona técnica | Nome do lugar | Ingredientes projetados | Natureza do número |
|---|---|---:|---|
| `portomonte` | Portomonte | 13 | resultado procedural, não contagem ecológica |
| `thargrid` | Thargrid | 12 | resultado procedural, não contagem ecológica |
| `ironwood` | Ironwood | 12 | resultado procedural, não contagem ecológica |
| `garganta` | Garganta | 12 | resultado procedural, não contagem ecológica |
| `drakport` | Drakport | 12 | resultado procedural, não contagem ecológica |
| `boca-abismo` | Boca do Abismo | 13 | resultado procedural, não contagem ecológica |
| `shadar-riverie` | Shadar-Riverie | 12 | resultado procedural, não contagem ecológica |
| `alem-sul` | Além Sul | 13 | resultado procedural, não contagem ecológica |
| `eldroth` | Eldroth | 12 | resultado procedural, não contagem ecológica |

**Limite importante:** os totais de zona foram reconstruídos **estaticamente a partir do código e dos overrides**. Não foi feita leitura integral do arquivo compilado `data/itens.json` nesta passagem. Se houver edições diretas posteriores ao gerador, a projeção poderá divergir da base efetivamente servida ao jogo. A matriz marca isso em `catalogo_de_itens_publicado_conferido_integralmente:false`.

## As cinco localizações com evidência histórica em Peren

| Ingrediente e ID | Zona | Evidência comprovada | Limite da evidência |
|---|---|---|---|
| Pena de Gaivota — `ing-felsaad-tern-feathers` | **Portomonte**, exclusiva | `zona` e `zona_exclusiva` presentes na curadoria; decisão autoral registrada | O atlas documenta Portomonte, Deméter e agricultura, **não** a taxonomia, ecologia ou distribuição da gaivota |
| Carapaça de Caranguejo — `ing-mudcrab-chitin` | Além Sul | README mantém região anteriormente cadastrada | Não comprova ocorrência da espécie, coleta nem abundância no Além Sul |
| Pó de Vampiro — `ing-vampire-dust` | Boca do Abismo | README mantém região previamente definida | Não comprova procedência dos vampiros ou forma de obtenção |
| Couro de Rato — `ing-charred-skeever-hide` | Garganta | README mantém local anteriormente cadastrado | Não comprova presença de espécie específica nem rede de suprimento |
| Penas de Falcão — `ing-hawk-feathers` | Thargrid | README mantém região cadastrada | Não comprova população de falcões nem pontos de coleta |

Essas cinco referências **não precisam ser apagadas por não estarem confirmadas em Monstros da Carcaça**. São dados/documentos de Peren, de autoridade diferente do inventário ecológico externo. A promoção a habitat regional de mundo aberto requer evidência própria.

## Casos concretos que merecem inspeção antes da distribuição de loot

| Ingrediente | Zona prevista pelo gerador | Por que há risco de inferência |
|---|---|---|
| **Betta do Rio** | Shadar-Riverie | O nome sugere peixe fluvial, mas não comprova espécie ou ponto de coleta; ainda falta descrição na curadoria |
| **Fungo de Gualápoles** | Thargrid | O topônimo remete a uma cidade da Foz; isso não demonstra nem prova **contradição** com a zona técnica: pode envolver nome histórico, transporte ou outro fator ainda não escrito |
| **Bagas da Neve** | Portomonte | O nome evoca clima frio, mas não documenta cultivo, proveniência ou impossibilidade de circulação de mercadorias na Costa Sul |
| **Peixe-Espada do Sangue** | Portomonte | Região costeira plausível, mas o atlas não confirma a espécie, a pesca ou a distribuição no Mar de Sangue |
| **Dentes de Espectro Gelado** | Boca do Abismo | Nenhuma fonte vincula esse espectro ao ambiente da Foz; não classificar automaticamente como morto-vivo local |
| **Sais do Vazio** | Thargrid | Vazio não significa que um cristal se extrai das minas de Thargrid ou de plano cosmológico definido |
| **Carne Humana** | Eldroth | Não transformar vítimas, pessoas ou cadáveres em loot regional automático |
| **Coração Humano** | Shadar-Riverie | A existência da Corte e de exploração não comprova comércio de órgãos ou mecanismo de obtenção |
| **Dedo de Gigante** | Eldroth | Gigantes são povos sapientes; zona gerada não autoriza caçada nem inventário comum de drops |
| **Orelha de Troglodita** | Thargrid | Sem taxonomia e proveniência individual comprovadas; não criar recurso de exploração de povo sapiente por analogia |

Nenhum caso da tabela é, apenas por isso, **erro comprovado**, nem autorização para trocar por outra região aparentemente mais adequada. **Ausência de prova de ocorrência não é prova de impossibilidade.**

## Regra editorial de quatro dimensões

O futuro sistema de coleta/comércio deveria distinguir claramente, sem misturá-los:

1. **Origem do registro:** campo `origem` indica a linhagem/editoria dos dados; não é habitat.
2. **Local histórico ou zona do catálogo:** o `zona` do gerador pode ser procedural, ou ter retenção documental em Peren; não prova a espécie naquele bioma.
3. **Ocorrência ecológica confirmada:** exige decisão e fonte sobre espécie/material, região e limites dessa afirmação. Pode permanecer indeterminada.
4. **Disponibilidade jogável/econômica:** vender, obter, encontrar no chão, pilhar ou receber um insumo requer regras próprias e justificativa; comércio em uma cidade não prova que a espécie viva ali.

Em particular, se o jogo vier a permitir comprar material em Shadar-Riverie, isso **não deve ser interpretado automaticamente como reprodução ou coleta da espécie em Shadar-Riverie**.

## Critérios de integração para o outro fluxo

- **Nenhuma mudança automática agora** no campo `zona`; nenhuma alteração nos 111 atributos, preços, receitas, drops, monstros, cidades ou saves.
- Preservar, por ora, as cinco localizações documentadas no jogo; a exclusividade da Pena de Gaivota não deve ser diluída por um algoritmo de reequilíbrio.
- Para os 106, preparar futuras fichas individuais com `fonte_de_ocorrencia`, `status_aprovacao`, `tipo_de_acesso` e `observacao_de_incerteza`, sem inventar valores de ecologia.
- Quando um local for aprovado, estudar em branch experimental migração compatível do gerador e dos catálogos legados. Não usar a matriz editorial para gerar automaticamente novas listas de loot.
- Depois, comparar **o JSON efetivamente publicado**, o resultado de `ferramentas/build_data.py`, o clássico, o Phaser e o laboratório. Respeitar hashes, receitas, saves, PWA e condições de publicação.

## QA desta rodada

- **111/111 IDs** reconciliados a partir dos nomes de importação, com função de slug equivalente à do gerador.
- **111/111 IDs** presentes na curadoria e na auditoria ecológica.
- **9/9 zonas** mapeadas no algoritmo e totais somando 111.
- **1** override explícito de zona; **4** locais históricos do README; **106** sem validação individual nas fontes auditadas.
- **0** mudanças no código do jogo, curadoria ativa ou arquivos de itens/receitas.
- **Pendente:** leitura completa e comparação do `data/itens.json` compilado e decisão autoral para novos habitats.

**Referências congeladas da análise:** Peren `138dcc07cc59aabe71f4e5152d7aca078be1e78d` (curadoria blob `57cf86f623ecabb4c30eb3a052384d627b615aa8`) e Monstros da Carcaça `f07ecba35a0b1c8c1aa4262dfd5f3c4968616f24`. A fonte Monstros foi utilizada para identificar limites de evidência; vários registros do atlas são propostas sem aprovação, não distribuições canônicas de espécies.

## Continuidade territorial — fila de investigação dos 106 (05/11/2026)

- [Fila estruturada](../data/fila-investigacao-territorial-ingredientes.json) com **106/106** registros procedurais e referências por ingrediente; os cinco registros de localizações historicamente preservadas em Peren permanecem fora da fila e não foram revogados.
- Triagem por risco de extrapolação: **P0: 11; P1: 25; P2: 16; P3: 54**. Os marcadores de risco podem coexistir no mesmo ingrediente e não representam balanceamento de jogo.
- **11/11 P0** receberam um **parecer documental preliminar**, sem comprovação nova de habitat e sem autorização de procedência/loot: quatro materiais de pessoa/povo potencialmente sapiente, quatro resíduos/identidades de fonte e três textos com ausência ou discrepância de efeito.
- Os textos candidatos de Betta do Rio, Beladona e Escamas de Piranha continuam **não aprovados** e não foram aplicados.
- [Relatório da fila e pareceres P0](fila-investigacao-ecologica-ingredientes-v1.md): fontes efetivamente verificadas, guardas de cânone, tabela dos 25 P1 e critérios de aceite.
- **Nenhuma alteração** em curadoria ativa, zonas, atributos, receitas, combos, loot, economia, código, saves ou PWA. A comparação integral com o JSON compilado `data/itens.json` continua pendente.

## Cruzamento com pareceres P1 — 07/11/2026

A segunda fase de averiguação publicou [25 pareceres P1 por ID](pareceres-p1-taxonomia-habitats-ingredientes.md) e elevou a fila para **36/106 registros com primeira opinião documental**. A classificação de zonas continua **1 exclusividade explícita + 4 locais preservados em Peren + 106 zonas procedurais**, sem realocação nem aprovação ecológica. O próximo bloco são **16 P2** focados em habitat aquático, circulação, ofícios e produção, e em seguida **54 P3** de investigação rotineira. A matriz territorial original permanece inalterada.
