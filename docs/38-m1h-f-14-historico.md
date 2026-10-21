# M1h-F.14 — Histórico da Batalha

**Escopo:** histórico temporário e consultável dos acontecimentos reais da batalha.

- A fonte é `BattleScene.publicState().log`, com janela de três mensagens.
- A sobreposição das janelas evita duplicação nas transições ocupado/livre. Histórico limitado a 24 mensagens, recentes primeiro, reiniciado ao trocar a chave do encontro.
- Visualização voluntária com `details/summary`, toque, foco de teclado e lista rolável; `aria-live=off` no registro para não duplicar avisos.
- Nenhum novo cálculo de dano, ação, item, IA, saque, saída do combate, histórico salvo ou chave de save.
- O painel aparece somente na M1h-F experimental; a versão estável não recebe a funcionalidade.

## Aceite
- [x] Helper puro e testes Node.
- [x] Smoke Chromium criado para 360×800, 390×844 e 1280×800, eventos, novo combate, layout e três saves isolados.
- [x] CI Node/Vite/Chromium concluído: [success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/39026469758).
- [x] Diff auditado e release exclusiva para `phaser-demo-m1hf/`: [PR #40](https://github.com/pedromaintenance/peren-o-bruxo/pull/40) mesclada à `main`.
- [x] QA público completo: [success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/39026858254), incluindo histórico em três viewports, seis vitórias, resiliência, PWA offline, diário, recuperação de save e isolamento. 
- [ ] Android/Xbox físicos e avaliação visual humana.
