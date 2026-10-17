# M1h-F.12 — Impacto e dano legível no HUD de combate

**Objetivo:** tornar imediatamente visíveis as mudanças reais de PV durante a batalha, sem reformular o motor de combate.

## Contexto e desenho
`battle-scene.js` já apresenta dano flutuante sobre sprites, animações de ataque e barras atualizadas por `renderBattleState()`. A melhoria acrescenta **−X PV** e **+X PV** junto às barras de vida do inimigo e de Peren (somente na prévia M1h-F) para que o impacto possa ser lido no celular.

- `battle-impact.js` compara dois snapshots públicos com **mesma `key` de encontro**; detecta somente diferença entre PV anteriores e PV atuais. Não calcula dano, resistência, acerto ou probabilidade.
- O componente DOM usa `aria-live="off"` para não duplicar a narração acessível do Diário de Combate existente. Temporizador de 1 s e animação CSS breve, sem alteração da cena Phaser.
- `prefers-reduced-motion` desativa o movimento, preservando números visíveis por 1 s.
- Ao encerrar batalha ou iniciar uma com nova chave, limpa o indicador. Sem gravação, novas flags de progresso, rewards ou alteração no motor.
- Todos os botões, controle Xbox, saves clássico e M1d permanecem intactos.

## Gates
- [x] Código-fonte e DOM/CSS exclusivamente na prévia implementados.
- [x] Testes Node da diferença de vida, cura, mudança de encontro e integridade dos snapshots.
- [x] Teste Chromium 360×800, 390×844, 1280×800 com impactos, cura, layout e saves isolados.
- [ ] CI Node/Vite/Playwright aprovada e bundle separado gerado.
- [ ] Diff auditado e release PR limitada a `phaser-demo-m1hf/`.
- [ ] QA público: impactos, 6 vitórias, resiliência, Diário, PWA offline e resgate.
- [ ] Avaliação Android e Xbox físicos e contraste real no mobile.
