# Pareceres P2 — produção, circulação e hidrografia dos ingredientes de Peren

**07/11/2026 · Estado: pareceres documentais, não executáveis.** 16/16 fichas P2 examinadas. Este relatório é um **handoff editorial**, não uma atualização da fonte de gameplay.

## Fontes

- [Fila de investigação dos 106](../data/fila-investigacao-territorial-ingredientes.json) — parecer estruturado de cada ingrediente, ID, zona procedural, fontes, evidência e lacuna.
- [Matriz ecológica 111/111](../data/auditoria_ecologica_ingredientes.json) — fatos de Peren, hipóteses separadas, referências de Monstros.
- [Matriz territorial 111/111](../data/auditoria_territorial_ingredientes.json) — reconstrução **estática** do gerador. Não é inventário de habitats.
- [Atlas de hidrografia](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md), [atlas básico](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/ATLAS_BASE_REGIOES_ASSENTAMENTOS_CULTURAS_MONSTROS_V0_1.md), [Deméter e Portomonte](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/ATLAS_DEMETER_PORTOMONTE_CICLO51.md) e [contexto produtivo de Thargrid](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/LORE_HACK_CARCACA_DW.md). Fontes adicionais e seu status estão discriminados em cada parecer.

## Resultado

| Frente | Fichas P2 | Pareceres emitidos | Habitat/produção regional nova homologada |
|---|---:|---:|---:|
| Agricultura, criação, colmeias e manufatura | **8** | **8** | **0** |
| Águas, desova, captura e concreções | **8** | **8** | **0** |
| **Total P2** | **16** | **16** | **0** |

Com a rodada, a fila de 106 possui **52 pareceres iniciais** (11 P0 + 25 P1 + 16 P2) e **54 P3 sem primeiro parecer**. Um parecer inicial é um inventário do que pode ser afirmado, **não uma certificação ecológica ou aprovação autoral**.

## Critério material para avaliar proveniência

A identidade do objeto, a área de ocorrência natural, o local de transformação, o ponto de venda e o método de obtenção são dimensões distintas. Uma cidade pode comercializar produto obtido fora dela. Uma região agrícola não produz necessariamente todas as culturas. Uma resistência ao gelo nas propriedades alquímicas não demonstra o habitat do animal.

O atlas documenta agricultura em Portomonte e Grama-Cortada, assim como minas, oficinas e produção de alimentos em Thargrid. **Não documenta especificamente trigo, alho, uvas, galinhas, apiários ou autômatos produzidos nesses locais.** O Rio Ancestral é real na ambientação, mas a distribuição dos peixes, tributários, trajetórias migratórias e locais de desova permanece aberta.

## Agricultura, criação, colmeias e manufatura

### Abelha (`ing-bee`)

**Zona herdada do gerador:** `portomonte` — **não aprovada como habitat.**

**Fato documentado:** Peren identifica a abelha como inseto polinizador e ingrediente alquímico; a Carcaça possui áreas agrícolas, sem declarar espécie local, apiários ou criadores.

**Questão não resolvida:** Presença regional em Portomonte, distribuição da espécie, relação com Favo de Mel/Casca de Colmeia, eventual criação e método de coleta.

**Proibição de inferência:** Não interpretar agricultura protegida por Deméter como apicultura documentada nem presumir os três materiais originários da mesma espécie.

**Próxima ação editorial:** `identificar_especie_e_relacao_com_colmeia_sem_inventar_apiario`.

**Fontes confrontadas:** `docs/ATLAS_BASE_REGIOES_ASSENTAMENTOS_CULTURAS_MONSTROS_V0_1.md`; `data/taxonomia_carcaca.json`.

### Casca de Colmeia (`ing-beehive-husk`)

**Zona herdada do gerador:** `drakport` — **não aprovada como habitat.**

**Fato documentado:** Peren descreve fragmentos de colmeia; o atlas registra agricultura e paisagens florestais, mas não criadores nem espécie produtora.

**Questão não resolvida:** Espécie de inseto, formação da estrutura, obtenção do material e eventual comércio em Drakport.

