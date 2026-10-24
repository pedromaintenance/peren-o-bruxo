# Peren — Battle Art v8.8 · release publicado

**Data:** 24/10/2026  
**Release original:** `1f6126534a74ca60bf6421306761be0271cf5020`, merge da [PR #69](https://github.com/pedromaintenance/peren-o-bruxo/pull/69) na `main`.  
**Deploy:** [GitHub Pages — execução bem-sucedida #40111834319](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/40111834319).

**Jogo:** https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/

## Entregas efetivamente publicadas

A pasta `art/battle/runtime-v84/` está em `main`, com **8 PNGs originais e manifesto** com SHA-256. O JavaScript `battle-art-runtime-v84.mjs` carrega os assets automaticamente na batalha e preserva o fallback quando algum arquivo não está disponível.

| Evento | Nova representação |
|---|---|
| `idle` | Novo battler de Peren (4 quadros, 560×821; loop a 4 FPS) |
| Raio de Fogo | Rajada Infernal de fumaça e caveiras (8 quadros; apresentação visual apenas) |
| Mísseis Mágicos | Void Rift (11 quadros; apresentação visual apenas) |
| Summon Greater Demon | Prévia visual de 2,38 s, acessada via menu **Cenas e invocações** (não é magia registrada em combate) |
| Cenas | Quatro portraits selecionáveis no mesmo menu |

**Sem mudanças em** regras, dano, consumos de PM, probabilidade de acerto, inventário, loot, XP, lógicas de save e sprites de exploração.

## Evidência de qualidade

- [Peren Official Art QA #40111685587](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/40111685587): sucesso, incluindo renderização de batalha com HUD correto nos tamanhos **390×844** e **1280×800**, nova sprite Idle plenamente visível, magias Infernal e Void Rift, retorno ao Idle.
- [Peren Single Free Mode QA #40111685564](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/40111685564): sucesso.
- [Capturas da batalha real #12566528706](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/40111398459/artifacts/12566528706): 6 imagens de Idle e conjurações para inspeção.
- [Importação binária #730b720](https://github.com/pedromaintenance/peren-o-bruxo/commit/730b7200a1ddd7001f6dfc2f1159d6ab232c8774): 8 PNGs e manifesto, com arquivos SHA-256 verificados na Action de ingestão.
- [Pages build #40111834319](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/40111834319): sucesso no merge.

## UX mobile

A área de comandos de batalha foi compactada para preservar a visualização do battler entre cabeçalho e controles; os efeitos são posicionados de acordo com o tamanho efetivo desse espaço. O menu **Cenas e invocações (prévia)** é recolhível para não ocultar a arena. Os comandos por teclado, toque e controle permanecem os originais.

## Diagnóstico

Ao usar `?debug-battler=1`, o código registra manifesto ausente, falha de PNG, pacote encontrado ou falha de rede. Esse diagnóstico é um **auxílio de rede**, não substitui a validação SHA-256 do repositório. Se o cache PWA do navegador estiver antigo, atualizar a página ou limpar o cache do aplicativo.

## Escopo pendente

O jogo passou nos testes automatizados e os PNGs foram distribuídos pelo Pages. **O acesso HTTP ao site público não pôde ser lido diretamente do ambiente desta conversa**; o sucesso do Pages foi comprovado pelo workflow de implantação. O teste humano do gameplay com o arquivo publicado, incluindo percepção de escala, som e dinâmica dos efeitos, continua importante.

A invocação demoníaca é somente visual, sem mecânica de concentração, criatura, duração ou custo. Essa mecânica pode ser desenvolvida em ciclo separado.
