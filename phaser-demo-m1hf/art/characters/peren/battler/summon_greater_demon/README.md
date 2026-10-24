# Summon Greater Demon — Peren Kerrhylon (asset de batalha v1)

## Material entregue pelo criador

- Arquivo `Peren_Summon_Greater_Demon_Integration_v1(1).zip` — SHA-256 `e0e36495bfa649ff85af65e94e844ffa5a15dec92de2ebc0519e357b7432c179`.
- Atlas transparente `2048 × 1024`, **4 colunas × 2 linhas**, 8 quadros RGBA de **512 × 512**.
- Oito PNGs individuais pixel idênticos às células do atlas (conferidos), além do PNG original com fundo verde, GIF, imagem de contato e manifest original.
- A animação exibe Peren preparando uma ruptura, abrindo a fenda, o demônio surgindo e encarando o jogador, culminando na retração.
- **Não é animação de exploração**, não substituir o atlas 48×64.

## Ritmo canônico do pacote

| Quadro | Ação | Duração |
|---|---|---:|
| 01 | Preparação | 190 ms |
| 02 | Fissura inicial | 210 ms |
| 03 | Fenda aberta | 250 ms |
| 04 | Primeiro contato | 300 ms |
| 05 | Emergência | 330 ms |
| 06 | Manifestação completa | 400 ms |
| 07 | Confronto com a quarta parede | 380 ms |
| 08 | Retração da fenda | 320 ms |
| **Total** | **One-shot** | **2.380 ms** |

O adaptador `phaser-demo-m1hf/summon-greater-demon.mjs` tem:

1. `preloadSummonGreaterDemon(scene,{assetsInstalled:false})`: ignora com segurança enquanto o atlas não estiver publicado.
2. `playSummonGreaterDemon(scene,actor)`: oculta temporariamente o battler atual, reproduz os 8 quadros nos tempos exatos, limpa timers e sprites no fim e restaura o battler original.
3. `summonTimeline(ms)`: mapeamento puro do tempo de execução para índices de quadros.
4. Fallback sem mudanças no jogo se a textura não estiver disponível. Limpeza também no `shutdown` do Phaser.

## Status real no projeto

**O código de apresentação foi adicionado à branch**, mas a imagem binária **não foi enviada ao GitHub** por este conector. Não há nova magia jogável nem alteração no `BattleScene`, `combat.js`, mana, concentração, dano, inimigos, saves ou recompensas. A ativação da animação no combate exige primeiro importar os PNGs e então vincular o gatilho ao evento de feitiço que vier a ser especificado pelo sistema de jogo.

A entrega completa **já é testável** no `Peren_Asset_Forge_v8_Summon_Greater_Demon_Standalone.html` fornecido na conversa (página offline com miniaturas e frames incorporados). O `Peren_Asset_Forge_v8_Summon_Greater_Demon_Pacote_Completo.zip` inclui todos os masters e o Asset Forge v8, com **82 registros**, **263 arquivos conferidos** e testes JavaScript do adaptador.

### Como instalar os binários no clone

```bash
python ferramentas/instalar_asset_forge_v8.py Peren_Asset_Forge_v8_Summon_Greater_Demon_Pacote_Completo.zip
node --test tests/qa_peren_summon_greater_demon.mjs
```

Para importar somente o material novo (sem o restante do Asset Forge):

```bash
python ferramentas/importar_summon_greater_demon.py "Peren_Summon_Greater_Demon_Integration_v1(1).zip"
```

Em seguida: revisar halos em fundo escuro e claro, commitar PNGs, validar deploy de `phaser-demo-m1hf/asset-lab/`, atualizar o cache PWA **apenas depois de verificar que os arquivos existem**, e habilitar `preloadSummonGreaterDemon` no `BattleScene` somente se a animação for usada numa ação realmente disponível.

**Atenção:** a fenda, Peren e o demônio estão compostos em uma mesma imagem por quadro. Não há sprites independentes da criatura. A remoção de chroma foi automática e alguns contornos finos podem ter halos. Não apresentar como asset de produção artística validado até revisão.

## QA executado na prévia local

- Os SHA-256 do ZIP enviado e das suas 14 entradas registradas coincidiram.
- Atlas comparado com oito PNGs: todas as células foram idênticas em RGBA.
- Sequência de 2.380 ms validada.
- Asset Forge v8: testes de navegador de 1440×900 e 390×844, com pesquisa, oito miniaturas, seleção de quadro e renderização do PNG. Sem exceções JS.
- Testes unitários locais do adaptador: passagem de quadro, textura ausente, pré-carregamento sob opt-in, retorno ao idle (4/4).

**A rota pública não foi atualizada por esta PR.** Não prometer link de Pages de Summon até importar os PNGs, incorporar a demonstração e verificar a publicação.
