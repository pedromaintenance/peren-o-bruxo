# M1h-F.18 — Janela de Recuo Seguro

## Problema encontrado
O recuo já posiciona Peren numa célula navegável, distante de criaturas, e impõe cooldown ao inimigo específico. Outros inimigos, entretanto, podem provocar um segundo encontro imediatamente, antes de Peren recuperar o controle.

## Implementação (apenas a prévia M1h-F)
- Uma **janela de 3 segundos de tempo ativo** surge ao recuar antes da batalha, fugir durante o combate ou ser resgatado após derrota. A contagem só anda com o Phaser ativo, não persiste em saves.
- Durante a janela **todos os contatos são temporariamente bloqueados** no ponto de decisão da cena, sem alterar `monsterDecision()`. Os inimigos continuam detectando Peren, patrulhando e perseguindo normalmente; depois de expirar o prazo, o contato volta à regra anterior.
- Aviso discreto no HUD informa `RECUO SEGURO · Ns para se reposicionar`, some sozinho, usa leitura `aria-live=off`, não bloqueia movimento nem permite exploração sem risco permanente.
- Não concede cura, XP, ouro, itens, imunidade a dano de combate, teleporte adicional ou alterações de save/catálogo. Na vitória não há janela: o inimigo é removido como antes.
- Mantém a lógica antiga fora da build isolada (`VITE_PEREN_M1HF_PREVIEW`).

## QA
- [x] Testes puros de duração, detecção, expiração e ausência de mutação.
- [x] Chromium criado em 360×800, 390×844, 1280×800 com recuo real e um *segundo* inimigo posicionado no contato, verificando a proteção e o restabelecimento do encontro após a expiração, HUD e isolamento dos três saves.
- [ ] CI de build e regressão completa.
- [ ] Publicação isolada e QA do GitHub Pages.
- [ ] Aceite manual Android e Xbox físicos, percepção da janela de 3 segundos.
