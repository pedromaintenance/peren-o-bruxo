# Peren, o Bruxo — Mercador da Carcaça

**Versão 0.1.0 — campanha sandbox jogável / base de dados extensível.**

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
