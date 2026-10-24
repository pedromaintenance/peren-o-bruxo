# Peren v8.5 — ciclo de homologação do combate real

## Diagnóstico do bloqueio

O pacote de arte v8.4 foi aprovado visualmente e reconstruído em oito PNGs, mas as PRs #64–#68 ainda não incluem os binários do diretório `phaser-demo-m1hf/art/battle/runtime-v84/`. Os dois pipelines anteriores foram bem-sucedidos porque testavam o código/fallback com as imagens ausentes. **Eles não demonstraram o novo battler no jogo.**

Nesta v8.5 acrescentamos um **terceiro status de aprovação separado**, intitulado *Peren v8.5 Battle Art Release Gate*, que **falha por projeto** se as imagens não estiverem na branch. Não marcar o jogo como publicado sem esse status verde.

## O que o novo gate realmente comprova

**Etapa 1 — bytes reais:** `tests/qa_peren_battle_v85_binary.mjs` exige o arquivo `battle-asset-pack-v84.json` e todos os oito PNGs *commitados*; valida magic number, dimensões, hashes SHA-256 e os 11 frames do Void Rift. É impossível passar com imagens-placeholder ou um manifesto inventado.

**Etapa 2 — Chromium com Phaser autêntico:** `tests/qa_peren_battle_v85_browser.mjs` abre a página original do Modo Livre, entra na Floresta de Mürin e lança um encontro de teste dentro do `BattleScene` real, usando `window.__perenLab`. Requer que a ligação visual tenha ativado `__v84Idle` e que o antigo `scene.peren` esteja invisível. Executa as duas animações de magia por `scene.animatePlayer`, sem modificar saves do usuário, e verifica a criação de sprites **`peren-v84-infernal`** e **`peren-v84-void`**. Faz isso em **390×844** e **1280×800** e armazena **quatro screenshots reais** como artefatos da Action.

**Etapa 3 — homologação humana:** avaliar nos screenshots se o novo battler e as partículas não encobrem nomes, barras de PV/PM ou botões de ação. Automatização prova carregamento, não beleza visual.

## Publicação necessária

O pacote de entrega é `Peren_v84_BattleScene_Assets.zip`, entregue anteriormente na conversa; contém estas oito imagens e o manifesto, nos caminhos corretos:

```
phaser-demo-m1hf/art/battle/runtime-v84/
  idle.png               2240×821
  infernal.png           2048×682  (fumaça e caveiras)
  void.png               2560×1086 (11 quadros)
  summon.png             2048×1024
  portrait_01.png ... portrait_04.png  (362×1086)
  battle-asset-pack-v84.json
```

Com o clone local do GitHub e esse ZIP à disposição:

```bash
python ferramentas/instalar_battle_v84.py Peren_v84_BattleScene_Assets.zip
node --test tests/qa_peren_battle_v85_binary.mjs
git add phaser-demo-m1hf/art/battle/runtime-v84/
git commit -m "assets: install Peren battle v8.4 approved PNGs"
git push
```

A validação do binário feita localmente a partir do ZIP (SHA e dimensões) foi bem-sucedida; **a validação do binário no checkout remoto não pode ser considerada concluída** até que os arquivos apareçam no repositório.

A plataforma conectada nesta sessão não dispõe de uma ponte de transferência dos bytes locais para o GitHub. O conector aceita `create_blob` (base64), mas não consegue acessar diretamente os bytes dos arquivos criados no container de execução. Não adotar soluções que degradem o sprite (recompressão agressiva, refazer pixels, base64 truncada) para simular publicação.

## Dependências e estado

- Código do `BattleScene`, instanciador do Idle e efeitos estão na PR #68.
- O teste de release é uma PR filha de #68; ao subir os PNGs para essa revisão, a Action executa a cena com os binários reais.
- Não mesclar a PR v8.5 ou suas dependências no `main` antes do gate verde e da inspeção dos screenshots.
- O endpoint atual do jogo público continua sendo `https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/`. Essa URL **não comprova** a publicação v8.5.

## Próxima ação

Instalar os oito PNGs efetivos, executar a Action de liberação, conferir quatro screenshots e só então fazer o merge/publicação do jogo. A ausência dos arquivos agora fica visível como falha de CI, não mascarada pelo fallback.

## Ajuste pós-auditoria: prova de conjuração visível

O teste `tests/qa_peren_battle_v85_browser.mjs` foi aprimorado para fotografar cada feitiço **enquanto seu sprite está ativo**, verificando que o Idle novo se oculta temporariamente, que a animação ocupa a janela de combate e que o novo Idle retorna ao término. Antes, uma captura após `await animatePlayer` poderia mostrar só o Idle, sem provar a presença de Infernal ou Void Rift. Os quatro screenshots agora devem conter as magias em execução.

**Falha remota observada:** a Action `Peren Official Art QA` reprovou no teste de PNGs: `idle.png`, `infernal.png`, os quatro `portrait_*.png`, `summon.png` e `void.png` estão ausentes. A suíte `Peren Single Free Mode QA` passou, preservando o jogo atual. Essa reprovação é intencional e bloqueia a publicação até os arquivos binários entrarem no mesmo commit/revisão da PR #69.

**Atalho para Windows:** entregue no chat o arquivo `INSTALAR-PEREN-V85.ps1`, que recebe `-ZipPath`, `-RepoPath` e `-Push`, verifica branch, repositório, oito SHA-256 e manifesto, recusa substituir arte divergente e envia somente os nove arquivos de batalha. Não autoriza merge automático na `main`.

## Diagnóstico v8.7 — detectar a causa do sprite antigo

Foi incorporado ao módulo `battle-art-runtime-v84.mjs` um diagnóstico **somente quando solicitado**, sem alterar gameplay nem saves. Ao acessar o aplicativo com a URL:

```text
https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?debug-battler=1
```

o jogo exibirá um pequeno painel indicando se está usando o novo battler ou o fallback antigo e qual etapa de verificação falhou:

- `manifest-not-found`: a implantação ainda não contém `battle-asset-pack-v84.json`;
- `manifest-invalid-schema-or-hashes`: o manifesto está incorreto;
- `png-missing`: um ou mais PNGs retornaram HTTP inválido;
- `assets-present`: os oito PNGs e manifesto podem ser encontrados;
- `manifest-network-error`: o dispositivo está offline ou não conseguiu acessar a rede.

Esse diagnóstico é intencionalmente separado do teste SHA-256 do GitHub. Um HTTP 200 não prova a integridade binária; a CI continua comparando todos os hashes aprovados.

O novo teste `tests/qa_peren_battle_diagnostics.mjs` verifica esses cenários sem requisitar PNGs ausentes nem alterar a máquina de estados do combate. O endereço com `?debug-battler=1` só terá o painel novo **depois que o código dessa branch for mesclado e publicado**. Antes disso, continuará o comportamento da versão antiga.
