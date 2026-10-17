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
- [ ] CI Node/Vite/Chromium do pacote aprovado.
- [ ] Release contendo somente arquivos de `phaser-demo-m1hf/` aprovada e mesclada.
- [ ] QA público após deploy incluindo readout de A/RT/analógico/desconexão, saves e PWA offline.
- [ ] Teste físico de Android e Xbox: **pendente de pessoa e dispositivo reais**.

**Segurança:** jamais substitua o teste físico pelo resultado do gamepad simulado em Chromium. A página mantém o relatório Markdown sob ação explícita do usuário.
