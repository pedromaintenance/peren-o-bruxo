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

## Continuidade — Ciclos 67–76 (03/11/2026)

Mais dez fichas auditadas, da **Vagem da Charneca** às **Garras de Urso**, cruzadas com Monstros da Carcaça (`182622fe6d0e`). O **Ramo de Cardo** não foi identificado com os *Cardos que Bebem Cinza* (apenas proposta de Eldroth); **Chifres de Cervo** não foi identificado com o *Cervo dos Galhos Invertidos* (também proposta); **Orelha-de-Elfo** é um fungo, não parte de pessoa élfica; **Garra de Bruxa** permanece material de uma feiticeira monstruosa não classificada no bestiário, sem equiparar bruxas humanas a monstros. A revisão estrutural encontrou que o **Betta do Rio** é o único ingrediente sem `descricao` e `origem`, e a **Beladona** possui uma frase sobre recuperação mágica não refletida em seus efeitos. Foram documentadas **redações candidatas, ainda não canônicas**, em [`data/auditoria_ecologica_ingredientes.json`](../data/auditoria_ecologica_ingredientes.json). A curadoria ativa não foi editada porque a [sincronização automática](../.github/workflows/sincronizar-curadoria-ingredientes.yml) pode propagar mudanças a catálogos e builds usados no outro fluxo. Nenhum item, runtime, receita ou save foi alterado.

## Diretriz de curadoria de combos sinérgicos e efeitos incompatíveis — 03/11/2026

**Nova decisão expressa do criador; ler a [Emenda A2 da Constituição](constituicao-design-v1.md):** vários efeitos **não** tornam uma preparação Impura. Apenas efeitos **incompatíveis** justificam esse rótulo. Efeitos **sinérgicos** podem gerar uma poção com **nome especial**; múltiplos efeitos benéficos sem sinergia identificada recebem o nome do efeito **mais intenso**, com o(s) outro(s) na descrição, **sem Impuro**.

**Primeira sinergia aprovada:** `aumentar_carisma` + `aumentar_ilusao` = **Poção da Fada**. **Incompatibilidade exemplificada:** `aumentar_carisma` + `diminuir_forca` = **Impuro**. **Contraexemplo de combo:** `aumentar_forca` + `resistencia_eletricidade` = preparo compatível **sem nome especial definido** (não inventar sinergia porque ambos são benéficos).

**Registro compartilhado de referência:** [`data/catalogo-combos-alquimicos.json`](../data/catalogo-combos-alquimicos.json). **Roadmap de mecânica e menus:** [seção 14 — combos, impurezas e arte futura](roadmap-crafting-mecanicas-menus.md). O JSON é metadado editorial para uso futuro, **não uma receita jogável nem alteração do catálogo de ingredientes**.

### Trabalho adicional obrigatório do agente de curadoria de itens

1. Durante auditoria de efeitos e ingredientes, observar **possíveis sinergias temáticas e incompatibilidades reais** entre os **IDs de efeitos**, respeitando Carcaça, usos sociais, ofícios e exploração. Não equiparar simples coocorrência ou dois benefícios a sinergia.
2. Preparar fichas de propostas com **IDs dos efeitos, nome especial candidato (se houver), justificativa narrativa/mecânica, origem/proveniência, exemplos de materiais, classificação editorial (`aprovado`/`proposto`), descrição e relações com efeitos extras**. Não modificar propriedades de ingrediente apenas para fazer uma poção combo aparecer.
3. **Catalogar para arte/animação futura:** ID persistente de combo, família visual, chave de asset reservada, tratamento visual pretendido, estado de produção, possíveis quadros e ritmo **apenas quando aprovados**. Poções comuns seguem assets da família; combos podem ganhar identidade animada própria posteriormente. **Não criar sprites, efeitos especiais ou duração de animação automaticamente.**
4. Combos são reconhecidos por **efeitos ativados**, **não pela dupla de ingredientes**, nem por uma receita especial. Com 3+ ingredientes, cada efeito continua exigindo pelo menos **dois tipos de insumo**; efeitos extras permanecem. O agente editorial não programa esse mecanismo.
5. Trabalhar **lado a lado com o agente de mecânicas**: o fluxo de curadoria fundamenta compatibilidades, nomes, descrições e arte planejada; o outro implementa classificação, conhecimento do personagem, menus, produção, inventário e testes, sem alterar o cânone automaticamente.
6. Registrar cada nova combinação proposta em revisão rastreável, **sem promovê-la automaticamente a aprovada**. Não aplicar bônus de poder ou nova propriedade porque uma sinergia recebeu um nome.

**Aceite do handoff:** ao concluir cada lote curatorial relevante, informar `combos aprovados`, `candidatos de sinergia`, `incompatibilidades propostas`, `efeitos sem nome especial`, `IDs validados` e `pendências de arte`. O índice de combinações especiais é **por efeitos**, evitando uma entrada para cada par de ingredientes.

## Continuidade — Ciclos 77–86 (03/11/2026)

Foram auditados mais dez ingredientes, de **Coração de Espinheiros** a **Flor Violeta**, com dados por ficha na [matriz ecológica](../data/auditoria_ecologica_ingredientes.json). No **Coração de Espinheiros**, manter Vampirismo II e a possibilidade de transformação progressiva, aprovados no Ciclo 9: o efeito não classifica automaticamente a planta como vampiro. A **Libélula Azul** conserva Velocidade II, aprovada no Ciclo 7, sem confusão com Destreza. O **Ovo de Tordo** `ing-pine-thrush-egg` refere-se à ficha de **agilidade**, enquanto `ing-rock-warbler-egg`, seguinte no Ciclo 87, refere-se à **restauração**; os rótulos funcionais sugeridos são **não canônicos** e não substituem os nomes em uso. Os habitats da Pérola Pequena, das Ovas de Salmão, de aves, musgos e flores não foram fixados por inferência. Fontes do repositório Monstros da Carcaça consultadas no commit `182622fe6d0edca18b32c3972641ebd9c72d58cb`. **Nenhuma alteração** em curadoria ativa, itens, receitas, motor, menus ou saves nesta rodada.


