# Plano executável — Alquimia e Gameplay (início v1)
**Origem:** Constituição de Design v1.0, aprovada em 03/11/2026.
**Roadmap de design dos menus e mecânicas:** [roadmap-crafting-mecanicas-menus.md](roadmap-crafting-mecanicas-menus.md). Este plano operacional organiza pesquisa, integração e QA; **não substitui** a hierarquia de ofícios, o tratamento de conhecimento oculto, as cinco famílias e as decisões abertas descritas no roadmap de crafting. **Não presumir que um protótipo na PR #94 está publicado no Pages.**
**Estratégia:** primeiro auditoria e módulo puro testável; depois integração versionada. Branch experimental isolada. O clássico publicado e o bundle Phaser não são alterados nesta largada.

## Inventário comprovado em 03/11/2026
- `data/curadoria_ingredientes.json`: 111 ingredientes, 53 efeitos, zero efeitos isolados; 101 fichas com três atributos e 10 com quatro.
- Problema editorial identificado: `ing-rock-warbler-egg` e `ing-pine-thrush-egg` exibem o mesmo nome "Ovo de Tordo"; IDs e efeitos não são equivalentes. Escolher nomes distintos, preservando IDs e referências, em curadoria rastreada.
- `game.js`: `craft()` fabrica por `data/receitas.json`; `useItem()` prioriza `it.efeito` ou o primeiro de `it.efeitos`. O motor dinâmico ainda não está integrado.
- O clássico usa `peren_carcaca_save_v1`. A prévia Phaser mantém save/cache próprios. Essas chaves são zonas protegidas.

## Etapa A — Curadoria transversal (P0)
**Entrega:** auditoria reprodutível do catálogo, matriz de parceiros, duplicidades, atributos inválidos, divergências de semântica, biomas/habitats e histórico de decisões.
**Ações:** validar os 111 registros e intensidade I–III; mapear nomes duplicados e colisões de tradução; identificar atributos incompatíveis e conflitos de lore; registrar justificativas, grau de confiança e mudanças.
**Gate:** testes de estrutura e consistência sem perda de IDs/efeitos. Divergências materiais exigem prova; decisões de cânone irreversíveis retornam ao criador.
**Estado inicial:** investigação; a auditoria por ingrediente está documentada até o Ciclo 38. Fungo do Pântano é o próximo da fila, mas o método agora passa a ser por lotes auditáveis.

## Etapa B — Núcleo combinatório independente (P0)
**Entrega:** `ferramentas/alquimia-experimental.mjs`, sem imports do runtime, que recebe catálogo + IDs e retorna a interseção com fontes distintas. Não define potência, duração ou save.
**Ações:** validar entrada, ordem invariável, pares com 2 efeitos, 3+ fontes, duplicação de tipos e ausência de interseção. Criar `tests/qa_alquimia_experimental.mjs`.
**Gate:** assertivas determinísticas com o catálogo canônico; nenhuma edição em `game.js`, `data/receitas.json` ou `data/itens.json`.
**Estado inicial:** iniciar na branch experimental, antes de qualquer integração visual.

## Etapa C — Semântica e balanceamento por simulação (P0)
**Entrega:** catálogo dos 53 efeitos com tipo, alvo, potência sugerida, duração, conflito, empilhamento, cura/veneno e efeitos persistentes.
**Ações:** testar fórmulas alternativas; não supor média. Diferenciar `dano_magia`, `diminuir_magia` e regeneração; distinguir aumentar saúde, restaurar saúde e regenerar saúde. Definir estados e transições de Vampirismo, doenças e maldições.
**Gate:** testes por classe de efeito, limites e invariantes; mudanças fundamentais de cosmologia voltam ao criador.

## Etapa D — Interface de laboratório (P1)
**Entrega:** protótipo isolado de bancada com seleção de insumos, descoberta de propriedades, falha e múltiplos efeitos; UI touch e teclado.
**Ações:** experimentar 2–4 tipos, recipientes reutilizáveis, feedback e diário/livro alquímico; sem expor efeitos desconhecidos por acidente.
**Gate:** usabilidade e regressão mobile/desktop; importação/exportação de resultados de teste sem tocar saves reais.

