# Arquitetura técnica e migração incremental

## Separar apresentação e regras

O estado do jogo (`S`, hoje em `game.js`) e os dados de `data/*.json` devem tornar-se núcleo independente de Phaser: `core/state`, `core/economy`, `core/crafting`, `core/progression`, `core/quest`, `core/combat`, com funções testáveis. **Não reimplementar a economia do zero**.

1. O menu HTML altera o estado por comandos como `buy`, `craft`, `train`, `acceptQuest`, `travel`.
2. Phaser explora o mundo e emite comandos `collect`, `startEncounter`, `battleAction`, `resolveEncounter`.
3. O **núcleo** valida e persiste cada comando. A cena lê snapshots e renderiza; **a animação não define resultados**.
4. O processamento de vitória se torna transação com ID único (`encounterId`) para impedir XP/loot duplicados.
5. Os dados de catálogo referenciam imagens por **ID**, via manifesto: `mob-x → portrait / atlas / animation clips`.

## Cenas previstas

- `BootScene`: inicialização/carga offline, asset packs e loaders.
- `ExpeditionScene`: seed, tiles, colisões, spawns, coleta, eventos e entrada/saída.
- `BattleScene`: equipes, turnos, efeitos, interface de ações e resultado.
- `TransitionScene`: fade, viagem e descarte seguro de texturas.
- `UiScene`: overlays de exploração e batalha (controles touch/teclado).

As cidades continuam em HTML/CSS como hubs, pois menus são mais acessíveis para comércio/receitas; o Phaser monta canvas somente onde necessário. As páginas existentes da `main` permanecem sem alteração nesta fundação.

## Phaser e publicação

Para protótipo isolado, `phaser-lab/` usa **Phaser 3** e **Vite**. O pacote deve ser construído localmente (`npm ci && npm run build`); o Phaser será incluído no bundle e não carregado de CDN em tempo de execução. Não commitar `node_modules`. O experimento não será distribuído como o PWA principal até integrar cache de seus bundles e assets ao service worker.

- Debug local: `phaser-lab/` independente, sem mexer em `index.html` do jogo atual.
- Fase seguinte: extrair o núcleo compartilhado do motor original e conectar ambos.
- Build de produção: arquivos com hash, manifest de cache atualizado, fallback offline e tratamento de atualizações.

## Save e segurança de progresso

Chave atual: `peren_carcaca_save_v1`. **Não alterar nem descartar** o save existente na `main`. Projetar `schemaVersion` separado de `gameVersion`, `migrateSaveV1`, backups exportados e validação de entradas. Explorações usam `seed`, posição, inventário e estado persistente de criaturas e recursos; as transições são checkpointadas. Ao resolver encontro, gravar ID único e resultado antes da animação final; se houver refresh, recuperar estado sem premiar novamente.

## Testes que devem permanecer verdes

`tests/qa_smoke.py` e `tests/qa_tutores.py` já existem na versão 0.1.2. Adicionar testes: conexão de loja/oficina → exploração; seed determinística e acesso à saída; seleção de alvo; queda do FPS; touch; reload mid-battle; combate vencido duas vezes; save migrado; cache offline sem CDN.