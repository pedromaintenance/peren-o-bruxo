# M1h-F — Primeira importação real CC0 (Kenney)
Data: 15/10/2026

## Escopo entregue
Quatro PNGs originais do **Monster Builder Pack**, autor Kenney, importados como arquivos binários do repositório `Tiddybub/2d-assets`. A página `phaser-lab/asset-audition.html` apresenta peças individuais e montagem visual experimental, com controle de escala. O processo não reescreve sprites nem salva estado.

## Proveniência
- Pack: https://kenney.nl/assets/monster-builder-pack
- Espelho: https://github.com/Tiddybub/2d-assets/tree/main/characters/monster-builder-pack/PNG/Default
- Licença original: https://github.com/Tiddybub/2d-assets/blob/main/characters/monster-builder-pack/License.txt
- Autor: Kenney
- Licença: **CC0 1.0** (uso comercial e alterações autorizados; crédito opcional).
- Transformações realizadas nos quatro PNG: **nenhuma**. A composição CSS é somente visual.

| Arquivo importado | SHA-1 do blob Git de origem | Uso |
| --- | --- | --- |
| body_darkC.png | `cbfe79aab4363e10b6f19f059cf129b15d0913be` | candidato de tronco |
| arm_darkB.png | `526b5d232438d12f53bddcaeda522eac4a41d208` | candidato de membro superior |
| leg_darkB.png | `4d261704b1a9de9e87621d90a30eee6cd39ec34c` | candidato de membro inferior |
| detail_dark_eye.png | `54a40680f85d92b0245a2573acb11293ca00d662` | candidato de detalhe |

## Limites da entrega
Este material **ainda não substitui** os três monstros do Phaser. Não são 28 quadros animados; reutilizar quadros idênticos para forjar animação seria um retrocesso. O teste é um passo verificável na seleção real de fontes gratuitas, destinado sobretudo à anatomia modular de criaturas como o Ettercap. Fungo Violeta e Galho Infectado continuam aguardando seleção apropriada.

## Próximas verificações
1. Validar composição em telas pequenas no navegador e conferir impacto estético frente à M1h-E.
2. Avaliar arte modular orgânica própria para Galho Infectado e Fungo Violeta.
3. Criar atlas animados autorais de 256×448 por monstro, testar as sete ações e quatro quadros genuínos, só então implementar `?art=m1hf` no gameplay.
4. Preservar `main`, saves, combates e variante `?art=m1he` até aceite.

## M1h-F · Segundo incremento jogável

Foi selecionado um pacote de origem 2D mais apropriado à animação da espécie **Ettercap** do que a anatomia modular do Monster Builder Pack: **Platformer Art Extended Enemies**, também da Kenney.

- Fonte oficial: https://kenney.nl/assets/platformer-art-extended-enemies
- Espelho consultado: https://github.com/Tiddybub/2d-assets/tree/main/characters/platformer-art-extended-enemies/Enemy%20sprites
- Licença: CC0 1.0, conforme `SOURCE.md` e `license.txt` do pacote.
- Assets importados: `spider.png`, `spider_walk1.png`, `spider_walk2.png`, `spider_hit.png`, `spider_dead.png`; originais preservados em `phaser-lab/public/art-m1hf/kenney-platformer-spider/`.
- Derivação: `phaser-lab/scripts/murin-m1hf-generator.mjs`, que adapta a geometria das poses à paleta quitinosa escura, conserva a transparência, introduz múltiplos olhos, acentos de ação e cria o atlas `256×448`, sete ações × quatro quadros (poses diferentes).
- Retrato correspondente gerado em `160×160`, mantendo moldura circular e silhueta araneiforme.
- Outros dois inimigos: **fallback idêntico à M1h-E**, para evitar fingir que seus visuais já foram produzidos.
- Opt-in: **`?art=m1hf`** no Phaser; **`review.html?art=m1hf`** no ateliê.
- Arte ainda candidata: requer julgamento estético humano e teste em aparelho real. Não afeta nenhuma regra, IA, inventário ou save.

### Blobs de origem verificados

| Asset | SHA do PNG original |
| --- | --- |
| spider.png | `8f642f73726cfc4120a046e18000a46b458fb669` |
| spider_walk1.png | `040bc12457a0ebf979580a1f5dc596290ac6cf49` |
| spider_walk2.png | `510f636a6b192acb48d2fa50d42f72238e9afa68` |
| spider_hit.png | `25f5c6cadc9889905746963eb538e36ea494d4b4` |
| spider_dead.png | `9da75f4919b395582d3b7aa4944ac57bd47e898d` |

### Gate de publicação

Executar `npm install && npm test && npm run build` dentro de `phaser-lab`; confirmar que `dist/art-m1hf/monsters/mob-ettercap/atlas.png`, `portrait.png` e `report.json` estão presentes. Inspecionar quadros de ataque, dano e morte lado a lado na galeria; comparar `?art=m1he` e `?art=m1hf`.
