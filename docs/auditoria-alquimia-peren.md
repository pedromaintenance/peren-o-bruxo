# Auditoria alquímica — Peren, o Bruxo

> Registro persistente de decisões, evidências e continuidade. Data: 2026-10-29. Fonte auditada: `data/curadoria_ingredientes.json` na branch `main`.
> **Estado:** diagnóstico e propostas documentados; nenhuma mudança de regras/runtime, ingredientes, itens, receitas, economia ou saves foi aplicada neste ciclo.

## Decisões aprovadas pelo criador (não rediscutir sem nova orientação)

1. O jogo é fundamentalmente de **coleta e crafting**. Efeitos extremamente poderosos são válidos e desejáveis. **Não nerfar** ingredientes por balanceamento de combate.
2. Alquimia comum inspirada em Skyrim: a preparação é **gerada pelos efeitos coincidentes de pelo menos dois ingredientes distintos**, em vez de buscar uma receita fixa por produto.
3. Diferentes pares podem produzir o mesmo efeito; uma mistura pode ter vários efeitos simultâneos, inclusive benéficos e nocivos.
4. Poções, venenos e misturas **compartilham sprites por família de recipiente/preparação**, sem criar asset individual para cada combinação.
5. Preservar lore da Carcaça, coerência material dos ingredientes e identidades/IDs dos dados; raridade não equivale automaticamente a poder.
6. A curadoria existente especifica mínimo de 3 atributos por ingrediente, intensidade 1–3 e atributos extras somente por revisão manual. **Esses são dados atualmente vigentes, não um teto geral de poder decidido para o gameplay.**
7. O laboratório de itens é somente leitura. Alterações futuras devem preservar edição clássica, Phaser, combate, coleta, economia, assets, PWA e saves.

## Evidências do catálogo atual (análise transversal)

- **111 ingredientes** encontrados em `curadoria_ingredientes.json`.
- **53 IDs de efeitos** distintos.
- **9 efeitos isolados**, existentes em um único ingrediente cada. Com a regra simples de interseção entre dois ingredientes diferentes, nenhum deles produzirá uma poção por enquanto.
- A contagem de parceiros significa número de **outros ingredientes** com pelo menos um efeito compartilhado. Não mede potência, qualidade nem número total de receitas.

### Efeitos isolados — fila de conectividade

| ID do efeito | Nome | Ingrediente único | Intensidade |
|---|---|---|---:|
| `curar_doenca` | Curar doença | Pena de Gaivota (`ing-felsaad-tern-feathers`) | 3 |
| `vampirismo` | Vampirismo | Pó de Vampiro (`ing-vampire-dust`) | 3 |
| `diminuir_carisma` | Diminuir Carisma | Couro de Rato (`ing-charred-skeever-hide`) | 3 |
| `infligir_doenca` | Infligir Doença | Couro de Rato (`ing-charred-skeever-hide`) | 1 |
| `visao_a_distancia` | Visão à Distância | Penas de Falcão (`ing-hawk-feathers`) | 3 |
| `velocidade` | Velocidade | Penas de Falcão (`ing-hawk-feathers`) | 1 |
| `diminuir_sabedoria` | Diminuir Sabedoria | Betta do Rio (`ing-river-betty`) | 1 |
| `aumentar_inteligencia` | Aumentar Inteligência | Musgo Parassol (`ing-emperor-parasol-moss`) | 1 |
| `diminuir_magia` | Diminuir Magia | Libélula Laranja (`ing-orange-dartwing`) | 1 |

**Tratativa:** não remover nem enfraquecer esses efeitos. Encontrar um segundo ingrediente compatível dentro do catálogo, com justificativa material e geográfica. Nenhuma atribuição nova foi aprovada ou implementada.

### Primeiro lote de 12 ingredientes

