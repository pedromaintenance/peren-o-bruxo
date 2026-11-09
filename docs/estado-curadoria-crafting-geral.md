# Estado da curadoria geral de crafting — Peren, o Bruxo

**Atualizado:** 07/11/2026 · **Responsabilidade deste chat:** curadoria e auditoria editorial. **Fora do escopo:** editar receitas, fórmulas, UI, rendimento, preços, loot, saves ou game engine sem aprovação e coordenação com o fluxo de mecânicas.

## Cobertura

| Frente | Objetos / receitas revisados documentalmente | Estado |
|---|---|---|
| Alquimia — ingredientes | 111 ingredientes, 53 efeitos, 111 auditorias ecológicas, 106 pareceres territoriais procedurais e cinco localizações preservadas historicamente | Revisão inicial documentada; decisões autorais abertas |
| Forja | 89 receitas; 84 equipamentos de 7 linhagens e 5 lingotes | Reconstrução estática + alertas por receita |
| Joalheria | 14 receitas de anel/colar | Reconstrução estática + alertas de materiais e slot |
| Curtume | 20 receitas de vestimentas/bolsas | Reconstrução estática + alertas de ofício e equipamento |
| Cozinha | 16 receitas | Reconstrução estática + 16 pareceres de coerência gastronômica |
| Escrita | 320 receitas de grimórios | Reconstrução estática; 34 grimórios sem receita |
| Encantamento | 113 receitas de relíquias | Reconstrução estática; 102 insumos de quantidade zero; 140 relíquias sem receita |
| Materiais-base gerais | 33/33 | Matriz de emprego e dúvidas de proveniência; 15 sem uso positivo em qualquer receita gerada, incluindo as 4 alquímicas específicas |
| Objetos de suprimento iniciais | 20 entradas de GEAR | Classificação do gerador; 4 fórmulas alquímicas diretas associadas |
| Equipamentos PHB sem receita | 135 entradas inferidas por reconciliação do manifesto | **Não houve exame individual das fichas compiladas** |

**A contagem integral do gerador fecha: 2.785 itens e 2.316 receitas.** As 572 receitas não alquímicas foram reconstruídas em matrizes por ID e com requisitos, resultados e alertas editoriais. Os dados compilados grandes permanecem sem conferência integral campo a campo por limitação da leitura do conector.

## Dossiês de referência

- **[Relatório geral das sete estações](auditoria-crafting-geral-v1.md):** metodologia, reconciliação dos 2.316 registros, P0, 16 comidas, 33 matérias-primas, slots, produção, economia e próximas decisões.
- **[Matriz de 139 receitas de produção tradicional](../data/auditoria-crafting-nao-alquimico-v1.json):** Forja, Joalheria, Curtume e Cozinha, mais 139 produtos e 33 matérias-primas de base.
- **[Matriz de 433 receitas de Escrita e Encantamento](../data/auditoria-crafting-escrita-encantamento-v1.json):** 320 grimórios, 113 relíquias, 34 magias e 140 itens mágicos sem receita, com IDs e insumos reconstruídos.
- **[Curadoria dos ingredientes](estado-curadoria-ingredientes.md)** e [fechamento territorial](fechamento-primeira-passagem-territorial-ingredientes.md): discussão de ecologia e alquimia, não substituir pela auditoria de outros ofícios.
- **[Roadmap das mecânicas e menus](roadmap-crafting-mecanicas-menus.md):** contrato dos sete ofícios, distinção entre orientação por receitas tradicionais e experimentação livre.

## Handoff prioritário

