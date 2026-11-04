# Estudo de Game Design — Intensidade, Dominância e Empates em Alquimia

> **Peren, o Bruxo · v1.0 · 03/11/2026**
> **ESTADO: PROPOSTA + TESTE DE HIPÓTESES; NENHUMA FÓRMULA APROVADA.**
> Autoridades: [Constituição v1.0, Emenda A2](constituicao-design-v1.md); [roadmap de crafting](roadmap-crafting-mecanicas-menus.md); [curadoria vigente de 111 ingredientes](../data/curadoria_ingredientes.json); [catálogo de sinergias/incompatibilidades](../data/catalogo-combos-alquimicos.json).
> **Prova de conceito isolada** (em branch de revisão): `prototipos/dominancia-alquimica-experimental.mjs`; **não** integrado ao Phaser ou ao Pages, sem alterações de receitas, efeitos ou saves.

## 1. O problema concreto

**[CANÔNICO]** Cada ingrediente curado tem intensidade de origem I–III para cada efeito; **a potência final de um preparado NÃO foi definida por essa escala**. O mesmo efeito ativa quando **dois tipos distintos** compartilham sua assinatura. O preparado mantém **todos** os efeitos ativados. Em caso de **incompatibilidade aprovada**, é Impuro; em caso de **sinergia aprovada** e sem incompatibilidade, recebe identidade de combo; em multiefeito compatível sem combo nomeado, seu **nome segue o efeito mais intenso** e os demais vão à descrição. A condição Impura não resulta da quantidade de efeitos.

**[ABERTO]** “Maior efeito” e “mais intenso” não são operacionais antes de definir: (a) como múltiplas fontes contribuem ao efeito resultante; (b) se intensidades de **efeitos heterogêneos** são realmente comparáveis (ex.: Força, Resistência à Eletricidade, Invisibilidade e Dano à Saúde); (c) a regra de empate; (d) papel de método, ferramentas e proficiência. Uma métrica isolada não resolve tudo automaticamente.

**Limite de autoridade do estudo:** índices de ordenação **não são potência final**, dano, duração, probabilidade de sucesso, raridade, economia ou intensidade nova do catálogo. Não afirmar que qualquer hipótese é regra do jogo.

## 2. Três modelos experimentais

Para um efeito ativo `E`, sejam `I1…In` as intensidades originais (I–III) em **fontes distintas** que possuem aquele efeito, com `n ≥ 2`. Nunca contam duas unidades do **mesmo tipo** como duas fontes.

| Modelo de índice | Regra exploratória | Vantagem | Problema |
| --- | --- | --- | --- |
| **M1 — Soma integral** | `I1 + I2 + … + In` | Reconhece a contribuição de 3ª e 4ª fontes; recompensa investimento e planejamento | Tende a premiar quantidade de fontes, podendo dominar mais que a qualidade; não é unidade de potência universal |
| **M2 — Duas maiores** | Somar as duas maiores intensidades `I` disponíveis | Reflete diretamente o mínimo de duas fontes para ativação; protege contra crescimento automático por quantidade | 3ª e 4ª fontes deixam de afetar **este índice**, embora permaneçam no preparado; ainda será preciso decidir seu possível papel material |
| **M3 — Maior fonte** | `max(I1,…,In)` | Destaca o ingrediente individual mais intenso; é simples | Ignora o peso relativo da segunda fonte essencial e cria empates frequentes |

**Possível M4 [não calculado]:** contribuição da terceira/quarta fonte para **estabilidade ou qualidade**, sem mudar a identidade do efeito dominante. Só considerar se compatível com futuros sistemas e depois de decisão expressa; não criar recursos ou estados novos silenciosamente.

## 3. Evidências reais do catálogo (sem alterar ingredientes)

### Teste principal: modelos discordam sobre o nome

Três tipos distintos: **Carapaça de Caranguejo** (`ing-mudcrab-chitin`), **Betta do Rio** (`ing-river-betty`) e **Garras de Urso** (`ing-bear-claws`).

| Efeito ativado | Intensidades de origem | M1 soma integral | M2 duas maiores | M3 maior fonte |
| --- | --- | ---: | ---: | ---: |
| `aumentar_forca` | II + II + II | **6** | 4 | 2 |
| `aumentar_constituicao` | III + II | 5 | **5** | **3** |

Com **M1**, Força vence. Com **M2 ou M3**, Constituição vence. Todos os efeitos são benéficos e **nenhum combo especial foi aprovado para esse par**: o preparado é multiefeito comum, não Impuro. **Não registrar nenhum desses títulos como definitivo antes de aprovação de regra de potência.**

### Teste de empate: um critério empata, outro resolve

**Carapaça de Caranguejo + Gordura de Troll** (`ing-mudcrab-chitin`, `ing-troll-fat`):

- `aumentar_forca` recebe II + II: soma = 4, maior fonte = 2.
- `resistencia_veneno` recebe I + II: soma = 3, maior fonte = 2.
- M1 e M2 elegem **Força**; M3 gera **empate**, exigindo apresentação transparente e decisão posterior.

Esses números **não comparam unidades finais de resistência e aumento de atributo**. São apenas testes de coerência do critério de rotulagem.

### Controle de Impuro, independente de intensidade

