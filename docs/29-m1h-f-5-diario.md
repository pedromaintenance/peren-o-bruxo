# M1h-F.5 — Diário de Peren

> **Implementado na fonte, sujeito aos gates de CI e Pages.** O diário é apenas uma interface de leitura sobre o **save experimental já existente**. Não cria eventos, missões, transações, chaves de armazenamento nem mudanças de esquema.

## Recurso jogável

O menu **✎ Diário de Peren**, em Portomonte, abre um caderno de viagem responsivo:

- **Atividade:** apresenta até 80 transações já retidas em `envelope.history`, na ordem mais recente primeiro. Exibe o número da revisão, nunca finge data ou quantidade que o histórico não armazena.
- **Crônicas:** mostra até 90 entradas do `character.journal` original, preservando o texto e os dias efetivamente registrados pelo jogo.
- **Filtros:** Combates, Coletas, Ofícios, Comércio e Outros (descanso e nova rota), além da visão de Atividade e Crônicas.
- **Busca** tolerante a maiúsculas/acentos, pesquisando nomes reais dos itens/monstros provenientes dos catálogos já usados pelo motor.
- **Resumo do personagem:** dia atual, nível, vitórias acumuladas e itens criados acumulados; cidade e seed ativas. Contadores totais vêm do estado canônico, enquanto as contagens por categoria referem-se somente às últimas 80 transações.
- **Exportar Markdown (.md):** operação voluntária, com crônicas e transações realmente armazenadas. O diário pode conter fatos privados do save: nada é compartilhado automaticamente, nenhuma telemetria, nenhum acesso ao save clássico.

## Integração

- `phaser-lab/src/ui-journal.js`: `journalViewModel`, `journalMarkdown` puros e UI controlada pelo DOM, sem modificar progresso.
- `phaser-lab/ui-journal.css`: interface de página inteira, com rolagem e responsividade em `390×844`, desktop, teclado e controle.
- `phaser-lab/index.html`: botão de Portomonte e painel semânticos. O botão **permanece escondido** em outras variantes; `M1HF_PREVIEW` habilita a navegação somente na prévia experimental.
- `phaser-lab/src/main.js`: abre e fecha sem interromper o save, dá suporte a Esc e Xbox B/Start para voltar, esquerda/direita para mudar filtro, cima/baixo para rolar. O menu da cidade fica inerte durante a leitura.
- IDs usados são os do catálogo real de 2.785 itens e 222 monstros. Sem recompensas artificiais e sem gravar arquivos a menos que o jogador toque em *Baixar*.

## Testes de aceite

- Node: modelo puro, ordem de registros, cap de 80, nomes reais, filtros acento-insensíveis, estado inicial vazio e exportação.
- Playwright: mobile **390×844** e desktop **1280×800**, filtro, busca, download Markdown, Esc, fechamento, navegação, imutabilidade do save experimental e das chaves clássica/estável.
- Regressão existente: combate (6 vitórias + resiliência), atlas, comparador, PWA offline e recuperação do save.
- **Publicação:** somente `phaser-demo-m1hf/` muda em uma PR separada. Validar no Pages online antes de marcar o item como publicado.
- **Android físico:** teste manual do toque, barra de filtros horizontal, pesquisa com teclado virtual, rolagem, exportação e instalação PWA ainda pendente.

## Limites honestos

Um registro recente `history` não inclui timestamp, preço, quantidade nem dia individual. Esses campos não devem ser inventados. `journal` contém as anotações originais e suas datas quando o jogo as registrou. O Diário não substitui um sistema de quests e não faz replay integral de toda a campanha.
