# Peren, o Bruxo — Mercador da Carcaça

> **Direção de desenvolvimento (30/10/2026):** a edição clássica HTML/JS está congelada; toda nova jogabilidade será feita no **Phaser**. Ainda não há paridade completa nem substituição da página pública. O projeto está em pré-alfa e **não exige migração de saves entre motores**. Consulte o [roadmap da transição](docs/roadmap-transicao-phaser.md) e a [auditoria alquímica](docs/auditoria-alquimia-peren.md). A curadoria é canônica e receitas legadas não serão regeneradas automaticamente.

**Versão 0.1.4 — atlas do protagonista auditado — Modo Livre sandbox jogável / base de dados extensível.**

## Um jogo, uma experiência livre

**Peren, o Bruxo — Mercador da Carcaça** é um único jogo sandbox: viagens, comércio, ofícios, exploração e escolhas no universo da Carcaça. **Não existe Modo Campanha separado**, seleção de modos ou obrigação de reproduzir os acontecimentos da mesa de RPG.

O dossiê da antiga campanha de Peren Kerrhylon fornece **referências conceituais** para a identidade, a arte oficial, a personalidade, a mitologia e a ambientação do videogame. Seus eventos são passado criativo de referência, **não** uma linha de missões obrigatória, um save de nível 7 ou progressão paralela.

O jogo clássico HTML/JS na raiz e a prévia experimental Phaser são **duas implementações técnicas do mesmo jogo**, não dois jogos ou duas histórias. O Phaser mantém cache e save de teste próprios para proteger o progresso do clássico.