**Proibição de inferência:** Não criar apiários em Drakport/Portomonte e não unir automaticamente Casca de Colmeia, Abelha e Favo de Mel por origem biológica.

**Próxima ação editorial:** `diferenciar_colheita_de_colmeia_e_circulacao_comercial`.

**Fontes confrontadas:** `docs/ATLAS_MACROAMBIENTES_CICLO35.md`; `docs/ATLAS_DEMETER_PORTOMONTE_CICLO51.md`.

### Favo de Mel (`ing-honeycomb`)

**Zona herdada do gerador:** `alem-sul` — **não aprovada como habitat.**

**Fato documentado:** Peren descreve favo nutritivo; existem regiões de cultivo e comércio, mas nenhum povoado produtor de mel ou espécie de abelha identificada.

**Questão não resolvida:** Origem da colmeia, espécie produtora, método de obtenção e eventual circuito de venda no Além Sul.

**Proibição de inferência:** Não presumir mel da mesma colmeia que fornece Casca de Colmeia ou Abelha; agricultura não demonstra criação de abelhas.

**Próxima ação editorial:** `distinguir_produto_animal_e_rede_de_fornecimento`.

**Fontes confrontadas:** `docs/ATLAS_BASE_REGIOES_ASSENTAMENTOS_CULTURAS_MONSTROS_V0_1.md`; `data/taxonomia_carcaca.json`.

### Alho (`ing-garlic`)

**Zona herdada do gerador:** `garganta` — **não aprovada como habitat.**

**Fato documentado:** Peren descreve bulbo de horta; a Carcaça documenta agricultura em Portomonte e Grama-Cortada, sem inventário de cultivos por cidade.

**Questão não resolvida:** Quem cultiva alho, em qual solo e zona, escala e forma de transporte/comercialização; Garganta é a zona do gerador.

**Proibição de inferência:** Não converter o alho em cultura obrigatória de Garganta ou Grama-Cortada; manter Curar Doença II e outros três efeitos aprovados.

**Próxima ação editorial:** `distinguir_produto_de_horta_de_producao_regional_comprovada`.

**Fontes confrontadas:** `docs/ATLAS_BASE_REGIOES_ASSENTAMENTOS_CULTURAS_MONSTROS_V0_1.md`; `docs/ATLAS_DEMETER_PORTOMONTE_CICLO51.md`.

### Ovo de Galinha (`ing-chicken-s-egg`)

**Zona herdada do gerador:** `thargrid` — **não aprovada como habitat.**

**Fato documentado:** Peren descreve ovo culinário abundante; a Carcaça possui agricultores e sistemas de provisão, mas não inventário de galinheiros por região.

**Questão não resolvida:** Espécie/linhagem criadora, local de postura, rede de abastecimento e significado da zona Thargrid: produção ou circulação.

**Proibição de inferência:** Não inventar galinheiro de Thargrid, Portomonte ou Grama-Cortada; 'abundante' no catálogo não prova reprodução em todas as cidades.

**Próxima ação editorial:** `separar_disponibilidade_comercial_de_criacao_local`.

**Fontes confrontadas:** `docs/ATLAS_BASE_REGIOES_ASSENTAMENTOS_CULTURAS_MONSTROS_V0_1.md`; `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`.

### Trigo (`ing-wheat`)

**Zona herdada do gerador:** `thargrid` — **não aprovada como habitat.**

**Fato documentado:** Peren descreve cereal comum; o atlas confirma produção agrícola diversificada em Grama-Cortada e agricultura favorecida em Portomonte, sem nomear trigo como cultivo.

**Questão não resolvida:** Onde o trigo é cultivado, disponibilidade em Thargrid, armazenagem, necessidade hídrica específica e circuito de distribuição.

**Proibição de inferência:** Não inventar monocultura, excedentes ou dependência comercial de Thargrid; o benefício agrícola de Deméter não prova trigo.

**Próxima ação editorial:** `investigar_cultivo_especifico_e_abastecimento_sem_concluir_monopolio`.

