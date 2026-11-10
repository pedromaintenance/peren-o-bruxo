# Curtume de Peren — 20 receitas, quatro materiais, cinco formas e função das bolsas

**09/11/2026 · Estado:** parecer editorial, **sem** aprovação de mudanças em produtos, receita, slots ou ambientação.

**Base rastreável:** [matriz individual de 20 pareceres](../data/auditoria-curtume-20-v1.json), [inventário de 139 receitas artesanais](../data/auditoria-crafting-nao-alquimico-v1.json), [gerador original](../ferramentas/build_data.py), [cidades](../data/cidades.json) e [motor clássico](../game.js). **Limite técnico:** reconstrução documental do gerador, sem auditoria de ponta a ponta de `data/itens.json` e `data/receitas.json` compilados, sem playtest do Phaser.

## 1. Inventário material

O Curtume contém **20 receitas**, geradas por **quatro materiais × cinco formas**. A maior parte da lista (15 receitas) emprega **materiais têxteis**, embora o ofício se chame Curtume.

| Material de origem | Perícia de Curtume exigida nas cinco receitas | Defesa cadastrada de qualquer forma | Raridade cadastrada | Zona técnica, não comprovada como origem |
|---|---:|---:|---|---|
| **Couro curtido** | 8 | 2 | undefined | `alem-sul` |
| **Linho de Deméter** | 8 | 2 | undefined | `portomonte` |
| **Linha de seda** | 16 | 3 | undefined | `portomonte` |
| **Fibra de Aranha Yokai** | 32 | 5 | undefined | `boca-abismo` |

As cinco formas são **Traje, Capuz, Manto, Bolsa de Coleta e Braçadeiras**. Traje/Manto consomem **3** unidades do material principal. Capuz/Bolsa/Braçadeiras consomem **2**. Nenhuma receita deste bloco pede agulha, linha adicional, molde ou ferramenta como insumo consumível; isso não significa que um artesão não pudesse usar ferramentas reutilizáveis. **Não foram documentadas no grafo das 572 receitas não alquímicas etapas de produzir couro curtido, linha de seda, linho ou fibra de aranha**, de modo que as quatro matérias-primas entram prontas no jogo.

O **Couro Curtido** tem outro papel: integra **35 receitas da Forja** além das cinco do Curtume. O **Linho de Deméter** entra em **320 receitas de Escrita** além das cinco peças de vestuário. Essa dupla dependência precisa orientar abastecimento e economia quando forem introduzidos processamento e estoques.

### Os 20 produtos, um a um

| Produto | Insumo | Valor nominal | Defesa cadastrada | Slot normal no clássico |
|---|---|---:|---:|---|
| Traje de Couro curtido | 3 × Couro curtido | 60 | 2 | armor |
| Capuz de Couro curtido | 2 × Couro curtido | 40 | 2 | armor |
| Manto de Couro curtido | 3 × Couro curtido | 60 | 2 | armor |
| Bolsa de Coleta de Couro curtido | 2 × Couro curtido | 40 | 2 | nenhum_na_UI |
| Braçadeiras de Couro curtido | 2 × Couro curtido | 40 | 2 | armor |
| Traje de Linho de Deméter | 3 × Linho de Deméter | 60 | 2 | armor |
| Capuz de Linho de Deméter | 2 × Linho de Deméter | 40 | 2 | armor |
| Manto de Linho de Deméter | 3 × Linho de Deméter | 60 | 2 | armor |
| Bolsa de Coleta de Linho de Deméter | 2 × Linho de Deméter | 40 | 2 | nenhum_na_UI |
| Braçadeiras de Linho de Deméter | 2 × Linho de Deméter | 40 | 2 | armor |
| Traje de Linha de seda | 3 × Linha de seda | 120 | 3 | armor |
| Capuz de Linha de seda | 2 × Linha de seda | 80 | 3 | armor |
| Manto de Linha de seda | 3 × Linha de seda | 120 | 3 | armor |
| Bolsa de Coleta de Linha de seda | 2 × Linha de seda | 80 | 3 | nenhum_na_UI |
| Braçadeiras de Linha de seda | 2 × Linha de seda | 80 | 3 | armor |
| Traje de Fibra de Aranha Yokai | 3 × Fibra de Aranha Yokai | 240 | 5 | armor |
| Capuz de Fibra de Aranha Yokai | 2 × Fibra de Aranha Yokai | 160 | 5 | armor |
| Manto de Fibra de Aranha Yokai | 3 × Fibra de Aranha Yokai | 240 | 5 | armor |
| Bolsa de Coleta de Fibra de Aranha Yokai | 2 × Fibra de Aranha Yokai | 160 | 5 | nenhum_na_UI |
| Braçadeiras de Fibra de Aranha Yokai | 2 × Fibra de Aranha Yokai | 160 | 5 | armor |

## 2. Falha funcional: quatro bolsas sem mecânica de coleta

As quatro **Bolsas de Coleta** possuem categoria `utilitario`, tipo `bolsa` e até **Defesa** no registro, porém:

