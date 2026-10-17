# M1h-F.16 — Recibo do Último Combate

## Problema
Ao retornar à floresta após vencer, o HUD exibia `ing-hanging-moss` e outros IDs técnicos no lugar dos nomes reais dos itens. O aviso também não indicava com clareza se o pagamento havia sido efetivamente aplicado.

## Implementação
- `battleReceiptViewModel({result,reward,applied},catalogs)` deriva um recibo **somente do evento já liquidado** `peren-battle-end`. Apenas `applied === true` permite declarar saque recebido.
- Exibe XP, moedas e quantidades de itens conforme `reward.items`, com nomes do catálogo `itensById` (sem criar drops).
- Fuga e derrota anunciam ausência de recompensa. Pagamento idempotente (already claimed) não gera recibo falso de pagamento.
- O feedback da floresta usa essa descrição real na M1h-F. Um painel expansível **Último combate**, fechado por padrão, permite consultar o recibo em Portomonte.
- Histórico temporário em memória; o Diário continua responsável pela persistência. Nenhuma nova transação, gravador de save, chamada remota, botão de coletar saque ou alteração no clássico.
- Os comandos, recompensas, IA e controles continuam idênticos.

## Aceite
- [x] ViewModel, UI, testes Node e Chromium implementados.
- [x] [Build e QA Chromium candidatos aprovados](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/39035571241), após correção do evento de recompensa e preservação do prefixo Vitória!.
- [x] [PR #42](https://github.com/pedromaintenance/peren-o-bruxo/pull/42) mesclada com somente o bundle isolado `phaser-demo-m1hf/`.
- [x] [QA do GitHub Pages após implantação aprovado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/39036357919), incluindo recibo, seis vitórias, resiliência, PWA offline, Diário e saves.
- [ ] Avaliação de legibilidade no Android físico pendente.