| Ingrediente | ID | Parceiros | Atributos atuais (intensidade) |
|---|---|---:|---|
| Pena de Gaivota | `ing-felsaad-tern-feathers` | 21 | Curar doença 3; Voar 1; Aumentar Constituição 2 |
| Carapaça de Caranguejo | `ing-mudcrab-chitin` | 31 | Aumentar Força 2; Aumentar Constituição 3; Resistência a Veneno 1 |
| Pó de Vampiro | `ing-vampire-dust` | 11 | Vampirismo 3; Invisibilidade 2; Regenerar Saúde 1 |
| Couro de Rato | `ing-charred-skeever-hide` | 9 | Diminuir Carisma 3; Resistência a Veneno 2; Infligir Doença 1 |
| Penas de Falcão | `ing-hawk-feathers` | 1 | Visão à Distância 3; Voo 2; Velocidade 1 |
| Raiz Botulínica | `ing-jarrin-root` | 42 | Dano à Saúde 3; Diminuir Constituição 3; Diminuir Destreza 3; Diminuir Força 3 |
| Betta do Rio | `ing-river-betty` | 26 | Aumentar Força 2; Aumentar Destreza 3; Diminuir Sabedoria 1 |
| Musgo Parassol | `ing-emperor-parasol-moss` | 26 | Regenerar Saúde 2; Aumentar Inteligência 1; Dano à Saúde 1 |
| Raiz Velada | `ing-nirnroot` | 24 | Invisibilidade 3; Resistência à Magia 2; Diminuir Destreza 1 |
| Raiz Velada Rubra | `ing-crimson-nirnroot` | 33 | Invisibilidade 3; Dano à Saúde 2; Diminuir Constituição 3 |
| Sino da Morte | `ing-deathbell` | 24 | Dano à Saúde 2; Diminuir Velocidade 2; Fraqueza a Veneno 1 |
| Flor Venenosa | `ing-poison-bloom` | 24 | Dano à Saúde 3; Medo 2; Diminuir Velocidade 1 |

**Achados:** Penas de Falcão só encontra **1 parceiro** e tem dois efeitos isolados; Raiz Botulínica encontra **42 parceiros** e seus quatro efeitos III são válidos (não balancear para baixo). Carapaça de Caranguejo, Raiz Velada, Raiz Velada Rubra, Sino da Morte e Flor Venenosa não exigem correção por potência. Pó de Vampiro mantém Vampirismo III, mas esse efeito precisa de uma segunda fonte para ser fabricável por interseção.

## Divergência documental a resolver

O `README.md` registra uma etapa anterior da Pena de Gaivota como **Restaurar stamina 2**, mas a fonte atualmente auditada em `data/curadoria_ingredientes.json` registra **Aumentar Constituição 2**. Não substituir silenciosamente um pelo outro: verificar histórico da curadoria e runtime antes de ajustar o README ou dados. Esta auditoria usa o **JSON atual** como evidência do estado presente.

## Regra de geração proposta — ainda não implementada

```text
selecionar ingredientes A e B (IDs distintos)
interseção = IDs de efeitos presentes em A e B
se interseção vazia: resultado = mistura fracassada
senão: criar preparação com a lista de efeitos coincidentes
persistir composição, efeitos calculados, intensidades e eventual qualidade
escolher sprite por família de recipiente/efeitos, não por receita única
```

**Decisões ainda abertas:** fórmula de potência (não assumir média), contribuição de 3+ ingredientes, efeitos contraditórios, descoberta/visibilidade de propriedades, duração, qualidade de instrumentos, custo e consumo, semântica de poção versus veneno, stacking, aplicação e migração de saves.

**Importante:** `data/receitas.json` ainda contém receitas legadas. Não apagar nem migrar automaticamente até mapear dependências do runtime e escolher estratégia reversível para receitas especiais e produtos legados.

## Continuidade operacional — próximo ciclo

1. Verificar cada um dos 9 efeitos isolados contra os 111 ingredientes, lore e origem; propor novos parceiros **sem aplicar automaticamente**.
2. Auditar o restante do catálogo por conectividade, incoerências semânticas, IDs equivalentes e duplicidade; **não usar balanceamento de poder como critério**.
3. Examinar `game.js`, os módulos de crafting do clássico e do Phaser, `data/receitas.json`, `data/itens.json` e o laboratório para desenhar adaptador de geração compatível.
4. Especificar testes determinísticos: A+B = B+A, dois efeitos em comum geram ambos, nenhum efeito gera falha, ingredientes distintos exigidos, sprites compartilhados, não perder saves.
5. Implementar em mudança separada, testável e reversível, depois de concluir o desenho da migração.

## Rastreamento

- **Ciclo 1 (29/10/2026):** 111 ingredientes, 53 IDs de efeitos, 9 isolados; 12 primeiras fichas enumeradas; regra de crafting emergente registrada; nenhuma mutação do gameplay.
- **Para retomada do chat:** ler este arquivo **antes** de sugerir alterações. A meta é maximizar descoberta e conectividade, não equilibrar combate.
