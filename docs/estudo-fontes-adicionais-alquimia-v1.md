# Alquimia — Contribuição da 3ª e 4ª Fonte (estudo de design v1.0)

> **03/11/2026 · [PROPOSTA / EXPERIMENTO, NÃO CANÔNICO]**. Constituição v1.0, Emenda A2, e `data/curadoria_ingredientes.json` seguem soberanas.
> **Não aprova potência final, duração, qualidade, segurança, nova ação, custo, limiar de perícia ou fórmula de nomeação.**
> Continuação de [Estudo de Dominância](estudo-dominancia-alquimica-v1.md) e do [Roadmap de Crafting](roadmap-crafting-mecanicas-menus.md). Protótipos independentes na branch `design/fontes-adicionais-alquimia-20261103`.

## 1. Problema de design

O requisito aprovado é **pelo menos dois tipos diferentes de ingredientes para ativar cada efeito**. Na pesquisa de combinações de até 4 tipos, uma fonte adicional pode: (a) ativar um efeito que até então tinha só uma origem; (b) fornecer **outra fonte** para um efeito já ativo; (c) fornecer ambos; (d) carregar propriedades que se ativarão em conjunto com outro ingrediente, inclusive indesejadas. **Não é correto atribuir potência, duração ou qualidade extra automaticamente** a cada ingrediente adicionado: a intensidade I–III é um dado de origem, não uma regra final.

**Separar sem ambiguidade:**
1. **Conjunto de efeitos ativos [CANÔNICO]:** duas fontes distintas por efeito, todas preservadas, nenhuma propriedade descartada por família ou nome de combo.
2. **Índice de núcleo [SOMENTE ESTUDO]:** as duas intensidades mais altas por efeito, seguindo M2 do estudo anterior; não é dano, duração nem potência aprovados.
3. **Excedente de fontes [SOMENTE ESTUDO]:** intensidades restantes, após escolher as duas maiores; registra **quanto material contribui além do núcleo** sem converter esse número diretamente em mecânica.
4. **Interações [CANÔNICO]:** somente incompatibilidades aprovadas criam **Impuro**; somente sinergias aprovadas geram nomes especiais. Uma propriedade negativa adicional **não cria automaticamente incompatibilidade**.
5. **Conhecimento / custo / tratamento / uso [ABERTO]:** Peren talvez ainda não conheça todos os efeitos, e nenhuma regra de XP, ação, tempo, perda ou consumo adicional foi aprovada neste estudo.

## 2. Quatro experimentos concretos da curadoria

### 2.1 Cadeia A — fonte extra sem fortalecer o núcleo M2

| Etapa | Tipos acrescentados | `aumentar_forca` | `aumentar_constituicao` | Efeitos extras ativados |
| --- | --- | --- | --- | --- |
| 2 | Carapaça de Caranguejo + Betta do Rio | II+II: núcleo **4**, excedente **0** | Inativo (uma fonte) | Nenhum |
| 3 | + Garras de Urso | II+II+II: núcleo **4**, excedente **2** | III+II: núcleo **5**, excedente **0** | Constituição é ativada |
| 4 | + Chifres de Alce | II+II+II+II: núcleo **4**, excedente **4** | III+II+II: núcleo **5**, excedente **2** | Nenhum novo efeito |

**Implicação:** sob uma proposta que usa *somente* duas fontes para potência, a 4ª fonte é **redundante no índice M2**; sob soma integral, Força muda de 6 para 8, Constituição de 5 para 7. Isso não autoriza dizer que o ingrediente é inútil: ele tem custo e uma contribuição material rastreável, cuja tradução mecânica permanece **a decidir**.

### 2.2 Cadeia B — fonte mais forte muda o núcleo

Mesmo trio (Carapaça + Betta + Garras), mas a 4ª fonte é **Pó de Presa de Mamute**:

- Força: **II+II+II+III**, núcleo M2 muda de **4 para 5**; excedente passa de 2 para **4**.
- Constituição: **III+II**, núcleo M2 mantém **5**; sem excedente.
- M2 passa de vantagem de Constituição para **empate entre Constituição e Força**. M1 favorece Força, porque soma 9 contra 5.
- **Nada disso estabelece empate na potência final do jogo**, apenas empate entre índices da hipótese M2.

