# M1g-C — Alquimia e Criação

**Status:** implementação em branch empilhada sobre M1g-B; QA de navegador e revisão artística são pré-requisitos do merge.
**Branch:** `feature/phaser-m1g-c-alquimia`.

## Entrega
- Tela separada `#craftUI` ligada ao comando **Alquimia e Criação** de Portomonte.
- Receitas exclusivamente de `catalogs.receitas`, filtradas pelas `estacoes` da cidade corrente, com busca textual, escolha da estação e paginação progressiva.
- Painéis de resultado, ingredientes do `catalogs.itensById`, possuído/necessário, proficiência `skillLevel()`, nível `rec.nivel`, ação disponível e justificativas de bloqueio.
- O botão de preparação usa apenas `bridge.execute({type:'craft',id})`. As regras econômicas, de proficiência, quantidade e disponibilidade pertencem a `progress.js`, reutilizadas sem duplicação.
- A quantidade indicada é **por receita/lote do catálogo**, sem opções fictícias de produzir mais de um lote no mesmo comando.
- Cada ação confirma uma transação e atualiza inventário, contador de ações, painel de Peren e feedback de sucesso/erro; o save clássico nunca é escrito.
- CSS específico com o design system M1g, telas mobile e desktop, janela focável, navegação por teclado e Xbox.
- Arte editável em `phaser-lab/public/scenes/portomonte-workshop.svg`: ambiente de oficina sem textos, botões ou informações de interface embutidos, produzida para esta etapa. É uma **composição vetorial provisória inspirada em pixel art**, não o sprite final e não a arte aprovada das telas conceituais.

## Controles
- Desktop: clicar em receitas/estações, pesquisar, confirmar **Criar**, Escape para voltar.
- Teclado: Tab circula pelos comandos da janela; setas verticais percorrem receitas quando fora da busca, esquerda/direita alternam estações ao focar a aba.
- Xbox padrão: entrar na oficina via opção do hub e A; D-pad cima/baixo seleciona receita; X muda estação; A prepara (quando disponível); B volta.
- Mobile: áreas de toque de pelo menos 44px nas opções, scrolling vertical/horizontal sem barra lateral bloqueadora.

## Restrições e testes
- Sem botão falsamente funcional para equipamento ou ingredientes inexistentes; sem monetização e sem novos itens/receitas no catálogo.
- Erros exibem mensagem sem conceder itens, e cliques duplicados são protegidos por estado `busy` e pelo gate do bridge.
- A interface não usa `localStorage` diretamente; a única gravação ocorre no estado Phaser pelo bridge.
- `npm test`, build, PWA, testes Chromium 360×800, 390×844, 1280×800 e regressões de Portomonte, inventário, exploração/combat são verificados no CI.
- Playtest Android/Xbox **físicos**, revisão visual e sprite final da oficina ainda pendentes. Teste automatizado não aprova direção artística.

## Próximo passo M1g-D
Implementar Comércio contextual com dados e regras reais. O mercador Rufino da imagem conceitual **não** consta no catálogo canônico de Portomonte: seus comerciantes cadastrados são Sofia do Porto Seguro, Jonathan o Taberneiro e Alina das Conchas. Não usar o nome inventado nas telas funcionais antes de decisão canônica.