## Protocolo de avaliação da carteira de combos — 03/11/2026

**Esta etapa pertence ao agente de curadoria**, não ao motor do jogo. Consulte [roadmap de mecânicas, seção 15](roadmap-crafting-mecanicas-menus.md) e [catálogo estruturado](../data/catalogo-combos-alquimicos.json) antes de classificar uma nova sinergia. A carteira inicial agora possui **oito nomes propostos e apenas um combo aprovado, Poção da Fada**. Nenhum candidato novo é canônico pela simples existência no JSON.

### Critérios de triagem curatorial

1. **Verificação de viabilidade:** IDs dos efeitos existem no JSON canônico e cada efeito é ativado por ao menos **dois tipos distintos** em algum conjunto de 2 a 4 ingredientes; os exemplos fornecidos no catálogo já foram verificados. Não chamar esse conjunto de receita fixa.
2. **Complementaridade real:** dois efeitos devem realizar **um mesmo propósito** (ex.: voo+velocidade) ou sustentar **etapas complementares de um processo** (ex.: restaurar+regenerar saúde). Dois benefícios independentes **não** merecem nome de combo apenas pela coexistência.
3. **Sentido na Carcaça:** dar ao nome/descrição uma função material e fantástica coerente, sem inventar regiões, cultos, espécies ou crenças não confirmadas. Quando houver necessidade de afirmação ecológica, buscar no repositório de Monstros da Carcaça e classificar proveniência.
4. **Contradições:** avaliar contra incompatibilidades **aprovadas**; **Impuro** prevalece. Não rotular automaticamente todo efeito positivo+negativo como incompatível; propor novos conflitos com justificativa separada para aprovação.
5. **Valor como poção especial:** a diferença deve poder ser explicada em duas frases legíveis no inventário e receber assinatura visual reconhecível, sem conferir poderes não previstos pelos efeitos.
6. **Ceticismo editorial:** documentar `nao_avaliado`, `proposto_nao_aprovado`, `aprovado` ou `rejeitado`. Hipótese nunca equivale a aprovação autoral.

### Fila inicial de propostas para avaliação, em ordem recomendada

| Prioridade de revisão | Candidato | Assinatura | Evidência material mínima | Parecer a verificar |
| --- | --- | --- | --- | --- |
| Alta | **Asas do Vendaval** | `voar` + `velocidade` | 3 tipos | Sinergia forte de deslocamento |
| Alta | **Olhos da Vigília** | `aumentar_percepcao` + `visao_a_distancia` | 3 tipos | Sinergia de observação |
| Alta | **Nascente Arcana** | `aumentar_magia` + `regenerar_magia` | 3 tipos | Ciclo de reserva e reposição |
| Alta | **Véu do Caçador** | `invisibilidade` + `aumentar_furtividade` | 4 tipos | Ocultação e discrição; sem presumir silêncio automático |
| Média | **Seiva Vital** | `restaurar_saude` + `regenerar_saude` | 4 tipos | Cura e recuperação continuada |
| Média | **Silêncio do Feiticeiro** | `dano_magia` + `diminuir_magia` | 3 tipos | Veneno antiarcano, requer regras de duração/alvo |
| Revisão crítica | **Fôlego das Profundezas** | `respirar_na_agua` + `resistencia_gelo` | 4 tipos | Talvez mera soma de utilidades; avaliar necessidade de nome especial |
| Revisão crítica | **Veneno da Ruína** | `dano_saude` + `fraqueza_veneno` | 2 tipos | Só sinérgico se mecanismo de dano e vulnerabilidade forem compatíveis; dano_saude não está tipado como dano de veneno |

**Controle contra falsas sinergias:** `aumentar_forca` + `resistencia_eletricidade` continua **preparo compatível sem nome especial**. **Controle aprovado:** `aumentar_carisma` + `aumentar_ilusao` é a **Poção da Fada**. **Incompatibilidade aprovada:** `aumentar_carisma` + `diminuir_forca` gera **Impuro**.

### Saída obrigatória de cada avaliação

Para cada candidato, registrar: `combo_id`, `efeitos_necessarios`, `nome`, `justificativa_de_sinergia`, `carcaca_proveniencia`, `exemplo_material_verificado`, `possiveis_incompatibilidades`, `estado_editorial`, `decisao_autoral`, `descricao_curta` e `visual` (família de recipiente, chave persistente, conceito de animação, status, quadros/duração ainda não definidos). **Não produzir arte nem inventar efeito extra**. O agente deve revisar os nomes, inclusive recusá-los se forem genéricos ou incoerentes.

**Interface com o agente de menus:** o curador só promove um candidato a `sinergias[]` quando houver decisão expressa do criador; o desenvolvedor deve ignorar `candidatos_sinergia[]` em regras e nomes da versão jogável. Uma poção sem combo aprovado continua funcionando com seu nome de efeito dominante, com demais propriedades na descrição. A arte do combo futuro será uma camada visual associada ao **ID da assinatura**, não ao par de ingredientes.

**Handoff deste ciclo:** oito candidatos no JSON, verificados contra o conjunto atual de ingredientes, com procedência e ideias visuais; **todos ainda não aprovados**. Não modificar `data/curadoria_ingredientes.json`, receitas legadas ou o runtime durante esta revisão.

## Continuidade — Ciclos 87–96 (03/11/2026)

