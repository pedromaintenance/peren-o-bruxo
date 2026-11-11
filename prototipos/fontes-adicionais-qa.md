# QA — Terceira e Quarta Fontes na Alquimia (v1.0, experimental)

**Data:** 03/11/2026. **Estado:** [PROPOSTA], fora do Phaser e sem alteração de save, potência, receitas ou curadoria.

**Artefatos nesta branch:** [painel HTML offline](painel-fontes-adicionais-v1.html), [estudo de fontes extras](estudo-fontes-adicionais.mjs), [16 testes declarados](estudo-fontes-adicionais.test.mjs). **Estudo de design:** [documento na main](https://github.com/pedromaintenance/peren-o-bruxo/blob/main/docs/estudo-fontes-adicionais-alquimia-v1.md).

## Casos de avaliação

| Cenário | Ação no painel | Resultado esperado |
| --- | --- | --- |
| Base de dois tipos | Abrir **Reforço de Força e Constituição** | Carapaça + Betta; só Aumentar Força II+II ativado; núcleo M2=4 |
| Terceiro tipo | Adição fixa de Garras de Urso | Força II+II+II, núcleo 4/excedente 2; Constituição III+II ativada, núcleo 5 |
| Quarto redundante | Escolher **Chifres de Alce** | Força ganha quarta fonte II; Constituição ganha terceira II; **nenhum efeito novo**; os núcleos M2 não mudam |
| Quarto com risco | Escolher **Amanita Rubra** | Diminuir Sabedoria I+II se ativa; **não rotular automaticamente Impuro**, pois incompatibilidade específica não está aprovada |
| Quarto mais intenso | Escolher **Pó de Presa de Mamute** | Núcleo M2 de Força passa de 4 para 5, empatando com Constituição 5; nenhuma fórmula final aprovada |
| Impuro no quarto tipo | Escolher **A incompatibilidade aparece no 4º tipo** | Carisma já ativo; Diminuir Força passa a ativo com Raiz + Asa; **Impuro** somente no quarto tipo |
| Combo pela terceira fonte | Escolher **Descobrir a Poção da Fada** | Carisma ativo nos dois primeiros; Ilusão se ativa na adição de Cogumelo Escamoso; assinatura aprovada da Fada |
| Integridade da fonte | Revisar dados embutidos | As 11 amostras do HTML devem coincidir, efeito por efeito, com `data/curadoria_ingredientes.json` |

## Verificação técnica efetivamente realizada

- **16/16 casos da lógica passaram em execução V8 isolada**, com uso do catálogo de ingredientes e do catálogo de sinergias/incompatibilidades. O runner do arquivo está pronto para `node --test`, mas **não** foi executado em CI Node.
- **10/10 testes funcionais do painel passaram em DOM simulado**, incluindo alternância dos três quartos, condição Impura, Poção da Fada e correspondência integral de **35 propriedades** entre 11 ingredientes embutidos e a curadoria vigente.
- **Não realizados:** renderização visual real de navegador, testes mobile e Xbox físicos, CI de integração, importação ao Phaser, balanceamento, saves ou economia. Esse resultado não deve ser citado como gameplay publicado.

## Guardrails de revisão

- Dois tipos diferentes são condição de ativação. Repetir a **mesma espécie** em duas unidades não cria a segunda fonte.
- **M2/núcleo** e **excedente** são índices diagnósticos, não atributos novos em itens finais. Não inventar +% potência, turno de duração, redução de risco, estabilidade ou chance de sucesso.
- Um efeito adicional **negativo** não implica automaticamente Impuro. A incompatibilidade exige catálogo **aprovado**.
- O fato de o número de efeitos ativos não diminuir com ingredientes adicionais **não** implica que o item permaneça compatível: uma nova incompatibilidade pode mudar a classificação.
- Em preparos com efeitos desconhecidos, a futura UI deve mostrar apenas propriedades identificadas pelo personagem.
- O relatório e as fichas devem preservar a distinção [CANÔNICO] / [PROPOSTA] / [ABERTO].

**Reprodução após checkout:** `node --test prototipos/estudo-fontes-adicionais.test.mjs`.

**Gate para integração real:** decisão autoral sobre papel da 3ª/4ª fonte, fórmula de potência/tempo por efeito, revisão do contrato de produção, integridade de save, QA de Phaser e dispositivo. **Não mesclar como runtime.**
