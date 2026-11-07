# Aplicação Contextual de Preparados Alquímicos — combate, exploração e descanso

> **Peren, o Bruxo — 07/11/2026 · ESTUDO v1.0 [PROPOSTA / NÃO CANÔNICO].**
> O estudo complementa o [núcleo de Saúde e Magia](estudo-recursos-alquimicos-v1.md), a [taxonomia dos 53 efeitos](taxonomia-53-efeitos-alquimicos-v1.md) e a [Constituição do Design](constituicao-design-v1.md).
> **Código e UI apenas para revisão:** [PR #100 (draft)](https://github.com/pedromaintenance/peren-o-bruxo/pull/100). Não integrar módulos, não alterar save, não publicar como gameplay.
> **Fontes reais inspecionadas:** `game.js` na `main` e `phaser-lab/src/{progress.js,combat.js,ui-inventory.js,alchemy.js,ui-alchemy.js}` na branch `transition/phaser-only-m0-20261030`. A branch de transição é parte **do mesmo jogo**, não de um segundo projeto.

## 1. Constatação material — os sistemas já têm fronteiras distintas

O jogo clássico possui `S.hp` e `S.mp`, função `useItem`, ações no mundo, batalha e `endDay()` com recuperação diária. `Regenerate Health` e `Regenerate Magicka` são aplicados **imediatamente** na rotina de consumíveis legados, assim como `Restore`; isso não resolve a nova semântica de regeneração. A chave de save clássico é `peren_carcaca_save_v1`.

Na branch experimental do Phaser:

- `ui-inventory.js` apresenta uma interface **somente leitura**. É incorreto assumir que já haja um comando geral de `usePreparation` na interface.
- `progress.js` mantém um envelope e save próprios `PHASER_KEY`, com **revision**, **ledger** e transações já aprovadas para atividades específicas (como coleta e liquidação de vitória). A chamada `createProgressBridge.execute` sincroniza revisão, valida a transação e grava o resultado. Isso é infraestrutura reutilizável **conceitualmente**, não autorização para anexar comandos sem novas regras.
- `alchemy.js` + `ui-alchemy.js` permitem experimentação livre e mistura de **dois tipos** na implementação estudada; `brewPair` consome ingredientes e ação, e registra preparado em `character.alchemy.preparations`, mas não aplica automaticamente os efeitos sobre uma criatura ou objeto.
- `combat.js` reduz `battle.potions` a cada ação `potion` em batalha, em sua própria estrutura de estado; `progress.js` reconcilia a quantidade de poções restante com `character.bag['ger-pocao-restauradora']` em `victory` e `escape`. **Essa duplicidade de locais de estoque é o maior risco de integração:** se o novo executor debitar no envelope ao mesmo tempo que a batalha e a liquidação posterior, o frasco pode ser debitado duas vezes.
- `progress.js` já restaura PV e MP com `endDay`. **Descanso não é automaticamente uma operação de beber preparados**, nem os ticks futuros de regeneração devem ser inferidos do fim de dia.

**Conclusão arquitetural:** separar `fabricar preparado`, `guardar instância/lote`, `pré-validar uso`, `executar efeitos no alvo`, `debitar uma unidade/custo`, `persistir o resultado` e `notificar apenas o conhecimento do personagem`. A classificação anterior de Impuro/sinergia é uma decisão da **fabricação**, não um filtro automático que suprime efeitos na aplicação.

## 2. Matriz de contextos × famílias [PROPOSTA]

As **cinco famílias** continuam Poções, Venenos, Tônicos, Elixires e Bálsamos. Os **três contextos** em estudo são combate, exploração e descanso. O [contrato JSON da PR #100](https://github.com/pedromaintenance/peren-o-bruxo/blob/design/aplicacao-contextual-alquimia-20261107/data/contrato-aplicacao-contextual-alquimia-proposta.json) registra **15 combinações**, sem autorizar automaticamente nenhuma delas.

| Família | Combate | Exploração | Descanso |
| --- | --- | --- | --- |
| **Poção** | Exemplo QA de uso próprio; decidir custo/rodada/alvos | Exemplo QA de uso deliberado; decidir gasto de ação | Não autoativar; uso deliberado é decisão aberta |
| **Veneno** | Alvo, via, resistência e consentimento precisam de contrato | Envenenamento do mundo fora de combate é decisão aberta | Não autoativar |
| **Tônico** | Duração, efeito extraordinário e empilhamento ainda sem relógio | Mobilidade, invisibilidade e outros estados precisam do mundo real | Sem transformação automática em recuperação |
| **Elixir** | Permanência, transformação e consentimento são riscos de alto impacto | Persistência entre cenas/dias e reversão exigem save | Descanso não aplica elixir nem encerra efeito sozinho |
| **Bálsamo** | Alvo deve ser equipamento/objeto, nunca beber por padrão | Tipo de item, desgaste, encantamento e duração abertos | Não escolher equipamento nem aplicar sozinho |

**Importante:** “exemplo QA de Poção” **não** significa que o criador já aprovou o consumo de 1 ação, administração em aliado ou recuperação de números específicos. A via de aplicação é questão própria de cada família; Venenos não herdam permissão de beber Poções, e Bálsamos não herdam a de administrar em criatura.

## 3. Fluxo recomendado — prévia antes da transação

**[HIPÓTESE DE PROTOCOLO]** O motor de uso futuro deveria seguir:

1. Identificar **instância/lote** do preparado sem reconstruir efeitos por texto de nome/ícone.
2. Ler **contexto e ação** (beber, administrar, aplicar em objeto) sem inferir a partir da família.
3. Confirmar **alvo existente**, legitimidade da via e, quando necessário, decisão de resistência/consentimento.
4. Checar quantidade disponível e **custo de uso específico do contexto**, sem misturar indiscriminadamente ação diária com turno de combate.
5. Validar a operação de **todos os IDs realmente ativados**. Se qualquer efeito não puder ser resolvido com segurança, **bloquear a tentativa completa** e preservar frasco e ações. Não aplicar só o primeiro efeito.
6. Definir **simultaneidade, limite, PV zero, duração e permanência** por contrato aprovado. Uma mistura não escolhe ordem pelo ingrediente selecionado ou pelo primeiro elemento do JSON.
7. Simular um estado novo sem tocar no anterior e construir recibo **público** com apenas os efeitos identificados pelo personagem; o executor conserva internamente o conjunto completo de efeitos.
8. Fazer **um único commit atômico**, que registre o novo estado, debite frasco/custo **uma vez** e grave recibo de transação.
9. Em repetição da mesma transação, devolver o recibo anterior sem consumir novamente. O mesmo identificador não pode ser reutilizado para outra ação/alvo.
10. Em combate, a fronteira de consumo deve reconciliar o `battle.potions` já existente, ou substituí-lo por uma autoridade única aprovada. **Não manter dois mecanismos de débito simultâneos.**

A proposta também separa **pré-validar** (nenhum efeito ou gasto) e **executar** (apenas se todas as regras autorizarem). O usuário recebe motivo seguro de bloqueio, sem revelar propriedades ocultas em tooltip, log ou DOM.

## 4. O que o experimento realmente implementa — e o que não implementa

A [PoC isolada](https://github.com/pedromaintenance/peren-o-bruxo/blob/design/aplicacao-contextual-alquimia-20261107/prototipos/aplicacao-contextual-alquimia.mjs) executa **somente quatro IDs imediatos**, por hipótese: `dano_saude`, `restaurar_saude`, `dano_magia`, `restaurar_magia`. O estado de QA tem `actors`, `bag`, `preparations`, `actions` e `ledger` em **memória efêmera**. Todos os números de magnitude e o `actionCost:1` são **fictícios e explicitamente declarados** em `researchPolicy()`. A política exige a marca `peren.alchemy.context.QA_ONLY`, não pode declarar `approved:true` e não existe no runtime.

Como pesquisa, a simulação permite por padrão somente beber uma Poção no **próprio personagem**, em combate/exploração, mediante custo e magnitude de QA. Vias para Venenos, outros personagens, objetos, Elixires, Tônicos e descanso **não** são liberadas silenciosamente. Um teste pode ativar permissões explícitas de resistência **simulada** para exercer a transação, mas isso **não é uma implementação de resistência real**.

**Bloqueios de segurança do experimento:** mistura contendo algum efeito ainda sem semântica de execução, ausência de estoque, ações insuficientes, custo não definido, alvo inexistente, revivificação desde PV zero, via de uso não aprovada, efeito temporal sem relógio, item do clássico, tentativa de aplicar em objeto e discrepância entre efeitos reais e conhecimento declarado. **Não** se assume que uma condição Impura possa ser purificada, neutralizada ou renomeada por sua aplicação.

**Persistência não implementada:** `ledger` é somente uma demonstração de idempotência numa estrutura JS em memória. **Não** é o save Phaser, não lida com concorrência em duas abas, restore real, reload nem falhas de gravação. A integração precisaria aproveitar os gates de `createProgressBridge` sem quebrar a liquidação de batalha.

## 5. Resultados observados

**QA de lógica:** **37/37 testes aprovados em JavaScript V8 isolado** com chamadas a funções puras, incluindo duplicidade de transação, colisão de ID, bloqueios sem consumo, custo explícito, via da família, alvo/resistência/consentimento, contexto, inventário, efeitos ocultos e legado. Arquivo preparado para `node --test` em checkout; **não** foi executado no runner Node do repositório.

**QA da interface:** **15/15 verificações funcionais aprovadas com DOM simulado**, usando o [painel HTML offline](https://github.com/pedromaintenance/peren-o-bruxo/blob/design/aplicacao-contextual-alquimia-20261107/prototipos/painel-aplicacao-contextual-alquimia-v1.html), com oito cenários:
- uso próprio em combate e exploração (parâmetros de teste);
- repetição idempotente e nova tentativa com ID próprio;
- descanso bloqueado sem aplicação automática;
- alvo hostil/consentimento ainda sem regras;
- efeito oculto realmente aplicado no cálculo de QA, mas ausente do recibo público;
- regeneração sem tempo, item clássico e aplicação em equipamento bloqueados.

**Não testados:** `node --test` real, browser visual, dispositivo Xbox/mobile, acessibilidade com leitor de tela, batalha Phaser real, gravação, persistência, integridade de loot, cache/Pages ou migração de saves. **Os resultados não são um novo release do jogo.**

## 6. Estratégia de integração futura (somente após decisão)

1. **Escolher uma autoridade de estoque para batalha:** ou o combate gerencia reserva e a liquidação consolida, ou todo consumo é transação individual do envelope com protocolo para rollback. Os dois caminhos exigem QA de vitória, derrota, fuga, recuo e reload. Recomendação inicial de pesquisa: estudar a **reserva de combate existente**, pois já há contrato de liquidação. **Não aprovar alteração por este documento.**
2. **Escolher custo por via/contexto:** `potion` já é ação de combate em `stepBattle`, enquanto `character.actions` serve às ações diárias. **Não cobrar ambas por padrão**, nem adotar o custo de 1 do laboratório.
3. **Separar alvo/consentimento/resistência:** beber (próprio corpo), administrar em outra criatura e aplicar em objeto são operações diferentes. Não transformar Poção em Veneno ou Bálsamo pela escolha de alvo.
4. **Definir o relógio de efeitos persistentes:** início, duração, suspensão, retomada, encerramento, stack, reinício e salvamento devem ser definidos para cada semântica de efeito. Descanso é evento de mundo, não universalmente o relógio de todos os efeitos.
5. **Proteger identidade e sigilo:** a mistura conhecida pelo jogo tem todos os efeitos; o Caderno e o recibo mostram só propriedades identificadas. Inventário deve manter identidade e versão semântica do preparado; os consumíveis clássicos não devem ser reinterpretados em silêncio.
6. **Aprovação, testes e depois integração:** só quando alvos, custos, duração e persistência forem definidos será seguro criar comando oficial de aplicação, botão no inventário e integração no combate.

## 7. Backlog proposto

- **CTX-D01 [P0]:** decidir via e contexto de uso para cada uma das cinco famílias, incluindo condições para Veneno, Elixir e Bálsamo.
- **CTX-D02 [P0]:** escolher autoridade única do estoque no combate e protocolo de conciliação de consumíveis após vitória/fuga/derrota.
- **CTX-D03 [P0]:** definir custo de uso em turno de combate versus ações do dia, sem dupla cobrança.
- **CTX-D04 [P0]:** estabelecer contrato transacional de prévia, validação, commit, idempotência e rollback real (inclusive reload/duas abas).
- **CTX-D05 [P0]:** definir alvos, alcance, via, resistência, consentimento e falha sem perda inadvertida de recursos.
- **CTX-D06 [P0]:** definir ciclo de vida dos efeitos persistentes, seus relógios, interrupções, expiração e salvamento.
- **CTX-D07 [P1]:** garantir sigilo dos efeitos, UX de bloqueios, confirmação, feedback de custo e compatibilidade do Caderno.
- **CTX-D08 [P0 QA]:** testes de integração das três situações de jogo, legado, inventário, combate, derrota, resgate, save, PWA e mobile.

**Aceites:** `CTX-Q01` prévia sem consumo; `CTX-Q02` item só debitado após confirmação válida; `CTX-Q03` repetição idempotente; `CTX-Q04` colisão de transação bloqueada; `CTX-Q05` custo explícito sem cobrança dupla; `CTX-Q06` alvo/rota/resistência; `CTX-Q07` efeito oculto não revelado; `CTX-Q08` mistura parcialmente não implementada bloqueada inteira; `CTX-Q09` descanso neutro; `CTX-Q10` item legado preservado; `CTX-Q11` duração sem contrato bloqueada; `CTX-Q12` conciliação batalha/progresso sem perda ou duplicação.

**Estado final:** estudo e protótipo de revisão; **nenhuma decisão canônica nova** sobre uso, custo, alvo, duração, potência ou save. [PR #100 permanece em rascunho](https://github.com/pedromaintenance/peren-o-bruxo/pull/100). O horizonte concreto é validar `CTX-D02` (fronteira transacional de combate), antes de começar a escrever o comando oficial de uso.

## Atualização — implementação de combate na pré-alfa (07/11/2026)

**Decisão posterior expressa do criador:** [Emenda S1 à Constituição](constituicao-design-v1.md) adia retrocompatibilidade de saves até depois da pré-alfa; começar de novo no jogo é aceitável. Por isso, os gates antigos referentes a **migração de saves de versões passadas** deixam de bloquear implementação. **Continua necessário não perder nem duplicar itens dentro da partida em andamento.**

A [PR #101](https://github.com/pedromaintenance/peren-o-bruxo/pull/101) é o **primeiro passo de implementação jogável** após este estudo: uso de preparados criados pela bancada em batalha, com seleção por ID, consumo do estoque de combate e reconciliação uma única vez no fim da luta. A síntese de um frasco segue a curadoria; somente os efeitos `restaurar_saude` e `restaurar_magia` têm aplicação provisória (+24 PV/+12 PM **não canônicos**). Outros efeitos **bloqueiam o lote inteiro**, e Poções/Venenos/Tônicos/Bálsamos/Elixires não são tratados como vias idênticas.

**Verificação:** [CI real success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/42423874692) com testes Node, build Vite e smoke Chromium, além das avaliações isoladas do estudo. A PR continua **draft, sem merge e sem publicação em Pages**. Permanecem abertos valores finais, resistência, duração, uso fora de combate e teste físico.