**Fontes confrontadas:** `docs/ATLAS_BASE_REGIOES_ASSENTAMENTOS_CULTURAS_MONSTROS_V0_1.md`; `docs/ATLAS_DEMETER_PORTOMONTE_CICLO51.md`; `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`.

### Uvas de Jasmim (`ing-jazbay-grapes`)

**Zona herdada do gerador:** `garganta` — **não aprovada como habitat.**

**Fato documentado:** Peren descreve uvas aromáticas; o atlas menciona sociedades agrícolas, mas não vinhedos ou cultivo de uva específica em Garganta.

**Questão não resolvida:** Zona produtora, terra/água para vinha, transformação do extrato, origem comercial e eventuais produtores.

**Proibição de inferência:** Não fabricar viticultura aristocrática, monocultura ou rota colonial na Garganta; propostas de povoamento do Além Sul não tornam a espécie canônica.

**Próxima ação editorial:** `distinguir_uva_comercial_de_vinicultura_local`.

**Fontes confrontadas:** `docs/ATLAS_BASE_REGIOES_ASSENTAMENTOS_CULTURAS_MONSTROS_V0_1.md`; `docs/POVOAMENTO_ECOLOGIA_ALEM_SUL_CICLO54.md`.

### Óleo de Autômato (`ing-dwarven-oil`)

**Zona herdada do gerador:** `shadar-riverie` — **não aprovada como habitat.**

**Fato documentado:** Peren identifica lubrificante arcano retirado de mecanismos anões; a Carcaça documenta forjas e infraestrutura anã em Thargrid.

**Questão não resolvida:** Se há autômatos próprios dessas oficinas, onde são fabricados, como o óleo é obtido ou reciclado, e por que está disponível na zona procedural Shadar-Riverie.

**Proibição de inferência:** Oficina anã não implica fábrica de autômatos nem rota de óleo; núcleos propostos do Ciclo LXII não são estabelecimentos canônicos.

**Próxima ação editorial:** `confrontar_tecnologia_do_automato_e_procedencia_do_oleo`.

**Fontes confrontadas:** `docs/LORE_HACK_CARCACA_DW.md`; `docs/ATLAS_MACROAMBIENTES_CICLO35.md`; `docs/ENGENHARIA_POLITICA_DA_FORJA_THARGRID_CICLO62.md`.

## Águas, desova, captura e concreções

### Carpa de Pedra (`ing-histcarp`)

**Zona herdada do gerador:** `portomonte` — **não aprovada como habitat.**

**Fato documentado:** Peren descreve carpa resistente e atributos aquáticos; o atlas documenta rio, costa e mares com limites hídricos ainda abertos.

**Questão não resolvida:** Tipo de água, região e população da Carpa de Pedra; não há demonstração de corpo pétreo ou filiação à ossatura de Golzdov.

**Proibição de inferência:** Não transformar Portomonte em área de captura, nem estender o nome 'Pedra' à anatomia mineral real.

**Próxima ação editorial:** `especificar_agua_e_especie_antes_de_pesca_regional`.

**Fontes confrontadas:** `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`; `data/taxonomia_carcaca.json`.

### Craca de Rio (`ing-nordic-barnacle`)

**Zona herdada do gerador:** `eldroth` — **não aprovada como habitat.**

**Fato documentado:** Peren descreve craca de água doce aderida a rochas e embarcações; a Carcaça possui Rio Ancestral, mas não todos os seus tributários e trechos.

**Questão não resolvida:** Identidade e distribuição da craca, salinidade concreta do trecho, rochas ou embarcações colonizadas, origem em Eldroth.

**Proibição de inferência:** Presença em embarcação não prova que o animal seja nativo do porto; não presumir ocorrência no Abismo ou em todo o rio.

**Próxima ação editorial:** `localizar_microhabitat_sem_confundir_transporte_com_natividade`.

**Fontes confrontadas:** `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`; `docs/ATLAS_MACROAMBIENTES_CICLO35.md`.