- A interface clássica só oferece **Equipar** aos itens `arma`, `armadura`, `escudo`, `reliquia` e `acessorio`. Bolsas utilitárias não recebem esse comando, nem um comando próprio de uso.
- A rotina de coleta `gather()` escolhe itens e quantidades com base em expedição e perigo, **sem verificar o inventário ou equipamentos de bolsas**. Ter uma Bolsa de Coleta não altera essa rotina.
- O número exibido junto ao ícone de bagagem é a soma de quantidades do inventário, e não uma capacidade máxima. Nenhuma vantagem de capacidade/carga foi identificada na versão clássica auditada.
- A função interna `equip()`, caso seja invocada diretamente com um utilitário, tem um fallback genérico para `relic`, mas a UI normal não encaminha bolsas para ela. Não usar esse comportamento como argumento para habilitar bolsas mágicas.

**Problema comprovado:** as bolsas são produtos fabricáveis e comerciáveis, **não ferramentas funcionais de coleta** no motor clássico examinado. Isso pode ser escolha temporária do protótipo, mas a interface sugere um benefício inexistente.

**Gate CUR-01:** decidir primeiro qual problema logístico o produto resolve (capacidade, organização, proteção contra perda, instrumentos ou bônus de coleta), com efeitos perceptíveis e teste de save. Não introduzir carga máxima retroativamente sem política de migração.

## 3. Falta de distinção funcional entre formas

As outras **16 peças** são `armadura`. `equip()` as encaminha todas para o slot **`armor`**. O personagem não pode vestir capuz, traje, braçadeiras e manto simultaneamente: equipar um substitui o anterior.

Em cada matéria-prima, as cinco formas recebem **a mesma Defesa cadastrada**, inclusive a bolsa, embora só as quatro peças de vestuário tenham caminho normal para equipar e utilizar Defesa. As quantidades e valores variam, mas **não há justificativa funcional para pagar mais material por um traje do que por braçadeiras se ambos oferecem o mesmo valor de Defesa e concorrem pelo mesmo slot**.

O sistema pode optar por abstração de proteção em um único slot. Contudo, isso exigiria explicar o uso de cada forma e impedir que o jogador interprete `Capuz` como item que complementa o `Traje` — pois atualmente o substitui.

**Opções CUR-05/CUR-06, nenhuma aprovada:** manter `armor` único com rótulos claros; criar slots separados por peça com migração dos saves; ou tratar acessórios têxteis como modificadores de uma armadura principal. A diferenciação de clima, carga, furtividade, proteção, qualidade e reparo precisa ser deliberada, não presumida.

## 4. As quatro fontes materiais e seu trabalho oculto

**Couro Curtido.** É matéria-prima que já sofreu tratamento. O catálogo não comprova espécie, relação com criação/caça, agente curtidor, técnica ou destino dos resíduos. **Além Sul** está no cadastro como zona do material, mas não é prova de rebanho, oficina ou cadeia extrativa.

**Linho de Deméter.** O manuscrito confirma agricultura em **Portomonte**, sustentada por um templo ligado a Deméter, mas **não comprova plantio de linho, fiação, tecelagem, sacralidade de toda peça nem controle sacerdotal do tecido**. A mesma matéria serve a 320 grimórios, o que abre uma pergunta econômica relevante: como distribuir tecido entre vestuário e escrita?

**Linha de Seda.** Uma linha não é automaticamente um tecido. O gerador salta diretamente da linha para roupa acabada, sem desenhar tecelagem/corte. Não há fonte autorizada para espécie produtora, trabalho dos fiandeiros, oficinas ou comércio de seda em Portomonte.

**Fibra de Aranha Yokai.** O manuscrito utiliza **Yokai** como povo élfico antigo; o bestiário também usa `yokai` como tipo de criatura. Esses usos não devem ser fundidos sem fonte. A proposta de aranhas inteligentes em Eldroth e os estudos recentes sobre autonomia dos corpos **não são cânone aprovado**. Não introduzir exploração, cativeiro, destruição de ninhos ou drops de pessoas como economia automática da fibra. A zona **Boca do Abismo** do cadastro não demonstra a origem.

**Observação de processo:** a maior parte das receitas seria mais claramente explicada pela tríade **material tratado → tecelagem/corte → costura/acabamento**. Mas criar novas estações ou obrigar ferramentas agora tornaria receitas antigas potencialmente inacessíveis. O ofício poderia continuar unificado em nome da simplicidade, desde que o design explique a abstração.

## 5. Oficinas, progressão e economia de trabalho

O cadastro do clássico dispõe de Curtume em **Portomonte, Thargrid, Ironwood e Além Sul**. Peren começa em **Portomonte com proficiência Curtume 0**, enquanto as primeiras peças exigem **8**, a seda **16** e a fibra Yokai **32**. Tutores locais permitem treinamento pago quando existe a oficina. Não há necessidade de afirmar impossibilidade de acesso — apenas a existência de uma barreira inicial de progressão.

