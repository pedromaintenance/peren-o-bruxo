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

## Etapa imprescindível para publicar

O binário fornecido no pacote de entrega deve estar **efetivamente commitado** em `phaser-demo-m1hf/art/battle/runtime-v84/sparks-v10.png`. Não considerar os scripts e o manifesto suficientes. Nunca fazer merge enquanto o teste `qa_peren_sparks_v10.mjs` falhar por ausência do PNG. Após publicar, validar o visual no GitHub Pages desktop e celular.
