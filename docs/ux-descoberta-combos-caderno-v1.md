# UX — Descoberta de Combos e Caderno Alquímico (proposta v1.0)

> **Peren, o Bruxo · 03/11/2026 · DESIGN, não código de gameplay.**
> **Autoridades:** [Constituição v1.0 — Emenda A2](constituicao-design-v1.md), [roadmap de mecânicas e menus](roadmap-crafting-mecanicas-menus.md), [catálogo de combos por efeitos](../data/catalogo-combos-alquimicos.json).
> **Protótipo ilustrativo:** [PR #95 — UX de combos e Caderno](https://github.com/pedromaintenance/peren-o-bruxo/pull/95) · [arquivo HTML standalone em branch isolada](https://github.com/pedromaintenance/peren-o-bruxo/blob/design/ux-combos-caderno-v1-20261103/prototipos/ux-combos-caderno-v1.html). Para executar fora do jogo, abrir o HTML baixado em um navegador; não exige servidor, rede, save ou dependências. **Não** substituir o Phaser nem publicar a interface como jogabilidade real.
> **Classificação:** canônico = regra explícita do criador; **PROPOSTA** = UX, estrutura de evento, persistência e apresentação ainda sujeitos a teste.

## 1. Momento da descoberta — sem criar outro sistema de crafting

**[CANÔNICO]** O jogador fabrica normalmente; cada efeito ativo exige fontes de dois **tipos diferentes** de ingredientes. Ordem de seleção não muda a composição. A resolução segue: **efeitos reais → incompatibilidades aprovadas (Impuro) → sinergias aprovadas (nome especial) → comum (nome do efeito mais intenso)**. Efeitos secundários não somem. Uma combinação de dois efeitos benéficos não é automaticamente sinergia.

**[PROPOSTA]** A tela de descoberta é uma consequência da **transação bem-sucedida**, nunca uma receita, uma escolha de família que filtre efeitos ou um bônus novo. Fluxo:

1. A mistura é concluída e debitada pelo motor. O motor fornece `effectIds` realmente ativados, `ingredientIds` e identificador único da transação; os dados canônicos não mudam.
2. Classificar somente usando a lista **aprovada** de sinergias/incompatibilidades. O array `candidatos_sinergia` é **editorial e proibido** para nomear produtos jogáveis.
3. O conhecimento do personagem é atualizado **pela regra atual de fabricação/estudo**; no protótipo Phaser, mistura bem-sucedida descobre os efeitos compartilhados nos ingredientes usados.
4. Verificar se **Peren reconhece** os efeitos de assinatura da sinergia. A classificação interna nunca precisa revelar ao jogador propriedades não descobertas.
5. Se `comboId` está aprovado, a mistura não é Impura e o personagem reconhece a assinatura **pela primeira vez**, gravar a descoberta no save Phaser **na mesma transação**, com chave `comboId`. Apresentar a celebração **uma vez**; nunca premiar XP, moedas ou outro bônus só por mostrar uma tela sem regra aprovada.
6. Se a sinergia já foi descoberta, mostrar resultado comum com nome especial e botão `Ver no Caderno`. Se a mistura contiver incompatibilidade aprovada, a classificação principal é **Impuro** e o alerta deve preceder qualquer nome sinérgico. Se o combo ainda não foi reconhecido pelo personagem, usar apresentação limitada ao conhecimento real, sem spoiler.
7. Fechar o resultado sempre leva de volta à bancada sem repetir a fabricação. `Abrir no Caderno` navega para a ficha, sem fabricar novamente.

**Casos reais e canônicos:** `aumentar_carisma` + `aumentar_ilusao` → **Poção da Fada**; `aumentar_carisma` + `diminuir_forca` → **Impuro**; `aumentar_forca` + `resistencia_eletricidade` → mistura compatível **sem nome especial**. Todos esses identificadores existem na curadoria. As demais 8 assinaturas são candidatas **não aprovadas**.

## 2. Tela de resultado: hierarquia visual e microtexto

### 2.1 Primeiro combo conhecido [PROPOSTA]

```text
┌──────────────────────────────────────────────┐
│  BANCADA DE ALQUIMIA       RESULTADO         │
│                                              │
│       ✦ NOVA SINERGIA DESCOBERTA ✦          │
│                                              │
│               POÇÃO DA FADA                  │
│      Aumentar Carisma + Aumentar Ilusão      │
│                                              │
│  [Frasco da família + FX reservado pelo ID]  │
│                                              │
│  Os efeitos se reforçam numa arte comum.     │
│  Outros efeitos do preparo: [conhecidos]     │
│                                              │
│  Registrada no Caderno do Bruxo.             │
│                                              │
│       [CONTINUAR]   [VER NO CADERNO]         │
└──────────────────────────────────────────────┘
```

A descrição acima é **copy de UX provisória**, não um efeito novo, multiplicador ou nova regra de duração. A ilustração usa **frasco padrão de Poções** até existir arte aprovada. O `comboId` permite no futuro aplicar camada animada sem multiplicar assets por receita.

### 2.2 Estados alternativos

| Estado | Cabeçalho / alerta | Comportamento |
| --- | --- | --- |
| Novo combo, efeitos identificados | `Nova sinergia descoberta` e nome especial | Registra primeiro encontro e revela a ficha; sem bônus oculto |
| Combo conhecido, fabricado novamente | `Poção da Fada` | Sem comemoração repetida, atualiza histórico de lotes |
| Mistura compatível sem combo aprovado | Nome do maior efeito conhecido | Outros efeitos conhecidos na descrição; sem Impuro e sem animação especial |
| Efeitos incompatíveis | `Impuro`, foco nos riscos identificados | Incompatibilidade sobrepõe sinergia; todos efeitos permanecem |
| Combo interno não reconhecido pelo personagem | Nome genérico conforme conhecimento | Sem spoiler, sem registro prematuro no índice visível |
| Candidato editorial | Comportamento da mistura comum | Nome candidato/FX não aparecem no jogo |
| Mistura fracassada | Resultado de falha já existente | Não cria preparação nem desbloqueia combo |

**[ABERTO]** Convenção exata de título quando o maior efeito ainda não está identificado; fórmula de potência; empates; múltiplos combos aprovados simultâneos; possibilidade de mostrar um sinal de Impuro sem revelar efeitos. Não resolver essas questões usando a ordem do JSON.

## 3. Caderno do Bruxo — nova seção de conhecimento

**[PROPOSTA]** `Caderno do Bruxo → Alquimia → Combos Descobertos → [comboId]`.

A navegação tem dois modos que compartilham as mesmas fichas: **índice de combos já reconhecidos** no Caderno e **atalho Combos conhecidos** dentro da bancada (família Poções, Venenos ou Tônicos conforme catálogo). Os oito candidatos não aprovados **não entram** nesses menus, tampouco em silhuetas com nomes disfarçados.

**Estado vazio:** “Peren ainda não reconheceu nenhuma sinergia. Experimente ingredientes ou estude suas propriedades.” Atalho **Voltar à Bancada**. Não listar quantidades totais de combos por descobrir, que denunciariam segredo editorial.

**Cartão de combo reconhecido:** nome e ícone da família; assinatura de **efeitos conhecidos**, descrição curada, primeira descoberta, número de lotes produzidos, status de posse **atual** e botão `Ver fontes conhecidas`. Quando existir arte, a animação é acessível sem depender de renderizar todos os efeitos no mapa.

**Detalhe:** explica o propósito conjunto, sem novas propriedades. Organiza fontes de cada efeito conhecidas por Peren. Se um conjunto possuído ainda não garante duas fontes por efeito, o botão `Preparar` fica desabilitado com explicação. A lista de pares/trios testados é **histórico**, não fórmula exclusiva. Não exibir ingredientes desconhecidos nem cruzar diretamente com todos os dados brutos do catálogo.

**Múltiplos efeitos:** a ficha mostra a **assinatura do combo** e uma subseção “Outros efeitos neste lote”, sem dizer que os extras fazem parte da assinatura. Uma versão do lote pode apresentar Impuro por efeito adicional incompatível; a ficha abstrata do combo não o oculta.

## 4. Contrato de dados proposto — separado da curadoria

O catálogo editorial `data/catalogo-combos-alquimicos.json` identifica conceitos, nomes e futuros assets **aprovados**; não precisa representar a experiência de cada personagem.

Um save **somente Phaser**, **futuro**, pode carregar uma estrutura versionada:
```json
{
  "alchemy": {
    "knownCombos": {
      "combo-pocao-da-fada": {
        "firstDiscoveryEvent": "tx-123",
        "firstDiscoveryDay": 15,
        "timesProduced": 1
      }
    },
    "comboLog": [
      {
        "transactionId": "tx-123",
        "comboId": "combo-pocao-da-fada",
        "preparationId": "preparo-123",
        "ingredientIds": ["ing-daedra-heart", "ing-dragon-s-tongue", "ing-scaly-pholiota"]
      }
    ]
  }
}
```
**Exemplo de contrato, não save real**: números/datas fictícios; os ingredientes representam um conjunto materialmente possível de três tipos. Repetir a transação **não** aumenta `timesProduced` e não mostra a descoberta novamente. `knownCombos` deve ser computado/transacionado de forma consistente, sem criar uma chave no save clássico ou alterar dados de navegação fora do Phaser. Limites do histórico e migração futura de schema permanecem abertos.

**Regras de estabilidade:** o ID do combo é a identidade de descoberta; a assinatura usa IDs dos **efeitos**, não os nomes visíveis nem a lista específica de ingredientes. IDs sobrevivem a traduções, variações de grafia, ordenação de materiais e futuras animações. O JSON de curadoria e as receitas legadas não mudam.

## 5. Reserva de animação e acessibilidade

**Contrato visual proposto:**
- `comboId` → `visual.chave_reservada` → recurso por **família visual** + camada visual opcional (partículas/quadros/iluminação).
- `animacao.estado=pendente|nao_produzido` significa **fallback imediato** ao frasco da família, sem asset quebrado.
- Uma única introdução **breve e dispensável** na descoberta; opção `Pular`/tecla de retorno; `prefers-reduced-motion` e controles de acessibilidade devem eliminar movimento obrigatório.
- Comunicar a descoberta **por texto e ícone**, não apenas por cores ou partículas. Nenhuma sobreposição animada bloqueia botões, leitura ou foco de teclado.
- Nenhum visual sugerido de candidato editorial aparece no jogo antes de promoção com decisão do criador.

**Tela pequena (360–390 px):** uma coluna, texto principal em até duas linhas, botões grandes de toque, resultado rolável, rodapé fixo apenas se não encobrir dados. **Xbox/gamepad:** foco inicial em Continuar; A confirma, B volta, setas/analógico navegam, sem prender foco em modal. Teclado: Tab/Shift+Tab, Enter/Espaço e Esc; leitor de tela anuncia o título sem repetir alertas; foco retorna ao botão que iniciou a fabricação.

## 6. QA de design e interface antes de integrar ao runtime

- **UX-C01:** primeira fabricação com assinatura canônica e reconhecida gera evento de descoberta **uma única vez**.
- **UX-C02:** repetir com outros ingredientes dá o **mesmo comboId**, sem reapresentar primeira descoberta nem exigir receita específica.
- **UX-C03:** candidatos `proposto_nao_aprovado` nunca aparecem como nomes especiais, botões secretos ou FX.
- **UX-C04:** a presença de incompatibilidade catalogada faz o preparado ser Impuro e prevalece sobre nome de combo, sem suprimir efeitos.
- **UX-C05:** efeitos extras, sem incompatibilidade, mantêm a identidade do combo aprovado.
- **UX-C06:** mesmo efeito presente em um único tipo de ingrediente não conta; 3+ fontes são avaliadas por efeito, não por total de componentes.
- **UX-C07:** UI e Caderno não mostram propriedades ou ingredientes ainda não conhecidos pelo personagem; nenhum spoiler em tooltip, atributo HTML ou leitores de tela.
- **UX-C08:** save Phaser guarda combo e lote de forma atômica; reload e repetição da mesma transação não duplicam histórico/descoberta.
- **UX-C09:** frasco-base aparece sem animação cadastrada; `prefers-reduced-motion` mantém todos os textos e ações acessíveis.
- **UX-C10:** fluxos mobile/teclado/gamepad/retorno à bancada funcionam sem perda de foco ou fabricação duplicada.

## 7. Handoff

**Agente de curadoria:** mantém **somente** o catálogo de sinergias/incompatibilidades, seus estados de aprovação, nomes e futuros briefings de arte. **Agente de mecânicas:** implementa reconhecimento posterior à fabricação, estado de descoberta no Phaser, menu, Caderno, acessibilidade e consumo apenas de registros aprovados. **Direção de arte:** mais tarde associa `comboId` a sprite/FX, sem recadastrar receitas e sem modificar efeitos.

**Backlog:** **CRAFT-D20** (resultado de descoberta), **CRAFT-D21** (Caderno), **CRAFT-D22** (identidade visual opcional e fallback), **CRAFT-D23** (persistência de conhecimento no save Phaser). **Gate:** UX-C01–C10 + QA em branch isolada; nenhuma promoção automática ao Pages.

**Estado em 03/11/2026:** especificação v1.0; não implementada no runtime, não publicada como jogo.

## 8. Extensão de design v1.1 — várias sinergias na mesma mistura (03/11/2026)

> **Status: PROPOSTA para UX e QA, NÃO nova decisão canônica.** Só existe uma sinergia efetivamente aprovada: **Poção da Fada**. Todas as combinações adicionais desta seção são **assinaturas artificiais de teste**, jamais candidatos editoriais ou nomes futuros de produto.

### 8.1 Reconhecer todas as assinaturas, escolher uma apresentação

**[CANÔNICO]** A produção primeiro calcula os efeitos por duas fontes distintas para **cada efeito**, independentemente de número e ordem de ingredientes. Em seguida, verifica incompatibilidades aprovadas (rótulo principal **Impuro**) e sinergias aprovadas (nomes especiais), preservando integralmente os efeitos. Nenhum novo bônus surge do número de sinergias.

**[PROPOSTA]** O classificador deve devolver **uma coleção ordenada e estável de `matchedComboIds`**, não apenas `comboId`. O resultado de várias sinergias é **um único lote/preparado**, com uma única despesa de materiais e ações, e tantas associações de conhecimento quanto assinaturas aprovadas e reconhecidas forem encontradas.

**Uma decisão ainda não tomada:** quando existirem dois combos aprovados, qual nome aparece como título **único** do preparado?

- **A — Prioridade por potência da assinatura**, depois de definir como comparar efeitos heterogêneos. Prós: mantém um título familiar; contras: depende de fórmula de potência ainda aberta e pode criar resultados arbitrários se houver empate.
- **B — Apresentação neutra + todos os nomes em subcartões** (opção de UX recomendada para o protótipo). Prós: nenhuma assinatura se perde nem ganha preferência arbitrária; contras: título menos autoral e pode reduzir impacto da descoberta.
- **C — Nome autoral de uma supersinergia**, **apenas** se curadoria aprovar explicitamente a assinatura composta. Prós: identidade visual excepcional; contras: cresce explosivamente e não deve ser inferida a cada sobreposição.

**Proposta de trabalho:** enquanto não houver regra para A ou aprovação autoral de C, usar B em testes como **“Múltiplas sinergias reconhecidas”**, apenas cabeçalho descritivo do resultado, **não nome canônico da poção**. Listar os combos aprovados conhecidos por Peren por ID estável, sem concatenar nomes num novo item/receita. Uma incompatibilidade aprovada **sobrepõe-se** a essa apresentação e exige título Impuro, mantendo assinaturas em metadados.

### 8.2 Cenários sintéticos de QA — NÃO aprovar uma segunda poção

**Mistura viável para isolar a colisão:** Língua-de-Dragão (`ing-dragon-s-tongue`), Coração de Demônio (`ing-daedra-heart`) e Beladona (`ing-nightshade`) produzem, pelo critério de duas fontes distintas:

- `aumentar_carisma` — Língua-de-Dragão + Coração de Demônio;
- `aumentar_ilusao` — Língua-de-Dragão + Beladona;
- `aumentar_magia` — Coração de Demônio + Beladona.

**Assinatura aprovada A:** `aumentar_carisma` + `aumentar_ilusao` → **Poção da Fada**. **Assinatura artificial B de QA:** `aumentar_ilusao` + `aumentar_magia` → **“Combo B — APENAS TESTE”**. Essa segunda assinatura **não é sinergia proposta, nome aprovado nem registro do catálogo**, serve exclusivamente para ensaiar a coincidência de dois reconhecimentos no mesmo lote. Em runtime real, com o catálogo atual, essa mistura gera **apenas** Poção da Fada (com Aumentar Magia como efeito adicional), nunca dois combos.

**Incompatibilidade com múltiplas assinaturas:** outro cenário testa os *effectIds* artificiais `aumentar_carisma`, `aumentar_ilusao`, `aumentar_magia`, `diminuir_forca`. Como contém a incompatibilidade aprovada Carisma × Diminuir Força, sua apresentação principal é **Impuro**, mesmo se duas assinaturas de teste coincidirem. Esse vetor é **somente do classificador**; não afirmar que haja receita de até quatro ingredientes que o produza.

**Cenários adicionais para implementação futura:** assinaturas disjuntas, assinaturas sobrepostas, três assinaturas simultâneas, duas incompatibilidades, efeito extra fora das assinaturas, lista de entrada em ordens diferentes e mistura de aprovado/proposto. Nunca incluir combos editoriais não aprovados no conjunto real `matchedComboIds`.

### 8.3 Contrato de resultado e idempotência [PROPOSTA]

```json
{
  "transactionId": "tx-QA-42",
  "preparationId": "preparo-QA-42",
  "effectIds": ["aumentar_carisma", "aumentar_ilusao", "aumentar_magia"],
  "classification": "multiple_synergies_test_only",
  "matchedComboIds": ["combo-pocao-da-fada", "qa-combo-b-ficticio"],
  "newlyDiscoveredComboIds": ["combo-pocao-da-fada", "qa-combo-b-ficticio"],
  "impurityIds": [],
  "display": {
    "titleStatus": "unresolved_multiple_names",
    "label": "Múltiplas sinergias reconhecidas",
    "isCanonicalItemName": false
  }
}
```

**Exemplo fictício, NÃO schema de runtime aprovado.** Em produção, IDs `qa-*` são proibidos. A lista dos combos em uma transação é estável e sem duplicatas; o Caderno registra cada descoberta no máximo uma vez por `comboId`, e associa a mesma `preparationId` a todas as descobertas encontradas. Repetir `transactionId` jamais duplica lote, custo, contagem, descoberta ou animação. Repetir a **fabricação legítima em outra transação** gera outro lote, mas não reabre “primeira descoberta” de IDs conhecidos.

**Impuro com sinergia:** decidir futuramente se Peren pode **registrar o conhecimento** da sinergia ao identificar uma mistura Impura, mesmo quando o nome e a arte do preparo permanecem Impuros. Proposta recomendada: registrar conhecimento comprovadamente identificado, mas nunca anunciar uma **poção combo pura**. Esta é uma regra de descoberta **aberta**, não nova autorização canônica.

### 8.4 Caderno, animações e acessibilidade

- **Caderno:** cada combo reconhecido conserva página **individual**; uma relação `preparationId → comboIds[]` permite ver todos os combos de **um mesmo lote** e voltar a ele. Nenhum “supercombo” é criado automaticamente nem é tratado como novo registro canônico.
- **Mensagem de descoberta:** agrupar novos nomes em **um único resultado** “2 sinergias reconhecidas”, com cartões independentes; se um já era conhecido, mostrar somente o outro como **nova** descoberta. Não tocar duas animações e dois sons simultâneos.
- **Identidade visual:** sempre um frasco da família; ao existir arte para múltiplos combos, considerar **sequência de breves destaques** ou um foco escolhido, nunca sobrepor FX que prejudiquem legibilidade. Sem recursos aprovados, fallback ao frasco normal.
- **Segredo:** em nenhum caso listar nomes, IDs, assinaturas ou benefícios **não conhecidos pelo personagem**, mesmo que o motor interno tenha calculado mais efeitos. Candidatos editoriais continuam ignorados.
- **Mobile/teclado/Xbox:** lista de sinergias com scroll/teclas acessíveis, foco previsível, um botão Continuar e um Ver no Caderno; a solução deve respeitar movimento reduzido e ausência de áudio.
- **QA visual:** o protótipo PR #95 recebe os cenários **Dupla sinergia — QA** e **Dupla + Impuro — QA**, explicitamente não canônicos.

### 8.5 Novos gates de aceitação

- **UX-C11:** duas assinaturas aprovadas ficticiamente em teste, simultâneas, são detectadas uma vez cada; efeitos extras não somem.
- **UX-C12:** com uma das assinaturas já conhecida, apenas a outra recebe primeira descoberta; o lote é único.
- **UX-C13:** um vetor contendo incompatibilidade aprovada é apresentado como **Impuro**, mesmo quando há sinergias; efeitos permanecem íntegros.
- **UX-C14:** candidatos editoriais reais e assinaturas `qa-*` não entram no catálogo efetivo de gameplay nem recebem asset publicado.
- **UX-C15:** a mesma transação repetida não duplica descobertas, lotes, ações, itens ou aviso de primeira descoberta.
- **UX-C16:** ordenação de ingredientes, efeitos e registros do JSON não decide arbitrariamente nome principal ou evento.
- **UX-C17:** Caderno preserva várias associações por lote e oferece navegação legível, com sigilo e fallback visual.

**Backlog:** **CRAFT-D24** (classificador multissinergia e hierarquia Impuro), **CRAFT-D25** (resultado agrupado e Caderno com várias assinaturas por lote), **CRAFT-D26** (política de título único, arte/FX e decisão autoral). **Sem mudanças em runtime até decisão e testes da mecânica.**

## 9. Conhecimento reconhecido versus preparo compatível — experimento v1.2 (03/11/2026)

**Estado:** PROPOSTA DE DESIGN e classificador experimental, **não canonizada**. A Constituição A2 exige somente que incompatibilidade torne a preparação Impura, que sinergias sejam reconhecidas por assinaturas aprovadas e que não se apaguem efeitos. A regra exata de aprendizado de sinergia dentro de um Impuro continua reservada a decisão do criador.

### 9.1 Duas conquistas distintas no Caderno

**Recomendação:** separar **descoberta da relação entre efeitos** de **produção de uma preparação compatível** que os contenha.

| Evento | O que muda | O que NÃO muda |
| --- | --- | --- |
| Reconhecer em preparo **Impuro** uma assinatura de sinergia com efeitos já identificados | O Caderno aprende aquela **relação sinérgica**; registra que o primeiro encontro ocorreu num lote Impuro | O produto permanece Impuro, sem nome principal de poção especial e sem remover efeitos incompatíveis |
| Produzir depois um lote **sem incompatibilidades** contendo assinatura já conhecida | O Caderno marca **primeiro preparo compatível**; pode ter apresentação comemorativa mais simples | Não finge que a sinergia foi descoberta novamente, não reativa ganhos, não elimina efeitos extras |
| Reconhecer sinergia e produzi-la compatível **na mesma operação** | Os dois marcos são registrados em uma transação | Não criar duas poções, duas despesas ou dois eventos de produção |
| Identificar apenas parte de uma assinatura | Ainda não foi reconhecido o combo pelo personagem | Nome, efeitos ocultos e futuras animações exclusivas não vazam |

**Termos preferidos:** `primeira observação`, `primeiro preparo compatível`, `preparações compatíveis`. Evitar o nome `puro` para qualquer lote que apenas não seja Impuro: um preparado pode carregar **vários efeitos compatíveis** e ser plenamente utilizável sem ter passado pela técnica de Purificação. O estado **Impuro** é classificação de incompatibilidade, não medidor geral de qualidade.

### 9.2 Exemplo material real e casos exclusivamente sintéticos

**Mistura Impura efetivamente viável com 4 tipos:** `ing-daedra-heart` (Coração de Demônio) + `ing-dragon-s-tongue` (Língua-de-Dragão) + `ing-jarrin-root` (Raiz Botulínica) + `ing-butterfly-wing` (Asa de Borboleta). Os efeitos ativos calculados pelas duas fontes distintas são `aumentar_carisma` e `diminuir_forca`; a incompatibilidade está aprovada. **Não há combo de Fada nesse exemplo** e o nome dominante depende da potência futura.

**Teste sintético de conhecimento dentro de Impuro:** `aumentar_carisma`, `aumentar_ilusao`, `diminuir_forca`. Assinatura **Poção da Fada** existe como subconjunto, mas o conflito Carisma×Diminuir Força torna o **preparo Impuro**. **Este é um vetor de efeitos para teste de regras**, NÃO alegação de uma mistura real de até 4 ingredientes que ative os três efeitos. Caso o criador aceite o aprendizado no Impuro, registrar o combo como **conhecido, mas ainda não produzido de modo compatível**.

**Mistura compatível realmente viável (3 tipos):** `ing-daedra-heart` + `ing-dragon-s-tongue` + `ing-scaly-pholiota` (Cogumelo Escamoso), produzindo Carisma e Ilusão. É um preparo da **Poção da Fada** que pode representar o primeiro lote compatível após a observação sintética acima.

### 9.3 Contrato de dados experimental, sem integração de save

**Proposta de estado por assinatura aprovada:**

```json
{
  "combo-pocao-da-fada": {
    "firstRecognitionTransaction": "tx-sintetica-01",
    "firstRecognizedInImpure": true,
    "firstCompatibleTransaction": "tx-compat-02",
    "observations": 2,
    "compatiblePreparations": 1
  }
}
```

Os IDs de transação são demonstrativos. Para cada `transactionId`, no máximo **um** lançamento efetivo e uma atualização de conhecimento por combo; diferentes assinaturas na mesma fabricação devem remeter ao **mesmo** identificador de lote. Uma preparação Impura pode ser **observação alquímica válida** sem contar como preparo compatível. Não migrar saves clássicos, não instituir quantidades ou custos extras e não expor esse estado no runtime antes da aprovação.

**Classificador puro experimental:** [`prototipos/experimento-classificador-sinergias.mjs`](https://github.com/pedromaintenance/peren-o-bruxo/blob/design/ux-combos-caderno-v1-20261103/prototipos/experimento-classificador-sinergias.mjs), testes [`experimento-classificador-sinergias.test.mjs`](https://github.com/pedromaintenance/peren-o-bruxo/blob/design/ux-combos-caderno-v1-20261103/prototipos/experimento-classificador-sinergias.test.mjs), **somente na branch isolada da PR #95**. Regras avaliadas: lista íntegra de assinaturas aprovadas, incompatibilidade prioritária, sigilo de efeitos, ignorar candidatos editoriais, determinismo da ordem, primeiro reconhecimento versus primeiro preparo compatível e idempotência de transações. **15/15 casos passaram em execução JavaScript em memória**, sem executar runtime Phaser ou QA de Pages.

### 9.4 Riscos que devem ser resolvidos antes de implementar

- **Risco de surpresa no inventário:** o Caderno poderá conter “Poção da Fada” aprendida sem Peren possuir ou ter produzido uma Poção da Fada compatível. **UX proposta:** separar visualmente `Conhecimento reconhecido` de `Preparado com sucesso`.
- **Incompatibilidade oculta:** o motor sabe que a mistura é Impura, mas Peren talvez ainda não identifique qual efeito causa a oposição; o aviso **Impuro** não deve vazar o ID ou nome da propriedade escondida.
- **Potência:** não escolher o título de uma mistura comum pelo primeiro efeito do array. A escolha do dominante continua aberta.
- **Escala do histórico:** o modelo experimental usa `processedTransactions` em memória; o limite, compactação e atomicidade com o save real exigem contrato futuro de persistência.
- **Aprendizado/acesso:** não conceder sinergia ao personagem quando ele não identificou **todos** os efeitos de sua assinatura, ainda que o motor tenha detectado a relação.
- **Economia/experiência:** aprender sinergia não adiciona bônus de combate, dinheiro ou XP sem regra aprovada; evita duplicação de recompensa por repetir preparo.

### 9.5 Critérios novos

- **UX-C18:** reconhecer sinergia no Impuro (caso sintético) cria **conhecimento**, não registro de preparo compatível; classificação principal continua Impuro.
- **UX-C19:** produzir depois o mesmo combo sem incompatibilidade marca primeiro lote compatível, sem reapresentar a primeira descoberta.
- **UX-C20:** a primeira fabricação compatível que também descobre a sinergia marca ambos os fatos na **mesma transação**.
- **UX-C21:** efeito da assinatura oculto ao personagem não pode gerar nome ou conhecimento revelado.
- **UX-C22:** transação repetida não aumenta contadores; nome e resultado não dependem da ordem de efeitos/assinaturas.
- **UX-C23:** a UI não chama “Purificado” ou “Puro” a qualquer mistura simplesmente compatível.

**Backlog:** **CRAFT-D27** — estados separados de descoberta e preparo; **CRAFT-D28** — política de aprendizado dentro de Impuros e feedback; **CRAFT-D29** — persistência/idempotência e integração futura na bancada, apenas após aprovação da política. Sem novo cânone ou gameplay.
