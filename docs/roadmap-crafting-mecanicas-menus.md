# Roadmap de Game Design — Crafting, Alquimia e Menus do Peren Phaser

> **Versão documental:** 1.0 · **Data:** 03/11/2026 · **Escopo:** mecânicas e experiência de usuário, **não implementação**.
> **Produto:** Peren, o Bruxo — Mercador da Carcaça, **um único sandbox**; o motor de desenvolvimento futuro é Phaser. O clássico é referência legada, não alvo de novas funcionalidades.
> **Autoridade:** [Constituição de Design v1.0](constituicao-design-v1.md) (aprovada em 03/11/2026), decisões expressas do criador e [auditoria alquímica](auditoria-alquimia-peren.md). Este roadmap **não altera** a Constituição e **não aprova por omissão** fórmulas ou usos especiais ainda em aberto.
> **Continuidade técnica:** [Plano de alquimia e gameplay](plano-alquimia-gameplay-v1.md); [contrato de bancada na PR #94](https://github.com/pedromaintenance/peren-o-bruxo/blob/transition/phaser-only-m0-20261030/docs/contrato-bancada-alquimica.md); [PR de integração Phaser #94](https://github.com/pedromaintenance/peren-o-bruxo/pull/94).
> **Estado:** design consolidado + backlog priorizado; a PR #94 tem protótipo de bancada e descobertas testado, mas não está mesclada e não é a versão publicada. **Não apresentar este documento como feature jogável.**

## 0. Como ler decisões e estados

- **[CANÔNICO]** — já decidido pela Constituição v1.0 ou por instrução expressa do criador; não rediscutir sem nova orientação.
- **[PROPOSTA]** — opção de design recomendada para protótipo, **não** aprovada como cânone numérico nem como regra final.
- **[ABERTO]** — requer comparação de alternativas, teste de UX ou decisão do criador; registrar o motivo da escolha antes de implementar efeitos irreversíveis.
- **[PROTÓTIPO]** — existe código na branch da PR #94, sem significar lançamento no Pages.
- **[ENTREGUE]** — somente após código, teste, build publicado e conferência no Pages; nenhum item deste documento recebe este status inicialmente.

**Separação de responsabilidades:** este fluxo documenta design de mecânicas e menus; o fluxo de curadoria trata nomes, propriedades, taxonomia, ecologia, biomas e decisões ingrediente a ingrediente (ver [protocolo de consistência](curadoria-itens-consistencia-carcaca.md)). Dados aprovados são consumidos, não alterados silenciosamente. Código, integração e deploy pertencem aos ciclos de implementação.

## 1. Princípios de experiência

1. **[CANÔNICO] Crafting e coleta são pilares do jogo**, não sistemas periféricos de produção de consumíveis para combate. Preparados devem servir a comércio, exploração, cura, resistência, mobilidade, ofícios, risco e transformação.
2. **[CANÔNICO] Descoberta emergente:** efeitos nascem da interseção de propriedades de **tipos distintos** de ingredientes; não dependem de cadastrar uma receita por par.
3. **[CANÔNICO] Consequências não são filtradas pela conveniência:** efeitos benéficos e prejudiciais compartilhados coexistem na mesma mistura, inclusive quando o jogador partiu de uma categoria positiva.
4. **[CANÔNICO] Respeitar poder e lore:** não reduzir ingredientes fortes para “balancear”; raridade não é potência; preservar atributos curados, IDs, materiais, coerência ecológica e a escola visual oficial.
5. **[CANÔNICO] O jogador pode estudar OU experimentar às cegas.** Conhecimento do jogador sobre o catálogo externo não equivale a conhecimento de Peren.
6. **[CANÔNICO] Nunca despejar milhares de receitas numa lista plana.** Navegação em camadas, com destaque visual para o que pode ser fabricado e atenuação do que é conhecido mas não fabricável.
7. **[CANÔNICO] Somente um sandbox.** Nenhum modo de campanha independente, migração obrigatória de saves clássicos ou segundo jogo.
8. **[PROPOSTA] Poucas ações por tela, informação contextual e confirmação de gasto**, com suporte futuro a mouse, toque, teclado e gamepad.

## 2. Arquitetura dos menus de ofícios

### 2.1 Tela de seleção de estação [CANÔNICO no conceito; desenho exato PROPOSTO]

`Oficinas / cidade → escolher estação disponível → modo de produção → categoria / efeito / projeto → materiais → confirmação → resultado`

As estações a preservar e evoluir são **Alquimia, Forja, Cozinha, Joalheria, Encantamento, Escrita e Curtume**. A lista visível depende das estações presentes na cidade; não criar uma bancada idêntica em todo lugar.

**Estrutura-base recomendada:**
- **Cabeçalho:** cidade, estação, proficiência, ferramentas, ações disponíveis, estado da oficina e botão Voltar.
- **Coluna/painel esquerdo:** ofício, modo, famílias e subcategorias; breadcrumbs para voltar sem perder contexto.
- **Painel central:** efeito/projeto escolhido, materiais selecionáveis, quantidades, substituições legais, instrumentos e botão de confirmar.
- **Painel direito ou inferior no celular:** resultado antecipável **somente até onde Peren conhece**, chance/condição de falha se regras aprovadas permitirem, custo, avisos de efeitos conhecidos conflitantes e histórico do caderno.
- **Rodapé contextual:** controles de teclado/toque/gamepad e legendas de estado. No mobile, um painel por etapa, sem exibir três colunas minúsculas.

### 2.2 Modos por ofício

**Produção orientada [CANÔNICO]:** navegar por categoria e efeito conhecido (alquimia), ou produto/projeto conhecido (outros ofícios), para depois escolher materiais. Exibe estados de fabricação.

**Experimentação livre [CANÔNICO para alquimia; PROPOSTA para demais ofícios]:** unir matérias-primas sem exigir receita conhecida. Para forja, escrita, encantamento etc., uma simples interseção de efeitos **não** constitui regra suficiente: cada ofício terá gramática de materiais, ferramentas, projeto e operações própria. Não criar um “misturador universal de quaisquer itens” capaz de produzir objetos sem lógica material.

**Receitas tradicionais [CANÔNICO preservar]:** caminho separado para fórmulas especiais existentes em `data/receitas.json` e outros ofícios. Não apagar, não converter em receita emergente automaticamente. Exibir em árvore `Ofício → tipo de produto → subtipo → faixa de perícia / projeto`, nunca lista longa achatada; permitir busca e filtros.

### 2.3 Hierarquia de navegação e feedback

- Nível 1: **estação**; Nível 2: **modo**; Nível 3: **família/tipo de produto**; Nível 4: **efeito ou projeto**; Nível 5: **materiais e produção**.
- Itens **conhecidos e executáveis**: iluminados, foco forte, ícone e texto “Preparável”; nunca depender apenas da cor.
- Itens **conhecidos mas não executáveis**: cinza / leve opacidade, ainda clicáveis; ao abrir mostram **qual condição concreta** falta (ingredientes, ferramenta, perícia ou ações).
- Itens **desconhecidos**: não revelar efeitos ou receitas ocultas apenas para preencher a árvore; usar “Descobrir” e experimentação livre em vez de uma listagem spoiler.
- Níveis com muitos elementos: grupos recolhíveis, filtros “Preparáveis / Conhecidos / Todos conhecidos” e busca **restrita ao conhecimento do personagem**.
- Confirmar gasto de materiais antes de fabricar, sobretudo quando houve experimentação às cegas; avisos só podem usar conhecimento adquirido.
- Histórico de resultados, opção de repetir **uma combinação conhecida** e retornar à estação sem repetir navegação profunda.
- Preservar contexto e foco ao alternar menus, inclusive ao usar Xbox ou touchscreen.

## 3. Alquimia — cinco famílias [CANÔNICO]

| Família | Conceito aprovado | Operação principal | Pendente de definição |
| --- | --- | --- | --- |
| **Poções** | Modificam positivamente atributos | Consumir em personagem/alvo conforme efeito | Potência, duração, restrições e misturas híbridas |
| **Venenos** | Causam dano ou modificam negativamente atributos | Aplicar/administrar conforme alvo e veículo | Alvo, resistência, via de administração, duração |
| **Tônicos** | Concedem **efeitos mágicos especiais temporários** | Consumir/ativar efeitos especiais | Duração, acúmulo, custos e contrapartidas |
| **Elixires** | Concedem **efeitos mágicos especiais permanentes** | Aplicação deliberada com consequências persistentes | Quais efeitos admitem permanência, riscos, reversão, limites |
| **Bálsamos** | **Aplicados a itens**, não são consumidos | Selecionar equipamento/objeto compatível | Material-alvo, slot, desgaste, prazo, compatibilidade |

**A família não é sinônimo de um efeito isolado**: organizar por família é navegação e apresentação; o conteúdo químico/mágico vem dos ingredientes. Uma mistura pode possuir efeitos classificados em mais de uma família.

**[PROPOSTA recomendada] Modelo em três dimensões:**
1. **Composição / efeitos:** resultados íntegros da interseção, com fontes, intensidades e consequências.
2. **Família / veículo de uso:** poção, veneno, tônico, elixir ou bálsamo; influencia recipiente, alvo e forma de aplicação, mas **não apaga** efeitos compartilhados.
3. **Método / instrumento:** procedimentos e ferramentas que permitem preparar um veículo; **não** “purifica” ou altera efeitos automaticamente, a menos que futuramente exista regra aprovada.

**[CANÔNICO — decisão expressa de 03/11/2026] Híbridos, dominância e impureza:** toda mistura híbrida é **classificada e nomeada pelo seu maior efeito**, acrescentando obrigatoriamente o rótulo **«Impuro»**. O efeito dominante governa a família principal de apresentação; **todos os efeitos secundários continuam presentes e ativos**, inclusive os desfavoráveis. Nome e rótulo não purificam nem eliminam propriedades.

**[CANÔNICO — decisão expressa de 03/11/2026] Purificação avançada:** purificar um preparado **Impuro** exige **grande habilidade alquímica**. Purificar é um **processo deliberado e distinto da fabricação**, nunca um botão gratuito, automático ou uma filtragem cosmética da UI. A perícia de alquimia deve representar uma barreira mecânica efetiva.

**[ABERTO — especificar antes de programar]:** o critério **quantitativo de «maior efeito»** depende da fórmula futura de potência (a intensidade I–III dos insumos não foi aprovada como potência final); permanecem pendentes **empates**, o limite exato de perícia, instrumentos, custo, tempo, risco de falha, perda/conservação de efeitos e eventual resíduo de purificação. Não inventar um limiar de nível nem presumir que purificar remove todos os efeitos secundários. Recomenda-se que a marcação **Impuro** apareça sem revelar propriedades ocultas, enquanto a lista dos efeitos segue o conhecimento real de Peren.

**[ABERTO] Classificação semântica dos 53 efeitos:** classificar efeito por natureza, alvo e uso, não apenas por prefixo do ID. `aumentar_*`, `diminuir_*`, `resistencia_*` e efeitos especiais devem ter classificação revisável por dados. Curar, regenerar, aumentar máximo e proteger são comportamentos distintos. Atribuir **permanência** apenas após regra explícita. Vampirismo pode progredir até transformação; não simplificá-lo a roubo de PV.

## 4. Alquimia — conhecimento, estudo e experimentação

### 4.1 Estados de conhecimento [CANÔNICO no conceito]

- **Ingrediente obtido:** Peren sabe que o item existe e o possui; suas propriedades podem estar inteiramente ocultas.
- **Ingrediente estudado:** identifica propriedade(s) progressivamente; não precisa descobrir todas na primeira observação.
- **Efeito conhecido:** aparece na hierarquia de sua família, mesmo sem os insumos disponíveis.
- **Par conhecido:** dois tipos com o mesmo efeito reconhecido podem ser selecionados para produção orientada.
- **Combinação experimentada:** registro factual do teste, incluindo falha e efeitos descobertos, evitando confundir experiência do jogador com dados globais do catálogo.

### 4.2 Dois percursos igualmente legítimos

**Percurso orientado:** `Alquimia → Poções → Aumentar Constituição → dois ingredientes conhecidos → Confirmar`. Se o efeito é conhecido mas faltam duas fontes possuídas, aparece apagado e explica o bloqueio; não some do menu.

**Percurso livre:** `Alquimia → Experimentação livre → escolher dois ou mais tipos → Tentar`. Não listar resultados antes da tentativa, exceto propriedades que Peren já conhece. Se nenhum efeito aparece em pelo menos dois tipos, a fabricação fracassa. Se houver interseções, a mistura produz **todos** os efeitos compartilhados, inclusive positivos e negativos.

**Estudo de ingrediente:** ação própria acessível pela bancada e pelo caderno. Retorna descoberta proporcional ao método/perícia quando houver regra específica. Estudar **não é obrigatório** para tentar misturar.

### 4.3 Escopo de 2–4 ingredientes

- **[CANÔNICO]** No mínimo dois **tipos diferentes** de ingredientes contribuem para cada efeito; repetir exemplares do mesmo tipo não cria segunda fonte.
- **[CANÔNICO]** Com três ou mais tipos, cada efeito é habilitado apenas quando ocorre em **pelo menos dois tipos distintos**; efeitos de ocorrência única não entram.
- **[PROPOSTA]** A interface inicial pode oferecer **2–4 espaços**, conforme a Constituição v1.0 sugere. Limite por bancada, progressão e quantidades ainda **não aprovados**.
- **[PROTÓTIPO]** A PR #94 atualmente calcula apenas dois IDs; estender o motor a N fontes é **P0 antes de declarar paridade constitucional de crafting**.
- Uma mistura pode carregar vários efeitos simultaneamente; ordem dos materiais não muda o conjunto de efeitos. O foco selecionado no menu **não filtra** a composição final.

### 4.4 Regras de custo, falha e descoberta [ABERTAS em números]

- Definir quantidade consumida por tipo, tempo/ações, utensílios, recuperação de materiais, tipos de erro e como o resultado de falhas aparece no caderno.
- **Hipótese vigente na PR #94, não canonizada:** estudar consome uma ação sem destruir ingrediente e revela um efeito; tentar mistura consome uma ação e um exemplar de cada tipo até quando falha.
- Decidir se tentativa fracassada ensina algo verificável (por exemplo, “sem efeito coincidente” entre aqueles materiais) sem revelar efeitos ocultos individualmente.
- Estudo por livros, mestres, experimentação, exploração e observação deve ser conectado à progressão; não limitar permanentemente o aprendizado a um botão.

## 5. Potência, efeitos, instrumentos e progressão

### 5.1 Potência — não fixar fórmula por palpite [ABERTO]

As intensidades de origem I–III são **atributos de cada ingrediente**, não teto de potência final. Comparar por simulação: maior fonte, soma ponderada, sinergia, método do alquimista, qualidade de recipiente, perícia e raridade material **sem assumir** média ou normalização arbitrária.

Para cada hipótese, avaliar ingredientes fortes, combinações multi-efeito, pares fracos, misturas com três ou quatro tipos, repetição da mesma espécie, custo efetivo e eventual exploração econômica. A decisão deve privilegiar coerência e consequências, não neutralização de poder.

### 5.2 Catálogo dos 53 efeitos [P0 para aplicação real]

Especificar ficha por ID: `categoria semântica`, `alvo permitido`, `operação`, `potência`, `duração`, `persistência`, `stacking`, `dissipação`, `resistência`, `interações`, `fontes`, `riscos`, `tratamento` e `feedback ao jogador`. Distinguir especificamente:
- aumentar PV máximo × restaurar PV × regenerar PV;
- causar dano mágico × reduzir reserva máxima de magia × diminuir regeneração;
- aumentar atributo × resistência contra dano × efeito especial;
- doença, intoxicação, maldição e transformação progressiva: estados que podem atravessar turnos e sessões.
Não reduzir o efeito de vampirismo a um buff passageiro; propor e aprovar progressão de exposição, condições, consequências e eventual cura antes de integrá-lo.

### 5.3 Perícia, ferramentas e qualidade [CANÔNICO direção; ABERTO números]

O domínio do ofício, equipamento, procedimentos e qualidade deverão ter impacto **perceptível** na execução. A progressão pode liberar processos, melhorar rendimento, permitir métodos de maior complexidade e revelar propriedades, sem adulterar o catálogo dos ingredientes. Evitar depender apenas de aumentos invisíveis em porcentagem.

## 6. Preparados como objetos utilizáveis

**Problema atual [PROTÓTIPO]:** `brewPair` registra mistura em `character.alchemy.preparations`; não cria objeto com uso operacional completo. Esse registro ainda não equivale a poção/veneno/tônico/elixir/bálsamo consumível, aplicável ou vendável.

**[PROPOSTA] Entidade única de preparo, instanciada a partir de dados canônicos:**
- ID de instância gerado no save Phaser; tipo/veículo (uma das cinco famílias), assinatura de ingredientes e método, autoria/lote e data.
- Lista completa de efeitos, com IDs e intensidades de origem, regra de potência e duração **versionada** quando aprovada.
- Quantidade/porções, alvo/via de uso, validade/estado se houver, histórico de aplicação e estado de consumo.
- Identidade visual selecionada **por família**, não uma arte por receita ou combinação.
- Conhecimento visual: mostrar apenas propriedades identificadas pelo personagem; evitar que inventário/comércio revelem efeitos ocultos no tooltip.
- Contrato de transação: consumir/aplicar uma vez, descontar quantidade, produzir efeitos, persistir alterações, bloquear duplicação após reload.

**[CANÔNICO] Nome e categoria de preparado híbrido:** identificar **o maior efeito** como dominante e usar **«Impuro»** como rótulo obrigatório, por exemplo **«Poção de Aumentar Constituição — Impuro»**, somente quando o efeito dominante determinar a família Poções. Os demais efeitos são preservados na composição e no comportamento. **[ABERTO]** como comparar potência entre efeitos diferentes e como tratar empates. O conhecimento do personagem limita a exibição dos efeitos secundários, sem apagar sua existência. **[CANÔNICO]** o estado Impuro somente é passível de purificação por grande habilidade alquímica; as regras de transformação do preparado ainda serão definidas.

**[ABERTO] Elixires:** persistência, irreversibilidade relativa, custos, restrições, incompatibilidades e sinais de advertência; consequências de transformar alguém não podem nascer de uma simples reclassificação de tônico.

**[ABERTO] Bálsamos:** lista de objetos-alvo, dose, duração/desgaste, interação com encantamentos, possível reaplicação e remoção; nunca permitir beber um bálsamo apenas por estar no inventário.

## 7. Integração com jogo, economia e mundo

- **Inventário:** selecionar preparado, ver propriedades conhecidas, usar/administrar/aplicar, organizar por família, armazenar lotes sem inflar o catálogo JSON.
- **Combate:** usar consumíveis com custo/turno correto, aplicar venenos a alvos elegíveis, resistências e condições; validar efeito sobre jogador e inimigo.
- **Exploração:** cura, mobilidade, visão, respiração aquática, resistências e consequências prolongadas precisam de efeitos fora do combate quando aplicável.
- **Equipamentos:** bálsamos em itens com validade de aplicação e persistência; identificar conflito com encantamentos sem inventar prioridade.
- **Comércio:** o valor do preparado deve refletir materiais, trabalho, raridade e conhecimento; preços/demanda regionais e risco de ciclos artificiais de lucro.
- **Coleta:** material pertence a ecossistemas coerentes da Carcaça; esse fluxo consulta a curadoria sem inventar habitat.
- **Outros ofícios:** gramáticas materiais separadas, tutores, estações, ferramentas e trabalhos progressivos; preservar receitas especiais legadas e não obrigar pesquisa de um efeito químico para forjar equipamento.

## 8. Roadmap de decisões e implementação posterior

| ID | Prioridade | Produto/decisão | Aceite de design | Estado |
| --- | --- | --- | --- | --- |
| **CRAFT-D01** | P0 | Definir árvore global das sete oficinas e breadcrumb | Nenhuma lista plana, estações por cidade, caminhos orientado e livre | **Design proposto / parcialmente confirmado** |
| **CRAFT-D02** | P0 | Alquimia: cinco famílias → efeitos → ingredientes | Poções/Venenos/Tônicos/Elixires/Bálsamos com semânticas distintas | **Conceito aprovado; uso completo pendente** |
| **CRAFT-D03** | P0 | Conhecimento e descoberta sem spoilers | Estudo, mistura cega, preparação guiada, efeito indisponível visível | **Conceito aprovado; UI prototipada na PR #94** |
| **CRAFT-D04** | P0 | Misturas híbridas e N fontes | Todos os efeitos compartilhados preservados; 3–4 tipos aceitos por efeito | **Lei constitucional; generalização pendente** |
| **CRAFT-D05** | P0 | Modelo do preparado e aplicação | Item real no inventário, com efeitos e quantidade atômicos | **Proposta estrutural** |
| **CRAFT-D06** | P0 | Semântica de 53 efeitos | Alvos, estados, potência, duração, dissipação, empilhamento definidos/testáveis | **A especificar** |
| **CRAFT-D07** | P0 | Elixires, bálsamos, doenças e vampirismo | Permanência/aplicação/riscos aprovada antes de ligar motor | **A especificar** |
| **CRAFT-D14** | P0 | Efeito dominante, rótulo «Impuro» e purificação avançada | Híbridos recebem nome do maior efeito + Impuro; nenhuma propriedade some automaticamente; purificação exige alta perícia e regras explícitas | **Regra aprovada; fórmula de dominância e parâmetros de purificação abertos** |
| **CRAFT-D08** | P0 | Interface de receitas especiais legadas | Árvore separada por tipo/projeto; nenhuma receita perdida | **Requisito confirmado; protótipo na PR #94** |
| **CRAFT-D09** | P1 | Progressão dos ofícios e instrumentos | Diferenças perceptíveis, sem nerf dos ingredientes | **Direção constitucional; números abertos** |
| **CRAFT-D10** | P1 | Economia e receitas negociáveis | Custos, preços, disponibilidade regional e exploit tests | **Direção constitucional; regras abertas** |
| **CRAFT-D11** | P1 | Acessibilidade e controles | Mobile/desktop/gamepad com estados não dependentes só de cor | **Proposta para QA** |
| **CRAFT-D12** | P0 release | Publicação em prévia Phaser isolada | Build + CI + Pages real + cache/save seguros + aprovação de promoção quando aplicável | **Não publicado** |
| **CRAFT-D13** | P1 | Outros ofícios com criação livre própria | Regras materiais por estação, sem receita universal arbitrária | **Proposta / detalhar por ofício** |

### Sequência de trabalho recomendada

**Onda A — design jogável mínimo:** D01–D04. Prototipar menu por família/efeito; generalizar insumos a 2–4 tipos sem mudar regras canônicas; estudar e experimentar; preservar receitas legadas.

**Onda B — significado do resultado:** D05–D07 e D14. Definir potência/duração e o contrato de preparado; implementar uso e efeito real, inclusive híbridos, persistência e classes extraordinárias.

**Onda C — identidade dos ofícios:** D08–D10 e D13. Manter produção especial, criar gramáticas livres por estação e integrar qualidade, perícia, economia e recursos.

**Onda D — experiência e publicação:** D11–D12. Testar mobile/teclado/gamepad, promover build isolado e só depois considerar alterar a página pública principal.

## 9. Cenários de aceitação de design / QA

- **AQ-01:** o personagem inicia sem saber os atributos; a árvore não vaza efeitos ocultos; pode selecionar qualquer par possuído em experimentação.
- **AQ-02:** estudar um ingrediente revela uma propriedade conforme a regra do estudo; não revela o parceiro e não é requisito para experimentar.
- **AQ-03:** um efeito conhecido sem dois insumos viáveis aparece cinza/opaco **e explica o motivo**, sem desaparecer.
- **AQ-04:** efeito conhecido e fabricável aparece iluminado com indicação textual.
- **AQ-05:** A+B e B+A produzem os mesmos efeitos, fontes e intensidades; nenhum ingrediente repetido como “segunda espécie”.
- **AQ-06:** A+B+C (ou D) ativa **cada efeito** com duas ou mais fontes distintas, incluindo efeitos de famílias diferentes; nenhum efeito com uma única fonte é ativado.
- **AQ-07:** mistura positiva+negativa preserva ambos efeitos, qualquer que seja o caminho de menu.
- **AQ-08:** sem efeito compartilhado não criar produto; custos/feedback de falha seguem a regra numérica **registrada**, não palpite.
- **AQ-09:** uma preparação produzida gera objeto identificável, utilizável ou aplicável, não apenas linha no diário.
- **AQ-10:** poção, veneno, tônico, elixir e bálsamo se comportam de forma diferente; elixir não ganha permanência automática e bálsamo não pode ser bebido.
- **AQ-11:** aplicações afetam corretamente personagem/alvo/item, persistem quando aplicável, e não se duplicam após reload.
- **AQ-12:** receitas especiais tradicionais, fórmulas de forja/cozinha/joalheria/escrita/encantamento/curtume e seus itens permanecem acessíveis.
- **AQ-13:** catálogo preserva IDs, 111 ingredientes e 53 efeitos da linha de base **sem congelar números futuros**; nenhuma Stamina; nenhuma regressão na arte.
- **AQ-14:** menu é legível em celular, acionável por teclado e gamepad e mostra as condições de bloqueio além da cor.
- **AQ-15:** build e serviço offline funcionam na rota Phaser isolada no Pages, sem limpar saves/cache do clássico; teste de CI **não substitui** navegação na URL publicada.
- **AQ-16:** mistura híbrida recebe o rótulo **Impuro** e o nome do **efeito dominante**; mantém todos os efeitos da composição em cálculos e efeitos reais, sem apagar os desfavoráveis.
- **AQ-17:** purificação não pode ser executada por personagem sem a habilidade alquímica exigida (limiar futuro); não ocorre silenciosamente na fabricação e não modifica a curadoria canônica.
- **AQ-18:** teste de efeitos de mesma potência não atribui arbitrariamente um «maior efeito»; desempate depende de regra explícita ainda pendente, sem classificar diferentemente A+B e B+A.

## 10. Decisões ainda abertas — pauta curta para próximos debates

1. **Método e família:** o híbrido já é nomeado pelo maior efeito + **Impuro** (decisão aprovada). Resta decidir **quando** o veículo de uso é escolhido, como identificar o maior efeito e como resolver empates.
2. **Potência:** como combinar intensidade I–III das fontes, quantidade usada, qualidade do instrumento e perícia, inclusive 3–4 tipos?
3. **Custo de tentativa e estudo:** consumir ação/ingrediente em sucesso, falha e pesquisa? Como traduzir falha parcial?
4. **Conhecimento:** ordem de efeitos revelados, progressão de estudo, livros, mestres e lembrança de combinações.
5. **Duração e stacking:** duração por família e por efeito, anulação/contradição e persistência fora do combate.
6. **Elixires:** quais efeitos podem ser permanentes, preço de transformação, riscos, reversão, consentimento de aplicação em alvos.
7. **Bálsamos:** itens-alvo, duração, desgaste e relação com encantamentos.
8. **Produção livre dos demais ofícios:** gramática de materiais e requisitos por estação, sem gerar produtos impossíveis.
9. **Economia:** preços de preparados multiefeito, receitas vendáveis, regionalidade, raridade e fraudes/arbitragem.
10. **Interface de 2–4 fontes:** quantidade de espaços inicial, desbloqueio de ferramentas e comportamento de toque/controle.
11. **Purificação avançada:** mínimo de perícia, equipamentos de laboratório, custo material, risco, qualidade, efeito escolhido e destino dos efeitos secundários retirados/isolados (sem apagar efeitos na fabricação normal).

**Regra de decisão:** aplicar livremente protótipos reversíveis em branch isolada; nenhum número, transformação irreversível, mudança cosmológica, regra de permanência ou promoção para Pages é aprovado apenas porque consta aqui como proposta. Para temas já fixados pela Constituição, o trabalho é de detalhamento/implementação, **não** novo voto.

## 11. Handoff para continuidade entre chats e ciclos

1. **Ler nesta ordem:** Constituição v1.0 → este roadmap → [contrato de bancada da PR #94](https://github.com/pedromaintenance/peren-o-bruxo/blob/transition/phaser-only-m0-20261030/docs/contrato-bancada-alquimica.md) → [plano técnico de alquimia](plano-alquimia-gameplay-v1.md) → auditoria de ingredientes atual.
2. Verificar **sempre a `main` atual** e o estado da PR #94; documentação de ciclo 29/34 não substitui as decisões posteriores até o ciclo 38 (ou o mais recente).
3. **Não presumir que a fonte Phaser está em `main`**: a PR #94 é protótipo em branch e a `main` mantém `phaser-demo-m1hf/` compilado. Diferenciar design, fonte, teste, build e Pages.
4. **Não migrar saves clássicos** nesta pré-alfa; preservar chaves existentes, sem apagar dados de usuário. Não modificar `game.js`, `data/receitas.json` ou atributos curados sem necessidade e autorização explícita.
5. Não interpretar grupos de receitas como uma fórmula universal para todos os ofícios. Alquimia usa interseção por efeito; outros ofícios exigem suas regras materiais.
6. Antes de qualquer entrega de código: registrar qual **CRAFT-Dxx** foi abordado, hipótese numérica, testes e compatibilidade; após, atualizar estado e evidência de commit/QA. Não marcar como publicado sem testar a URL real do Pages.
7. **Marcos para a próxima conversa:** primeiro fechar D04 (2–4 fontes), D05 (instância do preparado), D06 (catálogo de efeitos) e **D14 (dominância, Impuro e purificação)**; então integração com inventário, combate, exploração e produção nos outros ofícios. **Não voltar a discutir se híbridos devem ser rotulados como Impuro; isso foi aprovado.**
8. **Auditoria independente:** não misturar esse fluxo com o trabalho editorial em `docs/curadoria-itens-consistencia-carcaca.md`; ajustes curatoriais devem aparecer como changelog/commit de dados.

## 12. Histórico do roadmap

- **03/11/2026 · v1.0:** consolidadas as leis da Constituição, cinco famílias, hierarquia de menus, experimentação livre, estudo, misturas híbridas, proposta de três dimensões, integração dos ofícios, backlog D01–D13, 15 testes de aceitação e handoff. **Somente documentação**, sem alterações em código, catálogo, saves ou Pages.

- **03/11/2026 · decisão complementar v1.1:** híbridos são identificados pelo **maior efeito + Impuro**; purificação é uma técnica **avançada** e requer grande habilidade alquímica. Registradas pendências de potência comparativa, empates, custo, instrumentos, limiar de perícia e destino dos efeitos secundários. Acrescentados CRAFT-D14 e AQ-16–AQ-18. **Apenas documentação; sem alteração de gameplay, atributos ou catálogo.**


## 13. Proposta de progressão e purificação — v1.2 (03/11/2026)

**Natureza:** [PROPOSTA] — não altera a Constituição, a curadoria ou os motores. [CANÔNICO] continua sendo somente: todo híbrido recebe nome do maior efeito + Impuro; purificação exige grande habilidade alquímica; a fabricação não elimina efeitos secundários.

### A maestria usa a habilidade Alquimia existente

O clássico e o Phaser já possuem nível de perícia de 1–100, calculado sobre pontos acumulados; o clássico também possui tutores pagos. Não criar uma segunda perícia. Faixas para **teste**, não aprovadas:

| Alquimia | Grau proposto | Desbloqueio em estudo |
| --- | --- | --- |
| 1–24 | Aprendiz das Essências | Estudar, experimentar dois tipos, caderno |
| 25–49 | Praticante | Analisar efeitos conhecidos, possível terceiro tipo |
| 50–74 | Especialista | Diagnosticar impurezas, possível quarto tipo, preparar instrumental |
| 75–100 | Mestre da Retificação | Elegível a aprender purificação, com condições adicionais |

O nível **75** é hipótese; comparar alternativas **65/75/85** frente ao esforço real para alcançar cada faixa. A maestria não deve exigir apenas repetição mecânica: descoberta inédita, estudo, mestres e novos processos devem produzir progressão perceptível, sem reduzir a potência dos ingredientes.

### Retificação — uma bancada dentro da Alquimia

**Caminho [PROPOSTA]:** `Alquimia → Retificação → escolher preparado Impuro → examinar efeitos conhecidos → selecionar propriedade secundária → confirmar custos e riscos → resultado`.

**Portas de acesso [PROPOSTA]:** alta perícia + técnica aprendida de um mestre/texto + instrumentos especializados + conhecimento suficiente dos efeitos a separar. Se faltar alguma condição, a interface deve explicar e manter a ação bloqueada.

**Operação candidata:** conservar o efeito dominante e separar **um efeito secundário identificado por operação**. Os outros efeitos persistem; se a mistura continuar híbrida, mantém o rótulo Impuro. Se restar um único efeito, perde a marca Impuro. Nenhum efeito é automaticamente suprimido na fabricação, e nenhuma potência aumenta gratuitamente. Custos, subprodutos, instrumentos, risco de falha e consequência do erro **não foram aprovados**.

**Informação oculta:** a UI não revela propriedades desconhecidas ao classificar um preparado como Impuro. Se o efeito dominante ainda não foi identificado, uma identificação provisória do tipo `Preparado Impuro — efeito principal desconhecido` é preferível ao spoiler.

**Empate de potência [PROPOSTA]:** depois de fixar uma regra de potência, quando dois efeitos forem igualmente dominantes, o jogador poderá escolher entre os empatados identificados. Antes da identificação, usar apresentação sigilosa; nunca decidir pelo ingrediente selecionado primeiro.

**Questão aberta:** definir operacionalmente se todo preparo com dois ou mais efeitos é Impuro, ou somente uma mistura que reúna famílias/direções diferentes. A emenda constitucional fixa o tratamento dos híbridos, mas não resolve essa fronteira.

### Backlog e aceites adicionais

- **CRAFT-D15 [P1 design / P0 antes de implementar]:** aprovar faixas de maestria, progressão por estudo e tutores, técnica de retificação, bancada, instrumentos e custos.
- **AQ-19:** jogador sem requisitos vê Retificar bloqueado e não perde recursos.
- **AQ-20:** o mestre pode examinar preparado Impuro e escolher um efeito secundário identificado; propriedades ocultas não vazam para a UI.
- **AQ-21:** retificação é transação atômica sobre uma instância de preparado, sem duplos usos, duplicação ou alteração do catálogo original.
- **AQ-22:** em empate, a ordem A+B não define indevidamente o efeito dominante.

**Próximo debate:** escolher o limiar real de perícia e a definição de híbrido; depois desenhar custos, riscos e resultados da retificação. **Estado: proposta documentada, não implementada, não publicada.**
