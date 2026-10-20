# F.19 — Passos Silenciosos (mecânica de furtividade)

A Floresta de Mürin agora oferece **uma escolha tática real**: movimento lento em troca de menor alcance de percepção dos inimigos.

- Teclado: mantenha **C** pressionado. Xbox: mantenha **LT** pressionado. Celular: botão **◈ DISCRETO** alterna a postura.
- A velocidade na floresta passa de 135 para 82 unidades/s; solo úmido continua impondo o multiplicador de 0,78. O alcance base da visão dos monstros recebe modificador de **−1,35 tiles** durante a postura.
- Corrida sempre prevalece sobre a furtividade (205 unidades/s, percepção ruidosa); corrida por toque desliga o toggle de furtividade.
- Monstros continuam percebendo criaturas muito próximas e atrás de cobertura conforme as regras já existentes; não há invisibilidade, ataque furtivo, XP, magias, stamina, novas recompensas ou persistência.
- `monsterDecision` continua puro e recebe um argumento opcional `sneak`; as chamadas existentes com defaults preservam o mesmo comportamento. Somente o jogo experimental M1h-F ativa a mecânica; demos/classic não mudam.
- Estado do HUD e novo botão acessível; leituras da discrição permanecem na memória. LT funciona com a API Gamepad padrão.

## Testes
- [x] Testes Node: detecção e prioridade da corrida, controle LT, velocidade, status do ambiente e não-mutação das regras originais.
- [x] Chromium criado: 360×800, 390×844 e 1280×800, clique do botão, velocidade real, prioridade corrida, saves isolados.
- [x] [CI completo Node/Vite/Chromium aprovado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/39346802332). A primeira execução identificou sincronização incorreta no teste do HUD; corrigido antes da aprovação.
- [x] [PR #45](https://github.com/pedromaintenance/peren-o-bruxo/pull/45) mesclada exclusivamente em `phaser-demo-m1hf/`; [QA público completo: success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/39347684596), incluindo controles, furtividade, seis vitórias, Diário, PWA e saves.
- [ ] Teste humano Xbox real, Android físico e balanço da perseguição.
