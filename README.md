# Peren, o Bruxo — Mercador da Carcaça

**Versão 0.1.2 — campanha sandbox jogável / base de dados extensível.**

## Roadmap e protótipo Phaser em desenvolvimento

O jogo clássico permanece publicado na raiz deste site. A nova versão Phaser está sendo desenvolvida e testada **separadamente**:

- [**ROADMAP.md — prioridades, entregas, testes e pendências**](ROADMAP.md)
- [**Jogar o protótipo Phaser M1h-F no GitHub Pages**](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf)
- [**PR de desenvolvimento M1h-F**](https://github.com/pedromaintenance/peren-o-bruxo/pull/24), ainda em rascunho

A prévia tem save e cache próprios. **Não limpe os dados do navegador** para atualizar o protótipo sem antes exportar um backup do progresso.


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
- **Batalhas:** escolhas por turno no estilo JRPG clássico (ataque, guarda, magia, consumíveis); sem animações. A derrota causa resgate, perda de dinheiro e ferimentos, mas não apaga a campanha.

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
