# Calendário oficial da Carcaça — Era da Carcaça (EC)

**Regra canônica de ambientação, 09/11/2026.** Esta é a referência para tempo e acontecimentos de toda a Carcaça, inclusive jogos futuros do cenário.

## 1. Calendário Erisiano

O calendário da Carcaça adota a **estrutura do calendário discordianista/erisiano** descrita na referência entregue pelo criador do mundo; não adota sua numeração de anos litúrgicos (YOLD). Na Carcaça usamos a **Era da Carcaça — EC**.

- Ano normal: **365 dias**, distribuídos em **5 estações de 73 dias cada**.
- Semana: **5 dias**, em ordem: **Sweet**, **Boom**, **Pungent**, **Prickle**, **Setting Orange**.
- Estações e início na correspondência convencional de ano civil: **Chaos (Caos), 1º de janeiro**; **Discord (Discórdia), 15 de março**; **Confusion (Confusão), 27 de maio**; **Bureaucracy (Burocracia), 8 de agosto**; **The Aftermath (Consequência), 20 de outubro**.
- Anos bissextos: **Dia de São Tib**, intercalado no lugar de **29 de fevereiro**, **fora das semanas e das estações**; não reinicia nem avança a sequência Sweet/Boom/Pungent/Prickle/Setting Orange.
- A regra computacional **4/100/400**, aplicada aos números EC para definir quais anos são bissextos, é **provisória**. Uma correspondência histórica entre ano EC e gregoriano ainda **não foi estabelecida**. O calendário do jogo não deduz tal correspondência.
- Relógio: ciclo contínuo de 24 horas, 60 minutos por hora. Interface: `1 de Caos · Sweet · 922 EC · 08:00`.

## 2. Época inicial e estados canônicos

**Início do jogo: 922 EC**, primeiro dia de Caos, 08:00 (hora inicial provisória para testes).

Já ocorreram no início da pré-alfa:
- Voragar e seus Dragões **foram mortos**.
- Rayquaza **desapareceu misteriosamente**.

Esses estados compõem a história conhecida em 922 EC; não são missões a serem repetidas quando o jogo começa.

## 3. Acontecimentos históricos futuros (canônicos)

| Ano EC | Evento | Flags permanentes |
|---|---|---|
| **983** | Demônios invadem a Carcaça a partir do Abismo. O Templo das Sombras é destruído. | `abismo_invadido_por_demonios`; `templo_das_sombras_destruido` |
| **984** | Gualápolis é tomada pelo golpe do Senhor do Rio. | `gualapolis_tomada_pelo_senhor_do_rio` |
| **999** | O Templo do Crepúsculo é construído. | `templo_do_crepusculo_construido` |

Na primeira integração os eventos ocorrem na abertura de seus anos EC, passam a constar no **Diário e na Crônica da Carcaça** e deixam flags persistidas em `worlds.historicalFlags`, como fundamento para alterações futuras em mapas, NPCs e missões. Os detalhes da ocupação, da invasão, dos cenários e dos participantes **não devem ser inventados** por regras de combate antes de sua curadoria. Grandes saltos temporais atravessam os marcos na ordem correta, sem duplicação.

## 4. Tempo e dimensões

O **tempo só passa na Carcaça**. As viagens a outras dimensões, como Shadowfell, serão implementadas futuramente; o motor já permite a indicação `worlds.clock.dimension`:
- `carcaca`: o relógio do mundo avança e, com ele, fome, sono, envelhecimento e marcos históricos.
- Qualquer outra dimensão: o relógio **fica suspenso**; seus efeitos dependentes de tempo também, incluindo fome, sono, envelhecimento e eventos históricos.
- Não há por enquanto botão, portal ou acesso jogável ao Shadowfell. Alterar a dimensão via console não representa uma mecânica aprovada.

A pré-alfa não acumula passagem de tempo enquanto o navegador está fechado, em outra aba suspensa ou com exploração pausada por menus. Na exploração ativa, **1 segundo real corresponde provisoriamente a 1 minuto no mundo**, persistido em intervalos de três minutos. Ações usam durações próprias, que fazem parte da mesma transação do inventário e do tempo.

## 5. Sobrevivência e identidades possíveis

Peren é um **metamorfo mortal**; ser metamorfo não lhe concede imunidade à inanição, exaustão, ferimentos ou envelhecimento.

- Dois medidores persistentes de 0 a 100: **fome/saciedade** e **descanso/sono**.
- Comer consome uma **ração de viagem** existente no catálogo, aumenta saciedade e avança o tempo.
- Dormir de **1 a 12 horas** restaura o descanso, recupera parte de PV/PM e consome tempo; não força artificialmente a virada do dia.
- Deixar fome ou descanso a zero por tempo suficiente causa dano; exaustão e inanição podem matar. O morto não pode continuar agindo nem se ressuscitar gratuitamente. Há exportação e restauração **explícita** de um backup anterior.
- `survival.physiology` define **forma**, **dieta**, **necessidade de sono**, **mortalidade**, **taxa de envelhecimento**, **longevidade** e **permissão futura de ressurreição**. São parâmetros independentes: vampiro pode precisar de sangue; lobisomem pode ter metabolismo variável; uma ressurreição pode modificar a forma; imortalidade pode impedir morte por idade, ou não haver necessidade de alimento.
- **Não há transformação ou ressurreição funcional habilitada nesta etapa.** A existência de parâmetros no motor não concede poderes ao jogador.
- O limite experimental de **120 anos jogados** para a forma inicial e as velocidades de fome/sono são parâmetros de **balanceamento provisórios**, não uma declaração definitiva sobre a longevidade de metamorfo ou a idade pregressa de Peren.

## 6. Integridade do sistema

A pré-alfa continua com **schema de save Phaser v2**, usando a chave isolada existente. Saves da versão anterior, que só possuíam um número de dia e fadiga, recebem calendário/necessidades durante leitura/normalização sem apagar o original e mantendo seus itens, atributos e histórico.

Toda ação (coletar, estudar, misturar, criar, negociar, comer, dormir, viajar, lutar) consome **minutos**, **jamais uma das três antigas ações diárias**. O campo `actions` é mantido apenas como legado de compatibilidade, sem qualquer efeito na jogabilidade.

A cronologia tem dois estados persistentes: `worlds.clock` e `worlds.historicalFlags`/`worlds.eventLog`. A mesma transação salva alterações de inventário/atributos, metabolismo, relógio e eventos; uma falha de escrita não deve criar progresso parcial.

## 7. Horizontes de desenvolvimento

O marco seguinte é definir as **consequências espaciais, políticas e mecânicas** da invasão do Abismo, do golpe de Gualápolis e da construção do Templo do Crepúsculo. Depois, desenhar os diferentes regimes biológicos e ontológicos para vampirismo, licantropia, imortalidade plena, ressurreição élfica e planos sem tempo.

**Nenhuma dessas decisões pode pressupor que o metamorfo é imortal.**
