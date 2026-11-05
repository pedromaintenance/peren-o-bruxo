# Taxonomia dos 53 efeitos alquímicos — relatório de design v1.0

> **Data de referência:** 05/11/2026 · **Estado:** pesquisa e classificação **PROPOSTAS**, sem aprovação de novas regras.
> **Fonte primária de IDs, nomes e atributos:** [`data/curadoria_ingredientes.json`](../data/curadoria_ingredientes.json), curadoria com **111 ingredientes, 53 efeitos e nenhuma propriedade isolada**. [Estado da curadoria](estado-curadoria-ingredientes.md).
> **Base de autoridade para regras já decididas:** [Constituição do Design, Emenda A2](constituicao-design-v1.md), [auditoria alquímica](auditoria-alquimia-peren.md), [plano técnico](plano-alquimia-gameplay-v1.md).
> **Proposta estruturada e editável por processo de revisão:** [taxonomia JSON na branch de pesquisa](https://github.com/pedromaintenance/peren-o-bruxo/blob/design/taxonomia-53-efeitos-alquimia-20261105/data/taxonomia-efeitos-alquimicos-proposta.json). **Não consumir como regras de gameplay.**

## 1. O que foi encontrado e o que foi inferido

**Dados factuais do repositório:** os 53 IDs canônicos da curadoria, seus rótulos, o número de ingredientes portadores de cada efeito e as intensidades de origem I–III. Dois IDs possuem variantes textuais no catálogo: `curar_doenca` (Curar doença/Curar Doença) e `voar` (Voar/Voo); **não substituir IDs por texto de apresentação**.

**Decisões expressas:** cada efeito só se manifesta quando dois tipos distintos o possuem; uma mistura preserva todos os efeitos ativados. Somente incompatibilidades aprovadas tornam uma preparação **Impura**, e somente sinergias aprovadas dão identidade especial, como **Poção da Fada**. A potência final, a duração e o papel da 3ª/4ª fonte ainda não foram aprovados. **Vampirismo deve poder transformar alguém em vampiro com o tempo** — o ritmo, o acúmulo, a resistência e a reversão não estão decididos.

**Inferência editorial deste estudo, não cânone:** agrupar efeitos em 11 campos de pesquisa para facilitar o desenho de mecânicas. A alocação em grupos, o alvo, o comportamento temporal, o cálculo de potência, a resistência e o empilhamento ainda exigem avaliação. Grupos de efeito **não equivalem automaticamente às famílias Poção, Veneno, Tônico, Elixir ou Bálsamo**.

A proposta em JSON tem, para **cada ID**, nomes, fonte contada, faixa de intensidade realmente presente, grupo, processo, alvo hipotético, comportamento temporal hipotético, dimensões a estudar, ressalva específica, campos nulos de mecânica e proveniência. Ausência de valor **não** deve ser preenchida automaticamente por código.

## 2. Índice integral dos 53 efeitos por grupo

### Alterações de atributos — 10 efeitos [PROPOSTA]

Definir unidade de alteração, alcance sobre testes e reversão; atributo não significa deslocamento.

| Efeito (nome vigente) | ID estável | Fontes |
| --- | --- | ---: |
| Aumentar Carisma | `aumentar_carisma` | 2 |
| Aumentar Constituição | `aumentar_constituicao` | 21 |
| Aumentar Destreza | `aumentar_destreza` | 18 |
| Aumentar Força | `aumentar_forca` | 10 |
| Aumentar Inteligência | `aumentar_inteligencia` | 2 |
| Diminuir Carisma | `diminuir_carisma` | 2 |
| Diminuir Constituição | `diminuir_constituicao` | 13 |
| Diminuir Destreza | `diminuir_destreza` | 11 |
| Diminuir Força | `diminuir_forca` | 5 |
| Diminuir Sabedoria | `diminuir_sabedoria` | 2 |

### Escolas e aptidões — 9 efeitos [PROPOSTA]

Distinguir habilidades mágicas, perceptivas e ofícios; não pressupor que o efeito age diretamente no item fabricado.

| Efeito (nome vigente) | ID estável | Fontes |
| --- | --- | ---: |
| Aumentar Alteração | `aumentar_alteracao` | 3 |
| Aumentar Conjuração | `aumentar_conjuracao` | 7 |
| Aumentar Destruição | `aumentar_destruicao` | 4 |
| Aumentar Encantamento | `aumentar_encantamento` | 7 |
| Aumentar Ferraria | `aumentar_ferraria` | 2 |
| Aumentar Furtividade | `aumentar_furtividade` | 7 |
| Aumentar Ilusão | `aumentar_ilusao` | 3 |
| Aumentar Percepção | `aumentar_percepcao` | 3 |
| Aumentar Restauração | `aumentar_restauracao` | 6 |

### Limites e defesa — 5 efeitos [PROPOSTA]

Separar máximo de recurso, capacidade de carga e defesa da reserva atual, evasão e resistências.

| Efeito (nome vigente) | ID estável | Fontes |
| --- | --- | ---: |
| Aumentar Capacidade de Carga | `aumentar_carga` | 4 |
| Aumentar Defesa | `aumentar_defesa` | 8 |
| Aumentar Magia | `aumentar_magia` | 9 |
| Aumentar Saúde | `aumentar_saude` | 2 |
| Diminuir Magia | `diminuir_magia` | 2 |

### Mudanças imediatas em recursos — 4 efeitos [PROPOSTA]

Distinguir perda ou recuperação pontual de mudança do máximo e regeneração gradual.

| Efeito (nome vigente) | ID estável | Fontes |
| --- | --- | ---: |
| Dano à Magia | `dano_magia` | 10 |
| Dano à Saúde | `dano_saude` | 20 |
| Restaurar Magia | `restaurar_magia` | 14 |
| Restaurar Saúde | `restaurar_saude` | 9 |

### Taxas de recuperação — 3 efeitos [PROPOSTA]

Decidir taxa por unidade de tempo, duração do estado e tratamento fora de combate.

| Efeito (nome vigente) | ID estável | Fontes |
| --- | --- | ---: |
| Diminuir Regeneração de Magia | `diminuir_regeneracao_magia` | 5 |
| Regenerar Magia | `regenerar_magia` | 7 |
| Regenerar Saúde | `regenerar_saude` | 8 |

### Proteções específicas — 5 efeitos [PROPOSTA]

Determinar contra que ataque/estado protege, cálculo de mitigação e sobreposição com defesa.

| Efeito (nome vigente) | ID estável | Fontes |
| --- | --- | ---: |
| Resistência à Eletricidade | `resistencia_eletricidade` | 8 |
| Resistência ao Fogo | `resistencia_fogo` | 10 |
| Resistência ao Gelo | `resistencia_gelo` | 8 |
| Resistência à Magia | `resistencia_magia` | 10 |
| Resistência a Veneno | `resistencia_veneno` | 10 |

### Vulnerabilidades específicas — 5 efeitos [PROPOSTA]

Definir dano, resistência e tipos de ameaça; fragilidade a veneno não transforma todo dano em venenoso.

| Efeito (nome vigente) | ID estável | Fontes |
| --- | --- | ---: |
| Fraqueza à Eletricidade | `fraqueza_eletricidade` | 5 |
| Fraqueza ao Fogo | `fraqueza_fogo` | 7 |
| Fraqueza ao Gelo | `fraqueza_gelo` | 5 |
| Fraqueza à Magia | `fraqueza_magia` | 6 |
| Fraqueza a Veneno | `fraqueza_veneno` | 6 |

### Movimento e acesso ao ambiente — 6 efeitos [PROPOSTA]

Definir regras de velocidade, voo, respirar na água, visibilidade, alcance e detecção sem poderes implícitos.

| Efeito (nome vigente) | ID estável | Fontes |
| --- | --- | ---: |
| Diminuir Velocidade | `diminuir_velocidade` | 3 |
| Invisibilidade | `invisibilidade` | 6 |
| Respirar na Água | `respirar_na_agua` | 3 |
| Velocidade | `velocidade` | 2 |
| Visão à Distância | `visao_a_distancia` | 2 |
| Voar | `voar` | 2 |

### Controle e comportamento — 3 efeitos [PROPOSTA]

Definir severidade, duração, resistência e agência do alvo; não pressupor imobilização permanente.

| Efeito (nome vigente) | ID estável | Fontes |
| --- | --- | ---: |
| Frenesi | `frenesi` | 6 |
| Medo | `medo` | 5 |
| Paralisia | `paralisia` | 7 |

### Doenças e tratamento — 2 efeitos [PROPOSTA]

Definir catálogo de doenças, aplicação, cura e relação com estados persistentes.

| Efeito (nome vigente) | ID estável | Fontes |
| --- | --- | ---: |
| Curar doença | `curar_doenca` | 2 |
| Infligir Doença | `infligir_doenca` | 2 |

### Transformações progressivas — 1 efeito [PROPOSTA]

Vampirismo tem potencial de transformação com o tempo aprovado; progressão e reversão continuam abertas.

| Efeito (nome vigente) | ID estável | Fontes |
| --- | --- | ---: |
| Vampirismo | `vampirismo` | 2 |

## 3. Distinções que não podem se perder

| Par ou problema | Fato verificável e orientação de curadoria | Definição pendente |
| --- | --- | --- |
| `dano_magia` vs `diminuir_magia` | IDs distintos. Auditoria **propõe** dano à reserva atual versus redução do máximo/eficácia. | Recurso atingido, unidade, recuperação, limites. |
| `restaurar_magia` vs `regenerar_magia` | Nomes/IDs distintos; recomposição pontual e taxa ao longo do tempo são tratamentos **propostos**. | Instantaneidade, intervalo, duração e empilhamento. |
| `restaurar_saude` vs `regenerar_saude` | Curar pontos atuais não se confunde com processo de regeneração. | Unidade, teto, persistência e interrupção. |
| `aumentar_magia` vs `diminuir_magia` | Pertencem à esfera de capacidade, mas não há máximo/corrente estabelecido para cada efeito. | Interação em estados contraditórios, limite e retirada da influência. |
| `aumentar_destreza` vs `velocidade` | A auditoria propõe destreza de coordenação vs velocidade de deslocamento. | Física/movimento/atributos em mundo e combate. |
| `aumentar_percepcao` vs `visao_a_distancia` | Auditoria propõe sentidos gerais vs visão de longe; visão remota não foi aprovada. | Campo de visão, alcance, ocultação e detecção. |
| `dano_saude` vs `infligir_doenca` | Perda de vida e aquisição de doença não são sinônimos. | Lista de doenças, progressão, prevenção, resistência. |
| `fraqueza_veneno` vs `dano_saude` | A fraqueza a veneno não torna automaticamente venenoso todo dano à saúde. | Tipagem de dano, incompatibilidade, sinergias candidatas. |
| `invisibilidade` vs `aumentar_furtividade` | Efeitos distintos; invisibilidade não autoriza silêncio ou indetectabilidade total. | Detecção, audição, alcance e quebra de efeito. |
| `voar` + `velocidade` | Ambos têm fontes, mas o nome especial **Asas do Vendaval** continua candidato não aprovado. | Movimento aéreo, duração, velocidade, acidentes. |
| `vampirismo` | **Decisão canônica:** transformação possível com o tempo. Não reduzir à simples drenagem. | Exposição acumulada, estágios, resistência, reversão, alvos e aplicação. |
| `aumentar_ferraria` e `aumentar_encantamento` | Propriedades existentes, **não prova** de que devam ser Bálsamos ou afetar diretamente equipamentos. | Veículo/estação de uso, duração e efeitos sobre crafting. |

## 4. Método de avaliação dos efeitos [PROPOSTA]

A equipe de design deverá revisar cada efeito com a mesma ficha: **ação real**, **alvo legítimo**, **unidade de potência**, **tempo de início**, **duração**, **término/dissipação**, **resistência**, **empilhamento**, **fontes adicionais**, **veículo de aplicação**, **informação visível ao personagem** e **testes de integração**. Identificar primeiro o **estado do alvo** (atual, máximo, taxa, condição, transformação) antes de escolher qualquer fórmula. Efeitos instantâneos, permanentes, temporários e de progressão transformativa não devem receber o mesmo parâmetro de duração por presunção.

**Prioridade de investigação sugerida:** começar pelos quatro efeitos de **recursos atuais** e três de **taxa de recuperação**, depois **capacidade máxima**, **doença/transformações** e **estados de controle**. Isso destrava o contrato transacional do preparado e evita oferecer uma duração universal. O restante (aptidões, movimento, resistência, defesa, fraquezas) deve ser testado sobre os sistemas reais de exploração, ofício e combate quando os respectivos contratos existirem.

**Pontos delicados de implementação:** Vampirismo pode exigir persistência em vários dias/uso; Paralisia e Medo exigem regras de agência; Elixires e Bálsamos possuem veículos distintos; a Potência II ou III **do ingrediente** não equivale a uma quantidade final de cura, dano ou tempo. O classificador de **Impuro e Poção da Fada** permanece separado da ficha semântica do efeito.

## 5. Prova de integridade, interface e próximos gates

- **Arquivo-fonte do estudo:** `data/taxonomia-efeitos-alquimicos-proposta.json` em branch isolada. **Não** carregar automaticamente em runtime.
- **Verificação estrutural:** 17 testes do catálogo contra a curadoria original, confirmando cobertura integral dos 53 IDs, 111 ingredientes, nomes/variantes, grupos e campos nulos de mecânica. **17/17 passaram em V8 isolado**.
- **Painel de revisão:** HTML standalone com busca, filtro de grupo, fichas por efeito, parecer por ID, comentários e exportação/importação JSON. Pareceres locais não são aprovação automática; dados de revisão não são efeitos jogáveis.
- **Sem implementação:** nada foi alterado no motor Phaser, no jogo clássico, na curadoria de ingredientes, em receitas, nos saves, no combate ou na arte. Teste estrutural **não prova** que uma semântica proposta esteja mecanicamente correta.

**Backlog de design:**
- **SEM-D01 [P0]**: validar ou rejeitar os 11 grupos, com 53 fichas, mantendo efeitos identificáveis mesmo se mudarem de grupo.
- **SEM-D02 [P0]**: definir valores correntes, máximos, taxas e dano, separando `dano`, `diminuir`, `restaurar` e `regenerar`.
- **SEM-D03 [P0]**: definir temporalidade e persistência por efeito, incluindo doenças, Vampirismo e estados de controle sem durações inventadas.
- **SEM-D04 [P0]**: definir alvos, aplicação, resistência e interação com Poções, Venenos, Tônicos, Elixires e Bálsamos.
- **SEM-D05 [P1]**: decidir quais famílias suportam acréscimo de potência, duração ou qualidade por 3ª/4ª fonte, depois da semântica.
- **SEM-D06 [P0 antes de runtime]**: estabelecer testes de integração, sigilo de propriedades, integridade de inventário, saves e comportamento de efeitos extraordinários.

**Critérios de aceite de pesquisa:** `SEM-Q01` cobertura 53/53; `SEM-Q02` nomes e intensidades fiéis; `SEM-Q03` 11 grupos explicitamente propostos; `SEM-Q04` Vampirismo preservado; `SEM-Q05` Dano/Diminuir Magia separados; `SEM-Q06` Restaurar/Regenerar separados; `SEM-Q07` doença/dano separados; `SEM-Q08` Poção da Fada e Impuro não transformados em novos efeitos; `SEM-Q09` nenhum valor arbitrário de duração/potência; `SEM-Q10` comentários exportáveis e sem poder de alterar o jogo.

**Decisões reservadas ao criador:** aceitar/revisar a taxonomia, definir primeiro a semântica dos recursos e escolher quando evoluir de investigação para protótipos mecânicos. As classificações propostas não devem ser tratadas como novas regras simplesmente porque estão documentadas.
