# M1h-F.8 — Leitura da floresta / sinais de discrição

**Escopo:** exclusivamente a prévia Phaser M1h-F. O código do Peren clássico e da demo M1d não muda.

## Problema
O motor já usa `environmentAt` e `canDetect` em `encounters.js`: arbustos e folhagem dão cobertura, corrida aumenta a distância de percepção, neblina encurta a visão, e solo encharcado reduz velocidade. No HUD atual o jogador só conhece o tempo e o número de perseguidores, sem entender a relação tática entre movimento e terreno.

## Solução implementada na branch de fonte
- Novo HUD compacto e contextual **Passos contidos / Sob cobertura / Passos ruidosos / Rastros recentes / Caçado**, com cores e descrições legíveis.
- Deriva `cover`, `wet`, `sprint`, `weather`, `detected` e `investigating` das condições **já calculadas** pela IA; não acrescenta modificadores, ataques, itens, testes, regras ou recompensas.
- `field-awareness.js` contém apenas uma função pura para a apresentação; o mundo/monstros produzem `registry.fieldSignals` voláteis, atualizados somente quando mudam.
- O HUD fica oculto fora de `VITE_PEREN_M1HF_PREVIEW=1` e não altera `localStorage`, a bridge, o Diário ou o save clássico.
- Layout responsivo, inclusive em 360×800, com estado e título acessíveis; não divulga a localização de criaturas que ainda não perceberam Peren.

## Aceite
- [x] Indicador, coleta de sinais voláteis e estilos implementados.
- [x] Testes Node de cobertura, névoa, corrida, investigação e perseguição adicionados.
- [x] Teste Chromium local e público criado para 360×800, 390×844 e 1280×800, verificando viewport e saves isolados.
- [ ] CI Node/Vite/Chromium no candidato concluído com sucesso.
- [ ] Build somente `phaser-demo-m1hf/`, diff auditado e release publicada por PR própria; não mesclar PR #24 de fonte na `main`.
- [ ] Smoke no Pages incluindo os fluxos anteriores (combates, Diário, backup, PWA offline) e novo indicador.
- [ ] Android físico e aprovação artística em jogo permanecem pendentes.

**Limite:** o indicador explica condições reais; não é um radar nem garante invisibilidade quando não há inimigos detectando Peren. A IA e os cálculos de `canDetect` são preservados.
