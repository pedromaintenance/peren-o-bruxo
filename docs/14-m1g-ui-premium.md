# M1g — UI Premium + Portomonte (plano canônico)

**Estado:** planejamento registrado e execução incremental em PRs pequenas.  
**Base:** M1f (galeria visual), M1e (Peren redesenhado), M1d (economia/save separado).  
**Objetivo:** fazer a vertical slice de Portomonte e Mürin se aproximar das telas conceituais aprovadas, sem alterar regras, transações e dados canônicos.

## Referência visual e limite entre conceito e implementação

As telas de referência aprovadas (Portomonte, Inventário, Alquimia e Criação, Comércio) apontam para pixel art detalhada, personagens reconhecíveis, painéis azul-petróleo, molduras douradas, tipografia hierárquica e interfaces de JRPG com informação contextual. **Uma imagem estática de UI não é um menu funcional**: o layout final deve ser implementado em DOM/CSS e/ou Phaser, preservando foco, estado, responsividade e acessibilidade. Arte de conceito não deve ser publicada como imagem achatada contendo textos e botões falsos. Toda nova arte operacional precisa ser separada em assets próprios, com licença e revisão.

## Contrato de segurança e qualidade (todas as fatias)

- `main` e Peren clássico 0.1.2 ficam inalterados até aprovação de release.
- Chave `peren_carcaca_save_v1` é **somente leitura**; gravações apenas no save Phaser `peren_phaser_save_m1d_v1`, via progress bridge.
- Reutilizar a lógica pura de `src/progress.js`; não duplicar crafting, preço, XP, estoque ou loot no renderer.
- Respeitar o catálogo de IDs, inclusive nomes/equipamentos existentes; dados fictícios de arte não substituem os reais.
- Teclado, touchscreen e Xbox devem manter navegação; foco visível, alvos de toque ≥ 44px e controles de confirmação/retorno.
- Testar pelo menos 390×844, 360×800 e desktop 1280×800; nenhum overflow horizontal de ações primárias.
- Estado `em_producao` para toda arte ainda não aprovada. QA funcional ≠ aprovação artística.

## Fases / PRs

### M1g-A — Fundação visual e hub Portomonte [EM IMPLEMENTAÇÃO]

- [x] Registrar direção e planejamento detalhado no repositório.
- [x] Centralizar tokens de cor, moldura, tipografia, espaçamento e interação no CSS próprio.
- [x] Redesenhar cabeçalho, status, painel de Peren, navegação e atalhos de Portomonte.
- [x] Conservar `goForest`, `resetForest`, `showCraft`, `showShop`, `showInventory`, `endDayBtn`, `exportProgress`, `importProgress` e `hubPanel`, sem quebra de eventos/testes.
- [x] Integrar indicadores vivos: cidade de origem, dia, ouro, nível, EXP, PV, PM e recursos.
- [x] Criar layout mobile com hierarquia clara e versão desktop com composição em colunas (implementado, aguardando aprovação artística).
- [x] QA browser automatizado (360×800, 390×844, 1280×800) e save clássico imutável: GitHub Actions passou.
- [ ] Revisão visual presencial e playtest Android + Xbox físicos.

### M1g-B — Inventário e equipamento [CÓDIGO VALIDADO / ARTE EM REVISÃO]

- [x] Separar visualização do inventário (não confundir com vender).
- [x] Filtros por categoria, grid e seleção acessível, quantidades reais, detalhes do item.
- [x] Equipamento verdadeiro com os slots existentes do save (`weapon`, `armor`, `relic`); outros slots apenas se regras futuras os suportarem.
- [x] Retrato Peren, vida/mana e status no design system compartilhado.
- [x] Scroll, navegação controller/touch, nenhum item ou moeda criado pela interface.
- [x] Node, Vite, PWA e Chromium em 360×800, 390×844 e 1280×800; Xbox simulado e integridade dos saves aprovados. [Run 38594839312](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38594839312).
- [ ] Aprovação visual pelo usuário, Android/Xbox físicos e ícones individuais finais.

### M1g-C — Alquimia / criação [CÓDIGO IMPLEMENTADO, ARTE EM REVISÃO]

