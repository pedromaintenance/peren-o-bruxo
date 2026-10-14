# M1g-B — Inventário separado do comércio

**Base:** M1g-A, com tema e hub responsivos; branch `feature/phaser-m1g-b-inventario`.
**Estado:** código implementado, revisão de integração e aprovação artística pendentes.

## Decisões verificadas no código canônico

- A origem das quantidades é `bridge.state.bag`, com nomes, descrições, categorias e valores de `catalogs.itensById`.
- Os únicos slots reais em `newClassicState()` / `normalizeClassic()` são `equip.weapon`, `equip.armor` e `equip.relic`. **Não** inventar slots de capacete, botas, acessórios nem função de equipar sem motor de regras.
- O inventário é **somente leitura**. As ações de compra/venda continuam no `hubPanel` e passam pela transação `bridge.execute()`; a tela M1g-B não chama `execute()` ou `localStorage`.
- Os indicadores de ataque e defesa vêm de `weaponStats()`; PV/PM máximos de `maxClassicHp/maxClassicMp`; ouro, nível e experiência vêm do mesmo save Phaser.
- Nenhum ganho é sincronizado com o Peren 0.1.2. Não tocar `main` até aprovação explícita.

## Implementação

- `phaser-lab/src/ui-inventory.js`: modelo puro de categorias/filtro/seleção/equipamento e adaptador DOM de consulta.
- `phaser-lab/ui-inventory.css`: cena de inventário no tema azul petróleo/dourado, perfil de Peren, sprite desenhado a partir do atlas, equipamento e grade adaptativa.
- `phaser-lab/index.html`: inventário próprio `#inventoryUI`, com grid, categorias, busca, descrição, contadores, retrato, medidores e botão de saída.
- `phaser-lab/src/main.js`: botão **Inventário** no hub abre a nova cena; **Vender** permanece transação separada. Xbox Y no hub abre inventário; X alterna abas; setas/D-pad navegam, B fecha; teclado Tab/setas/Esc e toque.
- `phaser-lab/tests/ui-inventory.test.mjs`: valida leitura dos dados reais, filtros, slots, catálogo e impossibilidade de mutar o save pelo renderer.
- `phaser-lab/scripts/inventory-browser.mjs`: testa 360×800, 390×844, 1280×800, controle simulado e preservação do save clássico, produz screenshots no GitHub Actions.

## Lacunas explicitadas

- Os ícones ainda são glifos temáticos (arte temporária), pois **não existem ícones individuais aprovados** para os 2.785 itens. Substituir por sprites individuais à medida que forem produzidos; não usar capturas achatadas dos mockups como interface real.
- A arte do personagem e o retrato são os sprites ainda em avaliação do M1e. A interface usa o atlas real e não um sprite estático independente.
- A função *equipar/trocar equipamento* não existe no motor M1d: slots apenas informativos nesta fatia.
- Ainda falta validar em Android/Xbox físicos. Screenshots e testes Chromium não aprovam automaticamente a direção artística.

## Aceite

- [x] Inventário independente da venda, com quantidades reais e categorias.
- [x] Somente três slots canônicos, sem falsas funcionalidades.
- [x] Dados reais de Peren e do item selecionado, sem transações.
- [x] Estados de vazio, busca, seleção, rolagem e alvos touch.
- [x] QA automatizado e capturas reais em desktop/mobile (arte ainda não aprovada) — [run 38594839312](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38594839312).
- [ ] Revisão visual com o usuário e playtest Android/Xbox físicos.
- [ ] Produção de ícones individuais e ilustrações finais (fases visuais futuras).
