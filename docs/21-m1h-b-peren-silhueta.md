# M1h-B — Peren sem chapéu: silhueta e expressão

**Estado:** candidata artística em revisão, branch `feature/phaser-m1h-b-peren-silhueta` baseada em M1h-A (PR #17).

## Identidade do personagem

- Peren é um **bruxo mais velho, austero**, com **cabelos e barba prateados**, manto grafite, sem chapéu pontudo. Não canonizar retratos jovens/de cabelo preto ou personagens de outros conceitos.
- A arte anterior M1e está preservada em `public/art/`; a M1h-A, recoloração não destrutiva, fica em `public/art-m1h/`.
- **M1h-B** fica em `public/art-m1hb/`. Não altera o save, as animações, o combate ou os dados do jogo.

## Implementação

1. O script `scripts/peren-m1hb-generator.mjs` usa PNGJS para **redesenhar a cabeça sem chapéu nos 128 quadros**, nas 4 direções e 8 ações. O corpo abaixo da linha 43 de cada quadro de 48×64 permanece pixel a pixel idêntico à M1h-A (posição, cajado, botas, animações).
2. As vistas frontal/lateral/costas têm cabelos em camadas e pontas assimétricas, e as vistas frontal/lateral exibem sobrancelhas carregadas, expressão austera e barba cheia.
3. O mesmo script gera três retratos 256×256: normal, conjurando e ferido; não é apenas recoloração da silhueta do chapéu.
4. A rotina `sync-assets.mjs` gera as três variantes em sequência, sem editar os originais. `npm test` sincroniza os assets antes de validar.
5. A demonstração aceita `?art=m1hb` para habilitar apenas a nova aparência, além de `?art=m1h` (recoloração anterior) e padrão M1e. `review.html` permite alternar entre as três e percorrer **todas as 32 animações**.
6. `scripts/peren-m1hb-preview.mjs` monta a prancha `m1h-b-contact-sheet.png` com retrato M1h-A, retrato M1h-B, conjuração M1h-B e as quatro direções do novo sprite para revisão real.

## Primeiro resultado de QA

- [CI funcional aprovado #38646248645](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38646248645): build, PNG de 128 quadros, 3 retratos, 3 modos em navegador, 35 capturas antigas, viagem/combate e Xbox simulado. O artifact **`peren-m1h-b-silhueta`** contém a prancha e capturas.
- A prancha real foi examinada: **M1h-B elimina o chapéu perceptível**, preserva o cajado e apresenta cabelo claro e barba legíveis nos quatro ângulos. A imagem comparativa também mostra que a nova massa de cabelo ainda pode precisar de suavização e o rosto do retrato de mais marcas de idade; esses refinamentos são um trabalho artístico posterior, não uma falha mecânica.
- **Aceite artístico ainda pendente**; teste automatizado não substitui avaliação do jogador ou hardware real.

## QA e limites

- Testes PNG validam estrutura dos 128 quadros, modificações na região da cabeça, integridade total do corpo abaixo da linha 43, dimensões dos três retratos, isolamento dos motores e saves.
- Chromium compara as três versões em 360×800, 390×844 e 1280×800 durante Portomonte, floresta, encontro e batalha, além de examinar todas as animações no ateliê.
- Testes históricos: PWA e offline, auditoria de 35 telas, Xbox simulado, movimento, coleta, combate, economia e save clássico inalterado.
- Prints e prancha ficam no artifact `peren-m1h-b-silhueta`, com relatório JSON das dimensões e alterações.

**Não declarar "arte definitiva" sem inspecionar capturas e receber aprovação estética.** O redesenho pixel a pixel foi gerado de maneira procedural: ainda pode exigir refinamento manual do cabelo, do cajado próximo à cabeça e da barba em movimento, especialmente nas quatro orientações. Os PNGs e o personagem canônico devem ser vistos na escala real (2× a 3× no celular), não apenas na ampliação do ateliê.

**Próxima etapa proposta:** M1h-C, refinamento artístico quadro a quadro e aprovação da silhueta; posteriormente, monstros, itens e cenários. Nenhuma PR foi mesclada à main automaticamente.
