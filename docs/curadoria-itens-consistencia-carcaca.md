# Curadoria dos itens de Peren — consistência com Monstros da Carcaça
**Acordo de escopo:** 03/11/2026. **Fonte cruzada:** [Monstros da Carcaça](https://github.com/pedromaintenance/monstros-carcaca), referência main `051cff4febdecc8d0bb8ec280ffd406e5b89a552`.
**Constituição:** [Constituição de Design v1.0](constituicao-design-v1.md).
**Estado deste documento:** protocolo editorial e diagnóstico preliminar; **não altera** atributos ou localizações dos ingredientes.

## 1. Divisão de responsabilidades entre chats
**Este fluxo — curadoria e preparação dos itens:**
- Auditar fichas, nomes, descrições, atributos, intensidade I–III, raridade, associações de efeitos, taxonomia da origem, habitats e proveniência.
- Preparar registros e metadados para serem consumidos por qualquer runtime, sem acoplar a interface, inventário ou algoritmos de fabricação.
- Identificar colisões, efeitos legados, traduções e inconsistências; criar alterações curatoriais pequenas e rastreáveis quando fundamentadas, sem desfazer decisões expressas do criador.
- Examinar todas as 111 fichas por lotes, documentar evidências e manter log de alterações.

**Outro fluxo — mecânica e menus:**
- Alquimia dinâmica, potência, duração, contêineres, estados, consumo de insumos, salvamento, inventário, combate, interfaces, integração Phaser/clássico, PWA e QA de gameplay.
- Não alterar silenciosamente propriedades canônicas; consumir curadoria versionada ou propor revisão de dados explicitamente.
- As regras comuns são definidas na Constituição; controvérsias editoriais voltam a este fluxo de curadoria.

## 2. Fontes e níveis de evidência
O repositório Monstros da Carcaça contém duas camadas distintas: referência importada licenciada em `dist/` e registros autorais em `curadoria/`, `data/` e `dist/carcaca/`. O fato de um registro constar numa API não significa que todas as suas inferências estejam aprovadas.

| Prioridade | Evidência | Regra |
|---|---|---|
| 1 | Decisão expressa do criador e cânone consolidado | Não sobrescrever por analogia, estatística ou conveniência de gameplay |
| 2 | Fato com proveniência `documentado` ou `confirmado` nos registros autorais | Pode fundamentar lore, nomes, categorias e ambientação, respeitando o escopo exato da fonte |
| 3 | Afirmações do Hack em revisão e índices de transcrição | Consultar contexto e `data/lore/hack-carcaca-dw-pontos-de-revisao.json` antes de promover ao cânone |
| 4 | `proposto`, `inferido`, `piloto`, `rascunho`, `aprovacao_autoral:false` ou `altera_canon:false` | Fonte de hipótese para análise; nunca apresentar como fato novo automaticamente |
| 5 | Listas importadas de D&D e equivalentes de outros RPGs | Referência taxonômica/nominal, não prova de ocorrência ou linhagem na Carcaça |

**Fontes primárias consultadas:** `data/taxonomia_carcaca.json`, `data/regioes_carcaca.json`, `data/lugares_carcaca.json`, `curadoria/criaturas/arquivo-dos-mortos-afogados.json`, `dist/carcaca/creatures.json`, `data/atlas/macroambientes-ciclo35.json`, `data/atlas/hidrografia-continental-ciclo39.json`, `docs/CONSULTA_CURADORIA.md`, `docs/ATLAS_MACROAMBIENTES_CICLO35.md`, `docs/LORE_HACK_CARCACA_DW.md` e `docs/ECOLOGIA_MONSTRUOSA_ELDROTH_CICLO12.md`.

## 3. Regras de compatibilidade cosmológica e ecológica
- Demônios, diabos, cambions e tieflings não são automaticamente tipos cosmológicos independentes. Meio-demônio pode ser ancestralidade, não tipo de criatura.
- Abissais **marinhos** são distintos de demônios do Abismo. Nunca produzir um ingrediente demoníaco a partir da palavra "abissal" sem fonte específica.
- Yokai (tipo de criatura) não se confunde automaticamente com o povo/civilização yokai antiga. Ser feérico, tradição cultural e facção não são sinônimos.
- Um indivíduo nomeado (por exemplo, criatura única do Arquivo dos Mortos Afogados) **não comprova uma espécie populacional**, distribuição geográfica nem recurso de caça disponível.
- A Foz, o Rio Ancestral, Eldroth, Thargrid, Caatinga, Costa Sul e Mar de Sangue têm contextos diferentes. A fronteira entre águas azuis e vermelhas é móvel; não fixar habitat ou coordenadas por suposição.
- O atlas macrorregional documenta grandes ambientes, não distribuição de cada fungo, ovo, ave, caranguejo ou criatura. Não inferir abundância, sazonalidade, pontos de coleta ou potencial de comércio sem fonte adicional.
- Peren pode conservar nomes fantasiosos e propriedades aprovadas antes de haver uma origem ecológica especificada; usar `habitat_nao_documentado`/`origem_a_investigar` em notas de auditoria, sem inserir espécies como fato no mundo.

## 4. Primeira matriz de consistência — amostra do catálogo vigente
| ID de Peren | Verificação com Monstros da Carcaça | Situação editorial e ação |
|---|---|---|
| `ing-daedra-heart` — Coração de Demônio | A taxonomia autoral `demonio` existe e difere de `abissal_marinho` | Compatível com natureza demoníaca; **não** atribuir origem abissal marinha, espécie específica ou localidade sem prova. Manter ficha aprovada |
| `ing-namira-s-rot` — Fungo de Gualápoles | `lugar:gualapolis` está documentado na região da Foz, mas não foi localizada prova da ocorrência de **esta espécie** ali | Nome pode referir-se a Gualápoles sem fabricar população, rota ou ecologia; preservar quatro atributos e descrição aprovados |
| `ing-abecean-longfin` — Peixe-Espada do Sangue | Mar de Sangue e limite móvel das águas constam da geografia, mas não como registro da espécie | Nome e propriedades canônicos de Peren; ocorrência, reprodução e bioma exato ainda indeterminados |
| `ing-nordic-barnacle` — Craca de Rio | Rio Ancestral é documentado; hidrografia de afluentes e pontos precisos de coleta não | Não espalhar automaticamente cracas por todo o Rio e a Foz; preservar a ficha |
| `ing-swamp-fungal-pod` — Fungo do Pântano | A descrição de Peren é genérica; o atlas macrorregional não comprova um pântano nomeado de ocorrência da espécie | Manter três atributos por enquanto; registrar ecologia/localidade como **não documentadas**, sem inferir uma região |
| `ing-rock-warbler-egg` e `ing-pine-thrush-egg` | Dois tipos de ovo distintos dividem o nome `Ovo de Tordo` na curadoria de Peren | Colisão de apresentação comprovada. Propor desambiguação **com evidência**, preservando IDs, efeitos e referências; não criar subespécies sem aprovação/lore |

## 5. Procedimento de cada lote de auditoria
1. Ler a curadoria e decisões históricas; escolher lote contíguo e relacionar efeitos/parceiros.
2. Verificar espécies, povos, ambientes e habitats no repositório de Monstros da Carcaça, registrando o SHA consultado e status (`documentado` vs. `proposto`).
3. Classificar achados em **compatível**, **indeterminado**, **contradição comprovada** ou **proposta de aprofundamento**. Não confundir indeterminação com erro.
4. Corrigir somente o que tenha fundamentação suficiente ou autorização editorial vigente; preservar IDs e decisões prévias. Mudanças de cânone profundo ou geografia exigem escalonamento ao criador.
5. Rodar validação do catálogo: mínimo de 3 atributos, intensidades I–III, IDs únicos, nenhuma Stamina reintroduzida, efeitos com pelo menos dois parceiros quando possível. Duplicidade nominal é alerta editorial separado de erro de schema.
6. Relatar por commit os arquivos alterados, diferenças de conteúdo e efeitos na curadoria. Não editar `game.js`, `phaser-demo-m1hf/`, `data/receitas.json`, menus nem saves neste fluxo.
7. Preparar um **handoff estável de dados** ao outro chat, sinalizando impacto em nomes, referências e compatibilidade, sem implementar mecânicas.

## 6. Próximo lote
- **Fungo do Pântano (`ing-swamp-fungal-pod`):** próximo na ordem de conectividade após o Ciclo 38; analisar a ambivalência Restaurar Saúde II / Paralisia II / Resistência à Eletricidade I, sem atribuir habitat específico não comprovado.
- **Ovos de Tordo:** pesquisar e preparar desambiguação fiel ao catálogo, com migração de rótulos planejada; não mexer no motor.
- **Lote ecológico:** revisar os ingredientes com nomes de lugares, criaturas ou oceanos antes de criar procedências ou regiões automáticas.


## Continuidade da curadoria autônoma — lote 39–46

O lote editorial de 03/11/2026 conserva integralmente **Fungo do Pântano, Gordura de Troll, Sais do Vazio, Asa de Borboleta, Asa de Mariposa Ancestral, Antena de Verme Gigante, Tufo Cinzento e Óleo de Autômato**. Não há contradições comprovadas nas propriedades, mas habitat, espécies e origens cosmológicas específicas não foram inventados para preencher lacunas. A matriz estruturada permanece em [`data/auditoria_ecologica_ingredientes.json`](../data/auditoria_ecologica_ingredientes.json) e as justificativas individuais no [dossiê de auditoria](auditoria-alquimia-peren.md). **Pendente:** resolver nome duplicado de dois Ovos de Tordo sem criar espécies inéditas. Próxima ficha por conectividade: Pena de Gaivota, cuja origem exclusiva em Portomonte já é decisão expressa, a ser confrontada com a geografia estabelecida.

## Lote adicional — Ciclos 47–56 (03/11/2026)

Dez fichas preservadas após revisão cruzada com `monstros-carcaca` na revisão `b08b0f69c8d6`. Evidência e lacunas catalogadas em [`data/auditoria_ecologica_ingredientes.json`](../data/auditoria_ecologica_ingredientes.json). A Pena de Gaivota mantém o vínculo exclusivo com Portomonte aprovado em Peren; o atlas confirma Deméter/purificação local, mas **não** comprova espécie, ecologia ou mecanismo de cura das penas. O `README.md` foi reconciliado com o atributo aprovado **Aumentar Constituição II**, eliminando a referência documental obsoleta a Stamina. A origem geográfica dos peixes de água doce, mamutes fossilizados, insetos, fungos e felinos permanece não demonstrada pelas fontes consultadas; nenhuma distribuição foi inventada. A etiqueta funcional opcional dos dois Ovos de Tordo foi registrada apenas como **proposta não canônica**, sem renomear IDs ou alterar menus.

## Continuidade — Ciclos 57–66 (03/11/2026)

Foram auditados mais 10 ingredientes, de **Cinzas Mortuárias** a **Flor Venenosa**, com proveniência e riscos registrados na [matriz ecológica](../data/auditoria_ecologica_ingredientes.json). O material mortuário foi discriminado por fonte e identidade sem associar automaticamente restos a Vandar, mortos-vivos ou escribas do Arquivo. O **Açúcar Lunar** não foi vinculado ao Templo da Lua de Severina por semelhança nominal, conforme os limites documentais de `monstros-carcaca`. Não houve mudanças em `data/curadoria_ingredientes.json`, receitas, runtime, menus ou saves. Próximo lote: **Vagem da Charneca**, **Ramo de Cardo**, **Orelha-de-Elfo**, e demais fichas segundo a conectividade.
