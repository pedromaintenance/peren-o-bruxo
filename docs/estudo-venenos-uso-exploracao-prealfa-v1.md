# Uso de Preparados na Exploração e Vias Próprias de Veneno — Pré-alfa v1

> **07/11/2026 · ESTUDO E IMPLEMENTAÇÃO EXPERIMENTAL.** Continuação da [PR #101](https://github.com/pedromaintenance/peren-o-bruxo/pull/101) pela [PR #102, empilhada e em rascunho](https://github.com/pedromaintenance/peren-o-bruxo/pull/102). A [Emenda S1](constituicao-design-v1.md) dispensa retrocompatibilidade com saves anteriores durante a pré-alfa; **não** dispensa transações corretas na partida atual. Não houve merge/publicação.

## 1. Inventário deixa de ser somente leitura para os preparados

A interface Phaser anterior listava somente `character.bag`. Preparados saídos de `brewPair` vivem como **instâncias** em `character.alchemy.preparations[]`, não como novos registros de `bag`. A interface foi ampliada para incluí-los como consumíveis individuais, com IDs reais e rótulos públicos genéricos **Preparo alquímico N**, sem inspecionar ou exibir IDs de propriedades ocultas. Equipamentos, consumíveis tradicionais, material e missões continuam consultivos nessa tela.

**[IMPLEMENTAÇÃO NA BRANCH]** `phaser-lab/src/ui-inventory.js` gera o modelo dessas instâncias, mas **não executa diretamente uma transação**. A função `onUsePreparation(id)` é delegada ao controlador `main.js`, que valida contexto e chama o `progressBridge.execute({type:'usePreparation',id,context:'exploration'})`. A operação é registrada com `ledger['prepared-use:'+id]` dentro de uma revisão única. O mesmo ID usado novamente retorna recibo anterior, sem produzir item ou cura duplicada. O controlador atualiza HUD e perfil de combate após o commit.

**Acesso durante exploração:** `⚗ BOLSA` para toque, **I** no teclado e **Y** no controle Xbox. Quando a tela abre com a cena de exploração ativa, o motor **pausa a exploração**; ao fechar, só retoma se a cena tiver sido pausada por esse menu e não houver batalha, encontro ou hub. O uso de frasco é bloqueado enquanto o encontro ou combate estiver ativo. Na cidade o inventário também está disponível: “fora de combate” é o contexto operacional, **não** uma fronteira geográfica canonizada.

## 2. Semântica de restauração reutilizada

`applyExplorationPreparation` em `phaser-lab/src/prepared-use.js` usa o **mesmo executor** da experiência de combate, com os mesmos resultados provisórios:

- `restaurar_saude`: **+24 PV**, até o máximo **calculado do personagem**.
- `restaurar_magia`: **+12 PM**, até o máximo **calculado do personagem**.

Ambos são **valores de playtest da pré-alfa**, não parâmetros aprovados de I–III. Não existe cura parcial se o frasco também contém efeito ainda não executável; a aplicação inteira é bloqueada e o estoque preservado. O uso fora de combate não é permitido se o personagem estiver com PV zero; não ressuscita automaticamente. Se a recuperação não produzir **nenhuma alteração em PV/PM**, a tentativa é rejeitada sem gastar o frasco.

**Custo provisório:** uso deliberado **não gasta ações diárias** na exploração. O futuro custo de usar itens fora de combate permanece a decidir. O frasco é consumido **uma vez** na transação, sem segundo débito em `bag`, pois as instâncias têm seu próprio inventário.

**Conhecimento do personagem:** recibos públicos e o diário registram `Preparo utilizado` sem descrever propriedades ainda não identificadas. O backend resolve o conjunto real e integral dos efeitos. Nem o apelido público nem os ícones podem virar atalho para deduzir propriedades ocultas.

## 3. Pesquisa de Venenos — três vias distintas, nenhuma aprovada

Ao contrário das Poções restauradoras, a família **Veneno** não pode herdar `drink:self` simplesmente por ser um consumível. A pesquisa [`poison-route-proposal.js`](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/prealfa-uso-exploracao-venenos-20261107/phaser-lab/src/poison-route-proposal.js) mantém todas as tentativas como `ready:false`, apenas identificando decisões mecânicas não tomadas.

| Via estudada | Alvo | Escolhas ainda necessárias |
| --- | --- | --- |
| **Lançar o frasco** | Criatura no combate | Alcance, mira, resistência, dano efetivo, falha, consumo e custo por turno |
| **Impregnar uma arma** | Arma equipada | Cargas por acerto, duração, elegibilidade, resistência, persistência entre cenas e precedência de Bálsamos |
| **Administrar uma dose** | Outra criatura | Consentimento ou surpresa, modo de contato, furtividade, resistência, custo e falha |

**Nenhuma dessas vias é automaticamente bem-sucedida.** `poison-route-proposal.js` não possui função de commit e **não causa dano nem consome frasco**. A existência de `dano_saude` no catálogo não determina magnitude de dano, resistência ou acerto. A resistência não deve ser substituída por uma rolagem inventada sem aprovação.

**Evidência real de curadoria:** **Beladona** (`ing-nightshade`) + **Sino da Morte** (`ing-deathbell`) compartilham exclusivamente `dano_saude`. Esse par permite testar um veneno simples sem alterar os 111 ingredientes. Já **Flor Vermelha** + **Beladona** compartilham **`dano_saude` e `aumentar_magia`**; um frasco dessa mistura **não** pode simplesmente descartar o efeito positivo para caber num executor de venenos. É preciso definir como múltiplos efeitos são aplicados ao alvo e preservar a classificação anterior de Impuro baseada apenas nas incompatibilidades aprovadas.

**Não misturar famílias indevidamente:** impregnar uma arma com veneno não transforma automaticamente esse preparado em Bálsamo. Venenos têm seu próprio método de entrega, enquanto Bálsamos continuam uma família de aplicação em objetos; seu eventual conflito de camadas (óleo/veneno/encantamento) é um tema aberto.

## 4. QA e estado de integração

- **PR #102** contém `prepared-use.js` estendido, `progress.js` com transação de exploração, `ui-inventory.js`, `main.js`, `index.html`, `ui-inventory.css`, testes `prepared-exploration.test.mjs`, o contrato de Venenos e testes próprios.
- **19 testes Node de exploração** foram adicionados: recursos, consumo, idempotência, save/reload, falha de gravação, concorrência entre abas, sigilo, bancada com ingredientes reais e saldo ao entrar em combate.
- **12 testes Node de pesquisa de Venenos** foram adicionados: par canônico, três vias, bloqueios sem alvo, semânticas mistas e sigilo.
- Foi preparado um **smoke de navegador Chromium** `scripts/prepared-exploration-browser-smoke.mjs` que opera a UI real: fabricar Flor Azul da Montanha + Asa de Borboleta, abrir inventário, usar frasco, confirmar PV e ledger, entrar na floresta, abrir inventário e verificar pausa/retomada da cena.
- **CI do último commit e teste físico precisam ser verificados separadamente**; execução anterior do pipeline da branch já aprovou o uso da exploração, mas mudanças posteriores no botão de campo e browser smoke exigem nova validação. Não confundir teste de navegador automatizado com inspeção humana da UI em celular/Xbox.

## 5. Próximas decisões e gates

**[EXP-D01]** Calibrar 24/12 por intensidade, origem e contexto, ou rever o ganho fixo antes de avançar.

**[EXP-D02]** Escolher se o uso fora de combate consome ação diária, tempo do mundo ou somente frasco. Na atual pré-alfa, apenas o frasco é gasto.

**[EXP-D03]** Aprovar uma primeira via de Veneno: **lançar**, **impregnar arma** ou **administrar**. Não assumir que uma cobre os três casos.

**[EXP-D04]** Definir precisão, resistência/consentimento, falha e momento do consumo antes de ativar dano contra inimigos.

**[EXP-D05]** Definir como misturas com múltiplos efeitos afetam criatura/arma, preservando cada propriedade e o sigilo do Caderno.

**[EXP-D06]** Testar o uso em equipamento, empilhamento, duração e persistência só após escolher a via correspondente.

**[EXP-D07]** Playtest humano no teclado, mobile e controle Xbox, com verificação de pausa/retomada de cena, feedback, ganho real de recursos e consumo único.

**Horizonte concreto:** validar a aplicação em exploração no navegador real e decidir a **primeira via de entrega de Veneno**. Compatibilidade com saves antigos **não** bloqueia essa evolução.