- [**Jogar Peren, o Bruxo — edição clássica**](https://pedromaintenance.github.io/peren-o-bruxo/)
- [**Laboratório de Itens — atributos, receitas e assets**](https://pedromaintenance.github.io/peren-o-bruxo/laboratorio-itens/) — painel **somente leitura** do catálogo real (2.785 itens e 2.316 receitas), famílias visuais e pendências de sprites. Permite **exportar o JSON completo de cada item** ou copiá-lo para solicitar alterações em linguagem natural, que serão feitas no repositório. O painel não altera dados, não grava no navegador e não toca nos saves.
- [**Jogar a prévia Phaser (Modo Livre)**](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf)
- [**ROADMAP.md — desenvolvimento do único jogo**](ROADMAP.md)
- [**Referências conceituais de Peren e Carcaça**](lore/peren/README.md)
- [**Identidade visual oficial de Peren**](lore/peren/ASSETS_OFICIAIS.md)
- [**Inspeção de Peren: retratos e movimentos nas 4 direções**](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/peren-arte.html) — bancada visual, não outro modo.
- [**Diário de Peren em Portomonte**](https://github.com/pedromaintenance/peren-o-bruxo/pull/31) — registra somente ações realizadas no sandbox
- [**Comparador de arte M1h-E × M1h-F**](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/compare.html)
- [**Código-fonte em desenvolvimento Phaser M1h-F — PR #24**](https://github.com/pedromaintenance/peren-o-bruxo/pull/24)

**Correção de escopo (21/10/2026):** os protótipos de uma campanha paralela introduzidos nas PRs #47–#54 foram retirados da edição jogável. O histórico Git os preserva apenas como experimentos descontinuados. Nada apaga os saves gravados anteriormente pelo navegador.

**Atenção:** não limpe os dados do navegador para atualizar o PWA; primeiro exporte um backup do progresso.


## Atualização visual de Peren (em validação)

O mesmo Peren de cabelo escuro, olhos azuis e manto dourado da arte aprovada aparece no HUD, na ficha e no combate do clássico, e nos retratos, sprites e variantes Phaser. A folha de 128 quadros adapta as 18 poses oficiais por nearest-neighbor; a direção direita espelha a caminhada à esquerda, e outras ações ainda reutilizam poses por falta de quadros dedicados. **O resultado é uma adaptação técnica, não animação autoral adicional aprovada.** Os mestres originais permanecem no ZIP; o script `ferramentas/gerar_peren_runtime.py` permite reproduzir os PNGs.

**Auditoria v2 (21/10):** corrigidos saltos de escala/posição dos pés e perda de cor. Ações sem sprites dedicados (interagir, coletar, ferido, conjurar, atacar) usam temporariamente quadros estáticos do original, evitando o bug anterior de tocar animações de caminhada como se fossem outros gestos. Frente em movimento também usa pose estática; faltam quadros novos para animação convincente. A arte v1 segue arquivada na pasta `official-v1/`. Veja a [galeria de avaliação](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/peren-arte.html) e o [relatório de origem](lore/peren/ASSETS_OFICIAIS.md).

**Caminhada oficial v3 (21/10/2026):** agora há **três poses novas em cada uma das quatro direções** (frente, esquerda, direita e costas), usando o ZIP `Peren_Kerrhylon_Assets_Atualizados_Caminhada(1).zip`. O atlas Phaser mantém 128 quadros de 48×64 e usa caminhada em ciclo **1–2–3–2**, com duração indicada de **180 ms/quadro**. As outras ações permanecem com seus quadros estáticos; nenhum gesto de ataque, coleta ou magia foi fabricado. [Visualizar os movimentos na galeria](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/peren-arte.html). O terceiro quadro de caminhada à esquerda já foi espelhado no arquivo de origem.

**Novo: caminhada ferida (v4)** — o pacote oficial traz três poses adicionais por direção para Peren mancando (3 × 4). No Phaser, se o personagem estiver com **0 < PV ≤ 50% do máximo**, caminhar ou correr usa os passos feridos em ciclo **1–2–3–2** a **230 ms por quadro**. A caminhada saudável (180 ms) retorna automaticamente após recuperar mais de 50% dos PV. Isso é apenas representação visual, **sem penalidade de velocidade ou dano**; ataques, coleta e outras ações não foram redesenhados. A [galeria de arte](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/peren-arte.html) permite comparar as duas animações sem mexer no save.

**Atualização de assets v5:** aplicada a correção nova da caminhada frontal. O atlas de coleta de ervas foi integrado ao Phaser em 4 direções e 4 quadros com tempo 350/250/450/850 ms, executando uma única vez. **Somente nós marcados como `herb`** recebem essa animação (Raiz Velada, Musgo Suspenso e Musgo Parassol de Eldroth); cogumelos continuam na coleta genérica. Caminhada ferida e demais ações não foram alteradas. A [galeria de Peren](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/peren-arte.html) exibe o gesto novo em quatro direções, sem afetar saves.

**A atualização não migra saves, não cria segundo modo e não altera economia ou combate.** O cache offline será atualizado; não limpe os dados do navegador para forçar a atualização.


## Curadoria de ingredientes — regra canônica (28/10/2026)

A base agora distingue os **efeitos legados** da compilação anterior dos **atributos revisados** para a Carcaça. A regra aprovada é: mínimo de **três atributos por ingrediente**, com atributos adicionais somente quando curados e **intensidade de 1 a 3**. A revisão será feita ingrediente a ingrediente; não converter automaticamente os 111 ingredientes nem presumir intensidades.

Primeira ficha: **Pena de Gaivota** (`ing-felsaad-tern-feathers`), existente exclusivamente em **Portomonte**, influenciada pelo templo de Deméter: **Curar doença 3**, **Voar 1**, **Restaurar stamina 2**. Nome simplificado no item, nos 30 elixires derivados e nas 30 receitas, sem trocar IDs. Essas receitas estão marcadas para reavaliação de correspondência alquímica à medida que os outros ingredientes forem revisados; a migração não recalcula combinações de forma prematura.

Segunda ficha: **Carapaça de Caranguejo** (`ing-mudcrab-chitin`), mantendo a origem previamente cadastrada no Além Sul: **Aumentar Força 2**, **Aumentar Constituição 3**, **Resistência a Veneno 1**. Seu nome anterior, *Quitina de Caranguejo Carmesim*, foi substituído na ficha, em 41 elixires e nas 41 receitas correspondentes, sem alterar IDs. Das 42 receitas que consomem esse ingrediente, uma também utiliza a Pena de Gaivota: a fila atual contém **71 fórmulas distintas aguardando revisão alquímica**. Os efeitos das poções herdadas não foram recalculados, e a implementação jogável dos novos atributos dependerá de uma etapa mecânica específica.

Terceira ficha: **Pó de Vampiro** (`ing-vampire-dust`), mantendo a região anteriormente definida (Boca do Abismo): **Vampirismo 3**, **Invisibilidade 2**, **Regenerar Saúde 1**. O nome anterior *Pó de Vampiro de Vandar* foi substituído no ingrediente e em 32 receitas/elixires, sem alterar IDs. Das 32 receitas vinculadas, duas já estavam pendentes devido à Pena de Gaivota ou à Carapaça de Caranguejo; o total cumulativo agora é de **101 receitas distintas** a reavaliar. A nova propriedade de vampirismo está documentada como atributo alquímico, sem presumir implementação de roubo de vida no motor.

Quarta ficha: **Couro de Rato** (`ing-charred-skeever-hide`), mantendo a localização anteriormente cadastrada em **Garganta**: **Diminuir Carisma 3**, **Resistência a Veneno 2**, **Infligir Doença 1**. O nome antigo *Couro de Rato Carbonizado* foi substituído no ingrediente e em 41 elixires/receitas, sem alterar IDs. Das 41 receitas que usam o ingrediente, três já estavam sinalizadas pela curadoria anterior, elevando o total cumulativo a **139 receitas distintas** para reavaliação. Não foram recalculados os efeitos das poções nem implementadas mecânicas novas automaticamente.

Quinta ficha: **Penas de Falcão** (`ing-hawk-feathers`), mantendo a região cadastrada em **Thargrid**: **Visão à Distância 3**, **Voo 2**, **Velocidade 1**. Renomeados o ingrediente, 20 elixires e 20 receitas que antes continham *Penas de Falcão das Montanhas*, preservando todos os IDs. Das 20 receitas associadas ao ingrediente, quatro já estavam na fila de análise, elevando o total a **155 receitas distintas** aguardando revisão alquímica. O efeito técnico de Voo é `Fly`, compartilhado com a Pena de Gaivota; os novos atributos não conferem automaticamente mecânicas jogáveis.

Fonte da curadoria: [`data/curadoria_ingredientes.json`](data/curadoria_ingredientes.json). O script de geração reaplica a curadoria após gerar a base combinatória para impedir que um novo build apague as decisões manuais.

## Publicação e instalação

1. Extraia o ZIP e envie **todos os arquivos e pastas** para a raiz de um repositório GitHub público.
2. GitHub → Settings → Pages → Deploy from a branch → main / (root).
3. Abra pelo link HTTPS do GitHub Pages no celular, espere o carregamento completar e instale pelo menu do navegador (**Adicionar à tela inicial / Instalar aplicativo**).
4. Abra novamente conectado para assegurar o cache e teste com modo avião. O jogo é offline após o cache completo. O progresso é salvo localmente pelo navegador e pode ser exportado em JSON na ficha de Peren.
5. Para testar no computador use `python -m http.server 8000` na pasta do jogo e acesse `http://localhost:8000/`. Abrir `index.html` diretamente via `file://` não permite carregar JSON via `fetch` nos principais navegadores.

## Como jogar

- **Mundo:** viajar, aceitar missões, trabalhar, coletar recursos, caçar e enfrentar monstros. Há três ações por dia; descansar recupera PV/MP e começa um novo dia.
- **Mercados:** comprar, vender, estudar margens de venda entre regiões e aumentar proficiência Comércio.
- **Oficinas:** forjar, curtir, realizar alquimia, encantamentos, joalheria e escrita de grimórios. Cada receita consome exatamente os materiais apontados no JSON.
- **Cozinha:** receitas regionais que preparam suprimentos para a estrada.
- **Grimório:** magias exigem Arcanismo; novos grimórios podem ser adquiridos, escritos ou recuperados.
- **Peren:** equipamentos, inventário, talentos, informações, importação/exportação de save.
- **Batalhas:** escolhas por turno no estilo JRPG clássico (ataque, guarda, magia, consumíveis); sem animações. A derrota causa resgate, perda de dinheiro e ferimentos, mas não apaga o progresso do jogador.

## Coleção de dados

Todos os arquivos ficam em `data/`: `itens.json`, `receitas.json`, `magias.json`, `monstros.json`, `cidades.json`, `missoes.json`, `expedicoes.json`, `reliquias_dnd.json` e `manifesto_dados.json`.

Os IDs são estáveis e as receitas se referem exclusivamente a esses IDs. Base gerada e validada por script local `build_data.py` incluído em `ferramentas/`.

## Origem e limites importantes

- Os **111 ingredientes** iniciais e propriedades vêm de uma compilação pública de Skyrim vanilla/DLC (vebyast/skyrim_alchemy), mas cada nome foi ressignificado para Carcaça. As **receitas alquímicas são novas combinações automáticas** de ingredientes com propriedades compartilhadas, não receitas extraídas do jogo Skyrim.
- Os títulos, níveis e escolas das magias têm como referência o **Livro do Jogador de D&D 5e fornecido pelo usuário**. As mecânicas foram simplificadas e reinterpretadas para este videogame. **Nem todas as 354 magias possuem efeitos individualmente exclusivos**: as não curadas usam regras padrão por tipo/escola; continuam podendo ser conjuradas.
- O catálogo de 253 itens mágicos foi derivado de metadados nominais/raridade do **Guia do Mestre fornecido pelo usuário**; as funções de uso são adaptações do motor, não reproduções literais das descrições originais.
- O bestiário aproveita 208 registros do **Manual dos Monstros enviado pelo usuário**, com 14 inimigos próprios do cenário. Estatísticas foram reconstruídas para as regras novas.
- **Este catálogo não reúne absolutamente todos os itens de Skyrim** (que possui muito mais objetos, variações e conteúdo extra). É uma etapa significativa, porém parcial, de compilação e um jogo funcional. Nenhuma dessas fontes deve ser confundida com aprovação ou associação oficial a Bethesda/Wizards of the Coast.
- Arte de capa e ícones produzidos originalmente para este jogo. Nenhum asset é carregado por URL externa.

## Estrutura técnica

HTML + CSS + JavaScript puro, PWA por Service Worker, localStorage e exportação/importação manual do progresso. Não usa servidor em tempo de jogo, bibliotecas remotas ou IA online.

## Panorama da edição 0.1

- **2.785** itens catalogados (a maioria são criações derivadas de receitas combinatórias, não cópias de Skyrim).
- **2.316** receitas com dependências verificadas por ID; inclui 1.740 misturas alquímicas, equipamentos, grimórios e culinária.
- **354** magias cadastradas.
- **222** registros de criaturas para encontro (208 classificados por referência do Manual dos Monstros + 14 criações da Carcaça).
- **9** cidades com **27** mercadores e oficinas regionais.
- **32** missões e **10** regiões exploráveis.

As contagens são base de dados, não promessa de efeitos exclusivos para cada registro. O jogo é uma versão sandbox inicial e o catálogo de Skyrim é **parcial**.


## Patch v0.1.1 — Estabilidade e Mercado (13/10/2026)

- Corrigido acúmulo de notificações de proficiência e level up: apenas um aviso aparece por vez e qualquer clique o fecha imediatamente; mensagens desaparecem sozinhas após 2,7 segundos.
- Corrigidas recompensas de missões lendárias: o catálogo `reliquias_dnd.json` agora é carregado pelo jogo.
- Adicionado botão **Recuar da batalha**, inclusive durante missões; o contrato permanece disponível. Saves com todos os inimigos mortos permitem **Concluir vitória pendente** após recarregar.
- Ganho de XP recebe validação e limites defensivos, consolidando múltiplos níveis em uma única mensagem.
- Magias da batalha paginadas em grupos de seis, mesmo quando o jogador conhece centenas.
- Cada vendedor expõe um estoque selecionado de até 18 mercadorias, com forte preferência por ingredientes básicos, renovado a cada três dias. **Nenhum item ou receita foi removido do catálogo.**
- Saves de versão 1 continuam aceitos no `localStorage`, sem reiniciar personagem nem suas missões. O Service Worker usa cache novo `peren-mercador-carcaca-0.1.1-offline`.

### Testes de regressão

`tests/qa_smoke.py` valida a interface usando dados JSON em memória: 32 missões, 354 magias, 2.316 receitas referencialmente íntegras, 27 vendedores, avisos, XP, recuo, consumíveis, persistência simulada e quatro larguras móveis. Ele **não substitui o teste da atualização instalada no aparelho** nem testes completos de equilíbrio de combate.

Para executar: `pip install playwright` e `playwright install chromium`, depois `python tests/qa_smoke.py` na raiz do repositório.

Para receber a atualização no PWA já instalado, entre no jogo com internet, feche e abra novamente (pode ser necessário atualizar/reabrir duas vezes enquanto o Service Worker novo assume). Confira `v0.1.1` no topo. **Não limpe os dados do site para atualizar**, pois isso pode apagar o save local. Exporte o save como precaução.


## Patch v0.1.2 — Tutores de Ofício (13/10/2026)

- Na aba **Oficinas**, cada cidade apresenta seus tutores locais, associados às estações disponíveis: Alquimia, Forja, Encantamento, Curtume, Escrita, Joalheria ou Cozinha.
- Cada aula consome **1 ação** e **moedas**, sem exigir materiais; o preço é calculado de forma crescente pelo nível **do próprio ofício**: `12 + 3 × nível + arredondar_para_cima(nível² / 18)`.
- Até a proficiência 39, uma aula pode elevar **2 níveis**; a partir da proficiência 40, eleva **1 nível**, até o máximo 100. A implementação calcula a XP necessária para atingir o novo patamar, em vez de dar XP fixa que se tornaria insuficiente com o tempo.
- Há um atalho na aba **Peren → Proficiências → Encontrar tutores de ofício**. Estudos mágicos continuam no **Grimório**.
- A compra de aulas é validada antes de descontar ações ou dinheiro: sem tutor local, moedas suficientes, ações ou estando no nível máximo, não ocorre gasto.
- O sistema utiliza as proficiências `skills` já existentes no save; **não há migração nem reinicialização**. O cache PWA foi atualizado para `peren-mercador-carcaca-0.1.2-offline`.
- QA adicional: `python tests/qa_tutores.py`; verificação de nove cidades, sete ofícios, aumento do preço, cobrança, save, requisitos, limite de nível e quatro larguras de tela.

O patch foi testado em navegador automatizado com o catálogo JSON completo em memória. A atualização de um PWA já instalado deve ser confirmada no aparelho; **faça um backup do save** e evite limpar os dados do site.
