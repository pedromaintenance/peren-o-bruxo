# M1h-F.15 — Laboratório de Controles (Teste de Campo)

Ações em um controle real precisam de QA humano no Android, PC e Xbox. A bancada `teste.html` agora incorpora um leitor **voluntário**, sem telemetria, usando `readXboxPad()` — o mesmo adaptador puro do jogo.

## Entrega
- Conexão/desconexão detectada via Gamepad API. É necessário pressionar algum botão para o navegador autorizar o dispositivo.
- Direcional/analógico com deadzone real do adaptador, estado de corrida RT/RB/L3 e estados dos botões A/B/X/Y, direções, Menu e View.
- Indicador de `mapping=standard` ou alerta para controles com mapeamento não padrão. Mostra o ID localmente, não o exporta.
- Inteiramente na Bancada de Teste `teste.html`: não lê nem modifica save, não transmite ou guarda telemetria, não introduz comandos ou gameplay novo.
- `prepare-demo.mjs` copia o adaptador e o laboratório para a mesma pasta isolada; service worker da M1h-F os inclui automaticamente.
- Checklist continua manual; nenhum teste de hardware pode ser considerado aprovado apenas pela simulação Chromium.

## Aceite
- [x] Interface, script, cópia do adaptador e regressões Node e Playwright implementadas na fonte.
- [x] CI Node/Vite/Chromium do pacote [aprovado (success)](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/39033132391).
- [x] Release isolada [PR #41](https://github.com/pedromaintenance/peren-o-bruxo/pull/41) mesclada: apenas `phaser-demo-m1hf/`.
- [x] [QA público completo (success)](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/39033495855): A/RT/analógico/desconexão simulados, três viewports, seis vitórias, resiliência, Diário, PWA offline e saves separados.
- [ ] Teste físico de Android e Xbox: **pendente de pessoa e dispositivo reais**.

**Segurança:** jamais substitua o teste físico pelo resultado do gamepad simulado em Chromium. A página mantém o relatório Markdown sob ação explícita do usuário.