- [x] Retrabalhar lista de receitas a partir de `catalogs.receitas` por `city.estacoes`, pré-requisitos e quantidades.
- [x] Painel de ingredientes disponíveis vs necessários e produção, refletindo `craftable` e ações.
- [x] Arte própria provisória da oficina em SVG editável: cenário **sem** texto/button baked-in; arte final em pixel art ainda pendente.
- [x] Criar pelo bridge; mostrar estados sucesso/erro, com bloqueio de comandos duplicados.
- [x] Integrar controles teclado, touchscreen e Xbox simulado; testes automatizados incluídos.
- [ ] Aprovação visual, CI de navegador completo e teste Android/Xbox físicos.

### M1g-D — Comércio [CÓDIGO IMPLEMENTADO, ARTE EM REVISÃO]

- [x] Mercadores oficiais de Portomonte, retratos provisórios, lista de comprar/vender e painel de preços dinâmicos.
- [x] Navegação por teclado/gamepad/touch, moeda disponível, cotação de lote e confirmação atômica.
- [x] UI distingue compra, venda e inventário sem reuso ambíguo da navegação.
- [x] Não inventa estoques individuais, preços e comerciantes: suprimentos comuns de Portomonte (IDs usados pela M1d), estoque indisponível em outras cidades.
- [x] Regressões Node/Chromium e capturas em 360×800, 390×844 e 1280×800 implementadas.
- [x] Node, build PWA, Chromium 360×800 / 390×844 / 1280×800, Xbox simulado, comércio em lote e regressões M1g-A/B/C + exploração/combate aprovados. [Run 38624579294](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38624579294).
- [ ] Aprovação visual das capturas, Android/Xbox físicos e arte definitiva pendentes.

### M1g-E — HUD / Encontros / Batalha [IMPLEMENTAÇÃO CONCLUÍDA, QA/ARTE EM REVISÃO]

