# M1g-E — HUD, Encontros e Batalha (UI Premium)

**Branch:** `feature/phaser-m1g-e-hud-combate`, sobre M1g-D. Nenhum merge na `main`.

## Escopo entregue

1. **Expedição:** o HUD agora contém retrato de Peren, título Floresta de Mürin, dia, nível, ouro, PV/PM com barras sem valores inventados, clima, aviso de ameaça, feedback de coleta e quantidade realmente coletada. As áreas touch do joystick e dos botões `gatherBtn`, `sprintBtn` e `returnBtn` mantêm eventos existentes. O HUD usa somente o modelo puro `expeditionViewModel()` derivado de `bridge.state` e `app.registry`.
2. **Encontro:** janela com retrato já fornecido pelos atlas de monstros do M1e, nome, classificação vinculada aos três IDs conhecidos de Mürin, lore já existente e decisões `observeBeast` (enfrentar) e `retreatBeast` (recuar). Sem adicionar a ação fictícia `Observar`.
3. **Combate:** painel JRPG com header, nome e barra de PV do monstro, PV/PM de Peren, quantidade de poções, rodada e log. Botões preservam todos os identificadores `data-battle` do M1c: `attack`, `defend`, `potion`, `flee`, `spell:mag-raio-de-fogo`, `spell:mag-raio-de-gelo`, `spell:mag-misseis-magicos`. Os nomes/custos das magias vêm de `SPELLS`, não de uma nova tabela fictícia.
4. **Componentes reutilizados:** `ui-theme.css` fornece fonte, cores, foco e contornos; `ui-adventure.css` controla apenas layout/estilo da expedição, encontro e batalha. `ui-adventure.js` é puro/sem transações.
5. **Resolução de combate:** continua gerenciada por `BattleScene.takeTurn()` e `BattleScene.endBattle()`, com bloqueio das ações durante `busy` e liquidação por `bridge.finishBattle()`. Nenhuma alteração do motor de monstros/dano/loot.

## Navegação

- **Toque:** joystick e botões com hitboxes funcionais; opções grandes; ações touch sem bloquear o mapa.
- **Teclado:** WASD/setas exploração, E coleta, Esc menu, Enter e atalhos 1–5 combate; setas navegam.
- **Xbox:** D-pad ou analógico movimenta; A coleta/seleciona; B recua/foge e confirma saída da batalha; X poção; Y fogo. Comportamentos originais preservados. Os estados ocupados de combate não aceitam novas ações.

## Testes e limites

- `phaser-lab/tests/ui-adventure.test.mjs` valida dados e percentuais de HUD, estados de combate, catálogo de magias e marcadores DOM.
- `phaser-lab/scripts/adventure-browser.mjs` gera 9 capturas reais de exploração/encontro/combate em 360×800, 390×844 e 1280×800; valida barras, arte, fuga sem recompensa e save clássico intocado.
- `.github/workflows/phaser-m1g-e.yml` roda Node, Vite, PWA, Chromium e regressões de Portomonte, Inventário, Alquimia, Comércio, coleta, batalha, Xbox simulado e persistência.
- **CI funcional aprovado:** [workflow #38629438749](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38629438749), incluindo capturas mobile/desktop e regressões da vertical slice. **Pendente:** aprovação artística das capturas, Android e Xbox físicos, troca de sprites provisórios do M1e. Teste funcional não implica equivalência visual com os conceitos.
- **Proibido:** alterar o save clássico `peren_carcaca_save_v1`, criar golpes/magias/recompensas fictícias ou publicar automaticamente na `main`.

## Próxima etapa

**M1g-F — Aceite da vertical slice visual:** testar o ciclo completo, validar composição e responsividade contra os conceitos aprovados, fazer uma rodada de polimento e playtests físicos. Depois segue a etapa de sprites finais M1h.
