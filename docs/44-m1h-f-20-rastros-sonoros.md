# M1h-F.20 — Rastros Sonoros

## Problema
A F.19 introduziu a escolha entre andar discretamente ou correr, mas a corrida só aumentava o alcance da **visão** dos monstros. Atrás de árvores, ruínas ou outros obstáculos, um personagem correndo permanecia inaudível.

## Implementação
- Corrida **com deslocamento real** (velocidade acima de 40 unidades/s) emite passos audíveis em até **3,25 tiles**. Segurar SHIFT, RT ou o botão de corrida sem andar não faz ruído.
- A criatura capaz de ouvir mas sem linha de visão muda para **investigação** e se dirige à última posição ouvida. Interromper a corrida evita novos estímulos, mas **não apaga a investigação** que já começou.
- A visão continua a ter prioridade: se o monstro vê Peren, persegue como antes. **Ouvir sem ver jamais dispara combate**, e o cooldown após recuo impede a nova perseguição enquanto durar.
- O painel existente de discrição mostra **BARULHO NA MATA** quando uma ou mais criaturas investigam o som, sem confundir audição com detecção visual.
- Mecânica ativada **somente no Phaser M1h-F**: motor puro `monsterDecision` recebe opção `noise` com padrão `false`; versões antigas preservam regras. Nenhuma escrita em save, recompensas, XP, inventário ou economia.

## Testes
- [x] Node: parede bloqueia visão, corrida audível causa investigação, som por si só não causa encontro, cooldown e detecção visual prevalecem, investigação termina ao chegar no destino.
- [x] Smoke Chromium em 360×800, 390×844 e 1280×800 criado: monstro real atrás de parede, corrida real, silêncio posterior, HUD, ausência de combate e integridade dos saves.
- [x] [CI completo Node/Vite/Chromium candidato aprovado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/39349599574).
- [x] [PR #46](https://github.com/pedromaintenance/peren-o-bruxo/pull/46) mesclada: somente o bundle JS, índice e cache offline em `phaser-demo-m1hf/`.
- [x] [QA público completo: success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/39350150632): investigação sonora atrás de obstáculos, seis vitórias, resiliência, Diário, PWA offline e saves.
- [ ] Balanceamento e Android/Xbox físicos: playtest humano pendente.
