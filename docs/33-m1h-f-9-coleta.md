# M1h-F.9 — Coleta contextual na Floresta de Mürin

**Objetivo:** dar feedback durante a partida sobre quando um ingrediente está ao alcance do comando Colher. Aplicação exclusiva na prévia Phaser. **Publicado na main pela PR #35, com QA online ainda em validação.**

## Problema
`nearestResource()` em `world.js` já define o alvo de `collect()`: recurso não coletado mais próximo a menos de **57 pixels**. O botão de toque e os comandos de teclado/controle, porém, não indicam o momento exato em que a coleta está disponível; o jogador descobre por tentativa.

## Implementação
- `harvest-proximity.js` consulta `nearestResource()` sem alterar mundo, inventário ou saves.
- `ExplorationScene.updateHarvestCue()` atualiza apenas `registry.harvestCue`, volátil, quando o recurso disponível muda. Durante a animação de coleta o indicador some.
- O HUD M1h-F exibe **“Ao alcance: nome · quantidade”** ao lado do botão Colher. O botão recebe `aria-label` contextual e realce discreto; **nunca é desabilitado**, preservando o aviso que já aparece quando não há recursos.
- Coletar continua a executar a mesma transação de antes. Recursos longínquos ou já coletados não são revelados.
- O feedback não aparece no jogo clássico nem altera o M1d. Não há telemetria, nova regra ou transformação de save.

## Gates
- [x] Fonte e estilo responsivo implementados, escopados à M1h-F.
- [x] Testes Node para alcance exato de 57 px, alvo correto, recursos coletados e seeds reais.
- [x] Teste Chromium 360×800, 390×844 e 1280×800 criado para validar entrada/saída do alcance, rótulo acessível e saves.
- [x] [Rodada CI Node/Vite/Chromium — success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38967845101), inclusive alcance, três viewports e isolamento de save.
- [x] [Release PR #35](https://github.com/pedromaintenance/peren-o-bruxo/pull/35), bundle exclusivamente `phaser-demo-m1hf/` com diff revisado (JS/CSS hash, índice e cache offline).
- [ ] [QA público reexecutado após a release](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38967851147) — aguardar sucesso explícito antes de marcar site validado.
- [ ] Teste Android físico e Xbox físico com retorno do jogador.

**Nota:** valores mostrados são oriundos da mesma célula de recurso já presente na floresta; não há radar de recursos nem extensão de alcance.
