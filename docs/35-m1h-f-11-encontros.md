# M1h-F.11 — Instinto do Bruxo / leitura do encontro

**Escopo:** informações contextuais do encontro hostil na Floresta de Mürin, apenas na prévia Phaser M1h-F.

## Problema

O modal já inclui retrato, nome e uma descrição da criatura, além dos comandos reais **Enfrentar** e **Recuar**, mas o jogador não tem leitura rápida do padrão de movimento e da própria prontidão antes de decidir lutar.

## Incremento

- Nova seção **Instinto do Bruxo** no modal, **somente informativa**: Sentinela, Errante de Esporos ou Caçador, com percepção base e velocidade classificadas pelos valores reais de `MURIN_BEASTS` (sem revelar a posição de outras criaturas).
- Segundo campo mostra os **PV, PM e poções reais**, oriundos do `combatProfile()`; ferimentos são classificados segundo frações apresentacionais da vida atual (35% / 65%). A leitura destaca explicitamente que **não prevê vitória**.
- `encounter-readout.js` é puro e não salva nada; a IA de `monsterDecision()`, os resultados de batalha e os fluxos de fuga/recompensa permanecem intocados.
- Mantém controles atuais por toque, mouse, teclado (Escape/Tab) e Xbox (A/B), diálogo acessível e interface responsiva.
- Modal do jogo clássico e da demo estável não são alterados.

## Gates

- [x] Implementação de apresentação e função pura de leitura, sem side effects.
- [x] Testes Node para padrões reais, limites de PV e degradação segura em dados desconhecidos.
- [x] Teste Chromium 360×800, 390×844 e 1280×800 para três encontros, recuo, viewport e isolamento das três chaves de save.
- [ ] CI Node/Vite/Chromium do pacote experimental aprovada.
- [ ] Publicação seletiva apenas de `phaser-demo-m1hf/` via PR auditada, após CI.
- [ ] QA público (modal, batalhas, PWA offline, Diário, resgate) aprovado após release.
- [ ] Revisão humana de contraste/legibilidade em Android físico e Xbox.