### Ovas de Piranha (`ing-slaughterfish-egg`)

**Zona herdada do gerador:** `ironwood` — **não aprovada como habitat.**

**Fato documentado:** Peren descreve ovas de peixe predador, de identidade ainda não localizada; o atlas não atesta piranhas no Rio Ancestral ou águas rubras.

**Questão não resolvida:** Espécie produtora, se compartilha espécie com Escamas de Piranha, bacia e época/condições de desova em Ironwood.

**Proibição de inferência:** Não converter proximidade nominal em identidade genética ou usar toda a bacia do Rio Ancestral como local de coleta.

**Próxima ação editorial:** `identificar_especie_reprodutiva_sem_inventar_periodo_de_desova`.

**Fontes confrontadas:** `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`; `data/taxonomia_carcaca.json`.

### Ovas de Salmão (`ing-salmon-roe`)

**Zona herdada do gerador:** `thargrid` — **não aprovada como habitat.**

**Fato documentado:** Peren descreve ovas de salmão; o atlas registra picos nevados de Thargrid e Rio Ancestral, mas não os conecta hidrogeograficamente.

**Questão não resolvida:** Habitat do salmão, se migra, onde desova, existência de rios de montanha ou comércio de ovas em Thargrid.

**Proibição de inferência:** Não inferir que neve fornece água ao Rio Ancestral ou que salmões desovam em Thargrid por analogia com ecologia terrestre.

**Próxima ação editorial:** `separar_regime_hidrico_de_habitat_e_abastecimento`.

**Fontes confrontadas:** `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`.

### Peixe de Escamas Finas (`ing-cyrodilic-spadetail`)

**Zona herdada do gerador:** `thargrid` — **não aprovada como habitat.**

**Fato documentado:** Peren descreve peixe de água doce; o Rio Ancestral está documentado, mas o atlas ainda não mapeia nascentes e afluentes.

**Questão não resolvida:** Qual bacia e trecho têm ocorrência natural, se há mercado fluvial ou captação alternativa, e relação da zona gerada Thargrid.

**Proibição de inferência:** Não presumir natividade em todo o Rio Ancestral ou em Thargrid; não criar afluentes por hipótese de pesca.

**Próxima ação editorial:** `identificar_bacia_e_fonte_de_captura`.

**Fontes confrontadas:** `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`.

### Perca Prateada (`ing-silverside-perch`)

**Zona herdada do gerador:** `garganta` — **não aprovada como habitat.**

**Fato documentado:** Peren registra peixe de escamas claras, com resistência ao gelo como efeito alquímico; o atlas tem rios, costa e oceano sem população desta espécie identificada.

**Questão não resolvida:** Água doce/salgada, corpo hídrico e captura; a zona Garganta não comprova fonte.

**Proibição de inferência:** Resistência ao Gelo II não demonstra habitat gelado; não inventar pesca em Garganta ou Thargrid por efeito.

**Próxima ação editorial:** `identificar_tipo_de_agua_sem_usar_efeito_como_evidencia`.

**Fontes confrontadas:** `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`.

### Pérola (`ing-pearl`)

**Zona herdada do gerador:** `drakport` — **não aprovada como habitat.**

**Fato documentado:** Peren identifica a Pérola como concreção de origem marinha; o atlas confirma Mar de Sangue, águas azuis e uma fronteira móvel.

**Questão não resolvida:** Organismo produtor, banco, coleta, água de origem, transporte até Drakport e vínculo com Pérola Pequena.

**Proibição de inferência:** Não atribuir ao Mar de Sangue inteiro, supor molusco específico nem afirmar que as duas pérolas são da mesma espécie.

**Próxima ação editorial:** `distinguir_matriz_marinha_de_circulacao_para_porto`.

**Fontes confrontadas:** `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`; `docs/ATLAS_MACROAMBIENTES_CICLO35.md`.

### Pérola Pequena (`ing-small-pearl`)

**Zona herdada do gerador:** `shadar-riverie` — **não aprovada como habitat.**