### 2.3 Cadeia C — a 4ª fonte também pode ativar efeito indesejado

Mesmo trio, mas a 4ª fonte é **Amanita Rubra**:

- Força recebe quatro fontes II: núcleo M2 **4**, excedente **4**, soma integral **8**.
- Constituição mantém III+II: núcleo **5**, excedente **0**.
- `diminuir_sabedoria` passa a ativo com **I (Betta do Rio) + II (Amanita Rubra)**.
- Isso **não** torna automaticamente o frasco **Impuro**: o conjunto atual de incompatibilidades aprovadas contém explicitamente Carisma+Diminuir Força, não essa combinação. Mesmo assim, o efeito negativo permanece real e deve ser exibido quando conhecido.

**Tensão interessante:** ingredientes extras aumentam flexibilidade, mas também podem **ativar consequências não desejadas** sem uma penalidade artificial.

### 2.4 Cadeia D — a 4ª fonte finalmente ativa uma incompatibilidade aprovada

Quatro tipos: **Coração de Demônio, Língua-de-Dragão, Raiz Botulínica, Asa de Borboleta**. Com os dois primeiros, Carisma já está ativo; com a terceira, Diminuir Força ainda tem apenas uma fonte; com a quarta, **Diminuir Força passa a ter duas** e o preparado torna-se **Impuro** por incompatibilidade aprovada. O conjunto de efeitos do frasco **aumenta**, não diminui, mas sua **classificação muda**.

**Controle de combo aprovado:** Coração de Demônio + Língua-de-Dragão ativam Carisma; acrescentar Cogumelo Escamoso ativa Ilusão e permite identificar **Poção da Fada**. Não existe preparo alternativo fixo para o combo — a identidade vem da **assinatura dos efeitos**.

## 3. Modelos concorrentes para fontes excedentes [TODOS ABERTOS]

| Opção de design | Resultado após duas fontes | Vantagem | Fragilidade / risco |
| --- | --- | --- | --- |
| **F0 — Só composição** | A 3ª/4ª fonte serve para ativar **outros efeitos**; reforços do mesmo efeito não mudam potência nem duração | Simples, robusto, sem sistema adicional | O jogador paga por 3ª/4ª fonte que pode não alterar nada no uso do preparo |
| **F1 — Reforço de potência** | Excedente influencia potência real por fórmula **ainda inexistente** | Valoriza investimento em material | Pode gerar *power creep*, premia quantidade, comparação heterogênea continua aberta |
| **F2 — Duração/alcance** | Excedente pode sustentar tempo/alcance do efeito por unidade semântica própria, depois de definir cada efeito | Diferencia intensidade de permanência; reconhece fontes redundantes | Alguns efeitos são instantâneos, permanentes ou não possuem duração/alcance aplicável |
| **F3 — Estabilidade ou confiabilidade** | Excedente poderia reduzir risco operacional de preparo por regra futura | Oferece razão não numérica para usar fontes extras | **Nunca** pode neutralizar automaticamente **Impuro**; não inventar “pureza” como porcentagem |
| **F4 — Reserva / recurso não aplicado** | Registrar fontes excedentes como metadado; adiar qualquer benefício até semântica e testes aprovados | Mantém evidência e não inventa poder | Pode parecer sem recompensa na primeira versão; requer feedback honesto |

**Candidato prioritário para prototipagem:** **F4** (registrar `sourceCount`, `twoStrongest` e `otherSources` como **diagnóstico** separado do produto final). Isso preserva a possibilidade de testar F1, F2 ou F3 no futuro, sem fixar multiplicadores ou tempo fictício. **F4 não significa que o jogador ganha qualidade, duração ou estabilidade por ter mais materiais.**

**Recomendação de projeto:** não escolher **uma regra universal** para todos os 53 efeitos sem antes definir as categorias semânticas: aumento temporário de atributo, resistência, dano instantâneo, cura, voo, invisibilidade, efeitos permanentes, bálsamos em itens, venenos e transformações. Um efeito instantâneo não recebe “+duração” automaticamente; um elixir permanente não deveria sofrer o mesmo escalonamento temporal de um tônico.

