# Martelo de ferreiro — animação reservada (eixo Y)

**Status:** asset arquivado; não utilizado pelo runtime, HUD, projéteis ou cache PWA.

## Identidade e uso futuro

- Rotação percebida e classificada pelo autor: **eixo Y**, não eixo Z.
- Finalidade potencial: ataque / arremesso de martelo.
- Amostra visual aprovada: 9 poses em faixa horizontal, fundo transparente.
- Não substituir `assets/icons/martelo.webp`, que é o ícone animado do inventário/ofícios.
- Manter quadros e ordem originais; a física de arremesso será definida quando a mecânica for criada.

## Proveniência

- PNG enviado no chat: `Martelo_Ferreiro_Giro_Z_9frames_80px(1).png` (2048 × 208, RGBA).
- Arquivo versionado sem modificação: `martelo-arremesso-eixo-y-9frames.png`.
- SHA-256 PNG: `2630bd35dd0e95e1da5691f8765b42abe9496575c4f63fda83afb94cf6979e8f`.
- O pacote ZIP original acompanhante foi recebido com nomenclatura antiga `Giro_Z` e JSON interno descrevendo eixo Z; **essa classificação é incorreta para o propósito definido pelo autor**, que é Y. O ZIP ainda não foi incorporado neste commit, devido a erro de transporte do arquivo maior. Não usar o metadado antigo como definição canônica.

## Integração futura

Separar animação visual de rotação do martelo da trajetória do projétil; definir hitbox, velocidade e duração somente após aprovação de design. Não modificar agora combate, inventário, saves ou service worker.
