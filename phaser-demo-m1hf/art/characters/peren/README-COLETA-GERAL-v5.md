# Peren Kerrhylon — Coleta geral v5 (sem erva)

## Fonte

Pacote fornecido pelo criador: `Peren_Kerrhylon_Assets_v5_Coleta_Geral (1).zip`.

- **Coleta geral:** `charset/coleta_geral/atlas/peren_coleta_geral_4col_4lin_160x190.png`; 640×760, células de 160×190, SHA-256 `42cb2f2827a9eb1a71c52fef858f23a53fb28445071aeb3406c972f923b72ba1`.
- **Coleta de ervas:** `charset/coleta/atlas/peren_coleta_4col_4lin_160x190.png`; permanece com o ramo verde e SHA-256 `f8f8d772a5268d0c465ec9ad0b6b2e02fc6660932090b8926ddb96ac4fef4147`.
- **Caminhada:** `charset/caminhada/atlas/peren_caminhada_3col_4lin_160x190.png`; versão v5 já integrada, SHA-256 `5882fb53ee495e977f69164373ce9a349d5cfc9deddf9f14471bb97690a5d8ba`.
- Caminhada ferida, retrato, demais ações e catálogo de itens: mantidos.

## Integração no Modo Livre

Na Floresta de Mürin, `node.sprite === "herb"` utiliza `gather-herb`: **350 / 250 / 450 / 850 ms**. Cogumelos e futuros recursos recolhíveis utilizam `gather-general`: **350 / 250 / 350 / 300 ms**. As animações são direcionais (frente, esquerda, direita, costas), tocadas **uma única vez**, sem loop. O item é incorporado ao inventário **somente após o evento `ANIMATION_COMPLETE`**, preservando salvamento e bloqueio de coleta duplicada.

## Reaproveitamento exato de pixels e PWA

Para não duplicar dezenas de arquivos PNG oficiais de alta resolução no site, usamos uma **delta de pixels RGBA sem perdas** no arquivo `generic-gather-runtime-patch.json`: apenas 8 retângulos mudam em relação ao atlas runtime oficial de colheita de ervas. Em cada direção, os dois primeiros quadros permanecem **exatamente iguais**. As pequenas diferenças nos quadros 3 e 4 retiram as folhas do chão/da mão sem trocar poses ou contornos.

No `ExplorationScene`, o navegador carrega o atlas runtime já existente `peren-herb-atlas.png` (768×512 / 128 frames de 48×64), copia para canvas e aplica os retângulos com `ImageData` e `putImageData`. Registra a textura `peren-generic` sem interpolação e sem inventar poses. Os quadros usados são 16–19, 48–51, 80–83 e 112–115. Esse procedimento foi comparado pixel a pixel com o atlas de 16 poses enviado no ZIP, já recortado para os mesmos 48×64; **todos os 16 quadros passaram**.

O cache offline do Modo Livre inclui o JSON delta. A galeria `peren-arte.html` demonstra as duas animações. As variantes de arte anteriores reutilizam o mesmo atlas de ervas e continuam disponíveis para comparação; o jogo segue com **apenas o Modo Livre**.

## QA

- `tests/qa_peren_coleta_geral_v5.mjs`: valida oito regiões RGBA, tamanhos, SHA de procedência, roteamento, sequências temporizadas e cache PWA.
- `tests/qa_peren_ervas_v5_browser.mjs`: prévia de erva e coleta geral em 360, 390 e 1280 px, reprodução única e cache offline.
- Fluxo prévio de `ANIMATION_COMPLETE`, de salvamento e de inventário permanece intacto.

A branch é de revisão. A versão pública não é alterada até a aprovação e o merge da PR.