| Prioridade | Achado | Responsável por implementação | Critério de aceite |
|---|---|---|---|
| **P0** | 102/113 receitas de encantamento com quantidade **0** de Cristal de Alma Maior | Mecânicas e dados | Definir omissão condicional de requisito inexistente; manter nível, valores e saves; testar Laboratório e 113 receitas |
| **P0** | Joias enviadas ao slot de relíquia; luvas/botas/capuzes compartilham slot único com peitorais; bolsas não possuem fluxo de equipar | Equipamento, UI e persistência | Decidir contratos de slots e bônus, sem quebrar equipamentos já equipados no save |
| **P1** | Cinco lingotes produzidos e não consumidos; 70 receitas usam minérios brutos em vez de lingotes | Forja/economia | Decidir cadeia de refino e migração das 98 fichas de equipamento |
| **P1** | 16 receitas culinárias com incoerências nome/insumo e o mesmo efeito de cura | Curadoria + Cozinha | Revisar individualmente as 16 e obter decisão autoral antes de alterar |
| **P1** | Produção de grimórios em Linho de Deméter, sem Pergaminho Vazio; 34 não fabricáveis | Escrita | Decidir suporte de escrita e modos de aquisição dos itens de alto nível |
| **P1** | Encantamentos selecionados por índice par, sem equipamento-base; 140 relíquias sem receita | Encantamento | Distinguir item físico, ritual e tipo de relíquia, com seleção autoral |
| **P1** | 15 materiais sem emprego em receita do gerador | Curadoria de materiais + Mecânicas | Escolher uso econômico, comercial ou de crafting; nenhum item deve ganhar origem regional arbitrária |
| **P2** | Falta de custo de trabalho, operações e progressão perceptível específica para quatro ofícios tradicionais | Design dos ofícios | Definir qualidades, ferramentas, oficinas e tratamento de insumos por ofício, com testes |

Nenhum desses pontos foi implementado neste ciclo. Esta lista é uma **fila de decisões e QA**, não autorização para mexer em dados em produção.

## Critérios para os próximos lotes de auditoria

1. Revisar **cada objeto e seus insumos** usando a matriz por ID: nome, corpo/material, técnica, local, valor, uso e efeito real no motor.
2. Diferenciar achado **objetivo** (quantidade zero, ausência de etapas, slot incorreto) de **opção de design** (forjar metal bruto, usar linho em grimório, nomes da culinária).
3. Quando houver discrepância, oferecer opções com trade-offs e recomendar a menos destrutiva, sem declarar uma solução canônica por inferência.
4. Para lore, não equiparar nome de região à origem do recurso, nem supor que uma ocupação econômica documentada comprove todas as mercadorias dali.
5. Para engenharia, comparar futuramente os JSONs compilados do clássico/Phaser e verificar o comportamento real, sem apagar saves.

**Último marco:** auditoria documental inicial de todos os sete ofícios, com 33 materiais e 572 receitas tradicionais/não alquímicas rastreados, 102 alertas objetivos de quantidade e backlog editorial separado da implementação.

## Primeiro aprofundamento — Forja 89/89 (08/11/2026)

- [**Parecer de Forja — 89 receitas, 7 linhagens, 12 formas e 5 lingotes**](parecer-forja-cadeia-produtiva-equipamentos-v1.md) publicado com alternativas de refino, slots e validação da economia.
- [**Matriz individualizada**](../data/auditoria-forja-89-v1.json): 84 peças e 5 lingotes, insumos, requisitos, flags, lacunas da forma e linhagem, seis decisões `FOR-01` a `FOR-06` **não aprovadas**, e um cenário quantitativo condicional de preços.
- Achados: **60** equipamentos usam minério bruto e **0** usa os 5 lingotes; **49** armas recebem Defesa não aplicada via slot `weapon` no clássico; **35** escudos/armaduras compartilham `armor`; **7** arcos consomem Ironwood.
- Cenário **hipotético** da Forja em Thargrid, com Comércio 9 e materiais supostamente compráveis: **18** saldos positivos, **1** nulo e **70** negativos. **Não** equivale a lucratividade real: loja/estoque, trabalho, coleta e transportes não foram simulados.
- Correção de referencial de mundo: **Golzdov e Kindau são entidades distintas**. `Osso de Golzdov` não vira material do cadáver de Kindau por analogia.
- **0 decisões mecânicas aprovadas**; nenhum produto, receita, status de slot, preço, atributo, engine, save ou loot foi alterado. Próximo aprofundamento: **Joalheria 14/14**, com os mesmos critérios.
