# Integração real de combate — Peren v8

**Escopo:** trazer o pacote homologado Asset Forge v8 para o `BattleScene` da distribuição Phaser, com fallback automático, sem alterar regras, saves ou inventário.

## Estado de entrega

1. **Código integrado à branch:** `phaser-demo-m1hf/index.html` importa `battle-art-runtime-v8.mjs`. O serviço offline inclui o módulo JS. O adaptador só ativa se encontrar `art/battle/runtime-v8/battle-asset-pack-v8.json` com todos os hashes declarados.
2. **Atlas reais gerados e verificados:** entregue no chat como `Peren_v8_BattleScene_Assets_Reais.zip`, contendo 8 PNGs e o marcador SHA-256, produzidos a partir do pacote v8 e verificados contra **263 checksums**. A instalação dos binários no GitHub **ainda é pendente**, porque o conector GitHub desta sessão permite editar arquivos de texto, mas não transferir os 12 MB do pacote local.
3. **QA:** `tests/qa_peren_battle_art_runtime_v8.mjs` e pipelines de integração/regressão. O módulo não faz chamadas a `stepBattle`, `finishBattle` ou `localStorage` e não registra magia nova.

## Quais assets entram em quais ações

| Jogo existente | Asset | Comportamento |
|---|---|---|
| Espera em batalha | Idle Battler (4 frames 479×821, folha horizontal 1916×821) | 4 FPS, loop, proporções preservadas |
| `spell:mag-raio-de-fogo` | Rajada Infernal (8 frames 512×341, atlas 2048×682) | Cinemática de fogo simultânea ao efeito original |
| `spell:mag-misseis-magicos` | Void Rift (8 frames 543×362, atlas 2172×724) | Cinemática arcana sobreposta à animação existente |
| Teste artístico em batalha | Summon Greater Demon (8 frames 512×512, atlas 2048×1024) | Botão **Prévia: invocar demônio (sem custo)**: 190/210/250/300/330/400/380/320 ms |
| Galeria de cenas | Quatro portraits 362×1086 | Botão **Retratos** permite alternar entre as quatro poses |
| Demais golpes/magias | Sprite e VFX atuais | Fallback (inclusive se algum binário estiver ausente) |

O comando Summon Greater Demon não está no repertório mecânico implementado; sua prévia NÃO executa um turno, não gasta PM e não cria NPC. A conexão completa ao sistema de invocação exige futuramente definir concentração, entidade, facção, controle, duração, custos e risco. **Não improvisar regras do D&D 5e no hack do projeto.**

O adaptor conserva `BattleScene.animatePlayer` original, sincronizando os overlays com `Promise.allSettled` e restaurando o idle, mesmo durante retorno à floresta. Não substitui o minificado nem cria segundo modo de jogo. Em caso de ausência de PNG/manifest, a distribuição inicia normalmente com seus visuais anteriores.

## Instalação e deploy

A importação no clone pode ser executada de duas formas:

**A. Usar o pacote focado com PNGs prontos (mais simples):**

```bash
cd peren-o-bruxo
unzip -o Peren_v8_BattleScene_Assets_Reais.zip
node --test tests/qa_peren_battle_art_runtime_v8.mjs
git add phaser-demo-m1hf/art/battle/runtime-v8/
git commit -m "assets(peren): publish complete battle art v8 binary pack"
git push
```

**B. Gerar os atlas diretamente dos masters (reproduzível):**

```bash
python -m pip install Pillow
python ferramentas/instalar_battle_art_v8.py Peren_Asset_Forge_v8_Summon_Greater_Demon_Pacote_Completo.zip
```

O instalador verifica SHA-256 de todos os arquivos e se recusa a sobrescrever PNGs diferentes. O `battle-asset-pack-v8.json` somente é gravado depois da geração correta de oito PNGs.

**Publicação:** depois que os binários forem efetivamente commitados e as PRs base (#64) e do combate (#65) estiverem aprovadas, mesclar, validar no GitHub Pages com teste real de cena e atualizar cache/QA. A URL prevista do jogo é `https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/`; a rota não constitui confirmação de que esses novos PNGs estejam publicados.

## Critérios de aceite

- [x] Código do adaptador versionado e fallback testado
- [x] Atlas RGBA montados a partir dos masters locais
- [x] Oito arquivos binários com hashes e dimensões conferidos
- [x] Coleta, lógica pura de combate, inventário, experiência, loot e saves mantidos
- [ ] PNGs binários presentes no GitHub na mesma revisão que o adaptador
- [ ] Teste de navegador do BattleScene **com** o manifesto v8 ativo, sprites carregados e nenhuma exceção
- [ ] Visual revisado em 390×844 e 1280×800, incluindo visibilidade de HUD e área de comandos
- [ ] Merge e GitHub Pages verificados

## Limitações artísticas documentadas

Os recortes v6 dos portraits incluem sobreposição de manto/cabelo nas divisas da folha. Void Rift foi cromado experimentalmente; sua transparência e halos devem ser inspecionados em fundo claro/escuro. As animações infernais e demoníacas são artes compostas por quadro, não rigs de partes independentes.

**Esta PR não é uma declaração de publicação bem-sucedida**; usar o pacote binário local como referência até os PNGs aparecerem nos endpoints reais.
