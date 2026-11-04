# Parecer editorial das sinergias de Peren — oito candidatos
**Emissão:** 03/11/2026 · **Situação:** parecer técnico para decisão autoral, **não canônico** · **Escopo:** curadoria de nomes e coerência das combinações; nenhum código de jogo alterado.

## Síntese
A [Constituição de Design v1.0, Emenda A2](constituicao-design-v1.md) determina três estados distintos: **Impuro** somente quando houver incompatibilidade aprovada, **nome especial** somente para sinergia aprovada e **multiefeito comum** para efeitos compatíveis independentes. A única sinergia aprovada continua sendo **Poção da Fada** (`aumentar_carisma` + `aumentar_ilusao`). Oito propostas foram examinadas, **nenhuma recebeu aprovação automática**.

**Fonte estruturada da revisão:** [`data/pareceres-sinergias-ingredientes.json`](../data/pareceres-sinergias-ingredientes.json). **Registro de propostas:** [`data/catalogo-combos-alquimicos.json`](../data/catalogo-combos-alquimicos.json).

### Triagem

| Proposta | Assinatura de IDs | Menor conjunto no catálogo | Parecer | Encaminhamento |
|---|---|---:|---|---|
| Asas do Vendaval | `voar` + `velocidade` | 3 tipos | Forte | submeter nome e descricao ao criador |
| Olhos da Vigília | `aumentar_percepcao` + `visao_a_distancia` | 3 tipos | Forte | submeter nome e descricao ao criador |
| Nascente Arcana | `aumentar_magia` + `regenerar_magia` | 3 tipos | Forte | submeter nome e descricao ao criador |
| Véu do Caçador | `invisibilidade` + `aumentar_furtividade` | 4 tipos | Forte | submeter nome e descricao ao criador |
| Seiva Vital | `restaurar_saude` + `regenerar_saude` | 4 tipos | Forte | submeter nome e descricao ao criador |
| Fôlego das Profundezas | `respirar_na_agua` + `resistencia_gelo` | 4 tipos | Não promover | manter como multiefeito compativel ate evidencia |
| Silêncio do Feiticeiro | `dano_magia` + `diminuir_magia` | 3 tipos | Condicional | reformular nome antes de submeter |
| Veneno da Ruína | `dano_saude` + `fraqueza_veneno` | 2 tipos | Não promover | suspender promocao ate tipagem de dano |

*“Menor conjunto” é o mínimo combinatório **no catálogo de hoje**. Não transforma ingredientes em receita fixa. As contagens de combinações no JSON consideram apenas a união dos insumos que fornecem um dos dois efeitos, sem matérias adicionais; não são receitas, drops, oferta econômica ou disponibilidade geográfica.*

## Forte para deliberação

### Asas do Vendaval (`combo-asas-do-vendaval`)

Assinatura funcional clara: voo e velocidade. Os três materiais do exemplo são atualmente as únicas fontes disponíveis desses dois IDs; isso não torna o combo uma receita fixa.

- **Descrição proposta, não canônica:** “Uma preparação que reúne voo e velocidade numa mesma travessia, preservando limites e riscos de cada efeito.”
- **Risco editorial:** A assinatura é pouco redundante: Voo e Velocidade possuem exatamente duas fontes cada; coleta de materiais de áreas distintas pode ser difícil. Não dar impulso ou segurança aérea extra.
- **Conjuntos de 2/3/4 tipos válidos no universo restrito:** 0 / 1 / 0; nenhum cria um efeito novo por si só.

### Olhos da Vigília (`combo-olhos-da-vigilia`)

Visão distante e percepção convergem para observação. Há alternativa de três materiais que evita no exemplo a Orelha de Troglodita, cujo suprimento de origem sapiente é indeterminado.

- **Descrição proposta, não canônica:** “A nitidez dos sentidos acompanha o alcance dos olhos; efeitos adicionais da mistura continuam válidos.”
- **Risco editorial:** A alternativa com Ovo de Falcão também ativa Aumentar Destreza; este terceiro efeito nunca pode ser omitido. Não inventar alcance visual em metros ou clarividência.
- **Conjuntos de 2/3/4 tipos válidos no universo restrito:** 0 / 2 / 1; nenhum cria um efeito novo por si só.
- **Alternativa ao exemplo original:** `ing-eye-of-sabre-cat` + `ing-hawk-s-egg` + `ing-hawk-feathers` ativa **aumentar_destreza, aumentar_percepcao, visao_a_distancia**. Ela evita usar Orelha de Troglodita no exemplo, mas acrescenta um terceiro efeito que não pode ser omitido.

### Nascente Arcana (`combo-nascente-arcana`)

Maior reserva mágica e reposição progressiva formam um ciclo de uso coerente, sem significar fonte infinita.

- **Descrição proposta, não canônica:** “Expande a reserva arcana e favorece sua reposição enquanto os efeitos permanecerem ativos.”
- **Risco editorial:** Intensidade I–III não fixa taxa de regeneração nem valor máximo; não introduzir multiplicador de mana.
- **Conjuntos de 2/3/4 tipos válidos no universo restrito:** 0 / 48 / 708; nenhum cria um efeito novo por si só.

### Véu do Caçador (`combo-veu-do-cacador`)

Invisibilidade e aumento de furtividade cooperam no ato de ocultar-se; no catálogo atual, a assinatura requer pelo menos quatro tipos distintos.

