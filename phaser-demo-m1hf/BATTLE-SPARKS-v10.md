# Peren v10 — Faíscas infernais (asset aprovado pelo criador)

A nova arte de cinco fases enviada para este ciclo não substitui a **Rajada Infernal v9.2**. É uma camada adicional de faíscas exibida durante a conjuração de `spell:mag-raio-de-fogo`, usando o próprio `BattleScene`. Dano, PM, saves, Idle, Void Rift e invocação não foram alterados.

## Fonte e padronização

- Arte: `Sequência de Chamas Mágicas Animadas(2).png`, fornecida pelo criador
- Fases: início, progressão, ápice, regressão, fim
- Arquivo final: `art/battle/runtime-v84/sparks-v10.png`
- Sprite sheet: **2080 × 682 px** (cinco células **416 × 682** sem margens entre células de runtime)
- SHA-256: `71769eb59937d35bbb0575a80a1c003a5e2f7042f273e6611c3fe13564b5007e`
- Tamanho exato: **644753 bytes**
- Origem: `art/battle/runtime-v84/sparks-v10.json`
- Cadência: `[120,125,165,145,130]` milissegundos (685 ms)

Os cinco recortes foram reposicionados em células de mesmo tamanho. Nenhum quadro foi redesenhado ou interpolado; são os mesmos pixels da fonte, com remoção de ruído de alpha de valor 1–5 nas regiões praticamente invisíveis.

## Comportamento e segurança

A verificação `checkInstalledSparks` só habilita o preloader se manifesto e PNG existirem. Sem eles, o usuário continua com a arte v9.2, sem erros de textura ou bloqueio de turnos. O sprite de faíscas sobrepõe a mão conjuradora de Peren durante 685 ms e é destruído após o quinto quadro ou no fechamento da cena.

O Service Worker adiciona o PNG e o manifesto ao cache offline. Os testes de integração exigem presença do binário, dimensões, digest SHA-256 e todos os cinco quadros renderizados na `BattleScene` real.

## Conclusão da integração e assets versionados

Os dois arquivos binários estão efetivamente commitados na branch e conferidos por blob SHA no GitHub:

- `art/battle/runtime-v84/sparks-v10.png`: 2080×682, SHA-256 `71769eb59937d35bbb0575a80a1c003a5e2f7042f273e6611c3fe13564b5007e`
- `art/battle/runtime-v84/flame-v10.png`: 1920×370, SHA-256 `27d13641bef40ebebe784d68c75f74909a31668bb2775a1bf0a87135a8f5a853`

O efeito Chama usa cinco células de 384×370 pixels, cadências `[145,165,220,170,180]` ms, transparência RGBA, e reproduz o movimento de vórtice incandescente original. O recorte foi normalizado sem regenerar ou pintar a fonte. Ambos os sprites animam como camadas visuais adicionais na Rajada Infernal, sem mudar combate ou saves.

CI de release: `qa_peren_sparks_v10.mjs`, `qa_peren_flame_v10.mjs` e `qa_peren_battle_v85_browser.mjs` devem aprovar a reprodução dos cinco quadros e a integridade dos arquivos. A avaliação visual no deploy ainda é recomendada.