**Coração de Demônio + Língua-de-Dragão + Raiz Botulínica + Asa de Borboleta** ativam `aumentar_carisma` e `diminuir_forca` pela regra de duas fontes. A incompatibilidade é **canônica**. O rótulo **Impuro** deve permanecer nos três modelos e mesmo em empate. A escolha do efeito dominante modifica **a descrição principal**, mas nunca reclassifica o preparado como não Impuro.

**Controle de combo:** `aumentar_carisma` + `aumentar_ilusao` é **Poção da Fada**, desde que não haja incompatibilidade. O nome aprovado dessa sinergia **tem precedência** sobre os índices de dominância usados para misturas comuns.

## 4. Recomendação de design [PROPOSTA]

**Separar dois sistemas:**

1. **Potência real do efeito:** depende de ficha semântica por efeito, método, qualidade e perícia (todos ainda por definir). Um aumento de atributo, uma resistência elemental e uma transformação podem ter unidades de medida diferentes.
2. **Dominância para apresentação:** quando a fórmula real oferecer grandezas comparáveis, aplicá-la à classificação do nome. Até lá, M1/M2/M3 são **proxies para análise e teste**, não um critério canônico. Nada impede futuramente um critério separado para título, mas isso exigiria acordo explícito.

**Preferência de investigação, não aprovação:** partir do **M2 (duas maiores)** como modelo-piloto para o título, pois respeita o requisito de duas fontes e não torna obrigatório maximizar a quantidade; contrastar com M1 em preparo de três/quatro tipos para verificar se a terceira fonte merece influência. Não instituir M2 no motor ou na curadoria só porque foi o modelo inicial do protótipo.

**Empates:**
- **[ABERTO]** permitir ao alquimista nomear pelo **efeito empatado conhecido de sua escolha** (apenas apresentação), ou preservar uma designação neutra. A seleção não aumenta nem suprime efeitos e nunca escolhe automaticamente o primeiro item do JSON ou o primeiro ingrediente clicado.
- Se houver **efeito dominante oculto** ou empate não compreendido por Peren, mostrar **rótulo cauteloso** (ex.: “Preparado de efeitos mistos”) até identificar as propriedades; não usar nome do efeito escondido em UI ou atributos.
- **Impuro** permanece visível como categoria proposta independentemente do desempate; a explicação do conflito só mostra os efeitos conhecidos.
- Duas **sinergias nomeadas** simultâneas usam o protocolo de UX v1.1: todas as assinaturas registradas, sem gerar superpoção nem título composto automático.

## 5. Simulação isolada e resultados

**Branch experimental:** `design/dominancia-alquimica-modelos-20261103`. Ferramentas:
- `prototipos/dominancia-alquimica-experimental.mjs`: calcula, por efeito, lista de fontes e os três índices para uma mistura de **2 a 4 tipos distintos**. Não importa nem modifica o Phaser.
- `prototipos/dominancia-alquimica-experimental.test.mjs`: 15 testes para divergência de dominância, empate, estabilidade da ordem, sigilo, imutabilidade da curadoria, recusa de fonte repetida e ausência de potência final.

**Evidência de execução em 03/11/2026:** **15/15 testes passaram** em execução JavaScript V8 isolada usando o JSON real de curadoria. O arquivo de teste usa `node:test` para futura execução com `node --test` em checkout. **Ainda não se afirma execução em CI Node, Phaser real, Pages ou dispositivo físico.**

## 6. Gates e questões para decisão

- **DOM-D01 [P0]:** aprovar ou rejeitar a necessidade de um índice **comum** de ordenação entre efeitos distintos; decidir se magnitude final e nome devem compartilhar critério.
- **DOM-D02 [P0]:** comparar M1 (soma integral), M2 (duas maiores), M3 (maior fonte), com casos reais de 2–4 ingredientes; escolher fórmula **somente após** estudar unidades e equilíbrio de fonte extra.
- **DOM-D03 [P0]:** definir empates, direitos de escolha de rótulo pelo personagem e títulos neutros durante conhecimento incompleto.
- **DOM-D04 [P1]:** definir o papel de perícia, instrumentos, qualidade, intensidade III e outros materiais em potência/duração sem desfigurar curadoria.
- **DOM-D05 [P1]:** estabelecer persistência do efeito dominante e recálculo de exibição após identificação/purificação, sem alterar IDs dos produtos criados ou quebrar saves.

**Testes futuros:** `DOM-Q01` invariância de ordem; `DOM-Q02` 2 fontes distintas; `DOM-Q03` divergência M1/M2 real; `DOM-Q04` empate M3; `DOM-Q05` desconhecido oculto; `DOM-Q06` Impuro não muda classificação; `DOM-Q07` Poção da Fada mantém nome aprovado; `DOM-Q08` nenhum índice altera custo, efeito, duração ou saves; `DOM-Q09` estabilidade por famílias/efeitos sem unidade comum; `DOM-Q10` 3ª/4ª fontes não criam receita especial ou efeito novo.

**Decisão autoral pendente:** que papel devem ter a 3ª e 4ª fontes na intensidade resultante, e qual critério deve decidir o nome do efeito dominante? **Este documento não aprova nenhuma das opções por conta própria.**
