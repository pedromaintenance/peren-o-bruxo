# Encerramento da primeira passagem — ecologia e território dos ingredientes de Peren

**07/11/2026 · Estado:** auditoria documental concluída; **sem** criação automática de habitat, espécie, rota, loja, drop, receita ou mecânica.

## Resultado por camada

| Objeto | Cobertura | O que está concluído | O que NÃO está concluído |
|---|---:|---|---|
| Curadoria individual de efeitos e intensidades | **111/111** | Os atributos de cada ingrediente estão documentados e conciliados com a matriz ecológica | Balanceamento/regras de jogo por este chat |
| Auditoria ecológica | **111/111** | Evidência, origem material descrita em Peren, lacunas e limites de inferência por ID | Confirmação da distribuição natural de cada espécie |
| Auditoria territorial | **111/111** | Reconstrução da zona procedural e separação de cinco referências históricas de Peren | Regras de spawn, coleta e mercado |
| Primeira passagem da fila de investigação | **106/106** | Todos os ingredientes com zona procedural receberam parecer inicial | Homologação de 106 novos habitats |
| Localidades historicamente mantidas | **5/5 identificadas** | Uma exclusividade explícita e quatro locais anteriormente preservados em Peren | Prova independente de taxonomia, abundância ou ocorrência no atlas |

### Detalhamento da fila de 106

- **11 P0:** origem potencialmente sensível de pessoas/restos, inconsistências descritivas e fontes materiais.
- **25 P1:** criaturas e materiais fantásticos, topônimos, nomes simbólicos, variantes e cosmologia.
- **16 P2:** produção agrícola/manufatura, água, bacias, reprodução e circulação.
- **54 P3:** **13** fungos/musgos/líquens; **21** flores/ervas/raízes/vagens; **10** insetos/aracnídeos/ovos; **9** partes de fauna terrestre; **1** cristal especial.

**Registros:** [fila dos 106](../data/fila-investigacao-territorial-ingredientes.json) · [P0 e fila inicial](fila-investigacao-ecologica-ingredientes-v1.md) · [P1](pareceres-p1-taxonomia-habitats-ingredientes.md) · [P2](pareceres-p2-producao-hidrografia-ingredientes.md) · [P3](pareceres-p3-primeira-passagem-ecologica.md) · [matriz dos 111](../data/auditoria_territorial_ingredientes.json).

## Cinco localizações anteriores de Peren

| Ingrediente | Registro histórico | Limite |
|---|---|---|
| Pena de Gaivota | **Portomonte exclusiva**, com `zona` e `zona_exclusiva` no JSON curatorial | Confirmada como decisão de Peren; atlas não confirma espécie e ecologia |
| Carapaça de Caranguejo | **Além Sul**, mantido no README de Peren | Não demonstra população da espécie |
| Pó de Vampiro | **Boca do Abismo**, mantido no README | Não comprova origem individual ou forma de obtenção |
| Couro de Rato | **Garganta**, mantida no README | Não identifica espécie ou fonte |
| Penas de Falcão | **Thargrid**, mantida no README | Não comprova biologia, ninhos ou distribuição da ave |

Essas cinco localidades **não** são equivalentes: a primeira tem override explícito e exclusividade; as outras quatro são retenções documentais do jogo, sem `zona` no override. Não declarar que as cinco possuem o mesmo status de aprovação ecológica.

## QA realizado nesta rodada

- **111** IDs do catálogo ativo, **111** registros de auditoria ecológica, **111** registros territoriais.
- **106/106** IDs procedurais presentes uma vez na fila, com primeiro parecer e `prova_habitat_resolvida=false`; **0** aprovados para gerar drops.
- **53** efeitos distintos, **0** efeitos isolados; conjuntos de atributos e intensidades do catálogo coincidem integralmente com a auditoria ecológica.
- **1** sinergia aprovada e **8** candidatas ainda não aprovadas, sem promoção implícita.
- Os três catálogos de itens compilados (`data/itens.json`, `phaser-demo/data/itens.json`, `phaser-demo-m1hf/data/itens.json`) têm **o mesmo blob Git `e549607c26fa131fc742ce0b1a4b41e63f8a3488`**: consistência de espelho verificada **por SHA e tamanho** (1.193.150 bytes por arquivo).
- **Restrição técnica:** o conector devolveu conteúdo vazio ao tentar ler o `data/itens.json` completo (inclusive por intervalos de linhas), portanto **não houve comparação do conteúdo compilado contra todos os overrides**. Identidade de SHA entre os três espelhos não demonstra correção dos campos contra o JSON curatorial. Não alegar que a comparação está encerrada.

