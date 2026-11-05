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

**[CANÔNICO — Emenda A2, 03/11/2026] Compatibilidade, dominância e combos:** múltiplos efeitos não implicam Impuro. **Incompatibilidades aprovadas** exigem o rótulo **Impuro**; sinergias aprovadas dão **nome especial** (ex.: Poção da Fada); efeitos compatíveis sem sinergia ficam com o **nome do efeito mais intenso** e os demais na descrição. **Todos os efeitos permanecem ativos**, mesmo em misturas Impuras.

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

**[CANÔNICO — Emenda A2] Identidade de preparo multiefeito:** (1) efeito incompatível aprovado → **Impuro**, identificado pelo efeito dominante; (2) combinação de efeitos sinérgicos aprovados e sem incompatibilidade → **nome de combo**; (3) múltiplos efeitos compatíveis não catalogados como sinergia → **nome do efeito mais intenso**, secundários na descrição, sem Impuro. **[ABERTO]** potência comparável e empates. Propriedades desconhecidas não são reveladas ao personagem, mas todos os efeitos persistem. Purificação avançada é pertinente **somente aos Impuros**.

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
| **CRAFT-D14** | P0 | Incompatibilidade, rótulo «Impuro» e purificação avançada | Só efeitos incompatíveis produzem Impuro; nenhum efeito some automaticamente; purificação exige alta perícia | **Emenda A2 aprovada; potência e parâmetros abertos** |
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
- **AQ-16 [corrigido por A2]:** misturas com **incompatibilidades aprovadas** recebem **Impuro** e nome do efeito dominante; misturas compatíveis não recebem Impuro por quantidade de efeitos; todos os efeitos são preservados.
- **AQ-17:** purificação não pode ser executada por personagem sem a habilidade alquímica exigida (limiar futuro); não ocorre silenciosamente na fabricação e não modifica a curadoria canônica.
- **AQ-18:** teste de efeitos de mesma potência não atribui arbitrariamente um «maior efeito»; desempate depende de regra explícita ainda pendente, sem classificar diferentemente A+B e B+A.

## 10. Decisões ainda abertas — pauta curta para próximos debates

1. **Método e família:** a Emenda A2 fixa que apenas **incompatíveis** são Impuros e só **sinergias catalogadas** são combos. Resta decidir veículo de uso, comparação de potências e empates.
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
7. **Marcos para a próxima conversa:** primeiro fechar D04 (2–4 fontes), D05 (instância do preparado), D06 (catálogo de efeitos) e **D14 (dominância, Impuro e purificação)**; então integração com inventário, combate, exploração e produção nos outros ofícios. **Observação histórica superada pela Emenda A2:** nem todo multiefeito é Impuro; somente incompatibilidades aprovadas justificam a classificação.
8. **Auditoria independente:** não misturar esse fluxo com o trabalho editorial em `docs/curadoria-itens-consistencia-carcaca.md`; ajustes curatoriais devem aparecer como changelog/commit de dados.

## 12. Histórico do roadmap

- **03/11/2026 · v1.0:** consolidadas as leis da Constituição, cinco famílias, hierarquia de menus, experimentação livre, estudo, misturas híbridas, proposta de três dimensões, integração dos ofícios, backlog D01–D13, 15 testes de aceitação e handoff. **Somente documentação**, sem alterações em código, catálogo, saves ou Pages.

- **03/11/2026 · decisão complementar v1.1:** híbridos são identificados pelo **maior efeito + Impuro**; purificação é uma técnica **avançada** e requer grande habilidade alquímica. Registradas pendências de potência comparativa, empates, custo, instrumentos, limiar de perícia e destino dos efeitos secundários. Acrescentados CRAFT-D14 e AQ-16–AQ-18. **Apenas documentação; sem alteração de gameplay, atributos ou catálogo.**


## 13. Proposta de progressão e purificação — v1.2 (03/11/2026)

**Natureza:** [PROPOSTA] — não altera a Constituição, a curadoria ou os motores. **Correção canônica A2:** apenas efeitos incompatíveis geram Impuro; sinergias reconhecidas geram combos, e múltiplos efeitos compatíveis são comuns. Purificação dos Impuros exige grande habilidade; fabricação não elimina efeitos secundários.

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

**Operação candidata:** conservar o efeito dominante e separar **um efeito secundário identificado por operação**. Os outros efeitos persistem; **o rótulo Impuro permanece apenas enquanto houver alguma incompatibilidade ativa**. Se não houver incompatibilidade, o resultado pode ser um combo catalogado ou uma mistura comum, mesmo com dois efeitos. Nenhum efeito é automaticamente suprimido na fabricação, e nenhuma potência aumenta gratuitamente. Custos, subprodutos, instrumentos, risco de falha e consequência do erro **não foram aprovados**.

**Informação oculta:** a UI não revela propriedades desconhecidas ao classificar um preparado como Impuro. Se o efeito dominante ainda não foi identificado, uma identificação provisória do tipo `Preparado Impuro — efeito principal desconhecido` é preferível ao spoiler.

**Empate de potência [PROPOSTA]:** depois de fixar uma regra de potência, quando dois efeitos forem igualmente dominantes, o jogador poderá escolher entre os empatados identificados. Antes da identificação, usar apresentação sigilosa; nunca decidir pelo ingrediente selecionado primeiro.

**Definição fechada pela Emenda A2:** dois ou mais efeitos, por si só, **não** constituem impureza. O catálogo de incompatibilidades é a referência; classificar automaticamente todo par positivo+positivo como Impuro é incorreto. Os casos específicos além dos exemplos aprovados requerem curadoria.

### Backlog e aceites adicionais

- **CRAFT-D15 [P1 design / P0 antes de implementar]:** aprovar faixas de maestria, progressão por estudo e tutores, técnica de retificação, bancada, instrumentos e custos.
- **AQ-19:** jogador sem requisitos vê Retificar bloqueado e não perde recursos.
- **AQ-20:** o mestre pode examinar preparado Impuro e escolher um efeito secundário identificado; propriedades ocultas não vazam para a UI.
- **AQ-21:** retificação é transação atômica sobre uma instância de preparado, sem duplos usos, duplicação ou alteração do catálogo original.
- **AQ-22:** em empate, a ordem A+B não define indevidamente o efeito dominante.

