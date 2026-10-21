# M1h-F — Produção de criaturas de Mürin com arte CC0

> **Estado atual (15/10/2026):** os três monstros possuem atlas e retratos alternativos próprios na variante opcional `?art=m1hf`. Estes são **candidatos artísticos**, não sprites aprovados para substituir a versão principal. Toda a lógica e os saves permanecem isolados.

## Resultado e escopo

| Criatura | Origem visual real | Derivação (gerada em build) | Arte |
| --- | --- | --- | --- |
| Galho Infectado | **Forest Tiles**, OpenGameArt, CC0 | Recorte de vegetação, tronco e galhos articulados, raízes móveis, seiva corrompida, paleta de madeira morta | `art-m1hf/monsters/mob-galho-infectado/` |
| Fungo Violeta | **Platformer Art Mushrooms**, Kenney, CC0 | Cogumelos recoloridos em roxo, chapéu deformável, micélio locomotor, esporos e pequenos fungos simbióticos | `art-m1hf/monsters/mob-fungo-violeta/` |
| Ettercap | **Platformer Art Extended Enemies**, Kenney, CC0 | Poses reais de aranha retocadas como quitina escura, olhos múltiplos e efeitos de ataque, alerta, recuo e morte | `art-m1hf/monsters/mob-ettercap/` |

Cada atlas é `256×448` pixels, contendo **7 ações × 4 quadros de 64×64**, com arquivos `portrait.png` de `160×160`. Os quadros não são um único sprite estático duplicado; as ações diferem em silhueta, posicionamento dos membros, anatomia e/ou efeitos, sujeitos à revisão visual.

**Visualização:** executar `npm run dev` dentro de `phaser-lab/`, abrir `/?art=m1hf` para jogar e `/review.html?art=m1hf` para inspecionar as sete ações. A bancada `/asset-audition.html` continua apresentando as peças Kenney originais. A ausência do parâmetro de URL mantém o visual legado.

## Licenças e cadeias de origem

Não se presume licença livre por constar em `free-asset-gallery.md`. Todos os arquivos importados permanecem preservados *bit a bit* em `phaser-lab/public/art-m1hf/`; apenas os arquivos derivados sob `monsters/` são escritos pelos geradores.

### Kenney · Monster Builder Pack
- Fonte: https://kenney.nl/assets/monster-builder-pack
- Repositório de origem: https://github.com/Tiddybub/2d-assets/tree/main/characters/monster-builder-pack/PNG/Default
- Licença original: https://github.com/Tiddybub/2d-assets/blob/main/characters/monster-builder-pack/License.txt — **CC0 1.0**.
- Uso atual: **audição modular**, **não** faz parte dos atlas animados aprováveis nesta etapa.

| PNG | SHA-1 blob original |
| --- | --- |
| body_darkC.png | `cbfe79aab4363e10b6f19f059cf129b15d0913be` |
| arm_darkB.png | `526b5d232438d12f53bddcaeda522eac4a41d208` |
| leg_darkB.png | `4d261704b1a9de9e87621d90a30eee6cd39ec34c` |
| detail_dark_eye.png | `54a40680f85d92b0245a2573acb11293ca00d662` |

### Kenney · Platformer Art Extended Enemies
- Fonte: https://kenney.nl/assets/platformer-art-extended-enemies
- Repositório: https://github.com/Tiddybub/2d-assets/tree/main/characters/platformer-art-extended-enemies/Enemy%20sprites
- Licença original: https://github.com/Tiddybub/2d-assets/blob/main/characters/platformer-art-extended-enemies/license.txt — **CC0 1.0**, atribuição opcional.
- Uso: entrada do gerador `phaser-lab/scripts/murin-m1hf-generator.mjs` para o Ettercap.

| PNG | SHA-1 blob original |
| --- | --- |
| spider.png | `8f642f73726cfc4120a046e18000a46b458fb669` |
| spider_walk1.png | `040bc12457a0ebf979580a1f5dc596290ac6cf49` |
| spider_walk2.png | `510f636a6b192acb48d2fa50d42f72238e9afa68` |
| spider_hit.png | `25f5c6cadc9889905746963eb538e36ea494d4b4` |
| spider_dead.png | `9da75f4919b395582d3b7aa4944ac57bd47e898d` |

### Kenney · Platformer Art Mushrooms
- Fonte: https://kenney.nl/assets/platformer-art-mushrooms
- Repositório: https://github.com/Tiddybub/2d-assets/tree/main/tiles-terrain/platformer-art-mushrooms/PNG
- Licença original: https://github.com/Tiddybub/2d-assets/blob/main/tiles-terrain/platformer-art-mushrooms/license.txt — **CC0 1.0**, atribuição opcional.
- Uso: chapéus, corpo, textura de pintas e fungos menores transformados em Fungo Violeta.

| PNG | SHA-1 blob original |
| --- | --- |
| tallShroom_red.png | `964e0a540d0118aab66074f361b3de0e17dc5f19` |
| tinyShroom_red.png | `7ccc449144a85687020e77cf0fce023c7583fbfb` |
| stemShroom.png | `61c0c212881d480d2ca1b5928572a86879826157` |
| shroomRedMid.png | `5b1b79f27b8fc58f4478d9a316eef218a04d352d` |

### OpenGameArt · Forest Tiles
- Fonte original: https://opengameart.org/content/forest-tiles
- Repositório de referência: https://github.com/Tiddybub/2d-assets/tree/main/fantasy/oga-forest-tiles
- Licença declarada pelo pacote em `SOURCE.md`: **CC0 1.0**.
- Uso: fragmentos de árvore e cores naturais aplicados às animações do Galho Infectado.

| PNG | SHA-1 blob original |
| --- | --- |
| forest_tiles.png | `482b607bf1c16fc6271cc7bc4c0db048609bbd5e` |

## Geradores e testes

1. `scripts/sync-assets.mjs` copia a arte padrão sem alterá-la e executa as gerações opcionais, na ordem M1h-E, M1h-F Ettercap e M1h-F botânicos.
2. `scripts/murin-m1hf-generator.mjs` processa o Ettercap e inicia `report.json`.
3. `scripts/murin-m1hf-botanical-generator.mjs` substitui os dois fallbacks por atlas autorais derivados de CC0, registra as três espécies em `report.json` e registra contagem de poses únicas.
4. `tests/m1hf-assets.test.mjs` verifica dimensões, pixels visíveis, no mínimo três poses distintas por ação, origem CC0 presente e código de saves intacto.
5. `scripts/m1hf-browser-check.mjs` verifica o Phaser real no navegador, carregamento dos três atlas e prévias na galeria em **390×844** e **1280×800**.
6. Workflow `.github/workflows/phaser-m1hf.yml` executa `npm test`, `npm run build` e Chromium, guardando capturas para julgamento artístico.

## Limitações e aceite

As fontes originais incluem estética de plataforma e folhas não infectadas; as adaptações M1h-F são uma **candidatura de estilo**, não um aceite de qualidade. Aprová-las requer inspeção humana da silhueta e quadros de *attack*, *hurt* e *death*, escala real em Android e legibilidade no cenário de Mürin. Em especial, Galho Infectado e Fungo Violeta precisam ser avaliados como criaturas ominosas, não simples decorações botânicas.

**Não alterar regras, IA, catálogo de monstros, inventário nem saves. Não realizar merge automático.** `main` continua usando sua arte existente. PR #24 é incremental em cima da PR #23 (M1h-E).
