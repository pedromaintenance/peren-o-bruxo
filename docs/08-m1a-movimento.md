# M1a — Primeira expedição animada (entrega incremental)

**Escopo desta PR:** dar a Peren corpo e animação, e a Mürin um primeiro mapa de exploração contínua; não marcar M1 completo. Branch derivada de `feature/phaser-fundacao` enquanto a PR #1 estiver em rascunho. Target de integração: `feature/phaser-fundacao` (PR empilhada), depois `phaser/develop`, não `main`.

## Entregas verificáveis

- Sprite original 48×64 de Peren com 128 frames e 32 clips (quatro direções, oito ações): idle, walk, run, interact, gather, hurt, cast, attack. Atlas e metadados JSON ficam em `phaser/assets/characters/peren`.
- Tileset de floresta 8×32 px, árvores com colisão de tronco, pedras, ervas, fungos, marco de saída e detalhe mágico — arquivos autorais em `phaser/assets/regions/floresta-murin`.
- Exploração Phaser 3 `phaser-lab/src/exploration.js`: controle móvel/teclado, aceleração, corpo Arcade, depth ordenado por Y, câmera suave, cenário por seed, coleta com animação e feedback de HUD.
- Hub Portomonte como HTML leve para voltar ao mapa. O PWA original e o save `peren_carcaca_save_v1` permanecem **completamente isolados**.
- `phaser-lab/src/world.js` é lógica pura, com mapa alcançável e recursos ligados aos IDs de `itens.json`; 86 testes de seed/rota/colheita.
- `npm run build` inclui Phaser no pacote e copia imagens do catálogo de arte automaticamente, sem CDN em tempo de jogo.

## QA obrigatório antes da integração

1. `npm test`: seeds, saída alcançável, coleta. **Executado localmente: 86/86.**
2. `node --check` em `src/*.js` e `scripts/*.mjs`: **executado localmente**.
3. `npm run build` num ambiente com registry npm disponível: **verificação remota em CI; não executável no container sem DNS externo**.
4. Captura de tela real desktop/touch e console limpo no navegador: **pendente de CI Playwright/validação manual**.
5. Android físico: resposta de joystick, FPS, legibilidade, offline após install: **pendente**.
6. Revisão da silhueta, escala e direção de arte de Peren pelo usuário: **pendente**.

## Não afirmamos ainda

- Não há monstros animados, encontros, dano, batalha JRPG, recompensas persistentes nem economia integrada na M1a.
- Não editar `game.js`, `index.html`, `data/*.json`, `style.css`, `sw.js` da versão clássica.
- Não mudar status de arte para `aprovado` antes da inspeção visual, QA mobile e aprovação.

## Próxima PR M1b

Confirmar arte/escala e fechar a exploração: 3 monstros exclusivos de Mürin, patrulha, interações ambientais de Ironwood e preparação da transição segura para combate. Conectar o inventário ao núcleo econômico depois de isolá-lo em funções testáveis.