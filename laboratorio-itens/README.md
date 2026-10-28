# Laboratório de Itens — Peren, o Bruxo

Página pública: https://pedromaintenance.github.io/peren-o-bruxo/laboratorio-itens/

## Escopo

Ferramenta editorial **isolada** do sandbox Peren, o Bruxo — Mercador da Carcaça. Sua entrada não muda o inventário, o balanceamento, as receitas ou os saves do jogo.

Fontes lidas em tempo de execução:
- \`../data/itens.json\`: os 2.785 itens da base original;
- \`../data/receitas.json\`: as 2.316 receitas com estação, nível, insumos e resultado;
- \`../data/manifesto_dados.json\`: identificação do corpus.

Os números exibidos pela interface são recalculados ao carregar o JSON. Se a base crescer, o laboratório atualiza as listagens e vínculos automaticamente.

## Telas

1. **Painel geral** — cobertura de sprites individuais, categorias, ofícios e insumos mais usados.
2. **Catálogo de itens** — busca e filtros por categoria, raridade, situação e prioridade; ficha de produção visual.
3. **Livro de receitas** — todas as fórmulas, ligação entre IDs e alertas estruturais.
4. **Famílias e variações** — grupos por categoria/tipo, registro de master, estratégia, meta e contagem de variantes aprovadas.
5. **Fila de arte** — quatro estados: sem sprite, criação, revisão/integração e aprovado.
6. **Auditoria de dados** — quantidades de insumos inválidas, resultados sem ID e arte sem caminho vinculado.

A galeria reutiliza os **13 ícones compartilhados** da edição clássica em \`../assets/icons/\`: eles não são prova de sprite exclusivo. A ficha permite associar o caminho de um desenho individual ou sprite sheet existente no repositório.

## Fluxo de produção

1. Abrir um item e conferir a imagem genérica da categoria.
2. Marcar prioridade e situação.
3. Informar um caminho, por exemplo \`assets/itens/raiz-velada.png\`, após adicionar o PNG/WebP ao GitHub.
4. Descrever variantes uma por linha: \`nome | caminho | estado\`, com estados \`pendente\`, \`criacao\`, \`revisao\`, \`aprovado\`.
5. Marcar aprovação somente após revisão visual e conferir a relação entre item e receita.
6. Definir estratégia e meta em **Famílias**, para não criar centenas de sprites redundantes.
7. Exportar **JSON** para backup e controle de versões. A fila em **CSV** é útil para planejamento externo.

## Onde ficam as alterações

Todas as fichas editadas são armazenadas **somente no localStorage deste navegador** pela chave \`peren_item_lab_v1\`. Nunca são gravadas em \`peren_carcaca_save_v1\` nem nos saves do Phaser. O Pages é estático: **não envia modificações automaticamente ao GitHub**. A importação JSON substitui o planejamento local somente após confirmação do usuário.

Para compartilhar o planejamento entre computadores, faça exportação/importação JSON ou registre o conteúdo exportado no controle de versão como documento de acompanhamento. Não publique a exportação como arquivo de jogo se houver comentários internos que você não queira tornar públicos.

## Validação

- \`app.js\` validado por parser JavaScript.
- Fluxo de inicialização e renderização inicial testado com catálogo/receitas simulados, sem erros.
- Rotas e arquivos adicionados à branch \`main\`; funcionamento final no Pages e validação de responsividade em dispositivos físicos devem ser conferidos após propagação da publicação.
- Não é feita uma auditoria completa dos binários do repositório: **sem caminho mapeado** significa ausência de referência individual na base/registro, não necessariamente inexistência física da arte.
