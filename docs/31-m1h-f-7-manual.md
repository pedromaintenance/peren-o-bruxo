# M1h-F.7 — Manual da Expedição e regressão de Portomonte

**Data:** 16/10/2026. **Escopo:** apenas a prévia Phaser M1h-F.

## Problema observado

Os workflows M1g-A, M1g-C e M1g-E falharam em `scripts/portomonte-browser.mjs` na linha de validação de quantidade fixa de botões (`7 !== 6`). O novo botão do Diário estava presente no DOM, inclusive quando oculto, e o teste contava indiscriminadamente todos os botões. Isso produzia falsos negativos após a entrega de M1h-F.5.

## Correção de QA

- O teste agora lista botões, confere a disponibilidade real dos cinco comandos essenciais, conta apenas controles visíveis/habilitados, e valida os módulos opcionais Diário e Manual quando a prévia os expõe.
- O teste de Manual cobre as quatro seções, a volta por Escape, foco/modal e acesso à bancada de testes. Três viewports: 360×800, 390×844, 1280×800.
- O teste do bundle M1h-F confirma preservação do save experimental, e continuará inspecionando o clássico e a demo anterior sem importar/modificar suas chaves.

## Novo recurso de interface

**Manual da Expedição** no menu de Portomonte, exposto só com `VITE_PEREN_M1HF_PREVIEW=1`. Quatro seções:

1. **Explorar:** comandos para toque, WASD/setas e Xbox; encontros e coleta na Floresta de Mürin.
2. **Combate:** atacar, defender, poções, magias e fuga com descrição dos controles existentes.
3. **Portomonte:** oficina, comércio, inventário, Diário e descanso.
4. **Saves e testes:** persistência, download/importação consciente de backup, resgate e link voluntário para a bancada de teste.

A tela não lê localStorage, não chama a bridge de progresso, não faz chamadas externas e não escreve informações em lugar algum. O hub fica `inert` enquanto aberta; Escape/B/Menu fecham, o foco retorna ao botão invocador; esquerda/direita navegam capítulos com Xbox, cima/baixo rolam instruções.

Arquivos de fonte: `phaser-lab/src/ui-guide.js`, `phaser-lab/ui-guide.css`, `phaser-lab/index.html`, `phaser-lab/src/main.js`; testes `phaser-lab/tests/guide.test.mjs`, `phaser-lab/scripts/portomonte-browser.mjs` e `phaser-lab/scripts/m1hf-pages-browser-check.mjs`.

## Gatilhos de publicação

- [x] Conteúdo, interface e handlers implementados na branch fonte.
- [x] Corrigida a asserção de botões de Portomonte por disponibilidade/visibilidade.
- [x] Adicionados testes Node e Chromium para o novo recurso.
- [ ] Aguardar CI no commit candidato: Node/Vite/Playwright e smoke de três tamanhos.
- [ ] Comparar bundle gerado pela CI com `main`; mesclar **somente** `phaser-demo-m1hf/`.
- [ ] Validar URL publicada em Chromium móvel e desktop, inclusive PWA offline, sem tocar saves clássico ou M1d.
- [ ] Android físico e Xbox real exigem playtest humano; CI não equivale a aprovação.

## Restrições

Não modificar `game.js`, `phaser-demo/`, `peren_carcaca_save_v1`, `peren_phaser_save_m1d_v1`, ou promover arte M1h-F sem aprovação explícita. `PR #24` permanece em draft para a fonte. O Manual não deve fazer uma promessa de funcionalidade não implementada.