**Próximo debate:** definir limiar real da perícia, regras de dominância e critérios de sinergia/incompatibilidade restantes; depois custos e riscos da retificação. **Estado: proposta documentada, não implementada, não publicada.**

## 14. Sinergias e combos catalogados — Emenda A2 (03/11/2026)

**[CANÔNICO] Uma combinação não se torna Impura por ter dois ou mais efeitos.** A regra anterior de “qualquer híbrido = Impuro” foi expressamente revogada pela [Emenda A2](constituicao-design-v1.md). Compatibilidade e sinergia são conceitos distintos:

| Situação | Classificação | Nome e apresentação |
| --- | --- | --- |
| Efeitos **incompatíveis** expressamente catalogados | **Impuro**, ainda que também exista uma sinergia | Nome do efeito mais intenso **+ Impuro**, efeitos restantes preservados |
| Efeitos **sinérgicos** reconhecidos, **sem incompatibilidade** | **Combo / preparado especial** | Nome autoral do combo (ex.: **Poção da Fada**) |
| Efeitos **compatíveis**, mas sem sinergia reconhecida | Mistura comum multiefeito, **não Impura** | Nome do efeito mais intenso; demais efeitos reais na descrição |
| Único efeito ativado | Preparado comum | Nome do próprio efeito |

**Exemplos aprovados pelo criador:**
- `aumentar_carisma` + `diminuir_forca`: **Impuro** pela incompatibilidade entre fortalecimento social e debilitação física.
- `aumentar_carisma` + `aumentar_ilusao`: sinergia chamada **Poção da Fada**. Não é Impura por possuir dois benefícios.
- `aumentar_forca` + `resistencia_eletricidade`: **compatível, sem sinergia nomeada**. Nome pelo efeito dominante (potência final a definir), outro efeito na descrição. **Não inventar nome especial apenas porque há dois benefícios.**

**[CANÔNICO] A fabricação é exatamente a mesma da alquimia comum:** materiais distintos → calcular todos os efeitos com pelo menos duas fontes distintas por efeito → classificar o **conjunto de efeitos ativados**. Combo **não é receita especial**, não exige componente fixo, não substitui `receitas.json`, não apaga efeitos extras e não concede automaticamente bônus mecânico adicional.

**Teste combinatório real da curadoria (não receita fixa):** `ing-dragon-s-tongue` (Língua-de-Dragão), `ing-daedra-heart` (Coração de Demônio) e `ing-nightshade` (Beladona) são três tipos que, juntos, ativam `aumentar_carisma` (primeiros dois), `aumentar_ilusao` (primeiro e terceiro) e `aumentar_magia` (segundo e terceiro). Portanto, **Poção da Fada deve ser identificada pela presença dos dois efeitos sinérgicos**, mesmo quando há outro efeito compatível adicional. **A PR #94 ainda aceita apenas dois tipos**, logo esse caso é futuro teste do motor de 3+ tipos, não indicação de que já seja fabricável no Pages.

### 14.1 Catálogo de interações e arte futura

**Fonte de registro (sem uso automático em gameplay):** [`data/catalogo-combos-alquimicos.json`](../data/catalogo-combos-alquimicos.json). **Atribuições:**
- `sinergias[]`: ID estável do combo, `nome`, IDs de efeitos necessários, justificativa material/mágica, estado editorial, descrição, efeitos adicionais possíveis, assinatura de ativação, proposta de apresentação e **reserva de identidade visual**.
- `incompatibilidades[]`: assinatura de IDs, motivo da contradição, classificação Impuro, decisão e proveniência.
- `exemplos_sem_sinergia_nomeada[]`: referências negativas para o agente não inventar nomes de todo multiefeito.
- `visual`: família-base, chave estável para asset/efeito de pós-processamento, status de arte, **animação futura** (briefing, quadros/duração quando aprovados); **nenhuma animação ou sprite foi produzido ainda**.
- **Curadoria dos combos** trata a relação entre **efeitos**, não entre pares de ingredientes; nunca registrar dezenas de cópias da Poção da Fada por rota de fabricação.

**Relação entre descoberta e menus [PROPOSTA]:** na primeira fabricação ou identificação de uma sinergia, o Caderno do Bruxo registra o **combo conhecido** como descoberta; a tela `Alquimia → Poções → Combos descobertos` destaca sua identidade e, quando houver asset, animação própria ou sobreposta. Não revelar o nome antes da descoberta do personagem. O jogo pode usar o sprite normal de poção enquanto não existe arte exclusiva de combo.

**Ordem de decisão canônica:** `efeitos realmente ativados → incompatibilidades catalogadas? Impuro : sinergias catalogadas? nome especial : nome do maior efeito`. A “Poção da Fada” não neutraliza uma incompatibilidade extra que apareça numa mistura mais complexa. O catálogo cresce por curadoria rastreável; **não concluir sinergia apenas porque ambos são benéficos**.

### 14.2 Handoff obrigatório à auditoria de ingredientes

O [roadmap de curadoria](curadoria-itens-consistencia-carcaca.md) e o [plano do agente de auditoria](plano-alquimia-gameplay-v1.md) recebem a tarefa de examinar pares/conjuntos de **efeitos** quanto a compatibilidade, sinergia e oposição, sem modificar atributos dos ingredientes por conveniência de criar combos.

O agente de itens deverá registrar **ID dos efeitos, nome/descrição, razão da sinergia, caso de uso, evidência/lore, decisão editorial, vínculo aos ingredientes apenas como exemplos, estado de produção visual e chave estável de animação**. Candidatos ainda não aprovados são `proposto`; somente `aprovado` participa do registro canônico. A criação de um nome não autoriza efeitos novos, potência adicional ou alterações no motor.

### 14.3 Backlog e critérios de aceite