Foram auditadas mais dez fichas, de **Ovo de Tordo (restauração)** a **Tórax de Vaga-lume**. A [matriz ecológica de 58 ingredientes](../data/auditoria_ecologica_ingredientes.json) e o [dossiê até o Ciclo 96](auditoria-alquimia-peren.md) preservam as justificativas. Referência autoral: [Monstros da Carcaça](https://github.com/pedromaintenance/monstros-carcaca/tree/338dfc5ff4304e6ec2519e06b08cbb1de0947bd6).

- **Ovos de Tordo:** as duas fichas com o mesmo nome foram examinadas (Ciclos 78 e 87). A distinção editorial **agilidade** versus **restauração** é fundada nas propriedades de cada ID, mas **não estabelece espécies distintas**. Os nomes canônicos do JSON continuam iguais; eventual rotulagem na UI é responsabilidade do outro fluxo.
- **Carne Humana e Orelha de Troglodita:** conservar a existência dos itens na curadoria de Peren sem inferir violência, vítima, espécie, consentimento ou proveniência. O fato de Drakport ser centro de escravização não fundamenta uma cadeia de fornecimento de restos humanos. A taxonomia e a representação desses materiais continuam pendentes de evidência e, se necessário, decisão do criador.
- **Gelatina de Medusa:** a ficha diz criatura flutuante; não está comprovado se é um organismo marinho, górgona mitológica ou outra criatura fantástica. Não atribuir petrificação nem origem no Mar de Sangue.
- **Ovo de Verme Gigante, Carpa de Pedra, Presa de Javali, Bagas de Zimbro, Uvas de Jasmim e Tórax de Vaga-lume:** preservar as propriedades sem inventar ecossistemas, povoações produtoras, métodos de coleta ou cadeia comercial.

**Integridade:** fichas e atributos canônicos intactos; não foram alterados `data/curadoria_ingredientes.json`, `data/itens.json`, `data/receitas.json`, scripts, menus, assets ou saves. Próximo lote a partir do **Ciclo 97 — Carapaça de Caranguejo**.

## Handoff visual: primeiras descobertas no Caderno do Bruxo (03/11/2026)

**Design de interface:** [`ux-descoberta-combos-caderno-v1.md`](ux-descoberta-combos-caderno-v1.md) · [protótipo de revisão PR #95](https://github.com/pedromaintenance/peren-o-bruxo/pull/95). Esta integração é **editorial**, sem alterar o trabalho corrente de ecologia, propriedades ou o motor.

**Atribuição do agente de itens:** ao aprovar futuramente uma sinergia, manter `comboId`, assinatura de IDs de efeitos, nome especial, família conceitual, descrição breve e justificativa, status editorial, proveniência e chave de futuro asset/animação. As propostas não aprovadas jamais devem ser exportadas como nomes reconhecidos pelo personagem. Evitar nomes que dependam de ingredientes específicos: uma mesma sinergia pode nascer de conjuntos de fontes diferentes.

**Atribuição do agente de interface:** o Caderno registra quando **Peren descobre** um combo já aprovado, em save Phaser próprio. A ficha não revela efeitos/fontes desconhecidos nem assume que o exemplo da curadoria é uma receita fixa. Animação é adereço opcional e deve usar fallback à família visual enquanto não existe arte final.

**Para futura direção de arte:** reservar tratamento por **ID do combo**, além do frasco comum: cor, partículas, ritmo, assinatura/silhueta, variação de estado e diretriz para movimento reduzido. Não criar sprites nem estabelecer duração numérica automaticamente. A única sinergia aprovada segue sendo **Poção da Fada**; demais nomes em `candidatos_sinergia` permanecem propostas.

## Continuidade — Ciclos 97–106 (03/11/2026)

Foram revisados **dez ingredientes** de Carapaça de Caranguejo a Chifres de Alce, cruzados com [Monstros da Carcaça](https://github.com/pedromaintenance/monstros-carcaca/tree/43d90cb9b728e42ba0c0b9328adf5fafe0521358). A [matriz ecológica](../data/auditoria_ecologica_ingredientes.json) contém agora **68 registros** auditados. A Carapaça de Caranguejo mantém sua localização **anteriormente cadastrada por Peren no Além Sul**, mas isso não estabelece distribuição zoológica ou método de coleta. O Fungo de Diabrete permanece **fungo**, não demônio; a coincidência nominal não dá origem no Abismo. O Ovo de Galinha, Ovo de Aranha, Perca Prateada, Abelha e Flor Azul da Montanha preservam efeitos sem novos habitats ou cadeias produtivas. Chifres de Alce seguem material distinto de Chifres de Cervo, ambos com origem regional não demonstrada.

**Materiais de povos sapientes:** Coração Humano (`ing-human-heart`) e Dedo de Gigante (`ing-giant-s-toe`) são ingredientes pré-existentes; não há autorização documental para converter pessoas, prisioneiros ou qualquer gigante em fonte automática de loot, caça ou comércio. A Carcaça descreve gigantes como povos com trabalho, cultura e organização nas montanhas de Thargrid, mas **não** atribui este dedo a Thargrid. A existência da escravidão em Drakport **não** comprova origem de órgãos humanos. Proveniência, obtenção e representação aguardam evidência ou decisão autoral.

**Integridade e separação de equipes:** este lote preservou os atributos e a raridade de todos os dez itens. Nenhum ajuste foi realizado em `data/curadoria_ingredientes.json`, itens compilados, receitas, menus, scripts, assets ou saves. O outro chat conserva a responsabilidade sobre as mecânicas.

## Ciclos 107–111 — fechamento parcial e reconciliação da cobertura (03/11/2026)

A sequência de auditoria por conectividade chegou ao **Ciclo 111**, com **Flor Amarela da Montanha, Lavanda Selvagem, Raiz Velada Rubra, Ectoplasma e Flor Vermelha** preservados. **Raiz Velada Rubra** mantém Invisibilidade III, Dano à Saúde II e Diminuir Constituição III, sem origem presumida no Mar de Sangue; **Ectoplasma** mantém os três atributos, sem ser automaticamente drop dos mortos-vivos de Vandar. A presença de flores em Thargrid, Eldroth ou outros ambientes também não pode ser inferida apenas pelo clima.

**Reconciliação por ID (não apenas numeração de ciclo):** 25 fichas individuais históricas nos Ciclos 14–38, 73 fichas individuais na [matriz ecológica](../data/auditoria_ecologica_ingredientes.json), totalizando **98 de 111 fichas**. Faltam **13 fichas individuais**, já relacionadas no [estado da curadoria](estado-curadoria-ingredientes.md), com Ciclos 112–124 sugeridos. O catálogo conserva 111 ingredientes, 53 efeitos e nenhuma propriedade isolada. Os 25 ingredientes históricos também devem receber revisão ecológica retroativa para que a matriz reflita os 111 IDs.

**Divergências textuais identificadas:** Betta do Rio sem descrição/origem; Beladona com referência desatualizada à recuperação mágica; dois ingredientes distintos chamados Ovo de Tordo; duas formas de grafar os efeitos `curar_doenca` e `voar`. Tudo permanece como proposta editorial, sem alterar o catálogo ativo nem executar workflow de sincronização. O fluxo de mecânicas e menus continua independente.

## Handoff de colisões entre sinergias — UX de Caderno v1.1 (03/11/2026)

**Referência obrigatória:** [especificação do Caderno, seção 8](ux-descoberta-combos-caderno-v1.md), [roadmap de mecânicas, seção 17](roadmap-crafting-mecanicas-menus.md), [protótipo em PR #95](https://github.com/pedromaintenance/peren-o-bruxo/pull/95).

Uma mistura pode conter **mais de uma assinatura** sinérgica quando existirem mais combos aprovados. Isso **não** equivale a uma receita nova, não concede automaticamente um nome composto, não muda os atributos dos ingredientes e não revoga incompatibilidades. O agente de curadoria deve:

1. **Catalogar cada combo aprovado por seu próprio ID estável**, sem fabricar supercombo ao encontrar duas assinaturas no mesmo lote.
2. Registrar quando duas assinaturas propostas ou aprovadas compartilham efeitos (`overlap`) ou são independentes (`disjoint`), sempre com evidência do catálogo, e evitar nomes muito próximos que confundam Caderno e inventário.
3. Manter **nome composto** como **proposta autoral separada**, jamais gerada por concatenação dos nomes existentes. Se a futura direção artística desejar supersinergia, exigir decisão expressa e ID independente.
4. Registrar **incompatibilidades** que possam aparecer entre efeitos de duas assinaturas, garantindo que `Impuro` continue prevalecendo no nome principal e que a classificação não oculte consequências.
5. Conservar **asset e animação por comboId**, com fallback à família visual. Para multi-sinergia, não encomendar uma nova sprite automaticamente para cada par de combos; o agente de mecânicas decidirá a orquestração de efeitos visuais.
6. Manter qualquer segundo combo usado no protótipo como **`qa-*` fictício**, proibido de ser promovido ao catálogo editorial ou ao gameplay. **Poção da Fada permanece a única sinergia aprovada.**

**A verificar em próximas auditorias:** colisões entre candidatos `candidatos_sinergia[]`, capacidade de serem ativados no mesmo lote de 2–4 tipos e distinção entre coocorrência, sinergia genuína e incompatibilidade. Não mudar a curadoria só para forçar uma colisão. **Nenhuma animação foi produzida e nenhuma decisão autoral de “supercombo” foi tomada.**

## Ciclos 112–124 — cobertura individual 111/111 (03/11/2026)

Treze fichas remanescentes foram auditadas, de **Algodão da Tundra** a **Cogumelo de Raiz**. A [matriz ecológica](../data/auditoria_ecologica_ingredientes.json) contém agora **86 fichas** dos Ciclos 39–124. Somadas às **25 decisões por ingrediente dos Ciclos históricos 14–38**, são **111/111 IDs com revisão individual identificável**. Isso não é sinônimo de 111/111 com proveniência ecológica documentada: **faltam 25 retroauditorias ecológicas** para os itens históricos, listadas em [`docs/estado-curadoria-ingredientes.md`](estado-curadoria-ingredientes.md).

**Decisões históricas preservadas:** Alho mantém Curar Doença II como quarto atributo (Ciclo 4); Cauda de Rato mantém Infligir Doença II como quarto atributo (Ciclo 5); Raiz Botulínica mantém quatro efeitos III, sem nerf. **Nova pendência editorial:** Escamas de Piranha cita “antídotos” na descrição, porém seus atributos vigentes tratam de defesa, resistência ao frio e dano à saúde. Foi documentada uma descrição alternativa candidata; não foi aplicada no catálogo ativo.

**Limites de proveniência:** rios não comprovam piranhas; campos agrícolas não comprovam apicultura ou lavoura específica; Thargrid não comprova Algodão da Tundra; o vocabulário “Espinho-da-Morte” não o associa a ritos de Vandar. A classificação das criaturas e a origem territorial permanecem fundamentadas no conteúdo autoral, não em importação automática de Skyrim ou D&D. O fechamento consultou o repositório Monstros da Carcaça no commit `388e678a981c1ca487c05a48f5934907857be418`.

**Separação de escopo:** os trabalhos deste chat são curatoriais e não alteram itens ativos, sinergias, efeitos publicados, receitas, menus, inventário, mecânicas, assets ou saves. O próximo trabalho será complementar a ecologia dos 25 históricos com rastreabilidade e sem rever as aprovações do criador.

## Handoff de estados do Caderno: reconhecimento vs preparo compatível (03/11/2026)

A [seção 9 da especificação UX](ux-descoberta-combos-caderno-v1.md) e a [seção 18 do roadmap das mecânicas](roadmap-crafting-mecanicas-menus.md) documentam um **estudo experimental**: Peren pode conhecer a assinatura de uma sinergia sem ter produzido um lote livre de incompatibilidades. **A hipótese de descobrir sinergia dentro de um Impuro continua aguardando decisão autoral; não é cânone novo.**

**O agente de curadoria deve preservar esta separação de responsabilidades:**
- **Conhecimento do personagem não pertence ao catálogo editorial.** O catálogo registra sinergias/incompatibilidades aprovadas, IDs, nomes, justificação, arte futura e estados de revisão; o save do Phaser poderá registrar primeira observação e primeiro preparo compatível quando a política for aprovada.
- **Compatível não é “purificado”.** Uma poção sem incompatibilidades pode carregar vários efeitos positivos independentes e não ter passado por Retificação. Retificação permanece técnica avançada exclusivamente sobre Impuros.
- **Pares reais versus testes sintéticos:** o quarteto Coração de Demônio, Língua-de-Dragão, Raiz Botulínica e Asa de Borboleta ativa Carisma positivo + Força negativa, proporcionando um exemplo concreto de Impuro. A combinação de Carisma positivo + Ilusão positiva + Força negativa é **vetor sintético de classificador**, não uma receita viável demonstrada para 2–4 fontes.
- **Não alterar ingredientes para favorecer testes:** auditoria de ecologia/efeitos não deve inserir Ilusão na Raiz Botulínica, nem deslocar propriedades, apenas para fabricar um caso de QA.
- **Arte por assinatura, não por lote:** o mesmo ID da Poção da Fada referencia uma futura animação especial mesmo que Peren a reconheça pela primeira vez num experimento Impuro. O frasco Impuro **não** recebe automaticamente a apresentação da poção especial compatível; o agente de interface decidirá o tratamento de descoberta depois da aprovação.

**Próxima decisão editorial:** nenhuma nova poção foi aprovada; o catálogo `data/catalogo-combos-alquimicos.json` permanece com **1 sinergia canônica**, oito candidatos e um exemplo de incompatibilidade. A revisão de nomes/efeitos segue as tarefas anteriores.

## Handoff sobre efeito dominante e intensidade dos ingredientes (03/11/2026)

**Estudo de dominância:** [`docs/estudo-dominancia-alquimica-v1.md`](estudo-dominancia-alquimica-v1.md) · [experimentos da PR #96](https://github.com/pedromaintenance/peren-o-bruxo/pull/96).

**Atribuição editorial do agente de itens:** conservar as intensidades **I–III de cada propriedade de cada ingrediente**, sem convertê-las em pontuação de potência final por mera conveniência. A matemática de combinação e a escolha do efeito dominante pertencem ao **agente de mecânicas**, com aprovação de game design. Não “corrigir” intensidades para que uma poção pareça ter o nome desejado.

**Fatos verificados na curadoria atual:**
- Carapaça de Caranguejo + Betta do Rio + Garras de Urso: `aumentar_forca` II+II+II e `aumentar_constituicao` III+II. Soma total elegeria Força; soma das duas maiores elegeria Constituição. **Ambas são propostas; nenhuma é regra aprovada.**
- Carapaça de Caranguejo + Gordura de Troll: Força II+II, Resistência a Veneno I+II; fonte máxima empata em II×II, soma resolve em 4×3. **Empate não se decide por ordem de ficha.**
- Coração de Demônio + Língua-de-Dragão + Raiz Botulínica + Asa de Borboleta: `aumentar_carisma` e `diminuir_forca`, Impuro pela incompatibilidade aprovada, **independentemente da fórmula comparativa**.

**Encaminhamento:** se o agente propuser ajustes de descrição, revisão de efeito ou inclusão de intensidade extra, comparar impactos nas três hipóteses sem alterar o catálogo por preferência de título ou arte. Rótulos especiais aprovados (**Poção da Fada**) dependem da **assinatura dos efeitos ativados**, não do ranking de potência. Futuras animações e nomes associados a IDs de combo permanecem desacoplados do critério de dominância.

**Status:** protocolo de revisão, sem novos combos aprovados, nenhum atributo de ingrediente reescrito, sem receita, save ou gameplay modificados. **A decisão do modelo de dominância continua com o criador.**

## Registro de continuidade — revisão semântica e de sinergias (03/11/2026)

- [Parecer estruturado de oito candidatos](../data/pareceres-sinergias-ingredientes.json) e [dossiê editorial de sinergias](parecer-editorial-sinergias-8-candidatos.md) publicados. **Cinco** assinaturas são fortes para deliberação, **uma** exige revisão de nome/semântica e **duas** não devem ser promovidas sem evidência adicional. A única sinergia aprovada continua sendo **Poção da Fada**.
- Os oito exemplos de combinação existentes ativam os dois efeitos requeridos com fontes distintas; nenhum ativa a incompatibilidade aprovada nos exemplos testados. Isso verifica interseções do catálogo, **não** valida um jogo em execução.
- O [pacote de correções editoriais](pacote-pendencias-editoriais-ingredientes.md) agora diferencia `origem` (**proveniência de dados**) de `zona` (**local indicado de coleta**). O gerador atribui zonas de base proceduralmente; a curadoria atual só contém override explícito de zona em Pena de Gaivota/Portomonte. Distribuição regional do catálogo **não é prova ecológica** e deve ser revisada antes de integrar loot/coleta.
- Corrigido `laboratorio-itens/README.md`: remove a referência obsoleta a Stamina II e passa a apresentar Aumentar Constituição II; os rótulos gráficos permanecem exatamente como no JSON até aprovação de padronização.
- Não houve mudança nos 111 registros ativos, efeitos, intensidades, zonas, receitas, motores, assets ou saves. Pareceres e documentos não são fontes executáveis do jogo.

## Handoff de curadoria — terceira e quarta fontes por efeito (03/11/2026)

**Referências:** [estudo de fontes adicionais](estudo-fontes-adicionais-alquimia-v1.md) · [roadmap de mecânicas, seção 20](roadmap-crafting-mecanicas-menus.md) · [PR #97, experimentos isolados](https://github.com/pedromaintenance/peren-o-bruxo/pull/97).

**[CANÔNICO]** Dois **tipos distintos** com o mesmo efeito são necessários para ativá-lo. Um terceiro/quarto tipo pode ativar uma nova propriedade, reforçar a composição de fontes ou ambos. **Somente incompatibilidades aprovadas** levam à classificação **Impuro**; um novo efeito negativo não basta por si mesmo. **Somente sinergias aprovadas** geram nomes especiais; mais ingredientes não são receita própria de combo.

**Responsabilidade do agente curador:** manter cada propriedade em sua fonte concreta com `id`, `intensidade` I–III e proveniência; não trocar valores para induzir nomes ou vantagem de potência. Quando auditar uma propriedade, examinar também o impacto das fontes 3 e 4 na ativação de outros efeitos e na ocorrência de incompatibilidades, **sem** decidir fórmula de potência, duração ou qualidade por conta própria.

**Amostras reais para regressão da curadoria:**
- **Carapaça + Betta + Garras** → Força II+II+II e Constituição III+II.
- **+ Chifres de Alce** → Força II+II+II+II; Constituição III+II+II; mais fontes sem nova propriedade ativada.
- **+ Amanita Rubra em vez dos Chifres** → também ativa **Diminuir Sabedoria** I+II; não catalogar automaticamente como incompatibilidade.
- **+ Pó de Presa de Mamute em vez dos Chifres** → Força II+II+II+III; fonte mais intensa altera índice **experimental** M2, não potência canônica.
- **Língua-de-Dragão + Coração de Demônio + Cogumelo Escamoso** → Carisma e Ilusão formam **Poção da Fada** pelos efeitos, não por receita fixa.
- **Coração de Demônio + Língua-de-Dragão + Raiz Botulínica + Asa de Borboleta** → somente com a quarta fonte surge a incompatibilidade aprovada e o estado **Impuro**.

**[PROPOSTA] Métricas de auditoria sem efeito de gameplay:** número de fontes distintas por efeito, duas maiores intensidades de origem, intensidade excedente e novos efeitos ativados por inclusão de material. **Não** transformar excedente em “+duração”, “pureza”, “estabilidade” ou um preço presumido antes de aprovação. Distinguir claramente as dimensões na documentação.

**Gatilho de revisão:** se a curadoria alterar um atributo existente, atualizar/rodar os fixtures de efeitos, incluindo cenários 2→3→4 e impacto nos catálogos de sinergias/incompatibilidades; informar IDs alterados e justificativa antes de a equipe de mecânicas consumir a revisão. **Não inserir novos atributos para satisfazer testes.**

**Contrato de entrega curatorial:** dados íntegros + descrição + justificativa + riscos de interação entre fontes. O agente de mecânicas permanece responsável por eventual tradução de intensidade para potência/duração/qualidade, sempre mediante decisão expressa do criador. **Esta seção não aprova novas propriedades e não modifica os 111 ingredientes.**

## Continuidade — proveniência territorial dos 111 ingredientes (05/11/2026)

Publicados os metadados editoriais em [`data/auditoria_territorial_ingredientes.json`](../data/auditoria_territorial_ingredientes.json) e o [relatório de auditoria territorial](auditoria-proveniencia-territorial-ingredientes.md). A distribuição inicial deriva de uma fórmula `CITIES[(i*7)%9]`, produzindo **12 ou 13 ingredientes por zona**, e não de uma matriz de ocorrência de espécies. Na curadoria ativa, só a Pena de Gaivota tem `zona` e `zona_exclusiva` explícitas (Portomonte); quatro outras regiões foram preservadas historicamente no README de Peren (Carapaça de Caranguejo, Pó de Vampiro, Couro de Rato e Penas de Falcão). As outras 106 zonas requerem avaliação individual, sem presumir erro nem implementar novos habitats automaticamente.

A matriz diferencia `origem` (proveniência de registro), zona calculada, zona preservada por decisão de Peren, ocorrência ecológica e disponibilidade jogável futura. A validação é **estática**: ainda não foi feita comparação integral com `data/itens.json`. O escopo continua exclusivamente editorial; **nada** de `data/curadoria_ingredientes.json`, loot, preços, receitas, Phaser, save ou PWA foi alterado.

## Handoff curatorial — taxonomia semântica dos 53 efeitos (05/11/2026)

**Fontes de consulta:** [relatório dos 53 efeitos](taxonomia-53-efeitos-alquimicos-v1.md) · [roadmap de mecânicas, seção 21](roadmap-crafting-mecanicas-menus.md) · [PR #98, catálogo e painel de revisão](https://github.com/pedromaintenance/peren-o-bruxo/pull/98).

**Dado e autoridade:** os 111 ingredientes têm 53 IDs com duas ou mais fontes distintas; não se alteraram as intensidades de origem I–III. A pesquisa propõe **11 grupos** de semântica para organizar dúvidas de alvo, tempo, unidade, resistência e aplicação. Esses grupos **não são decisões mecânicas**, não substituem rótulos/IDs e não determinam a família Poção, Veneno, Tônico, Elixir ou Bálsamo.

**Responsabilidade do agente editorial:** preservar os IDs, os nomes vigentes (inclusive variantes `curar_doenca` e `voar`), os ingredientes e as evidências de significado na Carcaça. Registrar ambiguidades **sem corrigir por conveniência de engine**, sem alterar uma intensidade para caber na duração hipotética de uma poção e sem adotar semânticas propostas como aprovadas.

**Atenção à distinção histórica:** `dano_magia` vs `diminuir_magia`, `restaurar_*` vs `regenerar_*`, `dano_saude` vs `infligir_doenca`, `aumentar_percepcao` vs `visao_a_distancia`, `aumentar_destreza` vs `velocidade`. A auditoria oferece hipóteses claras, **ainda não leis de gameplay**.

**Exceção canônica:** Vampirismo deve poder **transformar alguém em vampiro com o tempo**, por decisão explícita registrada na [auditoria alquímica, Ciclo 9](auditoria-alquimia-peren.md). Esse potencial não autoriza inventar exposição mínima, progresso percentual, reversão, duração ou outro atributo do ingrediente. O agente de curadoria mantém essa informação de lore/mecânica pretendida visível no relatório e preserva `vampirismo` em Pó de Vampiro e Coração de Espinheiros.

**Contrato com o agente de mecânicas:** cada efeito leva dados de origem e questões a resolver; os campos de potência, duração, resistência, empilhamento, fonte extra e veículo permanecem `null` até aprovação. O painel permite exportar **pareceres**, não atualizar automaticamente a curadoria nem o jogo. **Sem mudanças em ingredientes, receitas, combos, saves ou Phaser** neste estudo.

**QA editorial:** 53/53 fichas rastreadas, 11 grupos, duas variantes textuais, 17 verificações estruturais aprovadas no V8 e 13 checagens funcionais do painel em DOM simulado. **PR #98 draft**, não promovida para o motor nem para os assets.

## Handoff curatorial — dez efeitos de Saúde, Magia e Regeneração (05/11/2026)

**Referências:** [estudo de recursos](estudo-recursos-alquimicos-v1.md), [roadmap mecânico, seção 22](roadmap-crafting-mecanicas-menus.md) e [PR #99 (draft)](https://github.com/pedromaintenance/peren-o-bruxo/pull/99).

**Responsabilidades não intercambiáveis:** o agente de **curadoria** mantém nomes, efeitos, intensidades I–III, origem e justificativas dos ingredientes; o agente de **mecânicas** propõe operações sobre PV/MP atuais, capacidade máxima e taxas, mas **não** pode converter intensidade original em cura, dano ou duração sem decisão expressa. Não transferir efeitos de um ingrediente só para passar nos testes de recuperação.

**Dez IDs examinados sem modificá-los:** `dano_saude`, `dano_magia`, `restaurar_saude`, `restaurar_magia`, `aumentar_saude`, `aumentar_magia`, `diminuir_magia`, `regenerar_saude`, `regenerar_magia`, `diminuir_regeneracao_magia`. Os dados atuais indicam significados distintos, mas **alvos, fórmulas, potências, duração e método de aplicação ainda estão abertos**. A auditoria propõe diferença entre `dano_magia` e `diminuir_magia` (reserva corrente versus máximo/eficácia); a hipótese não deve ser promovida a cânone mecanicamente.

**Conflito com o clássico:** a rotina `useItem` no `game.js` ainda equipara `Regenerate Health/Magicka` a `Restore Health/Magicka` na recuperação instantânea. **Não corrigir fichas de ingredientes para justificar o comportamento legado**, nem modificar consumíveis antigos sem plano de migração e preservação de inventário/saves.

**Foco da auditoria futura:** evitar que “restauração” e “regeneração” virem sinônimos nos textos editoriais sem decisão; distinguir aumento de capacidade de recuperação corrente; evitar tratar fraqueza a veneno como tipo implícito de `dano_saude`; observar contradições de grupos e famílias sem inventar incompatibilidade. As fontes extras podem ser anotadas por origem e intensidade, mas **não** atribuem automaticamente maior taxa, duração, qualidade ou chance de sucesso.

**QA do handoff:** nenhum dos 111 ingredientes ou 53 IDs foi alterado; o simulador isolado registrou 31/31 casos e o painel de recursos 14/14 verificações simuladas. Não é prova de integração, browser real ou um novo balanceamento. **Apenas design e documentação.**

## Handoff curatorial — aplicação contextual e identidade do preparado (07/11/2026)

**Referências:** [estudo de aplicação contextual](estudo-aplicacao-contextual-alquimia-v1.md) · [roadmap de mecânicas, seção 23](roadmap-crafting-mecanicas-menus.md) · [PR #100 — protótipos isolados](https://github.com/pedromaintenance/peren-o-bruxo/pull/100).

**Responsabilidade da curadoria:** conservar efeitos, nomes, propriedades ocultas, intensidade I–III, proveniência de ingredientes e identidade do preparado. **Não** alterar atributos de um material para fazer seu conteúdo caber na via de aplicação provisória (Poção, Veneno, Tônico, Elixir, Bálsamo). A **família do preparado** e o **alvo da aplicação** não devem ser confundidos com os 11 grupos semânticos propostos para os 53 efeitos.

**Contrato de uso ainda não aprovado:** combater, explorar e descansar são contextos diferentes. A via (beber, administrar em criatura, aplicar em objeto) requer decisão por família. Uma Poção não autoriza automaticamente beber Veneno, e um Bálsamo não deve ser aplicado no corpo apenas porque está na mochila. Cada efeito ativo permanece em seu frasco; a falta de motor para um efeito **não autoriza descartá-lo no momento do uso**. Bloquear o lote completo e preservar o estoque até aprovação.

**Conhecimento do personagem:** dados editoriais podem descrever todos os efeitos de uma mistura; a interface e o recibo de aplicação devem exibir **somente os efeitos já descobertos por Peren**. Efeitos ocultos não devem vazar por tooltip, logs ou atributos HTML. Identificadores técnicos do catálogo permanecem estáveis e **não** autorizam sinergias novas ou purificação automática.

**Conflito real de integração, fora da responsabilidade curatorial:** o Phaser da branch de transição usa `battle.potions` e depois reconcilia com a mochila ao encerrar combate. Alterar a quantidade diretamente no inventário e manter esse débito do combate pode cobrar duas vezes. A equipe de mecânicas deverá escolher fronteira transacional e testar resultados antes de incorporar os preparados curados. O clássico permanece com seu save próprio e `Regenerate` imediato.

**Estado:** matriz proposta de 15 cenários (3 contextos × 5 famílias), **37/37 verificações de lógica** e **15/15 verificações de interface** executadas em ambientes simulados. **Nenhuma propriedade, fórmula, receita, save, família canônica, combate ou material foi alterado.**

## Handoff de curadoria — poções fora do combate e Veneno como via própria (07/11/2026)

A [PR #102](https://github.com/pedromaintenance/peren-o-bruxo/pull/102) implementa **uso de instâncias de preparados** na exploração e testa três **vias propostas de Veneno**. Referência analítica: [estudo de Venenos/Exploração](estudo-venenos-uso-exploracao-prealfa-v1.md).

**Dados canônicos preservados:** a mistura `ing-nightshade` (Beladona) + `ing-deathbell` (Sino da Morte) compartilha `dano_saude` como único efeito; `ing-red-mountain-flower` (Flor Vermelha) + `ing-nightshade` compartilha **dois efeitos** (`dano_saude` e `aumentar_magia`). Esses resultados evidenciam que **rotular uma preparação de Veneno não autoriza omitir efeitos positivos**. O motor do preparado aplica todos os efeitos executáveis ou bloqueia o consumo inteiro. O Caderno não deve revelar efeitos não estudados por Peren ao descrever o frasco.

**Vias em investigação, sem aprovação:** lançar frasco (precisão/resistência), impregnar arma (cargas/duração/precedência com Bálsamos), administrar dose (contato/consentimento/furtividade). `poison-route-proposal.js` é **pesquisa pura**, não arma nem executa dano no gameplay. Não modificar ingredientes, suas intensidades I–III ou famílias para adequá-los a um resultado numérico imaginado.

**Operacional pré-alfa:** o uso fora de combate só tem `restaurar_saude` e `restaurar_magia`, com valores temporários **24 PV/12 PM**, e nenhuma ação diária cobrada na hipótese de playtest. A retrocompatibilidade de saves de pré-alfa foi dispensada por decisão do criador (Emenda S1), mas a integridade do estoque na partida atual continua obrigatória. [CI aprovado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/42425972550) incluindo 19 testes novos de exploração, 12 de Venenos e smoke Chromium.

## Extensão da curadoria além da alquimia — Forja (08/11/2026)

A auditoria **não se limita aos 111 ingredientes**. Consulte o [estado geral dos sete ofícios](estado-curadoria-crafting-geral.md) e o [parecer específico das 89 receitas de Forja](parecer-forja-cadeia-produtiva-equipamentos-v1.md), com [89 fichas estruturadas no JSON](../data/auditoria-forja-89-v1.json). As decisões FOR-01 a FOR-06 tratam refino, slots, atributos, nomenclatura, fontes de osso/escama e economia. Nenhuma decisão foi incorporada aos dados jogáveis; Joalheria será o próximo ofício aprofundado.

## Continuidade da auditoria de ofícios — Joalheria 14/14 (08/11/2026)

O ciclo de Forja foi sucedido pela [matriz dos 14 acessórios de Joalheria](../data/auditoria-joalheria-14-v1.json) e pelo [parecer de gemas, slots e mercados](parecer-joalheria-14-gemas-slots-mercados-v1.md). Os anéis/colares atualmente ocupam o slot `relic` no clássico e ativam poder arcano padrão sem receita de Encantamento; seis gemas específicas não são insumos positivos do gerador. As decisões `JOI-01`–`JOI-08` não estão aprovadas. **Não houve** mudança nos itens, receitas, economia, slots, Phaser, clássico ou saves. A próxima auditoria aprofundará Curtume.

## Continuidade dos ofícios — Curtume 20/20 (09/11/2026)

A auditoria geral agora inclui o [parecer de Curtume](parecer-curtume-20-materiais-bolsas-e-slots-v1.md) e a [matriz por 20 receitas](../data/auditoria-curtume-20-v1.json). Quatro materiais alimentam 16 vestimentas/armaduras e quatro bolsas utilitárias: as vestimentas competem pelo slot `armor`; as bolsas não têm função de coleta implementada no clássico. As oito decisões `CUR-01`–`CUR-08` continuam propostas. A fonte de Fibra de Aranha Yokai e a produção de Linho de Deméter não foram homologadas. **Nenhuma alteração** em catálogo, saves, Phaser, runtime ou mercado. Próximo ofício aprofundado: **Cozinha**.

## Continuidade dos ofícios — Cozinha 16/16 e 139 receitas tradicionais (09/11/2026)

A [Cozinha recebeu parecer das 16 receitas](parecer-cozinha-16-alimentacao-efeitos-e-procedencia-v1.md) e [matriz individualizada](../data/auditoria-cozinha-16-v1.json). São 23 ingredientes distintos e todos os produtos restauram Vida; não há mecanismo culinário próprio de fadiga/viagem no clássico, embora `Ração dos Vigias` seja produto fabricável. A auditoria marca quatro incoerências materiais ou lacunas de preparo como P0 e documenta decisões `COZ-01`–`COZ-08`, **todas pendentes**. O bloco tradicional está **139/139** aprofundado (89 Forja, 14 Joalheria, 20 Curtume, 16 Cozinha). A etapa seguinte é Escrita, depois Encantamento. Nenhum arquivo ativo, save, receita ou economia foi alterado.
