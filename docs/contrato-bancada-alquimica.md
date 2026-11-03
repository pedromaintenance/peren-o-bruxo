# Bancada de Criação — contrato de interface e descoberta (pré-alfa)
> Projeto: Peren, o Bruxo (Phaser). Adicionado em 30/10/2026 durante a PR #94.
> Referências canônicas: `data/curadoria_ingredientes.json` e `docs/auditoria-alquimia-peren.md`.
> Não alterar o clássico, o PWA antigo, a lista dos 111 ingredientes nem `data/receitas.json`.

## Objetivo de experiência
**Não mostrar um catálogo achatado de milhares de receitas.** O percurso do jogador é:

`Ofício / estação → Família → Efeito descoberto → Ingredientes aplicáveis → Preparar`

Na alquimia, há duas rotas:
- **Por efeito conhecido**: selecionar uma família, abrir o efeito que Peren descobriu e escolher duas fontes *cujos efeitos ele já estudou ou descobriu em experimentos*. A interface sinaliza **brilhante** se dois ingredientes possuídos e com o mesmo efeito conhecido estão disponíveis; do contrário, o efeito permanece **cinza/atenuado**, mas pode ser consultado.
- **Experimentação livre**: escolher dois ingredientes da mochila **independentemente do conhecimento prévio**. Antes de preparar, não revelar qualquer efeito desconhecido, resultado previsto ou material oculto em data attributes/HTML. O resultado será calculado apenas pelo motor canônico.
- **Estudar ingrediente**: aprender propriedades ainda ocultas de um item da mochila, uma de cada vez. Efeito estudado pode aparecer no diretório de efeito conhecido mesmo sem segundo ingrediente.
- Uma preparação bem-sucedida compartilha **todos** os efeitos que têm pelo menos duas fontes na combinação, independentemente de qual efeito foi usado para navegar. Uma tentativa sem efeitos coincidentes **fracassa**. O fluxo não impõe interpretação moral dos efeitos mistos.

## Famílias previstas
| Família | Conceito do criador | Implementação atual |
|---|---|---|
| **Poções** | Alteram atributos favoravelmente | Diretório inicial de efeitos `aumentar_*`, `restaurar_*`, `regenerar_*`, `resistencia_*`, `curar_doenca` |
| **Venenos** | Alteram atributos negativamente | Diretório inicial de `diminuir_*`, `dano_*`, `fraqueza_*`, `infligir_doenca` |
| **Tônicos** | Efeitos mágicos especiais **temporários** | Diretório inicial de voo, invisibilidade, visão, respiração aquática, velocidade, frenesi, medo, paralisia e vampirismo (classificação provisória) |
| **Elixires** | Efeitos mágicos especiais **permanentes** | Família aparece na interface, mas permanece sem efeitos fabricáveis até que uma regra explícita defina quais alterações são permanentes; não atribuir permanência a buffs comuns |
| **Bálsamos** | Aplicáveis a itens, **não consumíveis** | Família aparece na interface, mas permanece sem efeitos fabricáveis até a regra de alvos/itens e aplicação; nunca tratar um tônico como bálsamo com base só no nome |

A classificação **não reduz intensidade** e não implica que um mesmo ID de efeito nunca possa aparecer em outra família quando houver modos de aplicação definidos. `vampirismo` preserva o risco de transformação progressiva canônica; **não** aplicar transformação permanente instantânea apenas pelo rótulo Tônico.

## Regras de validação e custos em teste
- Selecionar dois ingredientes de **IDs distintos** e possuir pelo menos um exemplar de cada.
- **Estudo** (regra provisória): gasta **uma ação**, não consome o ingrediente, revela **uma propriedade** por estudo; estudar tudo requer novas ações.
- **Mistura** (regra provisória): gasta **uma ação e um exemplar de cada ingrediente**, incluindo as tentativas fracassadas; seleção inválida/insuficiente não consome nada.
- Misturas válidas persistem em `character.alchemy.preparations` do save Phaser com **IDs de insumos**, **efeitos compartilhados**, **intensidades de origem** e **data**. Misturas fracassadas aumentam o contador de falhas.
- Sucesso da mistura revela seus efeitos compartilhados para os dois ingredientes envolvidos; falha não revela propriedades que não combinaram.
- As ações passam pelo `applyTransaction`/bridge; UI **nunca** modifica inventário/saves diretamente. Não há importação de save clássico.
- A intensidade de cada origem **não é potência final**; a regra de potência, duração, acesso a terceiro ingrediente, elixires, bálsamos, aplicação e consumo de preparados ainda está em definição. Até lá, o resultado é um **registro fabricado no caderno**, não um consumível ativo nem um buff permanente.
- **Receitas tradicionais de alquimia continuam acessíveis** por botão próprio dentro da bancada; voltar à combinação livre não altera ingredientes nem progresso.
- Fora da alquimia, forja, cozinha, curtume, escrita, encantamento e joalheria preservam receitas fixas legadas, agrupadas na UI por **tipo e faixa de nível**, sem recalcular fórmulas.

## Testes de aceitação
1. `A+B = B+A`, usando IDs reais e efeitos múltiplos.
2. Efeito precisa existir em **ambos** os ingredientes, independentemente de haver outras propriedades.
3. Jogador recém-iniciado só vê famílias vazias de efeitos; pode experimentar com ingredientes possuídos.
4. Estudo de um item revela um efeito, mas não o segundo ingrediente automaticamente.
5. Efeitos ficam brilhantes somente com duas fontes **conhecidas** e **possuídas** e ação disponível.
6. Falha consome dois exemplares e uma ação, sem registrar preparado.
7. Sucesso registra preparado e descoberta persistente, sem tocar em `curadoria_ingredientes.json`.
8. Famílias Elixires/Bálsamos não fabricam resultados com efeitos/durações inventados.
9. Nunca gerar item ou arte única para cada combinação; quando a aplicação de preparados chegar, sprites serão compartilhados por família.
10. Manter a política **sem stamina**, os nove acréscimos aprovados e decisões participativas posteriores.

## Próximas extensões
- Definir fórmula de potência, qualidade, duração e como efeitos opostos coexistem.
- Criar produto serializável equiparável/consumível com uso real no mundo ou na batalha, sem cadastrar uma receita ou um sprite por par.
- Regras de elixir permanente (reversibilidade, custo, limites) e bálsamo (alvo, duração na arma/armadura/relíquia, compatibilidade).
- Descoberta de efeitos para 3+ insumos e caderno de descobertas; filtros e navegação gamepad.
- Vincular efeitos reais a atributos/estados sem criar risco de efeitos permanentes implícitos.

## Estado do desenvolvimento
A interface e o motor de descoberta são uma **primeira implementação testável** na PR #94, não conclusão da alquimia plena. O artefato publicado em GitHub Pages continua sendo a prévia anterior até nova revisão.