- **CRAFT-D16 [P0 design]:** reconciliar classificação de Impuro, combos sinérgicos e misturas comuns com a Emenda A2; integrar consulta futura ao catálogo de IDs de efeitos sem criar receitas especiais.
- **CRAFT-D17 [P1 design/arte]:** catálogo durável das poções especiais com ID, assinatura, nome, descrição, proveniência, parâmetros visuais e contrato de animação futura.
- **AQ-23:** dois efeitos benéficos compatíveis sem sinergia nomeada → mistura comum, nome do dominante + secundários na descrição, sem Impuro.
- **AQ-24:** presença de `aumentar_carisma` + `aumentar_ilusao` sem incompatibilidade → **Poção da Fada**; reconhecer com 3+ ingredientes, sem exigir receita fixa.
- **AQ-25:** presença de `aumentar_carisma` + `diminuir_forca` → **Impuro**; preservar ambos, independentemente de outras sinergias possíveis.
- **AQ-26:** combo nomeado mantém efeitos extras compatíveis; sem bônus mecânico, nome, sprite ou animação inventados fora do registro aprovado.
- **AQ-27:** o catálogo distingue `aprovado` de `proposto`, e um registro visual sem sprite ainda utiliza corretamente o recurso por família.

**Próximo ciclo de design:** decidir procedimento de curadoria de **novos nomes sinérgicos** e como comunicar combos descobertos na UI. O limiar de proficiência para purificação continua assunto apenas de misturas **incompatíveis**.

## 15. Curadoria de sinergias — protocolo de avaliação e descoberta (03/11/2026)

> **Estado:** proposta de método e análise exploratória. A **Emenda A2** fixa apenas as diferenças entre **Impuro**, **sinergia nomeada** e **multiefeito comum**. Os nomes a seguir **não** são automaticamente aprovados.

### 15.1 Filtro antes de dar nome a um combo

Aplicar as verificações nesta ordem, sem transformar coincidência em suposta causalidade:

1. **Factibilidade material [obrigatória]:** conferir no `data/curadoria_ingredientes.json` que cada efeito da assinatura nasce de **dois tipos distintos**; exemplos podem exigir 2, 3 ou 4 tipos. A assinatura é de **efeitos ativos**, e o exemplo de insumos **não** é receita fixa.
2. **Complementaridade funcional [obrigatória para propor nome]:** os efeitos fortalecem um mesmo objetivo ou atuam como etapas de um processo identificável (ex.: alcance visual + percepção, voo + velocidade). Uma lista de dois benefícios independentes não passa nesse critério.
3. **Identidade temática [obrigatória]:** justificar em uma ou duas frases *por que* o conjunto merece identidade autoral. Não basta “soam mágicos juntos”; o nome deve comunicar a função e pertencer à Carcaça sem inventar cosmologia, bioma ou criatura.
4. **Análise de incompatibilidade [obrigatória]:** conferir o catálogo de incompatibilidades **aprovadas**. Havendo conflito, **Impuro** tem precedência mesmo que um subconjunto de efeitos seja sinérgico. Não inferir que todo positivo+negativo é incompatível, nem que todo positivo+positivo é combo.
5. **Sem efeitos extras automáticos [obrigatória]:** um nome bonito, uma sinergia e um visual diferenciado **não** criam nova potência, duração, resistência ou efeito. Esses elementos exigiriam decisão própria.
6. **Qualidade de apresentação [diferencial]:** nome pronunciável, descrição curta, função legível no inventário, identidade visual distinta e potencial para uma animação de poucos quadros; a arte **não é requisito para validar** a sinergia.

**Resultado editorial:** `aprovado` (decisão expressa do criador) / `proposto_nao_aprovado` (pesquisa candidata) / `rejeitado` (decisão documentada) / `nao_avaliado` (não presumir classificação). A fonte de execução só poderá consumir aprovações, não candidatos.

### 15.2 Primeira carteira de candidatos — verificação real de efeitos

O catálogo [`data/catalogo-combos-alquimicos.json`](../data/catalogo-combos-alquimicos.json) contém oito candidatos **ainda não canônicos**, com IDs, exemplo de materiais, efeitos realmente ativados e briefing de animação. As quantidades abaixo são o **mínimo de tipos no exemplo pesquisado**, não o limite final para todos os preparos.

| Nome candidato | Efeitos sinérgicos propostos | Tipos de ingredientes no exemplo | Parecer inicial |
| --- | --- | ---: | --- |
| **Asas do Vendaval** | `voar` + `velocidade` | 3 | Forte: deslocamento aéreo acelerado |
| **Olhos da Vigília** | `aumentar_percepcao` + `visao_a_distancia` | 3 | Forte: observação e alcance visual |
| **Nascente Arcana** | `aumentar_magia` + `regenerar_magia` | 3 | Forte: reserva e regeneração arcana |
| **Véu do Caçador** | `invisibilidade` + `aumentar_furtividade` | 4 | Forte: ocultação e discrição |
| **Seiva Vital** | `restaurar_saude` + `regenerar_saude` | 4 | Forte: recuperação imediata e contínua |
| **Fôlego das Profundezas** | `respirar_na_agua` + `resistencia_gelo` | 4 | **Condicional:** pode ser apenas soma de dois benefícios de viagem; não presumir relação geográfica |
| **Silêncio do Feiticeiro** | `dano_magia` + `diminuir_magia` | 3 | Forte: ameaça à reserva mágica em duas dimensões |
| **Veneno da Ruína** | `dano_saude` + `fraqueza_veneno` | 2 | **Condicional:** `dano_saude` ainda não está tipado como dano venenoso; não pressupor amplificação |

**Controle negativo obrigatório:** `aumentar_forca` + `resistencia_eletricidade` continua preparado multiefeito compatível **sem sinergia nomeada**, conforme a decisão do criador. **Controle positivo aprovado:** `aumentar_carisma` + `aumentar_ilusao` → **Poção da Fada**. **Controle de incompatibilidade aprovado:** `aumentar_carisma` + `diminuir_forca` → **Impuro**.

### 15.3 Descoberta e menus de combos [PROPOSTA]

**Não criar uma nova estação ou um botão de “fabricar combo”.** A descoberta deve surgir **após** a mesma transação de preparo normal:

`Escolher ingredientes → preparar → calcular todos os efeitos → verificar incompatibilidades aprovadas → verificar combos aprovados → descobrir/identificar nome → registrar no Caderno`.

