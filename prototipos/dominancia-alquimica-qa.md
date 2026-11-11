# QA — Estudo de Dominância Alquímica v1.0 (não canônico)

**Fonte:** `data/curadoria_ingredientes.json` (main, 03/11/2026). **Experimentos:** [módulo](dominancia-alquimica-experimental.mjs), [testes](dominancia-alquimica-experimental.test.mjs) e [painel offline](painel-dominancia-alquimica-v1.html). **Relação com o design:** [estudo de dominância](https://github.com/pedromaintenance/peren-o-bruxo/blob/main/docs/estudo-dominancia-alquimica-v1.md).

## Quatro amostras verificadas

| Amostra | Tipos de ingredientes | Efeitos e intensidades esperadas | Propósito |
| --- | --- | --- | --- |
| Divergência | Carapaça de Caranguejo, Betta do Rio, Garras de Urso | Força II+II+II; Constituição III+II | Soma (6 contra 5) diverge de duas maiores (4 contra 5) |
| Empate | Carapaça de Caranguejo, Gordura de Troll | Força II+II; Resistência a Veneno I+II | Maior fonte empata 2 contra 2; soma e duas maiores favorecem Força |
| Impuro | Coração de Demônio, Língua-de-Dragão, Raiz Botulínica, Asa de Borboleta | Carisma III+I; Diminuir Força III+I | Impuro **sempre**, empate nos três modelos; não presumir nome de efeito dominante |
| Combo | Coração de Demônio, Língua-de-Dragão, Cogumelo Escamoso | Carisma III+I; Ilusão II+II | **Poção da Fada** mantém nome especial apesar de índices diferentes |

**Atenção:** os valores 6, 5, 4, 3 e 2 nas comparações são **índices derivados para estudo**, não potência do preparado nem unidades de efeito de jogo. A regra combinatória das duas fontes distintas permanece canônica; a ordenação M1/M2/M3 **não**.

## Evidência verificada neste ciclo

- **15/15 testes de regra** passaram, executados em V8 isolado contra os dados do repositório. O arquivo `.test.mjs` usa o runner Node nativo para futuras execuções em checkout.
- **7/7 checagens funcionais do painel** passaram com DOM simulado: divergência na primeira amostra, empate na segunda, Impuro permanente e nome Poção da Fada prevalecendo, além de visualização de intensidades.
- Código da comparação e HTML são independentes do Phaser, do runtime clássico e dos saves. Nenhuma alteração nos ingredientes ou no catálogo de combos.
- **Não executados ainda:** `node --test` em CI Node real; renderização completa em Chromium/Firefox; dispositivo mobile e gamepad; verificação artística da interface.

## Roteiro de revisão manual

1. Baixar e abrir o painel HTML. Alternar entre M1, M2 e M3 na amostra Carapaça + Betta + Garras: conferir a mudança de Força para Constituição.
2. Selecionar Carapaça + Gordura de Troll e M3: observar um **empate**, sem desempate por ordem do JSON.
3. Selecionar Carisma + Diminuir Força: manter **Impuro** com qualquer opção e efeito dominante em empate.
4. Selecionar Poção da Fada: conservar o nome aprovado em qualquer modelo.
5. Revisar a legibilidade dos cartões, gráficos e tabelas em 360×800, 390×844 e 1280×800; tabulação, leitores de tela e modo movimento reduzido.
6. Registrar preferência pelos modelos **como proposta**, junto com justificativa sobre a contribuição da 3ª e 4ª fontes e comparabilidade entre tipos de efeitos.

**Comando quando houver checkout:** `node --test prototipos/dominancia-alquimica-experimental.test.mjs`.

**Gate para integrar ao Phaser:** decisão expressa do criador sobre critério de dominância, empates e suas relações com potência final/efeitos heterogêneos; avaliação de UI; integração e QA transacional sem migração destrutiva. **Não mesclar a PR #96 por resultado positivo destes testes.**
