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
- [ ] Executar CI de fonte no GitHub Actions.
- [ ] Auditar bundle da prévia e publicar apenas `phaser-demo-m1hf/` na `main`.
- [ ] Reexecutar QA público no Pages; Android/Xbox reais ainda pendentes.