- **Primeira descoberta:** mostrar uma pequena faixa *“Nova combinação reconhecida: [nome do combo]”*, com nome e efeito visual só se o personagem descobriu os efeitos necessários. Nunca anunciar um candidato `proposto_nao_aprovado` nem revelar propriedades ocultas antes da experiência.
- **Caderno do Bruxo:** submenu `Alquimia → Combos descobertos` como **índice de conhecimento**, organizado por família e nome; cada entrada mostra assinatura de efeitos conhecidos, descrição, possíveis fontes conhecidas e preparações já produzidas. **Não se converte em receita fixa por par.**
- **Produção orientada:** ao selecionar combo descoberto, filtrar fontes **já conhecidas** de cada efeito, mostrando que o ingrediente precisa participar de um conjunto em que **cada efeito obtenha duas fontes**. Não mostrar a terceiros ou ao jogador informações ocultas.
- **Misturas com efeitos extras:** conservar propriedades fora do combo; se houver incompatibilidade aprovada em qualquer par ativo, a preparação recebe **Impuro**, e a identidade do combo pode permanecer registrada como detalhe, sem mascarar riscos.
- **Múltiplos combos aprovados simultaneamente [ABERTO]:** não escolher arbitrariamente o primeiro elemento do JSON. Estudar regra de prioridade explícita ou apresentação de múltiplos títulos; preservar todas as assinaturas detectadas sem sobrescrever dados.
- **Identificação visual:** nome especial é metadado do produto e do caderno; **arte base continua por família**. Reservar `visual.chave_reservada` / `visual_proposto.chave_sugerida`, sobreposição e `animacao.estado`, mas apenas o combo aprovado recebe identidade visual prioritária. No mobile, partículas e efeitos não podem impedir leitura ou interações.
- **Não assumir “Poção” para todos os combos:** a forma de apresentação segue a família de uso aprovada (venenos e tônicos também podem ter sinergias); elixires/bálsamos ainda dependem de regras próprias.

### 15.4 Handoff e critérios de aceite

**Para curadoria:** consultar as propostas, marcar parecer fundamentado e elevar à aprovação as melhores, **sem alterar os 111 ingredientes** para forçar um combo. Para gameplay: projetar a camada classificadora consultando apenas sinergias aprovadas; não implementar novas propriedades ou custos para combos por sugestão de catálogo.

- **CRAFT-D18 [P0 design]**: validar protocolo de sinergia com exemplos positivos, negativos, triviais e ambíguos; documentar aprovação e proveniência.
- **CRAFT-D19 [P1 UX]**: caderno de combos descobertos, feedback de descoberta e reserva de identidade visual/efeito de animação, sem vazamento de propriedades ocultas.
- **AQ-28**: `proposto_nao_aprovado` não aparece com nome de combo no inventário nem recebe asset exclusivo; o material continua sendo fabricável pela regra comum.
- **AQ-29**: combo aprovado é identificado com 3–4 tipos, mesmo com efeitos adicionais, e o nome não depende da ordem de seleção dos materiais.
- **AQ-30**: incompatibilidade aprovada tem precedência sobre qualquer nome especial; não elimina os efeitos sinérgicos da composição.
- **AQ-31**: misturas sem sinergia classificada são comuns (não automaticamente Impuras); nome do dominante quando potência comparável estiver definida; efeito secundário disponível na descrição conforme o conhecimento.
- **AQ-32**: cadastro de animação com `estado=nao_produzido` recai no visual-base por família; não há erro de asset ausente ou alegação de animação publicada.

**Status em 03/11/2026:** 1 sinergia aprovada (**Poção da Fada**), 8 candidatos propostos, 1 incompatibilidade aprovada e 1 caso compatível sem nome especial. **Somente metadados e documentação; nenhuma animação, alteração de motor ou publicação da nova bancada.**

## 16. UX da primeira descoberta e do Caderno — fluxo de revisão (03/11/2026)

