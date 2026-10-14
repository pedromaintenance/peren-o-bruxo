# M1h-D — Expressão austera, sobrancelhas e boca de Peren

**Situação:** candidato artístico em revisão; `feature/phaser-m1h-d-expressao` sobre a M1h-C (PR #19). **Sem alterações na main ou na versão clássica.**

## Objetivo

O Peren canônico é um bruxo veterano de **cabelo e barba prateados, manto escuro e sem chapéu pontudo**. A M1h-C melhorou o volume do cabelo, mas o retrato ainda sugeria um sorriso amplo sob o bigode. Esta fatia concentra-se na geometria da expressão, não em cosméticos arbitrários ou alterações de gameplay.

## Arte e implementação

O gerador `scripts/peren-m1hd-generator.mjs` usa PNGJS e a M1h-C como base, preservando as quatro variantes anteriores:

- Atlas de **1536×256**, 128 quadros de **48×64**, quatro direções, oito ações e quatro quadros por animação.
- Nos sprites de frente/perfil, compacta a linha da boca, acentua sobrancelhas, raízes do bigode e vincos. No sprite de costas, trabalha somente o sombreado da nuca.
- Nos três retratos de **256×256**, redesenha a região de nariz, bigode, lábio e queixo, deixando a boca comprimida e sem dentes/sorriso. As expressões `cast` (concentração) e `hurt` (tensão) têm pequenas diferenças, preservando a identidade do rosto.
- **Canal alfa idêntico** em todos os pixels. Nenhuma alteração no corpo, equipamentos ou cajado a partir da linha 43 do frame.
- Resultado em `public/art-m1hd/characters/peren/`, com `report.json` explicitamente `em_producao` e `pendente`.
- A prévia é **opt-in** por `?art=m1hd` no Phaser; `review.html?art=m1hd` permite comparar M1e, M1h-A, M1h-B, M1h-C e M1h-D.

## Verificação e critérios de aceite

- Testes unitários: alterações efetivas nos 128 frames, canal alfa preservado, corpo inalterado, todos os retratos com mudanças **somente no retângulo facial**, e isolamento da lógica/save.
- `node scripts/peren-m1hd-preview.mjs` produz prancha com retrato M1h-C, retrato M1h-D, conjuração M1h-D e as quatro direções do sprite.
- `node scripts/peren-m1hd-browser.mjs` testa as cinco variantes em três resoluções, Portomonte, Mürin, batalha e ateliê.
- CI dedicado: auditoria histórica das 35 telas, pacote PWA e jornada de controle Xbox simulado, integridade do save clássico.
- Antes de transformar M1h-D em sprite padrão: inspecionar a prancha PNG **real**, aprovar os retratos em tamanho nativo/2×/3× e validar Android e Xbox físicos.

**Observação:** melhorias procedurais não garantem por si só qualidade artística. O CI é uma verificação de integridade técnica; não substitui a aprovação visual do personagem.
