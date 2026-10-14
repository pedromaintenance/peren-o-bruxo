# Controles Xbox — contrato de interação do Peren Phaser

**Status:** implementação funcional na branch `feature/phaser-movimento`, PR #2 (somente laboratório M1a). Não modifica a `main` ou o PWA clássico. Requer Gamepad API do navegador; dispositivos com mapeamento de botões não padrão precisam de validação própria.

## Mapeamento inicial — exploração M1a

| Entrada Xbox | Ação | Contexto |
|---|---|---|
| Analógico esquerdo / direcional | Mover Peren de forma analógica / 8 direções | Exploração |
| RT, RB, L3 pressionado | Correr enquanto segurado | Exploração |
| A ou X | Colher / interagir com recurso próximo | Exploração |
| Y ou View | Mostrar/ocultar bolsa da expedição | Exploração |
| B | Voltar ao menu Portomonte; fechar bolsa | Exploração |
| Menu (☰) | Pausar/voltar ao menu Portomonte | Exploração |
| Direcional / analógico cima-baixo | Selecionar uma ação no menu | Cidade |
| A | Confirmar botão selecionado | Cidade |
| B ou Menu | Retomar expedição anterior (se já iniciada) | Cidade |

Teclado e controles touch **continuam funcionando**. A preferência de dispositivo se dá pelo comando presente; o movimento combinado é normalizado para evitar diagonais mais rápidas. Zona morta radial de 20%, com reescalonamento progressivo e normalização. Ao desconectar, a velocidade de movimento solicitada pelo controle zera na próxima atualização. Não gravar informações de pareamento no save.

## Mapeamento planejado — combate Phaser (M1c/M2, ainda não implementado)

- Direcional/analógico: navegar entre **Atacar, Defender, Magias, Itens, Relíquia, Recuar**, percorrer páginas e selecionar alvos.
- A: confirmar; B: voltar um nível no menu sem consumir turno; X: detalhes do alvo ou da magia; Y: informações do grupo/estado.
- LB/RB: mudar alvo, página ou grupo de ações; Menu: pausa; View: diário/mapa quando aplicável.
- Comando é processado **uma vez** por acionamento (edge-trigger) para evitar gasto duplo de poção ou turno; durante animações, rejeitar comandos sem gerar XP/loot repetidos.
- Manter todas as ações acionáveis por teclado e toque, sem uso obrigatório de controle.

## Aceite e testes

1. `node --test phaser-lab/tests/gamepad.test.mjs`: deadzone, diagonal, d-pad, eixo, corrida, troca/desconexão de controle e botões pressionados uma vez.
2. `npm run test:e2e`: mock da API nativa em Chromium nas dimensões 390×844; botão A entra na floresta, analógico movimenta, RT corre, A colhe, Y abre bolsa, B fecha, Menu pausa e B retoma. 360px preserva cenários de teclado e touch.
3. Controle físico Xbox via USB e Bluetooth em Windows/Android: **pendente de teste manual**. Browsers podem exigir gesto em botão físico antes de expor `navigator.getGamepads()`.
4. Testar foco de navegador, desconexão durante caminhada e reconexão em próximas iterações; não marcar "validado fisicamente" com testes de mock.
