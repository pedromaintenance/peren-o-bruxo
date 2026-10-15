# M1i-A — Galho Infectado: primeira criatura sombria de Mürin

**Base:** M1h-E (PR #21). **Branch:** `feature/phaser-m1i-a-galho-infectado`. **Estado:** candidata artística, não aprovada para publicação.

## Diagnóstico do original

Mürin já possui três monstros reais, identificados em `src/encounters.js`: **Galho Infectado** (`mob-galho-infectado`), **Fungo Violeta** (`mob-fungo-violeta`) e **Ettercap** (`mob-ettercap`). Todos possuem atlas de **256×448 pixels (4×7 quadros de 64×64)**, um retrato de 160×160 e sete animações: `idle`, `walk`, `alert`, `attack`, `hurt`, `retreat`, `death`.

Os sprites originais são pequenos e ainda estão marcados como `em_producao`. Antes de redesenhar todas as criaturas, devemos testar uma direção coesa em **uma só espécie**, sem alterar a jogabilidade.

## Entrega M1i-A

O script `scripts/galho-m1i-generator.mjs` desenha **28 quadros novos**, com silhueta de ramos partidos, raízes retorcidas, casca oca, musgo, madeira apodrecida, resina carmesim e olhos profundos. Também cria retrato próprio em 160×160. Todas as ações mantêm **os mesmos IDs, dimensões e ordem de quadros**. O desenho de resina carmesim é uma decisão de *arte*, **não implica nova condição, ataque, magia ou detalhe canônico do monstro**.

Arquivos gerados separadamente em `public/art-m1i/monsters/mob-galho-infectado/`:
- `atlas.png` — 256×448, 28 quadros de 64×64;
- `portrait.png` — 160×160;
- `report.json` — declaração de estado `em_producao`.

A prévia é ativada somente com `?monsters=m1i`; sem o parâmetro, a sprite e o retrato originais continuam inalterados. O ateliê `review.html?monsters=m1i` oferece seletor M1e/M1i-A apenas para o **Galho Infectado**; Fungo Violeta e Ettercap não mudam.

## Integridade funcional

- `src/encounters.js`, `src/combat.js` e `src/progress.js` continuam intocados.
- Não acrescentar criaturas, golpes, recompensas, XP, ouro, drops ou condições fictícias.
- `npm test` verifica estrutura 4×7, 28 quadros não vazios, diferenças reais, dimensões do retrato e parâmetros opcionais.
- `node scripts/m1i-galho-preview.mjs` gera prancha 960×670: retrato antigo x novo e sete ações originais x novas.
- `node scripts/m1i-galho-browser.mjs` valida atlas realmente requisitado pelo Phaser, retrato do encontro, batalha, fuga sem recompensa e save clássico inalterado em 360×800, 390×844 e 1280×800.
- CI dedicado repete regressão da vertical slice, 35 capturas, PWA e movimentação/Xbox simulado.

## Critérios de revisão artística

- [ ] Ver a prancha real e a criatura no contexto sombrio da Floresta de Mürin.
- [ ] Verificar leitura das sete ações em escala 2× e mobile real.
- [ ] Confirmar que casca oca, garras de raízes e brilho de corrupção não parecem símbolos ou equipamentos falsos.
- [ ] Aprovar ou pedir ajuste do Galho **antes de usar a direção artística nos outros dois monstros**.
- [ ] Testar Android e Xbox físicos e autorizar explicitamente qualquer merge.

Não transformar CI funcional em declaração de arte definitiva.