- **Descrição proposta, não canônica:** “A presença se desvanece e os movimentos se tornam mais discretos, sem apagar rastros, sons ou outros sinais.”
- **Risco editorial:** Não equivale a silêncio, imunidade à percepção ou invisibilidade permanente. Disponibilidade de quatro materiais é critério de interface ainda não aprovado.
- **Conjuntos de 2/3/4 tipos válidos no universo restrito:** 0 / 0 / 315; nenhum cria um efeito novo por si só.

### Seiva Vital (`combo-seiva-vital`)

Restaurar saúde e regenerar saúde cobrem recuperação imediata e subsequente; a assinatura exige atualmente quatro tipos distintos.

- **Descrição proposta, não canônica:** “Uma parcela da vitalidade retorna de imediato; a recuperação continua enquanto o segundo efeito perdurar.”
- **Risco editorial:** Sem ressuscitar, reconstituir membros, curar doença ou eliminar efeitos negativos por inferência. 'Seiva' é metáfora do nome, não origem botânica necessária.
- **Conjuntos de 2/3/4 tipos válidos no universo restrito:** 0 / 0 / 1008; nenhum cria um efeito novo por si só.

## Revisão condicional

### Silêncio do Feiticeiro (`combo-silencio-do-feiticeiro`)

Dano à Magia e Diminuir Magia atuam sobre o recurso arcano por vias distintas; há complementaridade, mas 'Silêncio' sugere bloqueio total de conjuração não documentado.

- **Descrição proposta, não canônica:** “Drena parte da energia arcana e reduz a capacidade mágica, sem impedir automaticamente a conjuração.”
- **Risco editorial:** Sem especificação de alvo, duração ou diferenças mecânicas, o nome promete mais que os atributos. Alternativa apenas editorial: 'Esgotamento Arcano'.
- **Conjuntos de 2/3/4 tipos válidos no universo restrito:** 0 / 9 / 36; nenhum cria um efeito novo por si só.
- **Nome alternativo sugerido:** Esgotamento Arcano, a avaliar antes de qualquer aprovação.

## Não promover ainda

### Fôlego das Profundezas (`combo-folego-das-profundezas`)

Respirar na Água e Resistência ao Gelo podem servir juntos em determinadas viagens, mas continuam duas proteções independentes. A Carcaça não documenta um ambiente único que torne a combinação necessária.

- **Descrição proposta, não canônica:** “Permite respirar na água e oferece resistência ao frio; não protege de outras ameaças das profundezas.”
- **Risco editorial:** O nome associa frio às profundezas e pode sugerir resistência à pressão, visão subaquática ou proteção geral inexistentes.
- **Conjuntos de 2/3/4 tipos válidos no universo restrito:** 0 / 0 / 84; nenhum cria um efeito novo por si só.

### Veneno da Ruína (`combo-veneno-da-ruina`)

A coativação é real, inclusive com dois insumos, mas Dano à Saúde ainda não é tipado como dano venenoso. Fraqueza a Veneno não demonstrou amplificar o outro efeito.

- **Descrição proposta, não canônica:** “Pode causar dano à saúde e deixar o alvo vulnerável a venenos posteriores, sem presumir que um efeito intensifique o outro.”
- **Risco editorial:** Não afirmar bônus causal, toxina de dupla ação ou escalada de dano sem definição semântica. Nome genérico pode ser confuso com venenos já existentes.
- **Conjuntos de 2/3/4 tipos válidos no universo restrito:** 1 / 166 / 2589; nenhum cria um efeito novo por si só.

## Testes e limites de aplicação

1. **Verificação estrutural executada em análise isolada:** os oito exemplos existentes ativam ambos os efeitos de assinatura por **pelo menos duas fontes diferentes**; nenhum ativa a única incompatibilidade já aprovada. Um exemplo material nunca é receita obrigatória.
2. **Testes de contingência:** nenhum dos oito promoveu sua `aprovacao_autoral` para `true`; `data/catalogo-combos-alquimicos.json` permanece com uma sinergia aprovada e um exemplo aprovado de incompatibilidade.
3. **Testes pendentes para o fluxo de mecânicas:** potência final e dominância, progressão de conhecimento no Caderno, arte, realização no runtime clássico/Phaser, persistência em save, teste visual em navegador e QA de jogo. Esta análise **não** equivale a CI ou teste de gameplay.
4. **Limite de evidência ecológica:** viabilidade pela interseção dos IDs não comprova habitat, espécie, origem regional, disponibilidade de materiais nem permissibilidade de coleta. Fontes sapientes precisam de cautela adicional.
5. **Gate de publicação:** aprovar **nome + razão da sinergia + descrição** individualmente; somente então registrar alteração em `sinergias[]`, mantendo as propriedades dos ingredientes e todos os efeitos resultantes. Em caso de efeito adicional incompatível, a classe **Impuro** prevalece.

## Próximo pacote de decisão do criador

Para decisão em etapas: (a) revisar os cinco pareceres fortes; (b) decidir se “Silêncio do Feiticeiro” deve virar “Esgotamento Arcano” e quais as distinções semânticas entre `dano_magia` e `diminuir_magia`; (c) decidir se “Fôlego das Profundezas” merece nome especial ou é somente multiefeito; (d) não promover “Veneno da Ruína” sem tipagem de dano à saúde.

**Responsabilidade:** este chat prepara curadoria de itens e semântica editorial; integração e menus continuam com o outro fluxo. Nada aqui é autorização para alterar motor, receitas ou saves.