**Especificação principal desta etapa:** [`docs/ux-descoberta-combos-caderno-v1.md`](ux-descoberta-combos-caderno-v1.md). **Protótipo navegável, isolado e não jogável:** [PR #95 — Design UX](https://github.com/pedromaintenance/peren-o-bruxo/pull/95), arquivo `prototipos/ux-combos-caderno-v1.html` na branch `design/ux-combos-caderno-v1-20261103`. **NÃO mesclar automaticamente nem publicar como runtime Phaser.**

**Direção proposta da interface:** a fabricação normal gera todos os efeitos; a classificação consulta apenas incompatibilidades/sinergias **aprovadas**; a primeira **sinergia reconhecida por Peren** apresenta um resultado com nome especial e registra a descoberta **uma vez por ID de combo**, sem bônus extra. Repetir com outros materiais gera outro lote, não uma nova identidade. `Caderno do Bruxo → Alquimia → Combos Descobertos` mostra apenas combos conhecidos do personagem, não as propostas editoriais. Poções comuns e Impuras continuam nos fluxos normais e não podem ganhar nome especial por engano.

**Caderno e arte futura:** separar catálogo **global/editorial** (`data/catalogo-combos-alquimicos.json`, com proposta/aprovação) do **conhecimento pessoal** de Peren no save Phaser. Identificar por `comboId`, não por fórmula de ingredientes. Efeitos ocultos não vazam por menu, rótulo, HTML ou leitor de tela. O identificador visual pode receber uma animação especial futura, mas até lá usa frasco da família; não há sprite pronto.

**Backlog adicional:**
- **CRAFT-D20 [P1 UX]:** evento de primeira descoberta, comunicação discreta, retorno à bancada sem fabricação repetida.
- **CRAFT-D21 [P1 UX]:** seção de combos descobertos no Caderno, primeiro encontro e histórico de lotes, filtros sem spoiler.
- **CRAFT-D22 [P1 arte/QA]:** contrato `comboId → asset`, fallback por família, versão com movimento reduzido, revisão mobile/Xbox.
- **CRAFT-D23 [P0 antes da integração]:** persistência transacional e idempotente de `knownCombos` e registros; preservar saves clássicos e não duplicar eventos.
- **UX-C01–UX-C10:** especificação de testes de descoberta, repetição, incompatibilidade, conhecimento, candidatos editoriais, famílias, persistência, acessibilidade e ausência de regressões (ver documento específico).

**Status:** design e protótipo para revisão; **não implementado no gameplay**, não integrado ao save Phaser, não publicado no Pages. A PR #94 continua sendo o protótipo de duas fontes, independente do experimento visual da PR #95.

## 17. Múltiplas sinergias em um único preparado — proposta de UX v1.1 (03/11/2026)

**Documento detalhado:** [UX de descoberta e Caderno, seção 8](ux-descoberta-combos-caderno-v1.md). **Protótipo:** [PR #95 em revisão](https://github.com/pedromaintenance/peren-o-bruxo/pull/95) com cenas `2 sinergias (QA)` e `2 + Impuro (QA)`.

**[CANÔNICO]** A mistura continua sendo **um** produto com **todos** os efeitos ativados; uma incompatibilidade aprovada exige o rótulo **Impuro**, mesmo se um subconjunto corresponder a sinergia. O nome da Poção da Fada é a única assinatura sinérgica atualmente aprovada. Nenhum candidato adicional pode ser promovido automaticamente.

**[PROPOSTA]** O resultado do classificador deve conter **todas** as assinaturas de combos aprovadas e identificadas: `matchedComboIds[]` em vez de um único nome, além de `impurityIds[]` e `effectIds[]`. A apresentação sugerida para duas sinergias simultâneas, enquanto não existe regra de potência e prioridade, é um **cabeçalho neutro descritivo** com os nomes em **cartões separados**. Não se trata de criar uma “superpoção” canônica, outra receita ou bônus acumulado.

**Três possibilidades de nomenclatura (nenhuma aprovada):** (A) nome do combo dominante determinado pela futura potência; (B) cabeçalho neutro e subcartões sem hierarquia — **preferência para protótipo**; (C) um nome composto autoral somente quando uma supersinergia receber aprovação específica. Nunca escolher arbitrariamente pelo primeiro registro JSON.

**QA isolado:** para simular duas sinergias sem inventar aprovação, a PR #95 usa a **Poção da Fada** mais a assinatura FICTÍCIA `aumentar_ilusao + aumentar_magia`, rotulada `Combo B (FICTÍCIO · QA)`, exclusivamente no browser de revisão. O conjunto de **Língua-de-Dragão + Coração de Demônio + Beladona** efetivamente ativa Carisma, Ilusão e Magia; **apenas** a sinergia da Fada existe no catálogo aprovado. A cena `2 + Impuro` injeta um **vetor sintético de efeitos** e **não** afirma que exista receita de até 4 ingredientes para esse teste. O produto real, com o catálogo atual, nunca será renomeado “Combo B”.

**Caderno e persistência [PROPOSTA]:** o registro de um lote aponta para zero, uma ou várias sinergias aprovadas: `preparationId → matchedComboIds[]`. Conhecimento pessoal guarda os IDs descobertos individualmente, mas uma única transação consome recursos **uma vez**. A primeira descoberta é anunciada **somente** para as assinaturas ainda desconhecidas. Se houver mais de uma descoberta nova, criar **um** resultado agrupado, não um modal por efeito. Registro de uma assinatura dentro de preparado Impuro continua **decisão aberta**: proposta de registrar conhecimento identificado sem apresentar uma poção combo pura.

**Arte futura:** um frasco por família e FX opcionais por `comboId`, sem necessidade de sprite por conjunto de ingredientes. Combos simultâneos podem alternar destaque, jamais executar dois efeitos conflitantes/estroboscópicos ao mesmo tempo; modo de movimento reduzido mantém texto e ações. `qa-*` nunca deve carregar arte do jogo real.

**Backlog:** `CRAFT-D24` — reconhecimento multissinergia, lista íntegra e prioridade Impuro; `CRAFT-D25` — Caderno e primeira descoberta agrupada por lote; `CRAFT-D26` — escolha autoral da nomenclatura e orquestração de animações. **Critérios:** `UX-C11`–`UX-C17` no documento UX.

**Verificação do protótipo:** sintaxe JS, IDs de elementos e **oito checagens funcionais com DOM simulado** passaram; isso **não** equivale a um teste gráfico, dispositivo físico, integração real com Phaser ou deploy Pages. Próximo gate: decidir como nomear preparações multissinérgicas e se sinergias identificadas dentro de Impuros entram imediatamente no Caderno.

## 18. Identificar uma sinergia dentro de um Impuro não equivale a produzir a poção especial — estudo v1.2

**Estado:** [PROPOSTA testada, não aprovada canonicamente]. Vinculado à [seção 9 do documento UX](ux-descoberta-combos-caderno-v1.md) e à [PR #95](https://github.com/pedromaintenance/peren-o-bruxo/pull/95). **A Emenda A2 continua prevalecendo:** Impuro significa incompatibilidade, e combos emergem de assinaturas aprovadas.

**Tese de design:** o conhecimento de Peren e a classificação do frasco são fatos distintos. Ao identificar *todos* os efeitos da assinatura de uma sinergia aprovada num preparado Impuro, Peren poderia **reconhecer a combinação no Caderno**, mas o lote permanece **Impuro** e não conta como “poção combo compatível”. Quando produzir posteriormente uma mistura **sem incompatibilidades** com a mesma assinatura, o Caderno registra um **segundo marco**: primeiro preparo compatível. Na primeira produção compatível sem descoberta anterior, ambos os marcos surgem juntos e se registram numa única transação. Isso **não** é uma regra aprovada pelo criador; é a melhor hipótese de UX para preservar o conhecimento obtido em experimentos arriscados.

**Não confundir:** “sem incompatibilidade” não significa “purificado”. Uma poção multiefeito comum ou uma Poção da Fada pode ser compatível sem passar por **Retificação**. Reservar a palavra “Purificar” para o procedimento de grande habilidade sobre preparados Impuros, conforme Constituição.

**Evidência de factibilidade (dados atuais):** Coração de Demônio + Língua-de-Dragão + Raiz Botulínica + Asa de Borboleta ativam Aumentar Carisma e Diminuir Força (dois tipos por efeito), compondo uma mistura **Impura real com quatro fontes**. Esse exemplo **não** tem a sinergia de Fada. O vetor `aumentar_carisma + aumentar_ilusao + diminuir_forca`, utilizado como **teste de conhecimento em Impuro**, é sintético: **não** afirmar que o catálogo vigente o produz em até quatro ingredientes. A mistura de Coração de Demônio + Língua-de-Dragão + Cogumelo Escamoso é um exemplo materialmente verificável de Poção da Fada compatível.

**Prova de conceito isolada [PROTÓTIPO, NÃO RUNTIME]:** [classificador puro](https://github.com/pedromaintenance/peren-o-bruxo/blob/design/ux-combos-caderno-v1-20261103/prototipos/experimento-classificador-sinergias.mjs) + [15 testes escritos](https://github.com/pedromaintenance/peren-o-bruxo/blob/design/ux-combos-caderno-v1-20261103/prototipos/experimento-classificador-sinergias.test.mjs). As 15 verificações passaram em execução JS isolada com o catálogo real, cobrindo: classe Impuro com todas as propriedades, multissinergia sintética, reconhecimento condicionado ao conhecimento, ignorar candidatos, sigilo, primeiro preparo compatível após observação Impura, idempotência e independência de ordem. **Não houve teste do runtime Phaser, importação para o jogo, teste físico, merge de branch nem alteração de save.**

**Contratos de dados propostos:** `internal.activeEffectIds`, `internal.matchedComboIds`, `internal.incompatibilityIds` (não expor integralmente à UI); `presentation.visibleEffectIds`, `presentation.recognizedCombos`, `presentation.kind` (somente efeitos identificados). Conhecimento por combo inclui `firstRecognitionTransaction`, `firstRecognizedInImpure`, `firstCompatibleTransaction`, `observations` e `compatiblePreparations`. O protótipo usa `processedTransactions` em memória para mostrar idempotência; schema, tamanho e persistência reais são **ABERTOS**. Não permitir que caracteres secretos apareçam por tooltip ou atributo HTML.

**Backlog e aceites:**
- **CRAFT-D27 [P0 design]:** estados de conhecimento separados de objeto preparado; sinergia reconhecida não torna um Impuro compatível nem altera efeitos.
- **CRAFT-D28 [P1 UX]:** feedback e Caderno para primeira observação em Impuro versus primeira produção compatível; impedir revelação precoce de sinergias.
- **CRAFT-D29 [P0 antes de implementação]:** transação idempotente de descobertas e lotes no Phaser, sem migração destrutiva, novos bônus ou custo duplicado.
- **UX-C18–UX-C23:** critérios completos na [especificação de UX, seção 9](ux-descoberta-combos-caderno-v1.md).

**Decisão reservada ao criador:** registrar o conhecimento de uma assinatura descoberta num Impuro **imediatamente** ou apenas após conseguir uma produção sem incompatibilidades? Recomendação documentada: aprendizado imediato, mas separar claramente os dois marcos no Caderno.

## 19. Dominância, potência de origem e empates — estudo de modelos v1 (03/11/2026)

**Documento diretor deste ciclo:** [Estudo de Dominância, Intensidade e Empates](estudo-dominancia-alquimica-v1.md). **Experimentos em branch isolada:** [PR #96](https://github.com/pedromaintenance/peren-o-bruxo/pull/96), arquivos `prototipos/dominancia-alquimica-experimental.mjs`, `prototipos/dominancia-alquimica-experimental.test.mjs`, `prototipos/painel-dominancia-alquimica-v1.html`.

**[CANÔNICO]** A fonte tem intensidades I–III, mas **potência final não está definida por essa escala**. Dois **tipos distintos** de ingrediente ativam cada efeito, a fórmula não pode apagar secundários, e nome especial de **sinergia aprovada** prevalece para preparos compatíveis. Em **incompatibilidade** o frasco continua **Impuro**, independentemente do efeito eleito dominante. Misturas compatíveis sem sinergia devem receber nome do efeito mais intenso **após** resolver qual é e como desempatar.

**[PROPOSTA, NÃO CANÔNICO]** Três formas de comparar as intensidades de origem:
- **M1 — Soma de todas as fontes:** favorece 3ª e 4ª contribuições, com potencial de inflar o índice simplesmente por quantidade.
- **M2 — Soma das duas maiores fontes:** respeita o mínimo de duas fontes e evita favorecer automaticamente a adição de ingredientes; o papel das fontes extras precisará ser estudado à parte. **Hipótese prioritária para avaliação, não escolha aprovada.**
- **M3 — Maior fonte individual:** preserva destaque de ingrediente forte, mas ignora a segunda contribuição e gera empates.

**Divergência material confirmada:** **Carapaça de Caranguejo + Betta do Rio + Garras de Urso** ativam `aumentar_forca` com intensidades `II+II+II` e `aumentar_constituicao` com `III+II`. M1: Força **6** vs Constituição **5**, nomearia Força. M2: Força **4** vs Constituição **5**, nomearia Constituição. M3: Força **2** vs Constituição **3**, também favorece Constituição. Portanto os índices afetam diretamente o **rótulo** que o usuário pediu, e não podem virar verdade canônica por preferência do implementador.

**Empate demonstrado:** Carapaça + Gordura de Troll: Força `II+II`, Resistência a Veneno `I+II`; o modelo M3 empata em **2 vs 2**, enquanto a soma M1 dá **4 vs 3**. Nunca desempatar por ordem dos ingredientes, primeiro registro JSON, ordem alfabética de ID ou família arbitrária.

**Ressalva central:** índices comparativos **não equivalem à potência final** de efeitos heterogêneos; não é possível concluir automaticamente que Constituição III seja “mais forte” que Resistência II no mundo do jogo. Separar interpretação semântica, intensidade de origem, potência final, família/nome e regra de conhecimento do personagem.

**Compatibilidade e nomes continuam invariantes:** o quarteto real Coração de Demônio + Língua-de-Dragão + Raiz Botulínica + Asa de Borboleta produz `aumentar_carisma` e `diminuir_forca`, **Impuro** em todos os modelos. `aumentar_carisma` + `aumentar_ilusao` permanece **Poção da Fada** quando não houver incompatibilidade, independentemente do índice. **Não trocar o nome do combo especial por uma composição genérica.**

**[PROPOSTA] Empate/efeito desconhecido:** apresentar designação neutra (ex.: “Preparado de efeitos equilibrados” ou “Preparado de efeitos mistos”) enquanto não houver métrica e decisão; eventualmente deixar Peren selecionar um efeito **empatado e já identificado** somente para rotulagem. Isso não purifica, reforça ou suprime qualquer efeito. O nome final e a regra de desempate seguem **ABERTOS**.

**Backlog e aceites:**
- **CRAFT-D30 [P0 design]:** decidir comparabilidade entre efeito heterogêneo e escala de intensidade de origem vs potência final.
- **CRAFT-D31 [P0 design]:** revisar M1/M2/M3 em 2–4 fontes e aprovar ou rejeitar modelo para nomeação; investigar papel de fontes adicionais.
- **CRAFT-D32 [P0 UX]:** empates, estado de conhecimento insuficiente e título neutro sem spoiler.
- **CRAFT-D33 [P1 mecânica futura]:** papel de perícia, instrumentos e qualidade na potência/duração real, sem alteração da curadoria.
- **CRAFT-D34 [P1 QA]:** persistência da identidade, reclassificação visual após estudo/purificação, segurança de inventário e save.
- **DOM-Q01–DOM-Q10:** critérios detalhados no estudo de dominância.

**Verificação:** módulo isolado com **15/15** testes de regra executados em V8 e painel HTML standalone com **7/7** checagens em DOM simulado. Isso **não** constitui jogo implementado nem QA visual no navegador físico. [PR #96 é draft, não mesclada](https://github.com/pedromaintenance/peren-o-bruxo/pull/96). A curadoria mantém íntegros os ingredientes, os IDs e seus valores I–III.

## 20. Terceira e quarta fontes: contribuição material, efeito adicional e potência [PROPOSTA — 03/11/2026]

**Documento específico deste ciclo:** [`estudo-fontes-adicionais-alquimia-v1.md`](estudo-fontes-adicionais-alquimia-v1.md). **Protótipos não jogáveis:** [PR #97 — fontes adicionais (draft)](https://github.com/pedromaintenance/peren-o-bruxo/pull/97), contendo módulo de análise, **16 testes de lógica**, painel HTML offline e roteiro de QA. Este estudo **não altera a Emenda A2**, não define potência final e não implementa fontes extras no Phaser.

**Separação obrigatória para implementação futura:**

1. **Ativação [CANÔNICO]:** cada efeito exige pelo menos duas **espécies/tipos diferentes** que o possuam. Mais fontes não removem efeitos já ativados; podem **adicionar** efeitos e mudar a classificação por incompatibilidade.
2. **Identidade [CANÔNICO]:** incompatibilidade aprovada → **Impuro**; sinergia aprovada → nome especial quando não houver incompatibilidade; multiefeito compatível sem sinergia → nome pelo efeito dominante quando for definida a potência. Preservar todos os efeitos.
3. **Diagnóstico de fonte [PROPOSTA]:** para cada efeito, separar as **duas maiores intensidades** (índice-núcleo hipotético M2) das **demais intensidades** (índice excedente), sem declarar que esses números são dano, duração, qualidade ou potência final. A versão de investigação abrange 2–4 tipos; isso **não** fixa o limite global de ingredientes.
4. **Contribuição adicional [ABERTO]:** terceira/quarta fontes podem apenas ativar outros efeitos (F0); influir em potência (F1), duração/alcance quando aplicáveis (F2), estabilidade/risco operacional (F3), ou ser somente metadado até definição por categoria semântica (F4). **F4 — guardar evidência e não dar bônus automático — é a hipótese prioritária de desenvolvimento, não regra aprovada.**
5. **Consequências e visibilidade:** efeito prejudicial não é automaticamente **Impuro**. A UI só pode divulgar ao personagem os efeitos identificados, mesmo que o motor calcule todos os efeitos e conflitos reais. Chamar fonte excedente de “mais pura” ou declarar redução de incompatibilidade é incorreto.

**Exemplos verificados na curadoria vigente:** 
- **Carapaça de Caranguejo + Betta do Rio:** Aumentar Força II+II.
- **+ Garras de Urso:** Força II+II+II e Constituição III+II; surge um segundo efeito ativado.
- **+ Chifres de Alce:** Força II+II+II+II e Constituição III+II+II. **Nenhum efeito novo**; índice M2 continua Força 4 e Constituição 5, mas excedente de ambas as propriedades cresce.
- **Quarta fonte alternativa, Pó de Presa de Mamute:** núcleo M2 de Força muda de 4 para 5 (Fonte III), e **empata** com Constituição em índice M2. Não é empate de potência final aprovado.
- **Quarta fonte alternativa, Amanita Rubra:** ativa **Diminuir Sabedoria** I+II (Betta + Amanita). Há efeito negativo, mas **não** incompatibilidade especificamente aprovada nesse conjunto. Não converter em Impuro por reflexo.
- **Conflito aprovado surgindo na 4ª fonte:** Coração de Demônio + Língua-de-Dragão + Raiz Botulínica + Asa de Borboleta ativam Diminuir Força apenas quando chega a segunda fonte da propriedade; classificação passa a **Impuro** com todos os efeitos preservados.
- **Combo na 3ª fonte:** Coração de Demônio + Língua-de-Dragão + Cogumelo Escamoso ativa Aumentar Ilusão, permitindo reconhecer a **Poção da Fada** junto a Aumentar Carisma. Não gera receita fixa.

**Handoff de equipe:** o agente de **curadoria** não deve alterar intensidades ou propriedades para fazer aparecer um benefício de fonte extra; deve manter IDs, origens, efeitos, descrição e possíveis contradições. O agente de **mecânicas** deverá preservar origem de cada efeito e testar contribuições potenciais **somente depois** de especificar as 53 semânticas, potenciais e durações, custos e interação com perícia. **Nenhum extra é grátis** só por existir, nem obrigatório por decreto antes do design.

**Backlog e critérios:**
- **CRAFT-D35 [P0 design]:** mapear comportamento marginal de fontes extras e distinguir novo efeito de reforço de efeito ativo.
- **CRAFT-D36 [P0 efeitos]:** decidir contribuição F0–F4 **por categoria semântica de efeito**; nunca aplicar duração universal a instantâneos/permanentes.
- **CRAFT-D37 [P1 UX]:** exibir fontes identificadas e novos efeitos sem prometer aumento não aprovado; explicitar consequência e sigilo.
- **CRAFT-D38 [P0 contrato de preparado]:** preservar `effectId → origens distintas` e eventual métrica validada, sem duplicar ingrediente ou migrar saves clássicos.
- **CRAFT-D39 [P1 QA]:** testes 2→3→4 com alteração de classificação, combo, empates, fontes sem reforço, integridade de inventário e ausência de bônus inventados.
- **SRC-Q01–SRC-Q08:** gate detalhado no [estudo de fontes adicionais](estudo-fontes-adicionais-alquimia-v1.md).

**Verificação real:** **16/16** casos de lógica executados em V8 isolado com os JSONs reais, **10/10** verificações do painel em DOM simulado, incluindo comparação de **35 atributos de 11 ingredientes** com `curadoria_ingredientes.json`. **Não** houve CI Node, navegador real, integração Phaser ou publicação do protótipo no Pages. **[PR #97 permanece em rascunho, sem merge](https://github.com/pedromaintenance/peren-o-bruxo/pull/97)**.

## 21. Taxonomia dos 53 efeitos — semântica, alvos e temporalidade (05/11/2026)

**Documento diretor:** [`taxonomia-53-efeitos-alquimicos-v1.md`](taxonomia-53-efeitos-alquimicos-v1.md). **Catálogo estruturado em branch isolada e painel de revisão:** [PR #98 — rascunho](https://github.com/pedromaintenance/peren-o-bruxo/pull/98), `data/taxonomia-efeitos-alquimicos-proposta.json`, `prototipos/revisao-taxonomia-53-efeitos.html` e `prototipos/validar-taxonomia-efeitos.test.mjs`.

**[DADO VIGENTE]** 111 ingredientes e 53 IDs reais; nenhuma propriedade isolada. Nomes, fontes e intensidades I–III são reproduzidos da curadoria sem reescrever a origem. Variantes textuais somente em `curar_doenca` e `voar`, sem duplicar IDs.

**[CANÔNICO]** Dois tipos distintos são necessários por efeito; todos os efeitos ativados permanecem. Somente incompatibilidades aprovadas geram **Impuro**; apenas sinergias aprovadas geram nome especial (Poção da Fada). **Vampirismo deve poder transformar alguém em vampiro com o tempo**, conforme decisão documentada na auditoria; progressão, reversão, resistência e duração exatas não estão aprovadas.

**[PROPOSTA, NÃO CÂNONE]** Para organizar decisões, o estudo distribuiu os 53 efeitos em **11 grupos semânticos** (não confundíveis com as 5 famílias de preparo): modificadores de atributos (10), habilidades/escolas/ofícios (9), capacidade e defesa (5), recurso atual (4), fluxo de recurso (3), resistências (5), fraquezas (5), movimento/exploração (6), estados comportamentais (3), doenças (2) e transformação (1). Todos os registros contêm alvo e temporalidade **hipotéticos**, variáveis de escala a estudar, ressalvas e valores nulos para mecânicas não aprovadas.

**Distinções críticas antes de definir potência/duração:**
- `dano_magia` pode degradar reserva atual, enquanto `diminuir_magia` pode afetar máximo/eficácia; **essa semântica é proposta na auditoria, não definitiva**.
- `restaurar_magia`/`restaurar_saude` não devem ser equiparados a `regenerar_magia`/`regenerar_saude`; a primeira família sugere mudança pontual, a segunda taxa contínua, **a confirmar**.
- `aumentar_destreza` não implica `velocidade`; `aumentar_percepcao` não implica `visao_a_distancia` remota; `dano_saude` não implica `infligir_doenca`.
- Vampirismo não pode ser reduzido a simples drenagem; estados como Frenesi, Medo e Paralisia requerem resistência, término e proteção contra aprisionamento infinito.
- Nenhuma família Poção/Veneno/Tônico/Elixir/Bálsamo deve ser inferida exclusivamente do grupo do efeito; elixir permanente e bálsamo de equipamento exigem contratos próprios.
- Não atribuir duração universal à terceira/quarta fonte; primeiro definir se o efeito possui tempo aplicável, intensidade escalar, persistência ou reversão.

**Contrato de curadoria e gameplay:** o agente de **curadoria** continua responsável por preservar IDs, nomes, fontes e intensidades, registrando dúvidas e proveniência. O agente de **mecânicas** elabora estado/alvo/tempo/resistência/empilhamento por ID após avaliação das propostas. A UI de revisão da PR #98 aceita anotações exportáveis por efeito, mas **não** cria decisões canônicas automaticamente nem altera saves.

**Backlog:**
- **CRAFT-D40 [P0 design]:** decidir os 11 grupos de pesquisa e o modelo de ficha por efeito, sem substituir IDs nem criar novas propriedades.
- **CRAFT-D41 [P0 recursos]:** diferenciar atual, máximo, recuperação pontual e taxa, com regras de dano/cura verificáveis.
- **CRAFT-D42 [P0 estados]:** duração, reversão, resistência e progressão por categoria, incluindo Vampirismo, Doença, Medo e Paralisia.
- **CRAFT-D43 [P0 aplicação]:** definir alvos e veículos: criaturas, objetos, uso em ofício, famílias de preparo e efeitos extraordinários.
- **CRAFT-D44 [P1 fontes]:** avaliar potência/duração/qualidade por semântica de efeito, nunca como multiplicador universal de 3ª/4ª fonte.
- **CRAFT-D45 [P0 QA]:** contrato transacional de aplicação, conhecimento oculto, empilhamento, persistência e integridade de saves/arte.

**Aceites de design:** `SEM-Q01–SEM-Q10` no relatório integral. **Verificação:** 17/17 testes do catálogo e 13/13 checagens de UI em execução V8/DOM simulado; ainda não executados em navegador, CI Node, Phaser ou dispositivo físico. [PR #98 permanece como proposta isolada, sem merge](https://github.com/pedromaintenance/peren-o-bruxo/pull/98).