### Imutabilidade dos dados operacionais

`data/curadoria_ingredientes.json` mantém o blob `57cf86f623ecabb4c30eb3a052384d627b615aa8` e `data/catalogo-combos-alquimicos.json` mantém `86c7627c3db22da4cf8a6b65a48928d5e0552a7b`. **Não houve** alteração em engines, receitas, comercialização, zonas, save, mecânicas ou assets por esta rodada documental.

## Próxima fase: decisões autorais em vez de habitats inventados

A primeira passagem está encerrada. O trabalho que resta não é repetir auditorias para gerar mais ficção, mas tomar **decisões delimitadas** com critérios de evidência e aprovação. Recomendação de ordem:

| Ordem | Decisão concreta | O que já existe | Risco de integração |
|---|---|---|---|
| **1** | Aprovar ou rejeitar as três correções de **Betta do Rio, Beladona e Escamas de Piranha**, sem mudar atributos | [Pacote editorial](pacote-pendencias-editoriais-ingredientes.md) | Alteração do override pode acionar sincronização dos catálogos |
| **2** | Determinar o valor correto do campo de **proveniência editorial `origem`** do Betta, separado de `zona` | Gerador + ficha sem override de `origem` | Confusão de dado de fonte com local de pesca |
| **3** | Decidir se os dois **Ovos de Tordo** ganham rótulos funcionais apenas na interface; padronizar grafia dos dois IDs de efeito (`curar_doenca` e `voar`) sem alterar seus IDs | Dois registros e duas variantes textuais já documentados | Impacto em nomes, receitas, exibição e save |
| **4** | Estabelecer protocolo de origem sensível para **Carne Humana, Coração Humano, Dedo de Gigante e Orelha de Troglodita** | Pareceres P0 e taxonomia da Carcaça | Não criar mercado ou drop automático de pessoas |
| **5** | Decidir a apresentação e eventual origem de **Seiva/Ent, Coração de Espinheiros, Raiz Mestra, Sais** e outros materiais cuja mágica está definida mas espécie/local não | Pareceres P1/P3 e atributos canônicos | Não reduzir efeitos ou confundir tipo de criatura com geografia |
| **6** | Escolher quais habitats realmente exigem canonização antes da exploração regional | 106 pareceres completos, 5 referências preservadas | Não forçar uma espécie por região para preencher distribuição |
| **7** | Em fluxo experimental de mecânicas, comparar **JSON compilado × override × gerador** e testar impacto na sincronização | 3 espelhos de itens com SHA idêntico | Nenhum teste de gameplay/conteúdo completo executado nesta rodada |
| **8** | Deliberar separadamente sobre as **8 sinergias candidatas** | [Parecer de sinergias](parecer-editorial-sinergias-8-candidatos.md) | Não promover combinações por coincidência de efeitos |

### Contrato com o outro fluxo

O chat de curadoria produz fatos citáveis, decisões a submeter, limites taxonômicos e perguntas. O chat de mecânicas detém a decisão de integração em código e seus testes. **Nada aqui deve ser importado automaticamente para loot, comércio, menus, saves ou o runtime**. Após aprovação explícita do criador, cada alteração deve apresentar diff mínimo e teste específico de compatibilidade.

## Fontes e status de autoridade

- **Peren:** catálogo curatorial, auditorias, decisões históricas e documentação do gerador.
- **Monstros da Carcaça:** manuscrito e fatos registrados; documentos `data/propostas/` e dossiês marcados como *não homologados* não têm autoridade para criar locais ou espécies.
- **Matriz investigativa:** parecer editorial de incertezas, **não** fonte executável do jogo nem ato de aprovação.

**Referência consultada de Monstros da Carcaça:** commit `d58caa14e5fa7f965582be30d3b41eaa64fd7e3d`. **Data da consolidação:** 07/11/2026.
