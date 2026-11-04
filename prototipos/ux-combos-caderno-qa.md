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
