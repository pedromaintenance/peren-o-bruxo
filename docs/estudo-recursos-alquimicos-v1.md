# Efeitos de Recursos — Saúde, Magia, Capacidade e Regeneração (v1.0)

> **05/11/2026 · ESTUDO DE GAME DESIGN / PROPOSTA.** Este documento **não aprova** regras numéricas de cura, dano, duração, regeneração, combate, consumo nem fórmulas de intensidade.
> Continua a [taxonomia dos 53 efeitos](taxonomia-53-efeitos-alquimicos-v1.md), o [plano técnico de alquimia](plano-alquimia-gameplay-v1.md) e os estudos de [dominância](estudo-dominancia-alquimica-v1.md) e [fontes adicionais](estudo-fontes-adicionais-alquimia-v1.md).
> **Prova de conceito isolada:** [PR #99 — draft](https://github.com/pedromaintenance/peren-o-bruxo/pull/99), com `data/contrato-recursos-alquimicos-proposta.json`, simulador de estados, testes e painel HTML. Não importar no Phaser nem no clássico.

## 1. Qual problema estamos resolvendo?

O catálogo de 53 efeitos distingue **nomes**, mas não tem uma fórmula aprovada para converter intensidade I–III das fontes em pontos de vida, pontos de magia ou duração. O próximo desenho não pode tratar `dano_magia`, `diminuir_magia`, `restaurar_magia` e `regenerar_magia` como equivalentes. Precisamos distinguir **qual grandeza do alvo** cada efeito altera.

**Referência material do jogo clássico:** `game.js` já possui `S.hp` e `S.mp` atuais, `maxhp()` e `maxmp()` derivados de nível/perícia/reliquia, dano de batalha, custos de magia, cura em magias e recuperação diária. Isso demonstra que existem recursos **correntes e máximos** no gameplay legado. **Não demonstra** que a alquimia dinâmica dos 53 efeitos já esteja implementada ou que o Phaser use exatamente o mesmo contrato.

**Divergência legada decisiva:** a função `useItem` do clássico trata `x==='Restore Health'` **e** `x==='Regenerate Health'` como aumento **imediato** de `S.hp`. Também faz `Restore Magicka` **e** `Regenerate Magicka` aumentarem **imediatamente** `S.mp`. A futura distinção entre restauração pontual e regeneração por tempo é portanto **proposta de evolução**, e requer **compatibilidade/migração consciente**. Nunca reescrever comportamento de itens antigos só porque o novo nome sugere duração.

## 2. Os dez efeitos de recurso avaliados

| ID do efeito | Operação estudada | Grandeza de alvo | Situação |
| --- | --- | --- | --- |
| `dano_saude` | Reduzir vida atual | PV atual | **Proposta**, não tipa dano automaticamente como veneno |
| `dano_magia` | Reduzir magia atual | MP atual | **Proposta** já sugerida na auditoria |
| `restaurar_saude` | Recuperar PV pontualmente | PV atual | **Proposta**, distinta de Regenerar Saúde |
| `restaurar_magia` | Recuperar MP pontualmente | MP atual | **Proposta**, distinta de Regenerar Magia |
| `aumentar_saude` | Aumentar capacidade máxima de PV | PV máximo | **Hipótese**, não concede cura automática sem política |
| `aumentar_magia` | Aumentar capacidade máxima de MP | MP máximo | **Hipótese**, não restaura MP automaticamente |
| `diminuir_magia` | Reduzir capacidade de MP **ou** eficácia arcana | Máximo de MP / outro valor indefinido | **Ambíguo — decisão obrigatória** |
| `regenerar_saude` | Aumentar taxa de recuperação de PV | PV por intervalo | **Hipótese**, duração/intervalo indefinidos |
| `regenerar_magia` | Aumentar taxa de recuperação de MP | MP por intervalo | **Hipótese**, não se confunde com Restore Magicka |
| `diminuir_regeneracao_magia` | Diminuir taxa de recuperação de MP | MP por intervalo | **Hipótese**, não equivale a dano ou reduzir máximo |

Estes IDs **já existem** na curadoria. O contrato não cria efeitos novos nem lhes atribui magnitude. `fraqueza_magia` e `resistencia_magia` ficam fora deste primeiro simulador porque afetam **interações de ameaça/resistência**, não necessariamente a reserva de MP do alvo.

## 3. Invariantes e hipóteses do simulador

**[CANÔNICO]** O efeito nasce apenas quando pelo menos **dois tipos distintos** de ingredientes o compartilham. Misturas podem preservar vários efeitos; a classe **Impuro** depende de incompatibilidades aprovadas, não de o efeito ser negativo. Uma sinergia nomeada não acrescenta bônus numérico sem decisão explícita.

**[HIPÓTESES DE QA]** Para visualizar operações, o protótipo usa `saude: {current,max,baseRate}` e `magia: {current,max,baseRate}`. O valor atual é limitado ao intervalo de 0 a máximo; o máximo não pode ser negativo; a taxa-base é um campo de **simulação**, não um atributo canônico do save clássico. As magnitudes inseridas em testes e na UI são **fictícias**, não extraídas de intensidade I–III. O `tick` não é um turno, segundo, dia ou ação oficial.

**Não definido:** custo e dose, quantidade de aplicações, alvo, resistência, uso fora de combate, interrupções, cancelamento, expiração de melhorias temporárias, recuperação a partir de PV zero (morte/derrota), sobreposição de efeitos repetidos, simultaneidade e unidade de tempo.

## 4. Questão A — dano e cura simultâneos não são comutativos

Demonstração **hipotética**: personagem com **95/100 PV**, `dano_saude` 40 e `restaurar_saude` 40.

| Política para um mesmo lote | Resultado calculado |
| --- | ---: |
| Dano antes da cura | **95/100 PV** |
| Cura antes do dano | **60/100 PV** |
| Saldo líquido simultâneo, limitando ao final | **95/100 PV** |

Se a cura ocorre primeiro, 35 pontos excedem o máximo e se perdem antes do dano. O teste demonstra que **não podemos usar ordem alfabética, ordem dos ingredientes ou ordem dos efeitos no JSON** como mecanismo oculto de balanceamento. Para misturas com vários efeitos, escolher uma **política explícita** (ordem semanticamente definida ou resolução simultânea) e documentar sua relação com Impuro, resistência, consumo e alvos. Recomenda-se o **saldo líquido como primeira hipótese de avaliação**, não decisão aprovada.

## 5. Questão B — aumentar capacidade não define quanto PV o personagem possui

Amostra de QA: **60/100 PV**, `aumentar_saude` com magnitude hipotética **30 de máximo**.

| Política hipotética | Resultado |
| --- | ---: |
| Preservar o valor atual | **60/130 PV** |
| Preservar a quantidade de PV que faltam (40) | **90/130 PV** |
| Preservar a fração atual (60%) | **78/130 PV** |

**Implicações:** preservar o déficit concede PV atual ao aumentar máximo; preservar valor não concede cura mas aumenta a fração faltante. Preservar a proporção exige arredondamento. Todas têm efeitos estratégicos. Ao reduzir capacidade (cenário `diminuir_magia`), também há divergência entre **cortar o excesso** e **preservar o déficit**.

**Risco ainda não abordado:** quando esse aumento termina, o que acontece ao PV/MP que estiver acima do máximo original? Quem está com PV zero pode ser revivido? Um estado de regeneração continua funcionando com personagem derrotado? **Nenhuma regra de ressuscitação ou expiração foi autorizada.** O simulador não deve ser integrado a gameplay enquanto essas perguntas não forem resolvidas.

**`diminuir_magia` exige decisão própria:** a auditoria propôs **reduzir máximo ou eficácia**, e nenhum dos dois comportamentos foi aprovado. Uma opção da UI **não mexe em MP** quando se escolhe eficácia, precisamente porque não há campo de eficácia validado pelo motor. Não inventar esse campo no save.

## 6. Questão C — regeneração precisa de unidade temporal

Amostra de QA com **50/100 PV**, taxa-base fictícia 2 e `regenerar_saude` hipotético de **+3 por intervalo**: após três intervalos, o modelo soma 5 por intervalo e chega a **65/100 PV**. Com **98/100 PV**, não ultrapassa 100, mesmo após vários intervalos. Isso não estabelece se um intervalo é turno, minuto, ciclo de mundo, ação do dia ou descanso.

**`diminuir_regeneracao_magia` não deve atacar MP atual por analogia.** A pesquisa testa diminuição da taxa, no exemplo reduzida até o piso zero. Se a redução pode virar **degeneração negativa**, causar dano ou persistir após repouso, é outra decisão aberta.

**A coexistência de duas influências de taxa** exige política de empilhamento: somar linearmente, limitar a uma instância, usar a mais intensa ou tratar fontes divergentes. O simulador soma apenas como caso de QA, sem estabelecer stacking de poções.

**O problema das fontes extras:** se a 3ª/4ª fonte repetir `regenerar_saude`, ainda não sabemos se aumenta taxa, prolonga duração ou simplesmente fornece outra origem. **Não transformar índice excedente F4 em +3 PV por segundo**, pois são grandezas incompatíveis e faltam unidades definidas.

## 7. Contrato de dados e integridade histórica

**No protótipo:** três operações independentes, sem consumo nem save:
- `simulateImmediate` (dano/restauração atual) compara três políticas de ordem;
- `simulateCapacity` (máximo) compara preservar atual, preservar déficit, preservar proporção e uma alternativa **não implementada** de eficácia arcana;
- `simulateRegeneration` (taxa) integra um número de intervalos fictícios e limita o valor atual ao máximo.

O catálogo `data/contrato-recursos-alquimicos-proposta.json` registra os **10 IDs**, hipóteses, condições de incerteza e lacunas explícitas (`null`). Os resultados são **ferramentas de análise**, não contratos autorizados para inventário e personagem.

**Proteção de migração sugerida:** distinguir comportamento de itens **legados** (`Restore` e `Regenerate` atualmente aplicados imediatamente no clássico) de produtos **dinâmicos futuros**; registrar versão semântica e proveniência **antes** de substituir a implementação. **Não editar `game.js`, saves ou item IDs** neste ciclo. Uma alteração global em `useItem` silenciosamente tornaria antigos itens de regeneração diferentes do que seus compradores receberam.

## 8. QA e backlog

**Ramo experimental:** `design/recursos-alquimia-20261105` · [PR #99 (draft)](https://github.com/pedromaintenance/peren-o-bruxo/pull/99).

**Evidências executadas:** **27/27 casos de lógica** passaram em JavaScript V8 isolado com o arquivo-fonte vigente do clássico; **14/14 verificações de interface** passaram em DOM simulado. Esse resultado não substitui `node --test` real, navegador visual, CI, integração Phaser ou jogo publicado.

**Gates propostos:**
- **REC-D01 [P0]:** aprovar significado dos 10 efeitos e a variável atingida (corrente/máximo/taxa/eficácia).
- **REC-D02 [P0]:** decidir ordem de efeitos múltiplos, simultaneidade, limites e efeitos não identificados.
- **REC-D03 [P0]:** definir o que acontece com valor atual ao modificar máximo e quando a alteração expira.
- **REC-D04 [P0]:** definir unidade temporal, sobreposição, interrupção e piso de regeneração.
- **REC-D05 [P0 legado]:** planejar compatibilidade das palavras `Regenerate` nos consumíveis existentes, inventário, save e clássico.
- **REC-D06 [P1]:** definir escala de magnitude e fontes extras por efeito, resistência do alvo, veículo e custo.
- **REC-D07 [P0 QA]:** testar inimigos/Peren, PV zero/derrota, migração, aplicabilidade de cura, sigilo e idempotência transacional antes de integração.

**Critérios de aceitação do estudo:** `REC-Q01` 10 IDs reconhecidos e nenhum novo ID; `REC-Q02` dano não altera máximo; `REC-Q03` cura clamped; `REC-Q04` ordem explícita; `REC-Q05` alternativas de máximo; `REC-Q06` eficácia indefinida; `REC-Q07` regeneração separada de cura instantânea; `REC-Q08` redução de taxa não causa dano por padrão; `REC-Q09` legado `Regenerate` protegido; `REC-Q10` sem fórmula baseada apenas em I–III, sem mudança de saves.

**Decisão autoral pendente:** escolher a semântica dos recursos, não simplesmente os números. A próxima investigação deve **comparar o recurso do personagem ao uso efetivo de um preparado em combate, mundo aberto e descanso**, só depois que os limites e as regras de aplicação forem decididos.
