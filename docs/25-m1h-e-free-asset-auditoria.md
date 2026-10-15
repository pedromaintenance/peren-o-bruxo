# M1h-E — Curadoria Free Asset Gallery (15/10/2026)

## Origem da decisão
O criador pediu aproveitar a `free-asset-gallery.md` já existente na `main`, em vez de depender apenas de pixels gerados proceduralmente. A galeria é um **catálogo**, não um diretório de assets já aprovados.

## Bibliotecas prioritárias verificadas
1. [Tiddybub/2d-assets](https://github.com/Tiddybub/2d-assets) — repositório com bibliotecas por categoria `fantasy/`, `characters/`, `nature/`, `effects/` e `ui/`. O mantenedor declara CC0 e mantém `SOURCE.md` por pacote; registrar e checar a fonte original dos candidatos.
2. [Monster Builder Pack](https://github.com/Tiddybub/2d-assets/tree/main/characters/monster-builder-pack) — partes individuais de monstro (cabeças/corpos/braços), **material modular**; não importar como animação acabada de Ettercap.
3. [shorepine/kenney](https://github.com/shorepine/kenney) — coleções Kenney de interface e ícones, geralmente adequadas a itens e UI. Confirmar licença/pacote.
4. [eturner58/game-assets](https://github.com/eturner58/game-assets) — catálogo de descoberta; não copiar conteúdo sem localizar origem e licença.

## Ordem prática de seleção
- **Fungo Violeta**: buscar sprites com chapéus de fungo, esporos e micélio, avaliar top-down e identidade de silhouette.
- **Galho Infectado**: selecionar galhos, troncos e raízes com leitura orgânica; combinar peças em atlas autoral.
- **Ettercap**: buscar anatomia aracnídea modular e animação de caçador; não transformar um ícone estático em 28 frames idênticos.
- **Inventário**: começar com Kenney, pois itens estáticos pedem adaptação menor que mobs animados.

## Critérios técnicos e de direitos
Para cada arquivo selecionado, registrar URL permanente, nome do pacote, autor, licença original, atribuição, dimensões, paleta, arquivo derivado e transformações. Não considerar que o nome `free-asset` ou a existência no GitHub autoriza uso. Não importar milhares de arquivos: só candidatos que passem por avaliação visual, licença e compatibilidade com atlas Phaser (`64×64`, 7 ações × 4 quadros para monstros).

A versão `?art=m1he` existente é **tratamento cromático procedural preliminar**, não integração de um pack externo. A integração efetiva dos assets selecionados requer sua avaliação visual. Manter PR em rascunho, `main` inalterada e testes de regressão.
