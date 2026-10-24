# Peren v8.9 — BattleScene offline e pós-publicação

## Origem e diagnóstico

A versão v8.8, publicada em 24/10/2026, confirmou a presença dos oito PNGs de batalha e o funcionamento em navegadores com rede. Porém a cache PWA `demo-sw.js` **não pré-carregava os PNGs novos** e o adaptador `battle-art-runtime-v84.mjs` só confirmava sua disponibilidade com HTTP `HEAD`.

O service worker atende requisições **GET** para rotas do aplicativo, não responde `HEAD` quando o usuário está sem rede. Portanto, após abrir o jogo offline, `checkInstalledAssets()` poderia desativar o battler novo e recorrer ao sprite legado mesmo tendo arquivos disponíveis em CacheStorage.

## Alterações da v8.9

1. **Pré-cache completo e versionado:** `demo-sw.js` agora usa `peren-phaser-m1hf-preview-battler-v89-20261024` e adiciona os oito PNGs `art/battle/runtime-v84/*.png` e o manifesto `battle-asset-pack-v84.json` à lista de `cache.addAll`. Os oito arquivos não foram alterados.
2. **Fallback de verificação:** `assetAvailability(file,fetcher,cacheStore)` tenta `HEAD` e, se não funcionar, verifica o cache previamente instalado para a mesma URL. Não lê os corpos dos PNGs nem desliga as validações online.
3. **Diagnóstico distinguindo fonte:** `diagnoseBattleArt()` agora retorna `cached-assets-present` quando depende do cache, e mantém `png-missing`, `manifest-not-found` e demais erros.
4. **Teste unitário:** `tests/qa_peren_battle_v89_offline.mjs` verifica todos os caminhos do cache, rede indisponível, imagens ausentes e falhas em CacheStorage.
5. **Teste de navegação real:** `tests/qa_peren_battle_v89_offline_browser.mjs` instala o service worker, aguarda todas as imagens em CacheStorage, desliga a rede no Chromium, recarrega o Modo Livre, entra na Floresta de Mürin, inicia um encontro pelo botão do jogo e exige `peren-v84-idle` visível na batalha — tamanhos 390×844 e 1280×800.

## Riscos monitorados

- O pré-cache acrescenta aproximadamente 11 MB de imagens; navegadores com pouco armazenamento podem recusar a instalação. Nesse caso, o jogo deve seguir funcionando online, mas o modo offline não fica totalmente disponível. O teste reproduz capacidade normal de Chromium, não dispositivos com quota extrema.
- O manifest é validado sintaticamente e os PNGs possuem SHA-256 fixado em `tests/qa_peren_battle_v85_binary.mjs`. O CacheStorage não recalcula hashes no browser; a integridade é conferida no GitHub em cada revisão.
- Esta versão **não implementa Summon Greater Demon como mecânica**, não altera combate, HP/MP, saques, crafting, saves ou cenas de história.

## Critérios de saída

- [x] `Peren Official Art QA` passou Node, integridade dos oito PNGs e browser online/offline ([execução #40114686577](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/40114686577)).
- [x] `Peren Single Free Mode QA` passou os testes de instalação PWA existentes ([execução #40114686570](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/40114686570)).
- [ ] PR mesclada em `main` sem conflitos.
- [ ] Build do GitHub Pages conclui com sucesso.

A versão atual do carregador continua denominada `battle-art-runtime-v84.mjs` por compatibilidade: a v8.9 melhora **a distribuição offline**, não altera as dimensões ou os IDs dos sprites de produção.