**Fato documentado:** Peren descreve uma pérola pequena usada em preparados e amuletos; diferente da Pérola maior, o texto não afirma expressamente origem marinha.

**Questão não resolvida:** Organismo ou processo de formação, tipo de água, zona de captura, eventual comércio em Shadar-Riverie e relação com Pérola.

**Proibição de inferência:** Não transportar automaticamente a origem marinha da Pérola maior para esta ficha; manter IDs e efeitos independentes.

**Próxima ação editorial:** `registrar_especie_e_processo_produtor_sem_unificar_fichas`.

**Fontes confrontadas:** `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`.

## Relações entre ingredientes — não equivalem a cadeias aprovadas

| Conjunto | O que sabemos no catálogo | O que ainda falta |
|---|---|---|
| Abelha / Favo de Mel / Casca de Colmeia | Três materiais descritos separadamente, com efeitos alquímicos próprios | Identidade da espécie produtora, eventual relação biológica, método de obtenção, criação e circulação regional |
| Escamas de Piranha / Ovas de Piranha | Dois insumos distintos associados nominalmente ao peixe predador | Espécie, população, águas de ocorrência, sazonalidade de postura e ligação entre os dois materiais |
| Pérola / Pérola Pequena | Pérola maior descrita expressamente como marinha; a menor é descrita pela dimensão e uso | Organismo produtor, ambiente da pequena, se possuem mesmo produtor, local de coleta e cadeia mercantil |
| Produção de alimentos / centros de venda | Agricultura e circulação comercial constam da ambientação da Carcaça | Culturas específicas, produção, abastecimento de cada cidade e capacidade produtiva; não construir monoculturas ou monopólios sem prova |

## Interoperabilidade: proposta de contrato para o outro fluxo

Não é autorização para implementar. A eventual modelagem territorial deveria manter campos **separados**, por exemplo:

```json
{
  "ingrediente_id": "ing-histcarp",
  "identidade_material": "descrita_em_peren",
  "habitat_confirmado": null,
  "zona_procedural_legada": "portomonte",
  "local_producao_confirmado": null,
  "ponto_comercio_confirmado": null,
  "modo_obtencao_confirmado": null,
  "fonte_primaria_territorial": null,
  "aprovacao_autoral": false,
  "pode_alimentar_loot": false
}
```

O exemplo é **contrato editorial ilustrativo**, não arquivo de dados executável. A zona `portomonte` é a herança do gerador, não confirmação de carpas locais.

## Protocolo de aceite de futuros vínculos

1. **Identidade:** a descrição do ingrediente identifica material, espécie ou processo de fabricação? Se apenas sugere, explicitar a dúvida.
2. **Ocorrência:** há evidência sobre uma espécie/material naquela região específica? Se não, `habitat_confirmado: null`.
3. **Produção e trabalho:** quem extrai, cultiva, manufatura ou transporta? Não deduzir atividades de uma categoria política ou cultural.
4. **Circulação:** mercados ou zonas legadas não demonstram lugar de origem; não confundir porto com habitat.
5. **Impacto de gameplay:** autorizações para spawn, loot e economia são deliberações independentes, com diff e testes no fluxo de mecânicas.

## QA e limites

- **16/16 P2** com parecer, fontes conferidas contra a matriz ecológica e IDs estáveis.
- **52/106** pareceres iniciais concluídos no total; **54 P3** ainda aguardam a primeira passagem.
- **Zero** novas localidades, habitats, taxa de captura, produção comercial, preço, atribuição de loot ou espécie criada nesta rodada.
- Sem edição em `data/curadoria_ingredientes.json`, `data/itens.json`, receitas, engines clássico/Phaser, assets, menus, inventário, PWA ou saves.
- **Verificação estática:** não é teste de coleta no jogo, execução do gerador, revisão integral do catálogo compilado ou confirmação de deploy no dispositivo.

**Próxima frente:** os 54 P3. Fichas sem marcador específico de risco **não estão comprovadas**, apenas possuem uma investigação editorial de rotina no estado atual.