A simulação utiliza `cost()` e `sellprice()` de `game.js`, **Comércio 9**, compra integral de materiais numa oficina e venda imediata do item ali, **sem confirmar estoque real ou custos de trabalho, ferramentas, transporte e coleta**.

| Cidade com oficina | Saldos positivos / 20 | Nulos | Negativos | Variação hipotética do saldo |
|---|---:|---:|---:|---|
| portomonte | 15 | 0 | 5 | -194 a 29 |
| thargrid | 15 | 0 | 5 | -206 a 35 |
| ironwood | 15 | 0 | 5 | -206 a 35 |
| alem-sul | 15 | 0 | 5 | -206 a 35 |

Nos quatro centros, **15 receitas geram saldo positivo** e **cinco negativo**, sob esse cenário artificial. Os cinco negativos são os produtos de **Fibra de Aranha Yokai**, cujo nível 4 também encarece a matéria-prima nos centros de perigo 1–2.

Isso **não é prova de que curtir couro ou costurar seda seja mais lucrativo que produzir fibra Yokai**. Não verificamos compradores de cada categoria, estoques, distância nem perigos de obtenção. A simulação mostra uma assimetria de valores nominais que merece controle quando a produção profissional entrar na economia.

### Trabalho, sobrevivência e criação de mundo

O Curtume não produz somente armaduras: produz **abrigo, peças de uso diário e soluções de transporte**. O [ciclo LXVIII sobre cuidado e autonomia](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/OS_QUE_SUSTENTAM_A_VIDA_CUIDADO_CICLO68.md) discute, **como proposta não homologada**, adaptações de ferramentas e trabalhos de manutenção para corpos distintos. Essa abordagem pode inspirar opções para mantos, braçadeiras e bolsas, mas não permite afirmar que as comunidades e oficinas propostas existam.

A análise material sugere investigar quem obtém fibras e peles, quem as prepara, quem costura e quem usa o produto. A distribuição do valor entre trabalho, risco e posse do material só poderá ser escrita como fato do cenário após decisões autorais.

## 6. Oito decisões pendentes (CUR-01 a CUR-08)

| Código | Frente | Pergunta central |
|---|---|---|
| **CUR-01** | funcao bolsas | Qual função de coleta, transporte ou organização devem conceder as quatro Bolsas de Coleta? |
| **CUR-02** | processos | Curtume cobre apenas tratamento do couro ou também tecelagem, corte e costura? |
| **CUR-03** | materiais | De onde vêm couro curtido, linho de Deméter e linha de seda; quais etapas antecedem o tecido? |
| **CUR-04** | fibra yokai | O nome Fibra de Aranha Yokai designa criatura, povo, técnica ou mercadoria de procedência mista? |
| **CUR-05** | slots roupa | Como equipar traje, capuz, manto e braçadeiras sem substituir todas as demais armaduras? |
| **CUR-06** | atributos roupa | Qual a função distinta de forma, material e qualidade? |
| **CUR-07** | economia | Como valorar trabalho, ferramentas, tratamento e produção profissional sem arbitrar preço a partir do valor cadastral? |
| **CUR-08** | identidade e social | Que bens atendem sobrevivência, abrigo, proteção e acessibilidade de corpos distintos na Carcaça? |

**Ordem editorial sugerida:** primeiro **CUR-01** (bolsas efetivamente úteis) e **CUR-05** (slots); depois **CUR-02/CUR-06** (gramática do ofício e diferenciação das peças); em seguida **CUR-03/CUR-04** (procedência de materiais), **CUR-07** (economia) e **CUR-08** (equipamentos orientados a necessidades sociais). Todas permanecem abertas.

## 7. Verificação e restrições de integração

- **20/20** receitas com insumos, produto, quantidade, nível, Defesa e observação por ID; **4/4** materiais e **5/5** formas mapeados.
- **16/16** peças da categoria armadura entram no slot `armor` do clássico. **4/4** Bolsas de Coleta não possuem função de coleta implementada no mesmo motor.
- **15/20** usam têxteis; **0/20** possui receita intermediária de processamento do insumo. **35** receitas de Forja também consomem Couro Curtido e **320** receitas de Escrita consomem Linho de Deméter.
- Economia condicional reproduzida em **4/4** cidades com oficina; sem inferência de preço final, lucratividade real, abundância ou comércio regional.
- **0** modificações no gerador, `data/itens.json`, `data/receitas.json`, `game.js`, Phaser, assets, inventário, loot, atributos, save ou decisões canônicas.
- Não foi executado build, playtest, nem comparação integral com compilados grandes. A auditoria verifica o comportamento descrito pelo **código do clássico**, sem presumir equivalência automática com a implementação Phaser.

**Próximo aprofundamento:** as **16 receitas de Cozinha** — coerência dos ingredientes, segurança alimentar ficcional, variedade de efeitos, técnicas, rendimentos e função das refeições na exploração.