- [x] HUD compacto PV/PM/área, feedback de coleta e controles touch sem obstruir o cenário.
- [x] Janela de encontro com retrato, descrição canônica e decisões reais.
- [x] Painéis JRPG de batalha: comandos, seleção e descrições por IDs reais.
- [x] Preservar transições, Xbox B e estado ocupado; evitar dupla ação.
- [x] Testes Node e Playwright com capturas 360×800 / 390×844 / 1280×800 adicionados.
- [x] [CI completo #38629438749](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38629438749) passou: 9 capturas Chromium, regressoes M1g-A/B/C/D, Xbox simulado, ciclo de jogo e save clássico intacto.
- [ ] Aprovar arte e testar Android/Xbox físicos.

### M1g-F — Auditoria da vertical slice [AUTOMAÇÃO IMPLEMENTADA / ACEITE ARTÍSTICO PENDENTE]

- [x] Roteiro de jornada completa com Portomonte → Mürin → coleta → combate → retorno → criação → comércio → reload (regressão M1g-E reaproveitada).
- [x] Matriz de paridade *conceito × funcionalidade × lacuna artística* documentada em [docs/19-m1g-f-auditoria.md](19-m1g-f-auditoria.md).
- [x] Auditoria automática de 7 telas em 5 resoluções, 35 screenshots, hitboxes, overflow, foco modal e save.
- [x] Auditoria de PWA, escopo do cache, presença de assets, tamanho do bundle e orientação; orçamento registrado em JSON.
- [x] Corrigir gradiente EXP, tamanho mínimo de comandos de batalha, restauração de foco e orientação PWA.
- [x] [Workflow completo #38631438717](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38631438717) aprovado: 35 capturas, 35 métricas, Node, Chromium, PWA e regressões da vertical slice.
- [ ] Revisar capturas com o usuário, corrigir diferenças artísticas e repetir QA em hardware físico.
- [ ] Playtest em Android físico + Xbox real; só então considerar pronto.
- [ ] Revisão artística explícita antes de publicar a demo.

## M1h — Arte definitiva (execução incremental)

### M1h-A — Identidade de Peren, paleta prateada [CANDIDATO EM REVISÃO]

- [x] Criar uma variante isolada para comparação com o atlas M1e original, sem alterar sprites e saves existentes.
- [x] Recolorir os 128 quadros de Peren (48×64), com cabelos e barba prateados, manto grafite e detalhes em ouro envelhecido.
- [x] Preparar três retratos correlatos (normal, conjuração e ferimento), preservando alpha e dimensões do original.
- [x] Adicionar modo experimental `?art=m1h` no jogo e seletor M1e/M1h no ateliê.
- [x] Testes PNG do canal alfa e dimensões, comparações visuais Chromium e regressões de jogo.
- [ ] Aprovação do visual da variante, revisão de silhueta e remoção completa do chapéu antigo.

### M1h-B — Silhueta, cabelo e expressão canônicos [CANDIDATO IMPLEMENTADO, QA/ARTE EM REVISÃO]

- [x] Gerador que redesenha cabelo e barba em todos os 128 quadros; revisão **manual** das 4 direções ainda pendente.
- [x] Variante visual sem chapéu e com sobrancelhas e barba; inspeção de pixel art e ajustes finos ainda pendentes.
- [x] Três retratos redesenhados por PNGJS; capturas em cidade, floresta e batalha incluídas no QA.
- [x] [CI #38646248645](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38646248645) aprovado: PNGs, galeria, 35 capturas, combate/Xbox simulado e saves.
- [ ] Aceite pelo usuário da arte de M1h-B antes de canonizar como padrão (refino M1h-C, Android/Xbox físicos).

Referências: [M1h-A](20-m1h-a-peren-palette.md) e [M1h-B](21-m1h-b-peren-silhueta.md).

### M1h-C — Refinamento de rosto, cabelo e barba [CANDIDATO EM QA]

- [x] Nova paleta de mechas/sombras e textura de barba/idade aplicada ao atlas existente.
- [x] Preservados os 128 quadros, geometria, alfa, cajado e corpo a partir da linha 43.
- [x] Retratos normal, conjuração e ferimento refinados em 256×256.
- [x] Habilitar variante `?art=m1hc`, sem alterar a arte padrão M1e.
- [x] Adicionar testes por pixel e comparação de quatro variantes em navegador/ateliê.
- [ ] Validar CI final, revisar capturas e obter aprovação estética, Android e Xbox físicos.

Detalhes: [docs/22-m1h-c-peren-refino.md](22-m1h-c-peren-refino.md).


## Design system: primeiros tokens

- **Profundidade e fundo:** `#08131c`, `#101f2a`, `#1b3039`; superfícies com translucidez controlada.
- **Acentos:** dourado `#d5ac67` para moldura/título; dourado luminoso `#f4d49a` para foco.
- **Conteúdo:** marfim `#f5ebd7`; secundário `#b2bdbc`; estados de perigo e sucesso distintos.
- **PV/PM:** verde saudável `#72bd83`, mana `#68b7e8`; barras também exibem valores textuais.
- **Estética:** serifada para títulos e nomes; sans legível para ações, números e texto em celulares.
- **Ornamento como fundo, não como controle:** bordas, canto decorativo e texturas não podem reduzir hitbox, foco ou leitura.
- **Responsividade:** layout amplo multicóluna e empilhamento vertical com navegação prioritária em portrait.
- **Reutilização:** `ui-theme.css` (tokens, botões, painéis, barra, tabs), `ui-portomonte.css` (layout e ambientação).

## Definição de pronto (cada PR)

A funcionalidade antiga continua executável no navegador, testes Node e Chromium passam, alteração de save clássico não ocorre, DOM não produz controles mortos, e o PR contém screenshots e lista do que ainda é provisório. **Revisão visual não pode ser inferida do CI.**

## Próxima ação

M1g-B implementado em branch empilhada sobre M1g-A (PR independente); revisar as capturas do inventário e o fluxo em Android. M1g-C validado por CI; M1g-D implementado em branch empilhada, validado funcionalmente por CI e pendente de revisão artística. M1g-E validado funcionalmente por CI em branch empilhada; aprovação visual e playtest físico pendentes. M1g-F implementado em branch empilhada e sob CI; próxima entrega após auditoria funcional é M1h, passe de arte e sprites finais. Não mesclar nem publicar sem revisão artística e testes físicos. Nenhuma dessas PRs foi mesclada à main. M1g-A e M1g-B aguardam aprovação visual; nada de merge na main.

### Revisão do primeiro lote de screenshots

Após inspeção visual das capturas reais, foram removidas duas imagens clássicas que continham menus/legendas embutidos. O M1g-A mantém apenas a pintura de ambientação sem controles incorporados; artes próprias de Portomonte e de oficinas seguem pendentes de produção. O CSS do hub foi corrigido para carregar o cenário relativo à página compilada, não ao CSS de desenvolvimento.
