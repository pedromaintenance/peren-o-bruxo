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
