# Fila de investigação ecológica e territorial — 106 ingredientes

**Data:** 05/11/2026 · **Estado:** trabalho editorial, não executável. Referências: [matriz territorial dos 111](../data/auditoria_territorial_ingredientes.json), [fila de investigação dos 106](../data/fila-investigacao-territorial-ingredientes.json), [matriz ecológica dos 111](../data/auditoria_ecologica_ingredientes.json) e [Constituição de Design](constituicao-design-v1.md).

## Escopo e classificação

O gerador original atribui regiões por fórmula `CITIES[(índice_original * 7) % 9]`; **isso não estabelece habitats**. A [auditoria territorial](auditoria-proveniencia-territorial-ingredientes.md) preserva cinco referências anteriores de Peren, sendo uma exclusividade em override curatorial (Pena de Gaivota, Portomonte) e quatro regiões historicamente mantidas na documentação do jogo. Estes cinco registros ficam fora da presente fila, não porque sua ecologia esteja plenamente resolvida, mas porque a localização foi preservada por decisão/documento de autoridade diferente do gerador.

Os outros **106 IDs** foram triados **sem modificar suas zonas**, efeitos, raridades ou características. Esta é uma fila de averiguação, não de realocação automática.

| Categoria | Fichas | Tratamento |
|---|---:|---|
| **P0** | 11 | Pessoas/restos e incongruências textuais: parecer documental antes de introduzir fontes de loot ou novos textos |
| **P1** | 25 | Identidade de fontes, nomes geográficos/rituais e colisão editorial |
| **P2** | 16 | Bacias, costas, cultivos, transporte e recursos produzidos |
| **P3** | 54 | Investigação ambiental geral com fonte regional ainda não demonstrada |
| **Total** | **106** | A prioridade ordena diligência, **não** perigo físico, raridade ou preço |

Os marcadores são **não exclusivos**. Por isso suas quantidades individuais não devem ser somadas. O método, os pesos e as perguntas de cada item estão versionados no JSON da fila.

## Primeiro lote — parecer emitido para os onze P0

O parecer identifica com segurança os **limites do que as fontes comprovam**, mas **não resolve automaticamente** procedência, cadeia de fornecimento, região de coleta, aprovação de texto ou política de drops.

| Material | Zona no gerador | Conclusão documental e próximo ato |
|---|---|---|
| **Beladona** (`ing-nightshade`) | `ironwood` | A descrição atribui interferência na recuperação mágica. Os atributos são dano_saude III, aumentar_magia III e aumentar_ilusao II; não existe efeito de redução da regeneração mágica. **Próximo ato:** `preferir_correcao_de_texto_sem_criar_quarto_efeito`. |
| **Betta do Rio** (`ing-river-betty`) | `shadar-riverie` | A ficha da curadoria não possui as chaves descricao ou origem, mas o gerador original atribui origem de dados separadamente; Shadar-Riverie é apenas a zona procedural. Os efeitos permitem redigir descrição curta sem inferir habitat. **Próximo ato:** `submeter_descricao_nova_e_avaliar_proveniencia_dados_em_separado`. |
| **Carne Humana** (`ing-human-flesh`) | `eldroth` | A ficha só menciona ingrediente macabro negociado às escondidas. O dossiê de Drakport confirma escravização e tráfico, mas não atesta fornecimento deste tecido, vítimas, regras comerciais ou origem em Eldroth. **Próximo ato:** `conservar_ficha_vedar_drop_de_pessoa_ate_decisao_de_procedencia`. |
| **Cinzas de Criatura** (`ing-spawn-ash`) | `alem-sul` | O material é cinza de criatura sobrenatural não especificada. Não há espécie identificada, território de origem ou regra de obtenção, portanto a zona procedural Além Sul não permite gerar drop. **Próximo ato:** `solicitar_classe_ou_fonte_especifica_antes_de_tabela_de_drop`. |
| **Cinzas Mortuárias** (`ing-berit-s-ashes`) | `portomonte` | As cinzas são de um escriba não identificado. O dossiê de Vandar não documenta rito funerário da cidade nem ligação com o escriba do ingrediente; Portomonte também não é origem demonstrada. **Próximo ato:** `manter_identidade_do_morto_indeterminada_ate_fonte`. |
| **Coração Humano** (`ing-human-heart`) | `shadar-riverie` | O coração preservado por rituais existe no catálogo; o cenário de escravização não confirma extração de órgãos, cadeia de comércio nem proveniência no território de Shadar-Riverie. **Próximo ato:** `conservar_ficha_exigir_criterio_de_obtencao_e_representacao`. |
| **Dedo de Gigante** (`ing-giant-s-toe`) | `eldroth` | Gigantes possuem agência e organização social no manuscrito da Carcaça. O ingrediente não identifica indivíduo nem forma de obtenção, e sua zona procedural Eldroth não comprova disponibilidade regional. **Próximo ato:** `conservar_ficha_nao_gerar_caca_a_gigantes_como_mercadoria`. |
| **Escamas de Piranha** (`ing-slaughterfish-scales`) | `ironwood` | A descrição informa antídotos, mas seus atributos são aumentar_defesa II, resistencia_gelo II e dano_saude I. Não há propriedade de cura de envenenamento ou resistência a veneno nesta ficha. **Próximo ato:** `corrigir_alegacao_de_antidoto_ao_inves_de_adicionar_efeito`. |
| **Faixas de Espírito** (`ing-wisp-wrappings`) | `thargrid` | Faixas de Espírito são resíduos espectrais após dissipação de uma aparição. O fato de Vandar ter mortos-vivos não demonstra que eles forneçam o material nem que Thargrid seja origem. **Próximo ato:** `nao_equiparar_aparicao_e_morto_vivo_e_especificar_fonte`. |
| **Farinha de Ossos** (`ing-bone-meal`) | `boca-abismo` | A descrição contém somente ossos moídos, sem espécie ou indivíduo. O cadáver de Golzdov e os mortos de Vandar não equivalem automaticamente a essa farinha. **Próximo ato:** `nao_atribuir_ossatura_de_golzdov_ou_de_pessoas_sem_evidencia`. |
| **Orelha de Troglodita** (`ing-falmer-ear`) | `thargrid` | Tecido de criatura subterrânea está na descrição, mas nem taxonomia nem sapiência da origem foram confirmadas; as cavernas de Thargrid não identificam a criatura. **Próximo ato:** `conservar_ficha_pedir_classificacao_da_fonte_antes_de_loot`. |

