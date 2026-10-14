# M1g-D — Comércio Premium

**Base:** M1g-C (Alquimia) → M1g-B (Inventário) → M1g-A (Portomonte). Branch: `feature/phaser-m1g-d-comercio`.
**Estado:** funcionalidade implementada em branch isolada; revisão visual e playtest físico ainda pendentes.

## Identidades canônicas / contrato com os dados
`data/cidades.json` identifica os três mercadores de Portomonte:
- **Sofia do Porto Seguro:** perfil `alquimia`; tônicos e ervas para os refugiados.
- **Jonathan, o Taberneiro:** perfil `provisoes`; suprimentos e notícias da costa.
- **Alina das Conchas:** perfil `oculto`; relíquias retiradas de recifes profanados.

**Restrição:** a versão atual de `cidades.json` descreve os mercadores, mas **não lista estoque individual por mercador**. Os oito IDs compráveis usados pelo menu econômico existente em M1d foram preservados como **suprimentos comuns da cidade** (não atribuídos falsamente a Sofia, Jonathan ou Alina). Mudar o retrato do NPC não altera preços nem inventa mercadorias. Outras cidades não exibem estoque de compra fictício; itens já possuídos ainda podem ser vendidos pelo motor existente.

## Resultado implementado
- Tela `#tradeUI` própria, separada de Inventário (`#inventoryUI`) e Alquimia (`#craftUI`).
- **Comércio** abre na aba Comprar; **Vender itens da bolsa** abre na aba Vender; alternância clara e botão Voltar.
- Seleção de mercador (nome e descrição canônicos), retrato estilizado provisório de cada um e cenário editável `scenes/portomonte-market.svg`.
- Lista pesquisável de itens reais, nomes/categorias/descrições/quantidade disponível e preços dinâmicos calculados por `purchasePrice()` ou `salePrice()`.
- Confirmação de quantidade entre 1 e 99 (na venda, limitada à mochila), valor **exato** e estados de bloqueio por falta de ouro, estoque, item equipado ou seleção vazia.
- `src/progress.js` acrescenta `tradeQuote()`, que simula os **mesmos preços e ganhos de habilidade por unidade** do modelo anterior, sem alterar o estado. O comando antigo sem `quantity` continua negociando uma unidade. Com `quantity`, uma única transação atômica registra o lote, ou nenhuma mudança ocorre.
- Duplo clique/toque bloqueado no cliente até 450 ms; um batch sempre gera só uma gravação.
- Navegação teclado/toque/Xbox (D-pad seleciona, esquerda/direita muda quantidade, X alterna aba, A confirma, B fecha) e alvos acessíveis.

## Limitações de arte e mecânica
- Cenário e retratos são SVGs **autorais provisórios**, sem texto e botões embutidos. São retratos de **interpretação visual**, não aparência canônica aprovada dos três mercadores; o pixel art definitivo fica para a revisão artística.
- Não existe estoque individual, compra com disponibilidade limitada por mercador nem barganha específica de NPC no motor; não foram inventados.
- Venda de item equipado permanece proibida. Equipar/trocar equipamentos ainda não está implementado no Phaser.
- Não existe sincronização bidirecional com o save clássico `peren_carcaca_save_v1`.

## Aceite técnico
- [x] UI independente, compradores canônicos e preços/quantidades de dados reais.
- [x] Transações de lote consistentes com transações unitárias e com commit único.
- [x] Bloqueios para item equipado, dinheiro/estoque insuficientes, zero, negativos e quantidade excessiva.
- [x] Testes Node, CI Chromium em 360×800, 390×844 e 1280×800, regressões e capturas incluídos.
- [x] [CI completo 38624579294](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38624579294) passou, com três screenshots anexadas; inspeção artística continua pendente.
- [ ] Aprovação visual pelo usuário; Android e Xbox físicos.
- [ ] Inventário de assets aprovados para retratos e ícones individualizados.

**Próxima fatia:** M1g-E — HUD da exploração, encontros e interface de combate.
