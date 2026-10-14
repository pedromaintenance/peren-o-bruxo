# M1c — batalha Phaser animada e carteira de teste

**PR empilhada sobre `feature/phaser-m1b-criaturas`. Não altera `main`, `game.js`, os JSONs canônicos nem o save clássico.**

## Concluído nesta fatia

- Ao encontrar Galho Infectado, Fungo Violeta ou Ettercap, escolher **ENFRENTAR** abre uma cena Phaser exclusiva; a floresta permanece pausada sem perder a posição.
- Peren usa o mesmo atlas animado de M1a para conjuração, ataque e dano; os inimigos usam os atlas de M1b para ataques, dano e morte.
- VFX novos, originais e individuais: Raio de Fogo, Raio de Gelo e Mísseis Mágicos (3 spritesheets de 10 quadros). Fundo de batalha de Mürin em WebP criado por código.
- Comandos por toque, teclado e gamepad Xbox (A escolher, D-pad/analógico para navegar, X poção, Y fogo, B fuga/retorno). Também dispõe de defesa e poção.
- Estatísticas dos 3 inimigos e IDs/custos/potências dos 3 feitiços **exatamente referenciados nos catálogos existentes** (`data/monstros.json`, `data/magias.json`). A fórmula de redução por defesa e o custo de nível progressivo acompanham a versão clássica.
- Diário de recompensas (`claims`) indexado por **seed + ID único da criatura**. Uma vitória concede ouro, XP e um ingrediente real no máximo uma vez, mesmo em chamadas repetidas. Criaturas derrotadas não reaparecem ao reiniciar a mesma seed nesta sessão.
- Fuga e derrota não geram recompensas; recuo reposiciona Peren longe das patrulhas. Derrota garante resgate sem softlock.
- Perfil **somente em memória** (`combatProfile`): os resultados aparecem nos menus de Portomonte e preservam os recursos da sessão, mas **não** modificam a chave `peren_carcaca_save_v1`.

## Ainda não concluído (não declarar como pronto)

- Migração do estado financeiro real, inventário e equipamento do Peren clássico; a carteira da arena é **isolada** deliberadamente.
- 354 magias com VFX; três estão implementadas nesta fatia.
- Encontros múltiplos e seleção de alvos, efeitos de equipamento, buffs complexos, sonoplastia e balanceamento de longo prazo.
- QA físico no Android e controle Xbox real.
- Estilo visual definitivo aprovado pelo usuário.

## Regressões obrigatórias

1. `npm test` em `phaser-lab` — regras de turno, mana, poções, status, idempotência e 90 combates reproduzíveis.
2. `python tools/test_murin_battle_fx.py` e `python tools/generate_visual_manifest.py --check`.
3. `npm run build` sem CDN em runtime.
4. Playwright Chromium em 390×844 e 360×800: coleta, modal de monstro, transição à batalha, feitiço, vitória, atribuição uma única vez, retorno sem encontro automático, nova batalha e fuga com Xbox B.
5. Playtest físico em Android (pendente).

## Próximo bloco

M1d: extrair a lógica de RPG de `game.js` para um núcleo compartilhado, com adaptador de saves versionados e testes de migração. **Só depois** sincronizar permanentemente XP/loot/crafting com o PWA antigo.
