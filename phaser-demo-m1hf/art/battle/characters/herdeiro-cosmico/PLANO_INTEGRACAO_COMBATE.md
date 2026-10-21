# Plano de integração — Combat Battlers e Herdeiro Cósmico

**Situação:** arquitetura proposta; nenhuma animação ou magia nova foi integrada ao runtime por este documento.  
**Data da análise:** 2026-10-21.  
**Jogo:** Peren, o Bruxo, único Modo Livre, prévia Phaser M1h-F.

## 1. Inventário real — fonte vs. arte importada

| Conjunto | Arte existente | Disponível em GitHub? | Papel proposto |
|---|---|---|---|
| `Peren Idle Battler` | 4 poses planejadas para folha de 1916×821 px, 479×821 por frame, 4 FPS | **Somente** `phaser-demo-m1hf/art/characters/peren/battler/idle/manifest.json` e README na `main`; `peren_idle_battler_4frames.png` **ausente** | Personagem de batalha permanente, substituição visual gradual da sprite 48×64 |
| `Herdeiro Cósmico v1` | 32 PNG RGBA no ZIP entregue: retratos 5, olhos 6, bocas 6, pálpebras 4, mãos 4, cabelos 2, mantos 2, efeitos 3 | **Somente documentação** na PR #63; PNGs não importados ao repositório | Cut-ins, expressões e VFX em planos separados |
| `Peren 48×64` | Atlas de exploração + ações antigas | Presente e funcional | Fallback até aprovação e chegada dos masters novos |
| Monstros e VFX atuais | Atacante/inimigo; VFX fogo/gelo/arcano 80×80 | Presentes | Conservar animações, regras e timing dos encontros |

**Identidade narrativa:** `Peren Kerrhylon` e `Herdeiro Cósmico` não foram oficialmente mapeados como a mesma entidade ou transformação. Manter os bundles independentes e o binding por configuração; não inventar a relação.

## 2. Arquitetura existente verificada

A `main` possui a prévia distribuída em `phaser-demo-m1hf/` e bundle `assets/game-B5Gp97dd.js` compilado; ela não mantém `phaser-lab/src/` como pasta de fonte.

A branch `feature/phaser-m1h-f-free-assets` contém o projeto-fonte Vite/Phaser, incluindo:

- `phaser-lab/src/battle-scene.js`: `BattleScene` (Phaser 3), criação dos atores, `resize`, `animatePlayer`, `animateEnemy`, `takeTurn` e `endBattle`.
- `phaser-lab/src/combat.js`: lógica pura de turno `stepBattle`; magias implementadas `mag-raio-de-fogo`, `mag-raio-de-gelo` e `mag-misseis-magicos`.
- `phaser-lab/src/main.js`: inicialização `Scale.RESIZE` (referência 390×844), HUD HTML, botões e bridge dos saves.
- `phaser-lab/scripts/sync-assets.mjs`: copia recursos de `phaser/assets` para `phaser-lab/public/art`.
- `phaser-lab/scripts/prepare-demo.mjs`: empacotamento Vite, PWA e geração das pastas publicadas.
- `phaser-lab/scripts/m1hf-combat-qa.mjs`: testes browser de batalha, recompensas, persistência e responsividade.

**Antes de alterar:** reconciliar essa fonte com a `main` e com mudanças posteriores de assets/controle; NÃO copiar uma versão antiga do bundle sobre a versão atual. Não editar o minificado manualmente.

## 3. Proposta visual: híbrido battle actor + cut-in

- **Camada 0:** cenário Mürin e inimigo, como hoje.
- **Camada 1:** `Peren Idle Battler` (folha com 4 quadros, quando o PNG existir) no lado esquerdo; escala por área disponível, preservação de proporção e âncora de base. Primeiro só `idle`.
- **Camada 2:** ação física do battler (sem novos frames, usar deslocamento breve da base ou sprite anterior, até material específico).
- **Camada 3:** *cut-in* episódico de retratos/corpo superior do Herdeiro Cósmico, com mãos, manto e cabelo apenas quando alinhamento for aprovado; oculto durante espera. Não sobrepor olhos e bocas sobre bustos completos sem máscara e registro.
- **Camada 4:** efeitos `efeito_01_portal`, `efeito_02_vortice`, `efeito_03_explosao`, em conjunto ou substituindo efeitos existentes conforme tipo de magia.
- **Camada 5:** HUD HTML (PV, PM, rodada, comandos), sempre legível e clicável.

**Filtros:** preservar `pixelArt: true` e nearest-neighbor para charset; renderizar retratos detalhados em superfície de alta resolução com dimensionamento proporcional, sem forçá-los a 48×64 nem pixelá-los artificialmente.

**Comportamento adaptativo:** retrato e cut-in na zona de batalha com limites seguros para 360×800, 390×844 e 1280×800; evitar que ultrapassem os controles do rodapé, as barras de PV ou o nome do inimigo. Considerar `prefers-reduced-motion`.

## 4. Mapeamento de estados e ações