### Três descrições já propostas, ainda não homologadas

As sugestões abaixo estão registradas também no [pacote de decisões editoriais](pacote-pendencias-editoriais-ingredientes.md). Seus três conjuntos de atributos e intensidades permanecem intocados.

**Betta do Rio** (`ing-river-betty`): texto atual **ausente**.
  
Texto candidato **não aprovado**: “Peixe de rio empregado em preparados que aumentam Força e Destreza, mas também podem diminuir a Sabedoria.”

**Beladona** (`ing-nightshade`): texto atual “Planta tóxica de sombra, conhecida pelo dano lento e por interferir na recuperação mágica.”.
  
Texto candidato **não aprovado**: “Planta tóxica de sombra, usada em preparados que causam dano à saúde, mas também ampliam reservas mágicas e fortalecem feitiços de Ilusão.”

**Escamas de Piranha** (`ing-slaughterfish-scales`): texto atual “Escamas grossas usadas em preparados protetores e antídotos para ambientes gelados.”.
  
Texto candidato **não aprovado**: “Escamas espessas de peixe predador, utilizadas em preparados de proteção e resistência ao frio; o extrato concentrado também pode ferir a saúde.”

**Nota de proveniência:** o `origem` ausente na ficha curatorial de Betta significa ausência de campo **no override**, não prova de falta de origem no arquivo compilado: o gerador inicia ingredientes com `origem: "adaptado_skyrim_alquimia"` e só substitui quando recebe override. O campo `zona` é independente. O Betta continua sem habitat verificado em Shadar-Riverie.

### Quatro fontes documentais que delimitam os casos sensíveis

