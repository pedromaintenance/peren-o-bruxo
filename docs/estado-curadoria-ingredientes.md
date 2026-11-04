# Estado da curadoria de ingredientes — reconciliação após Ciclo 111

**Data-base:** 03/11/2026. **Escopo:** curadoria editorial, consistência de dados e Carcaça — não é homologação de mecânicas ou menus.

**Repositórios:** [Peren, o Bruxo](https://github.com/pedromaintenance/peren-o-bruxo) e [Monstros da Carcaça](https://github.com/pedromaintenance/monstros-carcaca).
**Blob do catálogo auditado:** `57cf86f623ecabb4c30eb3a052384d627b615aa8`. **Revisão de Monstros consultada no fechamento:** [388e678a981c](https://github.com/pedromaintenance/monstros-carcaca/tree/388e678a981c1ca487c05a48f5934907857be418).

## Indicadores recontados
| Indicador | Valor | Significado |
|---|---:|---|
| Ingredientes no catálogo | 111 | Total de IDs, não número de ciclos |
| Efeitos distintos por ID | 53 | Todos possuem dois ou mais ingredientes com o efeito |
| Efeitos isolados | 0 | Integridade combinatória da curadoria |
| Auditorias individuais históricas (Ciclos 14–38) | 25 | Decisões por item; não garante proveniência ecológica completa |
| Matriz ecológica (Ciclos 39–111) | 73 | IDs distintos com notas de ecologia |
| Cobertura individual demonstrada | **98/111** | 25 históricos + 73 da matriz; sem sobreposição |
| Fichas pendentes de revisão individual | **13** | Algumas já tiveram decisão sobre atributos nos Ciclos 4–12 |
| Fichas com menos de 3 atributos | 0 | Escala de ficha preservada |
| Intensidades fora de I–III / duplicação de efeito numa ficha | 0 | QA estrutural |
| Campos `descricao` e `origem` ausentes | 2 | Ambos pertencem ao Betta do Rio |
| Colisões nominais | 1 | Dois Ovos de Tordo |
| IDs de efeitos com duas grafias | 2 | `curar_doenca` e `voar` |

## Distribuição de raridades

| Comum | Incomum | Raro | Épico |
|---:|---:|---:|---:|
| 54 | 31 | 22 | 4 |

## Lista fechada de pendências individuais (Ciclos 112–124 sugeridos)

A ausência de ficha ecológica não é ausência do item no catálogo. Atributos anteriormente aprovados pelo criador devem permanecer válidos.

| Ciclo proposto | Ingrediente | ID | Parceiros |
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

## Pendências transversais para revisão posterior

1. **Betta do Rio:** único sem `descricao` e `origem`. A descrição candidata existe na matriz. Origem não deve ser deduzida do Rio Ancestral.
2. **Beladona:** texto menciona interferência na recuperação mágica sem atributo de regeneração/diminuição correspondente; corrigir descrição, não inventar efeito.
3. **Ovos de Tordo:** usar rótulos editoriais provisórios de *agilidade* e *restauração*, mantendo IDs, raridade e nome ativo até decisão de integração.
4. **Efeitos:** mesmo ID aparece com grafias diferentes: `curar_doenca` = Curar doença / Curar Doença; `voar` = Voar / Voo. Não criar efeitos novos por causa da grafia.
5. **Proveniência:** Carne Humana, Coração Humano, Dedo de Gigante e possivelmente Orelha de Troglodita precisam de investigação de origem; não configurar pessoas ou povos sapientes como drops automaticamente.
6. **Identidade de Medusa:** a ficha diz criatura flutuante; não prova górgona nem organismo marinho.
7. **Ecologia e cosmologia:** templos, Mar de Sangue, Vandar, Eldroth, Thargrid e Vazio não são procedências automáticas de ingredientes parecidos no nome.
8. **Fonte histórica:** as decisões dos Ciclos 4–12 continuam vinculantes, mesmo quando a espécie não possui revisão ecológica individual.

## Handoff editorial para o chat de mecânicas e menus

**Fonte dos atributos vigentes:** `data/curadoria_ingredientes.json`. **Matriz de evidências e pendências:** `data/auditoria_ecologica_ingredientes.json`. **Decisões e precedentes:** `docs/auditoria-alquimia-peren.md`. **Protocolo de fontes:** `docs/curadoria-itens-consistencia-carcaca.md`.

Os campos `rotulo_proposto_nao_canonico`, descrições sugeridas e hipóteses de região são metadados editoriais. Não equivalem a autorização para alterar a interface, o loot, o mercado ou o catálogo publicado. O workflow de sincronização pode atualizar automaticamente os catálogos do clássico e de Phaser quando a curadoria ativa muda; coordenar qualquer edição que tenha propagação de dados.

**Próximos marcos:** completar as 13 fichas pendentes, revisar retrospectivamente a proveniência ecológica dos 25 itens dos Ciclos 14–38 e só então propor um pacote versionado de correções textuais. O avanço por ciclos não substitui a contagem por IDs. Não houve neste fechamento mudança no JSON jogável.
