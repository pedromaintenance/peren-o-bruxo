# M1h-F.10 — Marcos da Trilha / Retorno a Portomonte

**Escopo:** orientação qualitativa durante a expedição em Mürin, apenas na prévia M1h-F. **Publicado pela PR #36; QA online em execução.**

## Motivação

O mundo procedural já possui uma trilha de terra (tiles `5` ou `6`), ponte sobre o rio e a saída a leste. Os comandos de retorno funcionam somente ao chegar ao marco, mas os jogadores que saem da trilha podem se perder sem indicação de quais pistas ambientais seguir.

## Implementação

- `trail-orientation.js` calcula **sinais de marco** somente com o terreno existente em `world.ground`, `world.bridge`, `world.exit` e `world.blocked`. Nenhum mapa adicional, caminho oculto, raio de visão, combate ou item foi criado.
- Estados: **Trilha de Mürin** (ponte a leste), **Ponte de Mürin** (passagem), **Retorno a Portomonte** (trilha oriental), **Fora da Trilha** (aproximação cardinal da trilha, explicitamente aproximada) e **Retorno à Vista** (marco de saída a menos de 40 px).
- A indicação de rumo **não promete rota livre de obstáculos**, pois não é um algoritmo de navegação. Monstros e obstáculos permanecem ocultos.
- Renderização discreta no HUD junto de clima e ameaças. Processamento cacheado por tile percorrido, sem varredura a cada frame. Voltar a Portomonte permanece dependente do encontro com a saída; não há teleporte.
- Sem mudanças em saves, progressão, IA, PWA, arte ou jogo clássico; condição `VITE_PEREN_M1HF_PREVIEW=1` para mostrar a interface.

## QA e publicação

- [x] Função pura de orientação com estados qualitativos e sem side effects.
- [x] Integração na cena e no HUD M1h-F, cache por tile e threshold de saída.
- [x] Testes Node de seeds reais, ponte, saída (limiar 40 px), fora da trilha e não mutação.
- [x] Teste Chromium local/público para 360×800, 390×844 e 1280×800, incluindo integridade de saves.
- [x] [CI Node/Vite/Playwright — success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38984329094), com build e bundle experimental gerados.
- [x] Diff do bundle `phaser-demo-m1hf/` auditado, [PR seletiva #36 mesclada](https://github.com/pedromaintenance/peren-o-bruxo/pull/36), sem alterações no clássico/M1d.
- [ ] [QA no Pages público em execução](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38984333862): marcos, combate, Diário, resgate e offline.
- [ ] Android físico, Xbox e aprovação de legibilidade/arte pelo usuário.

**Regra:** não mesclar a PR #24 de fonte em `main`, nem alterar saves do clássico ou demo anterior.