## Etapa E — Mundo, comércio e progressão (P1)
**Entrega:** matrizes regionais de coleta, preços e demanda, ofícios/proficiência e usos não bélicos (viagens, resistências, cura, mobilidade).
**Gate:** fontes de materiais rastreáveis, progressão coerente, testes de economia (inclusive loops de lucro artificiais), sem sobrescrever o conteúdo anterior.

## Etapa F — Integração reversível (P0 antes de publicar)
**Entrega:** adaptador clássico + plano de consumo no Phaser que mapeia efeitos dinâmicos para itens fabricados; mantém receitas especiais e produtos existentes.
**Ações:** estudar bundling e runtime Phaser reais; versionar o formato de preparo/saves; testar produção, uso, inventário, comércio, luta, viagem, reload, PWA e migração.
**Gate:** QA automático + regressão em Pages candidato + playtest de dispositivo físico + aprovação do criador para publicação grande. Não atualizar `main` com o novo motor por conta própria.

## Rotina de autonomia
1. A cada ciclo: ler a Constituição, os últimos registros da auditoria, ``AGENTS.md` e arquivos pertinentes; verificar `main` e branch experimental.
2. Realizar um lote pequeno de pesquisa/curadoria ou código; anotar hipóteses, transformações, riscos e arquivos alterados.
3. Executar validações; informar claramente se QA foi local, em CI, ou em Pages. Registrar commit e URL de revisão.
4. Reavaliar a próxima etapa frente à gameplay e à Carcaça, sem substituir decisões canônicas.
5. Fazer merge/publicação apenas dentro da autorização e do gate apropriado.

## Primeira entrega concreta
Criar branch `feature/alquimia-v1-experimental` a partir da `main` documentada; nela adicionar módulo **puro e sem efeitos colaterais** e testes com dados reais. A branch pode ser atualizada autonomamente. O conteúdo só é promovido ao runtime com compatibilidade demonstrada e aprovação de publicação pertinente.

**Critério de sucesso da primeira entrega:** commit de documentação em `main`; commit funcional na branch experimental; nomes de arquivos afetados, checagem do módulo, estado do CI e próximos riscos descritos sem prometer publicação.

## Separação editorial entre fluxos (03/11/2026)

A partir desta data, **a curadoria e preparação de ingredientes/itens** deste chat não implementa mecânica, menus ou runtime. Outro fluxo é responsável pelas etapas B–F de código/interface. Este fluxo cobre a Etapa A e os dados editoriais de que os demais dependem. A referência cruzada de ecologia/cosmologia é [`pedromaintenance/monstros-carcaca`](https://github.com/pedromaintenance/monstros-carcaca), segundo as regras de proveniência em [`docs/curadoria-itens-consistencia-carcaca.md`](curadoria-itens-consistencia-carcaca.md). Propostas de Monstros da Carcaça não são promovidas automaticamente a cânone. Este ajuste de responsabilidades não revoga a Constituição nem altera os gates de publicação.

## Handoff de combinações especiais para a auditoria de itens — 03/11/2026

A [Emenda A2 da Constituição v1.0](constituicao-design-v1.md) e o [roadmap de curadoria](curadoria-itens-consistencia-carcaca.md) incluem uma tarefa editorial prioritária: **mapear sinergias e incompatibilidades entre efeitos** e registrar combinações com identidade narrativa/visual. **Não é correto afirmar que todo preparado multiefeito é Impuro.** Preparados Impuros possuem efeitos incompatíveis. Preparados com efeitos sinérgicos aprovados recebem nome de combo; misturas compatíveis não sinérgicas mantêm o nome do efeito mais intenso e o outro na descrição.

O registro versionado de partida está em [`data/catalogo-combos-alquimicos.json`](../data/catalogo-combos-alquimicos.json): **Poção da Fada** (`aumentar_carisma` + `aumentar_ilusao`), a incompatibilidade `aumentar_carisma` + `diminuir_forca` e o exemplo compatível sem nome especial `aumentar_forca` + `resistencia_eletricidade`. O agente de auditoria deve propor novos combos com fundamento e status **proposto** até aprovação, preservar IDs e catalogar chave de arte/possível animação futura, sem produzir assets ou alterar ingredientes/receitas para forçar resultados. Consultar o [roadmap de menus e mecânicas, seção 14](roadmap-crafting-mecanicas-menus.md), para contrato de integração e QA.

**O combo é uma classificação posterior à interseção normal dos ingredientes, nunca uma receita alternativa.** A etapa de implementação testa classificação e UI; a etapa curatorial mantém o catálogo confiável e animação planejável. **Somente documentação e metadados, sem gameplay publicado.**

## Handoff experimental — terceira e quarta fontes (03/11/2026)

**Referências:** [estudo de fontes adicionais](estudo-fontes-adicionais-alquimia-v1.md), [roadmap de mecânicas — seção 20](roadmap-crafting-mecanicas-menus.md), [roadmap de curadoria](curadoria-itens-consistencia-carcaca.md) e [PR #97, protótipos isolados](https://github.com/pedromaintenance/peren-o-bruxo/pull/97).

A auditoria de ingredientes e o motor devem tratar separadamente: **(1)** efeito ativado por pelo menos duas espécies/tipos distintos; **(2)** outras fontes do mesmo efeito, preservando seus IDs e intensidades de origem I–III; **(3)** novos efeitos ativados pela entrada de mais um material; **(4)** incompatibilidades e sinergias **aprovadas**; **(5)** eventual potência/duração/qualidade, **ainda não definida**.

**Não canonizar** soma integral (M1), duas fontes mais intensas (M2), maior origem (M3), reserva de intensidade ou efeito automático de duração. Uma 4ª fonte pode reforçar o índice sem alterar o conjunto de efeitos, pode ativar propriedade negativa sem torná-la Impura, ou pode ativar uma incompatibilidade verdadeira e tornar o preparado **Impuro**. A curadoria não muda atributos para forçar nenhum desses casos.

**Separação de equipes:** quem audita itens entrega origens, IDs e dados editoriais íntegros; quem implementa mecânicas poderá experimentar consumo, resultado e UI em branch isolada depois da definição das regras. O painel offline e o módulo de pesquisa da PR #97 não são integrados ao Phaser; suas **16 verificações V8** e **10 verificações de interface simulada** não equivalem a testes de runtime, CI Node ou Pages.

**Próxima definição:** semântica dos 53 efeitos e papel da terceira/quarta fonte em potência/duração/qualidade **por tipo de efeito**, sem aplicar bônus universais ou anunciar propriedades ocultas ao jogador.

## Handoff de Etapa C — taxonomia semântica dos 53 efeitos (05/11/2026)

O [relatório dos 53 efeitos](taxonomia-53-efeitos-alquimicos-v1.md) desenvolveu a etapa de classificação **sem implementar potência, duração ou efeito aplicado**. Uma taxonomia editorial com IDs, contagem de fontes e intensidades vigentes, grupo semântico **proposto** e campos `null` para mecânicas não decididas foi catalogada em [PR #98](https://github.com/pedromaintenance/peren-o-bruxo/pull/98), juntamente com revisão HTML exportável e 17 testes de integridade. O estudo abrange **todos os 53 IDs** do catálogo de **111 ingredientes**; a interface passou **13 checagens com DOM simulado**.

**Entregas futuras para o agente de mecânicas:** definir em cada ficha o estado modificado (**valor atual, máximo, taxa, condição, capacidade ou transformação**), o alvo permitido, a operação de aplicação, o início/duração, a resistência, empilhamento, dissipação, reversão, condições de descoberta, fonte extra e veículo Poção/Veneno/Tônico/Elixir/Bálsamo. Essas decisões precisam de aprovação e testes antes de qualquer integração transacional. Não calcular duração e potência globalmente apenas pelo nível I–III da origem.

**Ponto autoral a preservar:** `vampirismo` tem potencial de transformação gradual em vampiro **aprovado pelo criador**, mas sem estágios/duração/limites decididos. A auditoria também propôs distinções de dano/limite/taxa mágicos, cura/regeneração, doença/dano, percepção/visão e destreza/velocidade — **propostas não canônicas**.

**Status:** somente documentação na `main` e protótipos na PR #98 (draft); sem alterações de ingredientes, recipes, Phasers, clássico, saves ou arte. O próximo experimento mecânico deve focar na semântica de recursos atuais/máximos/regeneração, **não** em duração universal para os 53 efeitos.

## Etapa C — desdobramento operacional do núcleo Saúde/Magia (05/11/2026)

**Prova de conceito editorial:** [estudo dos dez efeitos de recursos](estudo-recursos-alquimicos-v1.md) e [PR #99](https://github.com/pedromaintenance/peren-o-bruxo/pull/99) (draft), que contêm simulador puro, catálogo JSON de decisões abertas, painel HTML offline e testes. **Não são imports de Phaser nem regras aprovadas.**

O próximo contrato do motor deverá distinguir **PV/MP atual**, **PV/MP máximo**, **taxa de regeneração** e **eficácia arcana não especificada**. O classificador de misturas precisa devolver todos os IDs de efeitos ativados; a **aplicação ao personagem/alvo** acontece em fase posterior e deverá respeitar a escolha explícita de simultaneidade, valores limites, tempo, resistência, custo e inventário.

**Achado de retrocompatibilidade obrigatório:** `game.js` trata atualmente `Regenerate Health` e `Regenerate Magicka` como reposição imediata, assim como `Restore Health` e `Restore Magicka`. A proposta de diferenciar regeneração ao longo do tempo não autoriza mudar o funcionamento dos produtos existentes. Antes de aplicar `regenerar_saude` ou `regenerar_magia` no runtime, definir comportamento do legado e versionamento semântico do item/salvamento.

**Testes e gates:** 31/31 verificações da lógica executadas em V8 e 14/14 do painel em DOM simulado; sem CI Node, teste de navegador/Phaser ou migração real. Resolver `REC-D01–D07` e `CRAFT-D46–D52` antes de integrar. Próxima investigação sugerida: aplicação de efeitos em diferentes contextos de uso (combate, exploração, descanso), inclusive PV zero, expiração de máximo e consumo em uma transação segura.

## Etapa C → uso contextual e fronteira de consumo (07/11/2026)

**Especificação de trabalho:** [estudo de aplicação contextual](estudo-aplicacao-contextual-alquimia-v1.md), [PR #100](https://github.com/pedromaintenance/peren-o-bruxo/pull/100) (draft) e [roadmap de mecânicas, seção 23](roadmap-crafting-mecanicas-menus.md). Protótipos não integrados e nenhuma decisão numérica aprovada.

A aplicação foi dividida em **pré-validação sem custo** → **resolução completa de efeitos** → **commit idempotente** de consumo, ação e estado do alvo → **recibo público restrito às propriedades conhecidas**. O protótipo em memória demonstra operações imediatas de Saúde/Magia **apenas com magnitudes fictícias de QA**. Não decide persistência, Pv zero, resistência, falhas, custo em turno, dose, alvo, Elixires, Bálsamos ou clock de Tônicos.

**Gate prioritário antes de implementação:** a branch Phaser já diminui `battle.potions` em `stepBattle('potion')` e reconcilia o restante com `character.bag['ger-pocao-restauradora']` em `victory` ou `escape`. **É proibido duplicar esse débito** sem revisar a fronteira transacional e os testes existentes. O `ledger` do envelope de `progress.js` não é uma licença para criar transação que cobre de novo o item do combate. A interface `ui-inventory.js` é de leitura, então não há botão geral homologado.

**Três contextos, cinco famílias:** matriz de 15 casos distingue combate, exploração, descanso e Poção/Veneno/Tônico/Elixir/Bálsamo. `endDay` recupera PV/MP no mundo, mas **não** ativa automaticamente poções ou ticks futuros. Permanência de efeitos atravessando combate, mundo e descanso depende de aprovação por categoria semântica.

**QA:** **37/37 testes V8 isolados** e **15/15 checagens UI com DOM simulado**. Ainda faltam Node CI, browser real, save/reload, teste de dupla cobrança e integração Phaser. Próximos requisitos `CTX-D01–CTX-D08` / `CRAFT-D53–D60` antes de qualquer comando real de uso. **Não alterar `game.js` nem saves clássicos.**

## Decisão de pré-alfa e implementação no combate — 07/11/2026

**[CANÔNICO — Emenda S1]** Retrocompatibilidade de saves antigos não é requisito durante a **pré-alfa**. O criador autorizou iniciar uma partida nova após alterações estruturais, sem desenvolver migrações para formatos anteriores. A [Constituição](constituicao-design-v1.md) prevalece sobre os antigos gates de save descritos neste plano. **Persistência correta dentro da build vigente** (sem duplo consumo, perda de itens ao liquidar combate ou loot duplicado) continua obrigatória.

**[IMPLEMENTADO EM BRANCH DE DESENVOLVIMENTO — AINDA NÃO MESCLADO]** A [PR #101](https://github.com/pedromaintenance/peren-o-bruxo/pull/101), voltada à `transition/phaser-only-m0-20261030`, inclui executor puro `phaser-lab/src/prepared-use.js`, comando `prepared:<id>` de batalha, conciliação de instâncias em `progress.js`, interface de seleção no painel de combate, animação e testes. O resultado da bancada `brewPair` é uma **instância individual** em `alchemy.preparations`; depois do uso, seu ID deixa de constar no estoque temporário da batalha. Ao encerrar o encontro, o envelope recebe **somente os IDs que permanecem**. Essa solução evita a cobrança duplicada entre combate e inventário.

**Limites de gameplay:** somente `restaurar_saude` (+24 PV) e `restaurar_magia` (+12 PM), ambos com **valores temporários de pré-alfa**, são executados por essa nova via. Qualquer efeito não implementado bloqueia o preparado inteiro. A ação gasta **turno de combate** e permite reação inimiga, sem gastar simultaneamente a ação diária. Poções legadas de combate seguem no comando existente. Isso **não aprova** novas semânticas para Venenos, Bálsamos, Tônicos, Elixires, Vampirismo ou outros efeitos.

**QA real:** [CI Phaser PR #101: success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/42423874692) — testes Node (incluindo duas suítes novas), build Phaser/Vite e smoke de navegador Chromium aprovado. Testes em dispositivo físico e validação visual humana pendentes. **Não publicar nem mesclar automaticamente**. Próximas tarefas: playtest humano, calibração, uso em exploração e demais vias de aplicação.

**CI final da PR #101 (07/11/2026):** [GitHub Actions — Node + build Vite/Phaser + smoke Chromium: success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/42424319985), commit `260c863fd8f5`. Suítes de pré-alfa: **21 testes de motor + 15 de progresso**, incluindo bancada real → frasco → combate → conciliação, nova chave `PHASER_KEY` e ingredientes iniciais **Asa de Borboleta** e **Chapéu Branco**. A regressão intermediária era um teste antigo com chave de save fixa, corrigido para usar `PHASER_KEY`. [Roteiro de playtest humano na branch](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/prealfa-consumo-preparados-combate-20261107/phaser-lab/PRE-ALFA-PREPARADOS-PLAYTEST.md). **Sem merge, sem Pages e sem teste em dispositivo físico.**

## Uso de preparados na exploração e pré-contrato de Venenos (07/11/2026)

**Implementação em revisão:** [PR #102 — draft, empilhada sobre PR #101](https://github.com/pedromaintenance/peren-o-bruxo/pull/102). Estudo: [`estudo-venenos-uso-exploracao-prealfa-v1.md`](estudo-venenos-uso-exploracao-prealfa-v1.md).

A fase de pré-alfa conectou o **inventário real** às instâncias de `alchemy.preparations`: botão **Usar preparo fora do combate**, IDs de lote, comando `usePreparation` no `progressBridge`, ledger por instância, atualização do HUD e recuperação até máximos calculados. A UI não executa diretamente mutações do estado. O uso no mundo tem **custo zero de ações diárias nesta hipótese de QA**; consome uma instância e é impedido em PV zero, sem efeito útil ou sem executor de todos os efeitos. Não se criam registros duplicados em `bag`.

**Campo e dispositivo:** botão **⚗ BOLSA** no controle de exploração, tecla **I** e Xbox **Y** abrem inventário; a cena é pausada enquanto o menu está aberto e retomada somente após fechamento apropriado. [CI #42425972550](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/42425972550) concluiu testes Node, compilação do Phaser e **dois smoketests reais de Chromium**, sendo o novo um percurso fabricação → inventário → uso → save → floresta pausada/retomada.

**Venenos (sem execução):** pesquisa separada em `phaser-lab/src/poison-route-proposal.js` enumera **lançamento, impregnação em arma e administração** como vias independentes. Todas bloqueadas até definição de acerto/alcance, alvo, resistência/consentimento, falha, duração, cargas e custo. **Beladona + Sino da Morte** é vetor real de efeito único `dano_saude`. **Flor Vermelha + Beladona** evidencia efeito positivo e negativo no mesmo frasco, que não pode ser parcialmente ignorado. Não canonizar dano numérico nem sucesso automático.

**Próximo gate:** revisão humana dos controles em mobile/Xbox e decisão autoral de qual via de Veneno prototipar primeiro. Migração de saves antigos permanece **fora do escopo da pré-alfa**.
