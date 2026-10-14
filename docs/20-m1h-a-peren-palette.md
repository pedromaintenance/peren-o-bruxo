# M1h-A — Primeiro passe de identidade visual de Peren

## Contrato e status

- **Estado:** `em_producao` — paleta e comparação jogável, ainda sem aprovação artística.
- **Branch:** `feature/phaser-m1h-a-peren-palette`, empilhada sobre a auditoria M1g-F.
- **Base:** **atlas M1e real**: 128 quadros PNG de 48×64, 4 direções × 8 ações × 4 quadros. Também existem retratos normal/conjurando/ferido. Não modificar o original, a geometria de colisão, o posicionamento do sprite ou os IDs de animação.
- **Personagem canônico:** Peren é um bruxo velho e austero, de cabelo e barba prateados, manto grafite, sem chapéu pontudo. Cores do M1e que destoam dessa identidade devem ser corrigidas antes de qualquer aprovação.

## Entregue

O script `phaser-lab/scripts/peren-m1h-generator.mjs`, usando `pngjs`, gera em `phaser-lab/public/art-m1h/characters/peren/`:
- `peren-atlas.png` — 1.536×256 px, preservando exatos 128 frames de 48×64.
- `portrait.png`, `portrait-cast.png`, `portrait-hurt.png` — mesmos tamanhos e canal alfa do original.
- `report.json` — todas as mudanças de paleta, contagem de pixels e etapa artística.

A paleta substitui tons roxos avermelhados da roupa por grafite/azul-petróleo; cabelo e barba escuros por prata/cinza-claro; dourado saturado por ouro velho; parte do brilho mágico roxo por azul luminoso.

O pipeline `scripts/sync-assets.mjs` continua copiando **o original M1e** e só depois gera a segunda variante, que fica em diretório independente. Compilações e testes geram os assets automaticamente. `npm test` também executa a sincronização.

## Como comparar

No ateliê de sprites `review.html`, a opção **Versão da arte de Peren** alterna M1e e M1h-A e permite visualizar cada direção, ação, os quatro frames e três retratos.

No jogo Phaser, o parâmetro `?art=m1h` ativa a variante. Sem esse parâmetro, o jogo usa exatamente o atlas e retratos M1e anteriores. Por exemplo, ao publicar uma prévia na rota `phaser-demo/`, `phaser-demo/?art=m1h` carrega Peren alternativo apenas naquela página. Isso não escreve em nenhuma chave de save.

A variante da exploração e do combate usa o mesmo atlas Phaser; o retrato do HUD e do inventário é alternado de forma coerente. Não é necessário modificar mecânicas de batalha.

## QA

- Testes PNG: dimensões, opacidade de cada pixel preservada, pixels recoloridos, arquivos separados, base de 128 quadros.
- Testes Chromium: M1e e M1h-A em 360×800, 390×844 e 1280×800, carregamento dos retratos, textura real no Phaser, galeria e save clássico preservado.
- Auditoria anterior: regressões de 35 capturas, conteúdo offline e fluxo de movimentação/combate com controle simulado.
- Capturas comparativas no artifact `peren-m1h-a-comparacao`.

## Critérios ainda pendentes para *arte definitiva*

**M1h-A ainda é uma recoloração**, não uma reconstrução da silhueta. Em especial:
- Remover todos os resquícios do antigo chapéu (sem cortar animações, cabelos ou equipamentos).
- Refinar barba, expressão facial madura e cabelo grisalho quadro a quadro, incluindo vistas laterais/costas.
- Aprovar silhueta/pose em todas as 32 animações a 2× e 3×, no celular e Xbox físico.
- Substituir os retratos provisórios por retratos verdadeiramente detalhados e consistentes com o sprite.
- Nenhum ícone ou cena ilustrativa achatada foi inserido como recurso jogável.

**Próximo passo: M1h-B — reconstrução da silhueta e retratos canônicos**, mediante inspeção do atlas real no ateliê. Só depois será possível propor sua adoção como arte padrão.
