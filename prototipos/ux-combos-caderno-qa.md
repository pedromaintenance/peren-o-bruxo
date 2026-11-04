# QA manual do protótipo de Caderno e múltiplas sinergias

**Data:** 03/11/2026. **Status:** avaliação de UX, não teste do Phaser publicado.
**Arquivo:** [ux-combos-caderno-v1.html](ux-combos-caderno-v1.html). Abrir como HTML local; não usar os saves do jogo. **Regra:** nenhum dado dessa simulação altera o inventário, catálogo ou caderno real.

## Casos clicáveis do cabeçalho

| Cenário | Ações | Resultado esperado |
| --- | --- | --- |
| Poção da Fada | Clicar, Preparar, Abrir Caderno; voltar e preparar de novo | Nome canônico uma vez como primeira descoberta; contagem de lotes avança, descoberta não se repete |
| Dois efeitos compatíveis | Clicar Multiefeito comum e Preparar | Nome ilustrativo pelo efeito dominante, segundo efeito na descrição, sem Impuro, sem combo |
| Impuro | Clicar Impuro e Preparar | Aumentar Carisma + Diminuir Força, rótulo Impuro, dois efeitos preservados |
| Candidato editorial | Clicar Candidato editorial e Preparar | Voo + Velocidade, sem o nome candidato `Asas do Vendaval` exibido como aprovado |
| **2 sinergias (QA)** | Clicar e preparar; abrir Caderno | **Poção da Fada** aprovada e **Combo B (FICTÍCIO · QA)** em cartões separados; assinatura fictícia jamais apresentada como canônica |
| **2 sinergias (QA)** após Fada conhecida | Reiniciar; fabricar Fada; depois Dupla | Somente Combo B deve ser anunciado como “novo” (porque Fada já foi descoberta); uma transação, um lote |
| **2 + Impuro (QA)** | Clicar e preparar | Resultado principal Impuro; lista de todos os efeitos e aviso de que a dupla é teste sintético, sem material/receita real |
| Reiniciar | Clicar após qualquer cenário | Limpar todos os contadores e descobertas fictícias somente desta página |

**Observação:** duas assinaturas simultâneas no protótipo não significam duas sinergias aprovadas. O teste `Combo B` é deliberadamente fictício e só serve para validar o design da UI. A variante **Impuro + duas assinaturas** é um vetor sintético de classificação e não atesta receita fabricável com 2–4 tipos.

## Verificações de integridade executadas (03/11/2026)

- Sintaxe do script: **válida**; IDs de elementos referenciados: **todos encontrados**, sem duplicação.
- **DOM simulado (8 checagens):** (1) dupla apresenta assinaturas separadas; (2) contadores canônico/QA separados; (3) três efeitos preservados; (4) Caderno indica QA não canônico; (5) repetição não reabre primeira descoberta; (6) Impuro prevalece e preserva quatro efeitos sintéticos; (7) Impuro não fabrica descoberta QA adicional; (8) Reiniciar limpa estados. **8/8 passaram**.
- Ainda **não executados**: navegadores reais, responsividade visual 360×800/390×844/1280×800, leitor de tela, controle Xbox físico, desempenho de animações, teste integrado ao Phaser e revisão artística do usuário.

## Próxima revisão humana sugerida

1. **Leitura:** no desktop e mobile, o jogador diferencia claramente Poção da Fada aprovada e Combo B fictício? A informação de “Impuro” é proeminente sem esconder os efeitos?
2. **Navegação:** é possível ir ao Caderno, voltar, preparar novamente e pular a celebração sem confusão?
3. **Identidade visual:** frasco por família + FX discreto por `comboId` parece suficiente ou o usuário quer uma tela maior de descoberta?
4. **Decisão ainda aberta:** um preparado com duas sinergias **aprovadas** deve usar (A) nome do combo dominante, (B) cabeçalho neutro com duas identidades ou (C) um terceiro nome autoral aprovado separadamente?
5. **Impuro com sinergia identificada:** o Caderno aprende a assinatura da sinergia identificada dentro do Impuro, ou só depois de purificar?

**Gate:** até resolver nomenclatura, reconhecimento de propriedades ocultas e integração transacional, não converter este HTML em gameplay, não mesclar automaticamente a PR #95, não prometer publicação no Pages.

## Ampliação QA v1.2 — aprendizado em Impuro, dois marcos e classificador puro

**Diretriz ainda não aprovada:** identificar assinatura sinérgica num lote Impuro pode adicionar **conhecimento**, sem produzir o combo sem incompatibilidades. A primeira produção posterior compatível é um evento diferente. Fonte: [especificação UX v1.2 na main](https://github.com/pedromaintenance/peren-o-bruxo/blob/main/docs/ux-descoberta-combos-caderno-v1.md#9-conhecimento-reconhecido-versus-preparo-compatível--experimento-v12-03112026).

### Novos caminhos para revisão manual

1. **Aprender no Impuro (QA):** clicar no cenário, Preparar, depois Caderno. Deve mostrar Poção da Fada como **conhecimento reconhecido em Impuro**, mas **primeiro lote compatível = não obtido** e **lotes compatíveis = 0**. Esse vetor é sintético; não é receita do catálogo.
2. Voltar à bancada, escolher **Poção da Fada**, Preparar. O resultado deve avisar **Primeiro preparo compatível**, e **não Nova sinergia descoberta**. Caderno passa a exibir primeiro lote compatível obtido; contagem compatível = 1.
3. Reiniciar e preparar **Poção da Fada** diretamente: deve ser **Nova sinergia descoberta**, porque conhecimento e primeiro preparo compatível ocorreram na mesma operação.
4. Escolher **Impuro**: a amostra de quatro ingredientes é factual na curadoria (Coração de Demônio, Língua-de-Dragão, Raiz Botulínica, Asa de Borboleta). Os dois efeitos são Aumentar Carisma e Diminuir Força. O nome principal do efeito mais intenso não foi fixado, logo o cabeçalho da amostra permanece neutro.
5. **Reiniciar:** nenhuma observação, lote ou primeira produção de qualquer caso permanece armazenada; toda a simulação é efêmera.

**Comprovação realizada:** 10/10 checagens funcionais de interface com DOM simulado, cobrindo reconhecimento em Impuro, Caderno, primeiro preparo compatível, não repetição da primeira descoberta, sintéticos anteriores, amostra Impura real e reset. Sintaxe JS válida; sem IDs duplicados ou referências ausentes.

### Experimento de classificador independente

- [`experimento-classificador-sinergias.mjs`](experimento-classificador-sinergias.mjs): funções puras, catálogo aprovado, separação de saída interna/visível e observação de combos com idempotência experimental.
- [`experimento-classificador-sinergias.test.mjs`](experimento-classificador-sinergias.test.mjs): **15 casos declarados** para `node --test`. **15/15 executados com sucesso em V8 isolado usando o catálogo real**, não em CI Node do repositório nem em Phaser.
- A operação `recordComboObservation` demonstra estados `firstRecognitionTransaction` e `firstCompatibleTransaction`, sem escrever save ou gastar ingredientes. O mapa `processedTransactions` é **somente para pesquisa**; não aprovar schema ou custo de memória em produção por implicação.

**Pendente:** executar o teste Node em ambiente local/CI próprio; QA visual em navegador real e dispositivo físico; decisão autoral sobre o aprendizado de combos dentro de Impuros; política de dominância numérica e nomes com várias sinergias. **Não integrar ao Phaser nem realizar merge automático.**