## 4. Interface e feedback ao jogador [PROPOSTA]

Na tela de fabricação, após identificação das propriedades, exibir **fontes identificadas por efeito** e diferenciação visual discreta:
- **Ativado:** pelo menos dois tipos conhecidos com aquele efeito.
- **Fontes adicionais conhecidas:** marcador de redundância material; **não** alegar “+20% duração”, “mais estável” ou “mais puro” sem regra aprovada.
- **Novo efeito ativado:** destacar que a inclusão de uma fonte combinou propriedades já existentes para revelar efeito adicional.
- **Consequência:** efeitos adversos reconhecidos aparecem com mesma integridade dos benéficos; apenas conflito do catálogo aprovado justifica **Impuro**.
- **Conhecimento oculto:** Peren só vê propriedades identificadas, embora o motor calcule o conjunto real. O estudo não autoriza revelar efeitos inesperados antes da regra normal de descoberta.
- **Recursos:** no futuro, mostrar custo e risco de uma fonte adicional **antes da confirmação**, mas sem pressupor que uma unidade por ingrediente corresponde a um item preparado, conforme contrato ainda aberto.

**Importante:** a decisão **qual efeito domina o nome** fica em outro gate. M2 é um candidato de índice; o benefício marginal da 3ª/4ª fonte, se houver, é decisão independente.

## 5. Prova de conceito e QA

**Branch isolada:** `design/fontes-adicionais-alquimia-20261103`:
- `prototipos/estudo-fontes-adicionais.mjs`: funções puras `examineMixture`, `compareAdditionalSource`, `examineSequence`; aplica duas fontes por efeito, conta origem total e excedente, identifica novos efeitos, reforços, incompatibilidades e sinergias **aprovadas**; sem fórmulas de potência real.
- `prototipos/estudo-fontes-adicionais.test.mjs`: **16/16** verificações executadas em JS/V8 isolado usando curadoria + catálogo de combos reais. Testa ativação, fonte redundante, fonte de intensidade superior, efeito secundário adverso, incompatibilidade verdadeira, identidade da Fada, ordem, ingredientes duplicados, imutabilidade e sigilo dos modelos.
- Painel HTML offline (na mesma branch) apresenta a evolução de duas para três e quatro fontes, com comparador sem efeitos de gameplay.

**Não validado ainda:** `node --test` em CI, renderização real em navegador, integração Phaser, QA de dispositivo físico, persistência de fonte/efeito no inventário, performance e aprovação de balanceamento. Os índices não devem ser apresentados como valores de poder em jogo.

## 6. Decisões pendentes e próximos gates

- **SRC-D01 [P0 design]:** definir **o que conta como reforço** depois do segundo tipo: só novas propriedades, potência, duração, confiabilidade ou combinação dependente do efeito.
- **SRC-D02 [P0 design]:** definir se M2 (duas maiores) é apenas **referência de nomeação**, núcleo de potência ou hipótese rejeitada; testar influência de materiais de intensidade III.
- **SRC-D03 [P0 efeitos]:** mapear **categorias semânticas dos 53 efeitos** para tratamento não uniforme de duração, recuperação, transformação e atributos.
- **SRC-D04 [P1 UX]:** mostrar contribuição marginal e risco sem spoilers e sem falsa promessa de aumento de poder; clareza no mobile/Xbox.
- **SRC-D05 [P1 QA/persistência]:** preservar origens, número de tipos e efeitos em instância transacional de preparado futuro; nenhuma migração destrutiva.
- **SRC-Q01–SRC-Q08:** aceites: ativação de novo efeito; fonte redundante não muda o índice M2; fonte mais forte muda o núcleo; efeito prejudicial não implica Impuro; incompatibilidade aprovada pode surgir no 4º tipo; combo só por assinatura aprovada; ordem das fontes não muda resultado final; sem potência/duração/qualidade inventadas.

**Status:** estudo do design e protótipos isolados. Nenhum conjunto especial de ingredientes, bônus, animação, regra de estabilidade ou mecânica de duração foi canonizado.
