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