- [`docs/RIO_DRAKPORT_CICLO28.md` no repositório Monstros da Carcaça](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/RIO_DRAKPORT_CICLO28.md) confirma escravização e coerção em Drakport, **não** a procedência de Carne Humana ou Coração Humano. Não transformar violência estrutural documentada em tabela de obtenção de corpos.
- [`docs/VANDAR_POLITICA_DOS_MORTOS_CICLO17.md`](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/VANDAR_POLITICA_DOS_MORTOS_CICLO17.md) registra mortos-vivos e expressa que os ritos funerários e identidades individuais estão abertos. Não associar Cinzas Mortuárias, Farinha de Ossos ou Faixas de Espírito a Vandar.
- [`data/taxonomia_carcaca.json`](https://github.com/pedromaintenance/monstros-carcaca/blob/main/data/taxonomia_carcaca.json) diferencia tipo, ancestralidade, posição social, facção e habitat. Não assumir que Orelha de Troglodita designa um povo/animal definido; não igualar Abissais marinhos a demônios.
- [`docs/LORE_HACK_CARCACA_DW.md`](https://github.com/pedromaintenance/monstros-carcaca/blob/main/docs/LORE_HACK_CARCACA_DW.md) registra gigantes como povos socialmente organizados no contexto de Thargrid, sem provar que **Dedo de Gigante** venha daquele território ou de um indivíduo explorável.

## Segunda fila — vinte e cinco P1

A triagem P1 **não declara erro de zona**. Nomes, imagens, símbolos e as nove zonas geradas devem ser lidos como sinais para investigação, não como prova de habitat.

| Ingrediente | Zona procedural | Questão prioritária |
|---|---|---|
| **Açúcar Lunar** (`ing-moon-sugar`) | `boca-abismo` | O nome Lunar indica processo de fabricação ou só nome comercial/poético? |
| **Algodão da Tundra** (`ing-tundra-cotton`) | `thargrid` | Qual microambiente frio específico seria necessário e ele foi identificado numa zona da Carcaça? |
| **Bagas da Neve** (`ing-snowberries`) | `portomonte` | Existe evidência direta da espécie em Portomonte ou de rota de comércio que a levaria lá? |
| **Coração de Demônio** (`ing-daedra-heart`) | `drakport` | Existe espécie ou indivíduo demoníaco documentado como fonte deste órgão? |
| **Dentes de Espectro Gelado** (`ing-ice-wraith-teeth`) | `boca-abismo` | Há criatura atestada e taxonomicamente classificada que produza dentes espectrais? |
| **Ectoplasma** (`ing-ectoplasm`) | `garganta` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Flor Amarela da Montanha** (`ing-yellow-mountain-flower`) | `eldroth` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Flor Azul da Montanha** (`ing-blue-mountain-flower`) | `alem-sul` | A referência a encostas frias na ficha indica qual microhabitat e há região homologada? |
| **Flor Vermelha** (`ing-red-mountain-flower`) | `portomonte` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Fungo de Gualápoles** (`ing-namira-s-rot`) | `thargrid` | O topônimo Gualápoles é origem biológica, denominação histórica ou associação cultural? |
| **Garra de Bruxa** (`ing-hagraven-claw`) | `garganta` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Gelatina de Gafanhoto** (`ing-ash-hopper-jelly`) | `portomonte` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Gelatina de Medusa** (`ing-netch-jelly`) | `ironwood` | A palavra Medusa designa qual tipo de ser na Carcaça? |
| **Gordura de Troll** (`ing-troll-fat`) | `garganta` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Madeira de Ent Carbonizado** (`ing-burnt-spriggan-wood`) | `boca-abismo` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Ovo de Tordo** (`ing-pine-thrush-egg`) | `boca-abismo` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Ovo de Tordo** (`ing-rock-warbler-egg`) | `shadar-riverie` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Peixe-Espada do Sangue** (`ing-abecean-longfin`) | `portomonte` | Há identificação da espécie ou pesca comprovada na costa de Portomonte? |
| **Penas de Bruxa** (`ing-hagraven-feathers`) | `alem-sul` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Pó de Presa de Mamute** (`ing-powdered-mammoth-tusk`) | `portomonte` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Poeira Luminosa** (`ing-glow-dust`) | `portomonte` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Sais do Vazio** (`ing-void-salts`) | `thargrid` | Existe fonte cosmológica ou técnica estabelecida para os sais? |
| **Sais Ígneos** (`ing-fire-salts`) | `alem-sul` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |
| **Sal do Sangue** (`ing-salt-pile`) | `alem-sul` | Há processo de evaporação, extração ou comércio documentado para o Sal do Sangue? |
| **Seiva de Ent** (`ing-spriggan-sap`) | `drakport` | Qual evidência identifica a espécie/material e sua ocorrência no local antes de transformar a zona procedurally atribuída em habitat? |

**Casos de contraste para orientar o próximo lote:**

- **Fungo de Gualápoles → Thargrid:** Gualápoles é um topônimo documentado, mas não determina onde cresce o fungo. A zona gerada não comprova nem exclui origem histórica, distribuição ou comércio.
- **Bagas da Neve → Portomonte:** o atlas descreve picos nevados em Thargrid, mas não localiza essa espécie. Não transferi-la para Thargrid por semelhança climática, nem inferir que Portomonte seja impossível.
- **Açúcar Lunar → Boca do Abismo:** a existência do Templo da Lua no Rio Ancestral não comprova monopólio ritual, fabricação lunar ou rota comercial desse ingrediente.
- **Gelatina de Medusa → Ironwood:** a ficha diz apenas criatura flutuante; não se deve transplantar água-viva, górgona, petrificação ou hábito oceânico por tradução do nome.
- **Dois Ovos de Tordo:** nomes idênticos possuem IDs e efeitos distintos; as zonas respectivas foram geradas. Distinguir as fichas na apresentação **sem declarar duas espécies taxonômicas aprovadas**.
- **Sal do Sangue → Além Sul:** Peren atribui origem material às águas rubras, mas o atlas não confirma salinas, produção, disponibilidade de sal ou comércio no Além Sul. Isso não obriga alterar a zona atual.

## P2 e P3 — continuidade controlada

Os **16 P2** concentram principalmente investigação sobre corpos d'água, origem de materiais, ofícios e produção; os **54 P3** são fichas sem sinal especial identificado neste recorte, e **continuam sem validação individual de habitat**. Não são certificados como ecologicamente corretos. A fila JSON contém todos os seus IDs, estados documentais, perguntas e caminhos de conferência.

Para qualquer ficha, distinguir em registros separados:

1. **Material ou espécie:** identidade taxonômica, física ou técnica; pode permanecer indeterminada.
2. **Habitat / local de produção:** somente com fonte e decisão pertinentes, não por nome ou sorteio.
3. **Local de circulação ou venda:** não constitui habitat; exige evidência independente de transporte e mercado.
4. **Mecanismo de obtenção:** coleta, manufatura, presente, comércio, encontro ou ritual, sem pressupor drops de pessoas.

## Critério de encerramento de cada investigação

O item só pode sair de `aguarda_averiguacao` quando houver registro de **fonte específica**, **escopo do que ela realmente diz**, **limite de extrapolação**, **proposta separada da decisão aprovada** e **responsável pela integração**. Sem evidência, registrar **território indeterminado** como conclusão válida, sem inventar fauna, economia ou estrada.

**Gate entre chats:** esta curadoria não muda `data/curadoria_ingredientes.json`, `data/itens.json`, `data/receitas.json`, `data/catalogo-combos-alquimicos.json`, runtime clássico/Phaser, mercados, loot, saves ou PWA. O outro fluxo só poderá integrar novas localidades após decisão autoral, diff mínimo e testes reais; preservar os cinco registros históricos existentes.

## Controles executados

- **106/106** IDs da categoria procedural reconciliados com a matriz territorial e a curadoria; **5 IDs históricos excluídos** deste lote.
- **11/11** P0 receberam primeiro parecer documental, todos com `decisao_autoral_aplicada=false` e `prova_habitat_resolvida=false`.
- **3/3** descrições candidatas comparadas ao pacote editorial; nenhum texto foi aplicado à ficha canônica.
- **0** habitats homologados e **0** mudanças em IDs, atributos, efeitos, intensidades, raridades ou zonas.
- **Ressalva:** validação baseada em GitHub/JSON e leitura documental. Não é teste de coleta em jogo, build, navegador ou conferência completa do `data/itens.json` compilado.

**Próxima operação editorial:** aprofundar os P1 por evidência: primeiro identidade de materiais e criaturas, depois toponímia/clima, depois ambientes aquáticos e circulação. A ordem não autoriza aprovação automática.

## Segunda passagem — pareceres P1 concluídos (07/11/2026)

Os **25 casos P1** foram examinados com base em Peren e Monstros da Carcaça. A fila evoluiu para **36/106 com parecer emitido** (P0 11; P1 25), ainda **sem homologação de habitats**. O dossiê detalhado desta rodada é [`pareceres-p1-taxonomia-habitats-ingredientes.md`](pareceres-p1-taxonomia-habitats-ingredientes.md); os objetos JSON individuais estão em [`data/fila-investigacao-territorial-ingredientes.json`](../data/fila-investigacao-territorial-ingredientes.json).

Os 25 P1 dividem-se em **5** materiais/cosmologia, **11** seres fantásticos e origens materiais, **6** plantas/clima/topônimos, **2** Ovos de Tordo duplicados nominalmente e **1** peixe costeiro. Não foram registrados novos produtores, espécies, zonas, drops, cultos, salinas ou processos técnicos por inferência. O próximo trabalho editorial é o primeiro parecer dos **16 P2**, seguido dos **54 P3**, sem mexer na distribuição jogável.
