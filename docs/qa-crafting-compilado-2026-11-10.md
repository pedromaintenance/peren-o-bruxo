# QA dos compilados do crafting — 10/11/2026

**Resultado:** leitura integral e conferência estática de **2.785 itens** e **2.316 receitas** do GitHub, sem executar nem editar o jogo.

**Dados estruturados:** [QA do crafting compilado](../data/qa-crafting-compilado-2026-11-10.json).

## Método

Foram lidos por **SHA Git do blob**, sem truncamento, os arquivos:
- `data/itens.json`: SHA `e549607c26fa131fc742ce0b1a4b41e63f8a3488`, 1.193.150 bytes.
- `data/receitas.json`: SHA `cbc1bfba78e6e4828b6fc3daa986c7b5f614c172`, 1.204.280 bytes.

Cruzamos **cada receita dos 572 registros não alquímicos** com as matrizes editoriais já versionadas, verificando `id`, `nome`, `estacao`, `pericia`, `nivel`, `ingredientes` (IDs e quantidades), `resultado` e `quantidade` de saída. Também conferimos a existência de todos os insumos e resultados nas 2.316 receitas e os campos principais de **139 produtos tradicionais**.

| Ofício | Receitas do compilado | Divergências da matriz |
|---|---:|---:|
| Forja | 89 | 0 |
| Joalheria | 14 | 0 |
| Curtume | 20 | 0 |
| Cozinha | 16 | 0 |
| Escrita | 320 | 0 |
| Encantamento | 113 | 0 |
| **Total não alquímico** | **572** | **0** |

Há **1.744 receitas de Alquimia**. Elas foram incluídas na verificação de referências, quantidade de insumos e IDs, mas **não** em um novo confronto semântico campo a campo com o algoritmo das combinações.

## Defeito estrutural realmente presente no compilado

**102 receitas de Encantamento** possuem um insumo `mat-cristal-de-alma-maior` com quantidade **0**. Os 102 IDs estão listados no [JSON de QA](../data/qa-crafting-compilado-2026-11-10.json). Nenhuma outra quantidade inválida foi encontrada nas 2.316 receitas.

O [Laboratório de Itens](../laboratorio-itens/app.js) considera quantidade menor ou igual a zero inválida. **Proposta ainda não aprovada:** quando o cristal maior for opcional em determinada receita, a engenharia deve avaliar omitir o requisito inexistente, e não convertê-lo automaticamente para quantidade um. Alterar essa lista exige testes de economia, progressão, menu, inventário e compatibilidade de save.

## Integridade e limites

- **2.785 itens; 2.316 receitas** carregados e analisados por JSON.
- **572/572** receitas não alquímicas compatíveis com as reconstruções anteriores.
- **0** referências quebradas a insumos ou produtos.
- **0** divergências nos campos selecionados dos 139 produtos tradicionais.
- **102** entradas inválidas de quantidade, concentradas em Encantamento.
- **0** alterações no gerador, nos arquivos compilados, em motores, saves, Phaser ou prealfa.

**Esta verificação supera a limitação técnica declarada nos relatórios anteriores de que não era possível ler os arquivos compilados grandes.** Não supera a outra limitação: **não houve testes de execução de gameplay, comportamento Phaser/prealfa, mercado real, progresso ou saves**. A auditoria dos dados e a decisão sobre como reparar o defeito continuam tarefas diferentes.
