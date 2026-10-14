# M1b — Criaturas de Mürin, patrulhamento e primeiro encontro

**Branch:** `feature/phaser-m1b-criaturas` empilhada sobre `feature/phaser-movimento`.

## Objetivo e limites

Dar vida à Floresta de Mürin **sem reimplementar o combate do Peren 0.1.2**. O jogo publicado em `main`, sua chave `peren_carcaca_save_v1`, crafting, inventário, compras e experiência **não são alterados nesta entrega**.

## Monstros do catálogo já existente

| ID canônico | Aparência autoral desta entrega | Comportamento |
|---|---|---|
| `mob-galho-infectado` | galhada infectada, olhos vermelhos, raízes ambulantes | sentinela; reage a perturbações próximas |
| `mob-fungo-violeta` | fungo andante, capa púrpura, olhos luminosos | lento, aparece sob vegetação densa |
| `mob-ettercap` | caçador aracnídeo com carapaça escura e olhos brilhantes | fareja a distância, persegue mais rápido |

Arquivos `phaser/assets/monsters/{id}/atlas.png`, `portrait.png`, `meta.json`: sprite 64×64, atlas 4 colunas × 7 linhas; **28 frames por criatura**. Sete clips próprios: `idle`, `walk`, `alert`, `attack`, `hurt`, `retreat`, `death`. Arte pixel autoral produzida por desenho procedural, não cópia nem simples ícone genérico. Status no manifesto: `em_producao` até revisão visual e teste em Android.

## Patrulhas e exploração

- `src/encounters.js` é independente do Phaser e usa a mesma seed do terreno, sem depender de `Math.random()`.
- Seis criaturas por expedição (duas de cada espécie), colocadas em casas navegáveis, próximas às trilhas mas afastadas da chegada/saída e das plantas iniciais.
- Patrulha, perseguição, investigação ao perder de vista e retirada após encontro.
- Obstáculos interrompem linha de visão; vegetação cerrada e névoa reduzem alcance; correr aumenta a detectabilidade; solo encharcado reduz a velocidade de Peren.
- O encontro pausa o mundo e abre diálogo de observação/recuo. Recuar escolhe ponto alcançável e põe a criatura em cooldown de 10 segundos para prevenir encontros em ciclo.

## Delimitação de integridade

**Não existe combate funcional nesta M1b.** Não há dano, vitória, morte de monstro, recompensa, experiência ou loot. O menu informa explicitamente que o combate Phaser virá no M1c. O recuo é o único caminho de continuidade; B/A no controle Xbox servem para sair com segurança. O usuário não fica preso em combate ou em pop-up; ESC/B também funcionam.

## QA

- `npm test`: teste por 100 seeds de geração de patrulhas, identidades, alcance, cobertura, névoa, cooldown e recuo.
- `python tools/test_monsters_art.py`: integridade dos arquivos, atlas e sete clips por espécie.
- `npm run build` + `npm run test:e2e`: validação Chromium com sprites reais, mapa, encontro e recuo; screenshots.
- Inspeção artística e Playtest físico no Android ainda são requisitos para marcar `aprovado`.

## Próxima etapa: M1c

Introduzir `BattleScene` com o núcleo de combate isolado, ações visualizadas, efeitos de pelo menos três magias e compromisso transacional (`encounterId`) para impedir duplicação de XP/loot ao recarregar. Manter menus e motores econômicos.