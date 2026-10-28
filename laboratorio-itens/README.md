# Laboratório de Itens — Peren, o Bruxo

Página: https://pedromaintenance.github.io/peren-o-bruxo/laboratorio-itens/

## Princípio operacional

**Painel de consulta, não editor.** A curadoria de itens, receitas, intensidades e assets é discutida em linguagem natural na conversa e aplicada diretamente aos arquivos do repositório GitHub. Não há formulário de escrita, importação ou armazenamento local no HTML. O painel não altera os saves do jogo.

## Fontes lidas no carregamento

- `../data/itens.json` — catálogo canônico de 2.785 itens (contagem inicial).
- `../data/receitas.json` — 2.316 receitas (contagem inicial).
- `../data/manifesto_dados.json` — metadados da base.
- `./estado-assets.json` — status visual versionado (preserva o planejamento no Git, não no navegador).
- `../data/curadoria_ingredientes.json` — decisões aprovadas de atributos e intensidades, incorporadas ao catálogo canônico.

O HTML exibe os 13 ícones genéricos compartilhados já usados pela edição clássica, mas **não os classifica como sprites únicos aprovados**.

## Como revisar os itens por conversa

1. Abra **Catálogo de itens** e filtre por ingrediente, categoria ou nome.
2. Clique em **Ver ficha** para conferir atributos, intensidade e relações de crafting; ou clique **↓ JSON** na própria linha.
3. A ficha também tem **Copiar JSON** e **Exportar JSON do item**. O conteúdo exportado é o objeto original do item em `data/itens.json`, preservando seu ID e todos os campos (inclusive `atributos`).
4. Envie o arquivo ou o texto na conversa e peça a alteração em linguagem natural, por exemplo: *“Altere os atributos da Pena de Gaivota”*.
5. A atualização é aplicada ao repositório, com verificação dos vínculos de receitas e manutenção dos IDs. Atualize a página para consultar a nova versão.

Opcional: **Catálogo JSON** no topo exporta todos os itens, e **Exportar fila CSV** cria um relatório de assets.

## Regra de atributos (curadoria)

- Cada ingrediente revisado precisa ter **pelo menos 3 atributos**.
- A intensidade é **inteira entre 1 e 3**: 1 baixa, 2 média, 3 alta.
- Ingredientes podem ter mais de 3 atributos se definidos na curadoria.
- **Não atribuir intensidades arbitrárias a ingredientes ainda não revisados**. A lista legada de `efeitos` permanece como provisória e é identificada como tal na ficha.
- A primeira revisão é **Pena de Gaivota**, exclusiva de Portomonte, com **Curar doença 3**, **Voar 1**, **Restaurar stamina 2**.
- A segunda revisão é **Carapaça de Caranguejo**, com **Aumentar Força 2**, **Aumentar Constituição 3**, **Resistência a Veneno 1**. Mantida a região já cadastrada: Além Sul. Nenhum asset novo foi criado nesta etapa.

O arquivo `data/curadoria_ingredientes.json` centraliza essas decisões para evitar que uma reconstrução do catálogo as reverta. O script `ferramentas/build_data.py` aplica a curadoria depois de gerar os objetos e receitas; IDs permanecem estáveis.

### Revisões de receitas ligadas

A mudança de uma propriedade pode invalidar fórmulas combinatórias antigas. As **30 receitas que consomem Pena de Gaivota** e as **42 receitas que consomem Carapaça de Caranguejo** ficam marcadas com `revisao_alquimica_pendente` até que os atributos de seus outros ingredientes sejam avaliados. Uma receita utiliza ambos, resultando em **71 receitas distintas** pendentes. O campo `insumos_revisados` identifica quais ingredientes revisados motivaram a marcação. Esta marcação **não** é a mesma coisa que erro estrutural de ID ou quantidade. Não refazer ou excluir receitas automaticamente.

## Situação de publicação e testes

Arquivos da ferramenta são publicados na branch `main` e servidos como diretório estático do Pages. O código JavaScript foi inspecionado e suas rotas, fichas e exportação foram testadas; é recomendada conferência manual no endereço público e no aparelho após propagação do Pages. Atualização do cache do PWA não apaga o save.

