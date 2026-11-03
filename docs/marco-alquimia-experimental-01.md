# Marco experimental 01 — Auditoria estrutural e núcleo de misturas
**Branch:** feature/alquimia-v1-experimental. **Data de referência:** 03/11/2026.
**Status:** experimento isolado; nenhuma integração à gameplay publicada.

## Linha de base observada
- 111 ingredientes, 53 efeitos únicos, 343 associações ingrediente-efeito.
- 101 ingredientes com 3 atributos; 10 com 4; nenhum registro com menos de 3.
- 0 efeitos isolados; 0 intensidades fora de I–III; 0 IDs de efeito duplicados na mesma ficha; 0 referências de Stamina em atributos revisados.
- Colisão nominal a resolver por curadoria: **Ovo de Tordo** em `ing-rock-warbler-egg` e `ing-pine-thrush-egg`. Manter ambos os IDs; nomes alternativos exigem análise da descrição/bioma antes de mudar strings ou dependências.

## Entrega executável
- `ferramentas/alquimia-experimental.mjs`: algoritmo puro para interseção por duas fontes de **espécies diferentes**, suporta três ou mais tipos, preserva simultaneamente efeitos benéficos e nocivos; devolve a intensidade de cada fonte, mas **não inventa potência ou duração**.
- `tests/qa_alquimia_experimental.mjs`: testes com a curadoria real e casos de falha/duplicidade/pureza.
- Workflow de CI na branch para executar as assertivas em Node 22.
- Próxima investigação: tradução da ficha dupla Ovo de Tordo; tabela de semântica dos 53 efeitos; taxa de falhas e coocorrência. Essas tarefas não justificam mexer nos runtimes antes de validar as interfaces.

## Limites de alcance
Não há produção efetiva de poção na bancada, sistema de descoberta, consumo de insumos, precificação, estado de Vampirismo, efeitos em batalha ou migração de saves. O clássico `game.js` ainda fabrica por receitas predefinidas; a lógica de uso de consumíveis privilegia um efeito. Essas integrações são posteriores e requerem QA específico.

**Invariante de publicação:** não promover experimentos à `main`, nem modificar `data/itens.json`, `data/receitas.json`, `game.js`, `phaser-demo-m1hf/` ou saves sem a etapa de integração aprovada.
