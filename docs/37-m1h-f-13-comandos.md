# M1h-F.13 — Consequências claras dos comandos de combate

**Objetivo:** antecipar as regras reais de cada comando antes da confirmação, sem revelar resultados futuros e sem alterar a dificuldade.

## Comportamento

O campo de dica existente abaixo das ações fica contextual: segue a escolha pelo teclado/controle, o foco do mouse e o apontamento. As descrições se baseiam diretamente em `combat.js`:

- **Atacar:** dano físico variável; um inimigo sobrevivente pode contra-atacar.
- **Defender:** recupera até 4 PM, aproximadamente 52% de redução do próximo ataque daquela rodada.
- **Poção:** consome 1, recupera até 36 PV (limitados ao máximo), não impede a reação do monstro.
- **Fugir:** termina imediatamente, sem XP ou saque. Não há rolagem de chance de fuga no motor atual.
- **Fogo:** custo real em PM, queimadura 3 PV na rodada atual e até 3 na próxima, se sobreviver.
- **Gelo:** custo real em PM, suprime a reação da criatura nesta rodada.
- **Mísseis Mágicos:** custo real em PM, dano arcano sem efeito adicional.
- **Indisponível:** mostra motivo para falta de mana, ausência de poções, magia não aprendida, ação em processamento ou luta encerrada.

`command-consequences.js` é um módulo puro de leitura e o jogo estável continua usando `actionDetails()` original. Não foram alterados `combat.js`, `battle-scene.js`, save, IA, recompensa, probabilidade, foco ou comandos de ação. No celular, as dicas cabem em um bloco rolável para não cobrir os comandos.

## QA e publicação

- [x] Implementação de apresentação e helper puro, somente na prévia M1h-F.
- [x] Testes Node verificam custos/equivalência do motor, motivos de indisponibilidade e ausência de mutação.
- [x] Testes Chromium nas resoluções 360×800, 390×844 e 1280×800, com foco nos sete comandos, alteração sintética de estado para verificar indisponibilidade e isolamento de saves.
- [ ] CI Node/Vite/Chromium completa aprovada.
- [ ] Publicação isolada `phaser-demo-m1hf/` após diff auditado via PR seletiva.
- [ ] QA público dos comandos, seis vitórias, resiliência, Diário, PWA e saves.
- [ ] Playtest humano em Android e Xbox físicos; avaliar legibilidade e rolagem da dica.