| Ação/resultado atual | Battler de campo | Camadas opcionais | Trigger / conclusão |
|---|---|---|---|
| `idle` | Atlas 4×1, 4 FPS, loop (somente após upload) | leve respiração do manto | retorno após cada ação |
| `attack` | avanço breve / fallback 48×64 | sem gesto inventado | efeito sincronizado com evento `hit` já calculado |
| `spell:mag-raio-de-fogo` | postura conjuração | `retrato_03`, mão 03, VFX existente de fogo | hit vindo de `stepBattle` |
| `spell:mag-raio-de-gelo` | postura conjuração | `retrato_03`, mão 03, VFX gelo | hit + estado `frozen` existente |
| `spell:mag-misseis-magicos` | postura conjuração | `retrato_03`, mão 03, portal → vórtice → explosão, alinhados ao VFX arcano | um só registro de dano/recompensa |
| `defend` | postura de guarda | escudo/runa atual | não alterar a defesa em `combat.js` |
| `potion` | interação existente | efeito restaurador atual | não consumir item pelo callback visual |
| inimigo `hit` | Peren recua visualmente | `retrato_04`; tremor curto | animação termina, volta a idle se vivo |
| `won` | manter vencedor | `retrato_05`; efeito opcional | término da batalha mantém confirmação de loot existente |
| `lost` | postura ferida | `retrato_04` | mantém resgate e save |
| `fled` | saída curta | sem cinematização obrigatória | manter lógica de fuga |
| `Void Rift` | pose-base do manifesto Idle Battler | portal cósmico como inspiração | **apenas conceito visual**; nenhuma magia nova cadastrada |

Os tempos 1400 ms para conjuração, 450 ms para impacto e 800 ms para ferido do `animation_recipes.json` são **propostas**, não timings de sprites exportados. Ajustar após preview e QA.

## 5. Contrato técnico recomendado

Criar módulos de apresentação desacoplados do combate:

- `phaser-lab/src/battle-actor.js`: cria/responsabiliza sprites de battler, controla `idle`/fallback, registro e layout.
- `phaser-lab/src/battle-cutin.js`: composição de retratos/VFX, overlays descartáveis e mascaramento.
- `phaser-lab/src/battle-animation-director.js`: `play(action, events)`, sequência em estágios e cancelamento por shutdown; nenhum acesso ao save.
- `phaser-lab/src/battle-scene.js`: delega `animatePlayer`/`animateEnemy` mantendo `stepBattle` e `endBattle` intactos.
- `phaser-lab/src/combat.js`: **não modificar** nesta etapa.

O motor já usa `result=stepBattle(...)` com `events` contendo `kind:'hit'`, `source`, `damage` e `effect`. O diretor consome esses eventos para mostrar efeitos e nunca determina dano.

**Fail-safe**: `busy` volta a `false` em `finally` quando uma animação não carregar/falhar; no `SHUTDOWN`, remover timers, listeners, tweens e sprites pendentes. O evento de finalização da animação não pode reaplicar `finishBattle`, comprar/consumir itens ou disparar um turno extra. Se qualquer PNG estiver ausente, usar o atlas de 48×64 e os VFX atuais.

## 6. Plano de trabalho em quatro PRs pequenas

1. **PR 1 — Importação e QA de arte:** colocar masters imutáveis e 32 sprites no GitHub, com manifest e hashes; importar `peren_idle_battler_4frames.png` quando disponível; verificar PNG/alpha, canais, licença e dimensões. Nenhum código de combate.
2. **PR 2 — Battler Idle:** sprite de 4 quadros e 4 FPS no `BattleScene` com fallback automático, responsividade e opções para movimento reduzido; teste visual desktop/mobile. Nenhum efeito de gameplay.
3. **PR 3 — Cut-ins/VFX:** sprites do Herdeiro Cósmico para conjuração, impacto, ferimento, vitória; alocação e âncoras validadas em galeria de QA; reutilizar as três magias existentes sem criar `Void Rift` mecânico.
4. **PR 4 — Polimento e publicação:** timings, som opcional somente se houver assets próprios, remoção de overlays no encerramento, atualização PWA, revisão do contraste e QA completo; publicar somente com aprovações e pipeline verde.

## 7. Critérios de aceite

- [ ] 32 componentes disponíveis e carregáveis por endereço real na prévia, com hashes conferidos.
- [ ] Master de `Idle Battler` importado ou fallback demonstrado sem erros de rede.
- [ ] `idle` não vira loop de conjuração/dano; `cast`, `hurt`, `win` são one-shot.
- [ ] 360×800, 390×844, 1280×800: sem sobreposição de comandos, PV, PM e nomes.
- [ ] `attack`, fogo, gelo, arcano, defesa, poção, fuga, derrota e vitória executáveis por toque, teclado e Xbox.
- [ ] `stepBattle`, custos de PM, chances/danos e loots idênticos aos baselines.
- [ ] Save clássico intocado; Phaser termina combate e retoma exploração sem travar; reload preserva recompensa uma vez.
- [ ] Browser offline com cache atualizado e sem sprites faltando.
- [ ] Carga inicial controlada: assets de cut-ins são carregados só ao entrar em batalha ou por preload de baixa prioridade; sprites não usados não impactam exploração.
- [ ] QA humano da composição e vinculação final da identidade do Herdeiro Cósmico a personagem/forma específica.

## 8. Próxima ação concreta

Importar binários ausentes antes de prometer sprites animados: **hoje a PR #63 é somente um índice**, e o Idle Battler da `main` é somente um manifesto. Trabalhar com a prévia Phaser e seus arquivos fonte, não com o bundle minificado. O primeiro teste visível deve ser `idle`/fallback e, em seguida, um **ataque arcano usando um cut-in e o portal**, sem modificar regras ou inventário.
