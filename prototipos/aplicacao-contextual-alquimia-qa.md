# QA — Uso Contextual de Preparados Alquímicos (07/11/2026)

**Escopo:** [design/protótipo] transação hipotética de uso no combate, exploração e descanso, sem modificar o runtime. Todas as permissões usadas nos testes são **ficções de QA**, não aprovações do criador.

**Arquivos neste ramo:** [matriz de 15 casos de contexto × família](../data/contrato-aplicacao-contextual-alquimia-proposta.json), [modelo puro](aplicacao-contextual-alquimia.mjs), [37 testes](aplicacao-contextual-alquimia.test.mjs), [painel standalone](painel-aplicacao-contextual-alquimia-v1.html). [Relatório de design na `main`](https://github.com/pedromaintenance/peren-o-bruxo/blob/main/docs/estudo-aplicacao-contextual-alquimia-v1.md).

## Resultado experimental efetivamente verificado

- **37/37 testes de lógica aprovados** em V8 isolado. Cobre: prévia sem débito, consumo único após preflight, reenvio de transação idempotente, colisão de ID, estoque insuficiente, custo de QA obrigatório, custo maior que ações disponíveis, alvo inexistente, outras vias e famílias de uso, consentimento/resistência, efeitos ocultos conhecidos versus reais, regressão do legado, regeneração sem duração, PV zero e descanso sem uso automático.
- **15/15 verificações funcionais da interface aprovadas** via DOM simulado, com oito cenários. Verifica uso e recibo em combate, repetição sem duplo débito, novo ID de operação, bloqueio de descanso/alvo externo/objeto/legado/regeneração, uso em exploração, sigilo no recibo e reset.
- **Não realizados:** `node --test` real, CI, screenshot/navegação real em Chromium ou Firefox, acessibilidade com leitor de tela, mobile/Xbox físico, carregamento como módulo no Phaser, conciliação real de batalha, persistência de status, gravação/exportação de save.
- O modelo de QA **não conhece dose, duração, potência, resistência, turno, ação nem custo realmente aprovados**. O `actionCost:1` e os valores de cura são parâmetros do experimento, não regras.

## Roteiro manual

1. Abrir o HTML standalone localmente. Escolher **Combate**, pré-validar, usar: no cenário sintético, PV 70→90 e MP 25→37, quantidade de frascos 2→1, ações fictícias 3→2.
2. Clicar **Repetir mesma transação**: conferência sem nova cobrança; usar **Nova tentativa** para obter novo ID e debitar um segundo frasco se houver estoque.
3. Reiniciar o laboratório entre cenários independentes; caso contrário, o estoque e as ações consumidos permanecem durante a sessão — como se espera de uma simulação transacional.
4. Em **Descanso**, não ativar consumíveis automaticamente. Uma transição de contexto não equivale à ação deliberada de beber.
5. Em **Administrar a inimigo**, verificar bloqueio por via de uso e resistência/consentimento. Não escolher Peren como alvo alternativo automaticamente.
6. Em **Regeneração**, não converter em `Restaurar Saúde` só por conveniência; em **Legado**, não consumir diretamente a poção clássica com semântica do protótipo.
7. Em **Aplicar em equipamento**, bloquear, pois Bálsamos, duração, alvo e relação com encantamentos permanecem abertos.
8. Em **Efeito oculto**, a simulação inclui dois efeitos no cálculo, mas o recibo público mostra apenas o efeito conhecido pelo personagem; isso é um **vetor fictício de QA**, não receita do catálogo.
9. Testar viewports 360×800, 390×844, 1280×800, teclado, tabulação e contraste antes de qualquer publicação.

## Riscos de integração a resolver

- O **inventário da branch Phaser é somente leitura**; não há comando canônico geral `usePreparation`. Não injetar botão ativo em branch de produção antes de definir a via de uso.
- Em `phaser-lab/src/combat.js`, `stepBattle('potion')` já reduz `battle.potions`; `phaser-lab/src/progress.js` reconcilia a contagem final com o estoque em `victory`/`escape`. **Nunca adicionar uma segunda redução direta no envelope e manter a redução existente no combate.** Eleger fronteira transacional única e testar fuga, vitória, derrota e reload.
- O Phaser usa save próprio (`PHASER_KEY`) e o clássico usa `peren_carcaca_save_v1`; a PR não toca em nenhum dos dois.
- Os preparados experimentais da bancada têm efeitos e ingredientes persistidos na branch de transição, mas **não há aplicação geral homologada**. O modelo só autoriza executar quatro IDs imediatos em fixtures de QA, e bloqueia qualquer efeito extra para não descartá-lo.
- **Impuro e Poção da Fada** continuam decisões do classificador de misturas; o validador de uso não determina nova sinergia nem purificação.
- A função de mudança de contexto é deliberadamente neutra: sem uso, tick, expiração, cura ou débito. O descanso real do jogo continua governado por seu fluxo já existente.

**Reprodução quando houver checkout:** `node --test prototipos/aplicacao-contextual-alquimia.test.mjs` — precisa de Node real, não foi executado no CI deste ciclo.

**Critério de promoção:** aprovação de quem pode ser alvo, ação e custo de cada via, semântica temporal/potência, regra de resistência, dose e consumo, integração com batalha/saves, QA em runtime e autorização expressa para merge.
