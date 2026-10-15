# M1h-E — Retrato Veterano de Peren

**Status:** candidato para aprovação visual, baseado em M1h-D; branch `feature/phaser-m1h-e-retrato-veterano`. Não modifica `main`.

## Por que mudamos de técnica

As versões M1h-A a M1h-D recoloriram e depois corrigiram a silhueta, o cabelo, a barba e a boca. As pranchas reais mostraram um problema persistente: a **anatomia do rosto ainda parecia jovem**. Continuar pintando linhas sobre essa estrutura não resolveria o reconhecimento do personagem.

Esta etapa trata o rosto como um **redesenho estrutural**, não uma nova recoloração.

## Direção canônica e trabalho realizado

Peren continua um bruxo veterano, austero, de cabelo e barba prateados, manto grafite e **sem chapéu pontudo**. Nenhum novo item, cicatriz obrigatória ou habilidade foi criado.

O script `phaser-lab/scripts/peren-m1he-generator.mjs` deriva três novos retratos PNG 256×256 da variante M1h-D. Sua nova estrutura desenha:

- Face mais longa e estreita, têmporas recuadas e maçãs do rosto acentuadas.
- Sobrancelhas angulosas, olhos profundos, rugas discretas e nariz mais alongado.
- Bigode em mechas caídas e boca comprimida sem dentes/curva de sorriso.
- Barba prateada formada por volumes e mechas, não uma máscara uniforme.
- Estados neutro, concentração e ferimento com a mesma identidade do rosto.

O **atlas de animação foi copiado sem qualquer modificação, byte a byte**, da M1h-D: 1536×256, 128 quadros de 48×64, quatro direções, oito ações e quatro frames. A identidade visual do personagem animado e os retratos precisam ser aceitos separadamente.

## Reversibilidade e implementação

- Sexta variante no ateliê de sprites, `review.html?art=m1he`, e prévia jogável `?art=m1he`.
- Nova página **`portrait-review.html`**, incluída no build Vite/PWA, compara M1h-D e M1h-E lado a lado. Possui seleção de três expressões, close-up pixelado com escalas de 2×, 3× e 4× e carregamento de PNGs reais; não acessa os saves.
- Diretório exclusivo `phaser-lab/public/art-m1he/characters/peren/`.
- M1e (padrão) e M1h-A/B/C/D permanecem acessíveis e intactos.
- Sem mudanças em `combat.js`, progressão, save, economia ou mecânica.
- `npm test` verifica identidade binária do atlas, canal alfa de cada retrato, limites da região redesenhada e mudanças reais no rosto.
- `scripts/peren-m1he-preview.mjs` gera prancha **1024×768**: retrato M1h-D, três retratos M1h-E, quatro close-ups de rosto 2× e vistas 4× do atlas mantido.
- `scripts/peren-m1he-browser.mjs` compara seis variantes em 360×800, 390×844 e 1280×800, inclusive combate, galeria e save clássico. O CI repete as 35 capturas e a regressão Xbox simulada.

## Critérios para aprovação

- [ ] Conferir a prancha e detalhes do rosto sem cair em exagero cartunesco.
- [ ] Verificar coerência visual entre retrato 256×256 e sprite 48×64.
- [ ] Aprovação do usuário: reconhece-se o **mesmo Peren** no retrato e nas quatro direções do sprite?
- [ ] Testar Android e Xbox físicos, além do navegador automatizado.
- [ ] Só após aprovação considerar outra PR para seleção como visual padrão. A arte não deve ser publicada implicitamente.

**Aprovação técnica não equivale a aprovação artística.**
