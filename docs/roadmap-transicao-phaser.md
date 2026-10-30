# Roadmap da transição total — Peren Phaser
> Início: 30/10/2026. Estado: **M0 iniciado**, ainda não publicado. Base: `main` commit `7a034578`. O Peren original (HTML/JS) é referência congelada; **nenhuma nova mecânica será desenvolvida nele**.

## Contrato de produto
- Um único jogo sandbox: **Peren, o Bruxo — Mercador da Carcaça**. Sem Modo Campanha separado e sem importação de funcionalidades de outros jogos.
- **Motor-alvo único: Phaser 3.** O clássico `game.js`/HTML/CSS fica legível como especificação de comportamento, não como alvo de atualizações.
- **Pré-alfa: não migrar saves clássicos.** Não alterar nem limpar chaves de saves existentes enquanto o clássico e a prévia coexistirem. O Phaser terá um novo save próprio quando estiver pronto para lançamento.
- Migrar **jogabilidade e conteúdo**, não interfaces HTML pixel por pixel. Todos os gates precisam de testes automatizados; a aprovação artística e hardware físico continuam separadas.
- Não substituir imediatamente o endereço principal do GitHub Pages. A prévia compilada continuará isolada até a paridade de gameplay demonstrada.

## Estado verificado no início da transição
- Clássico `game.js`: viagens entre **9 cidades**, contratos, colheita, caça, loja/mercadores, tutores, estudo, meditação, ofícios, consumíveis, equipamentos, relíquias e combate.
- Fonte Phaser antes isolada na branch `feature/phaser-m1h-f-free-assets` (`phaser-lab/` + `phaser/assets/`); `main` tinha apenas o bundle `phaser-demo-m1hf/`. Esta entrega importa a fonte **sem substituir o bundle publicado**.
- Fatia atual: Portomonte ↔ Mürin, três criaturas e três magias de batalha, inventário somente leitura e comércio limitado a suprimentos comuns de Portomonte.
- `data/receitas.json` da raiz é diferente da cópia de `phaser-demo-m1hf/data/receitas.json`. O Phaser deve **empacotar dados da raiz durante o build**, sem reescrever as fontes.
- Fonte primária da auditoria: `docs/auditoria-alquimia-peren.md`, até **ciclo 29**; `data/curadoria_ingredientes.json` contém **111 ingredientes, 53 efeitos, 0 efeitos sem parceiro**. A revisão participativa seguinte é **Poeira Luminosa** (`ing-glow-dust`). O marcador `atributos_revisados` do JSON não equivale a aprovação individual de 111 fichas.

## Invariantes de alquimia e crafting — bloqueios de regressão
1. **Nunca regenerar ou substituir** `data/curadoria_ingredientes.json`, `data/itens.json` ou `data/receitas.json` por uma versão antiga do Phaser; mudanças de curadoria exigem decisão explícita.
2. A política existente exige **mínimo de 3 atributos por ingrediente**, intensidades inteiras 1–3, atributos extras só por aprovação. Acurácia ficcional e conectividade importam; **não reduzir efeitos poderosos por balanceamento**.
3. A alquimia comum definitiva emerge da **interseção de efeitos de pelo menos dois ingredientes de IDs distintos**, contabilizada **por efeito**. A+B = B+A. Composições podem produzir múltiplos efeitos, benéficos e prejudiciais.
4. **Poções, venenos e preparados compartilham sprites por família visual**, não uma arte exclusiva por fórmula. Preservar IDs de ingredientes e a natureza regional dos recursos.
5. Os nove acréscimos aprovados (ciclos 4–12) são: Alho/curar_doenca II; Cauda de Rato/infligir_doenca II; Olho de Felino/visao_a_distancia II; Libélula Azul/velocidade II; Amanita Rubra/diminuir_sabedoria II; Coração de Espinheiros/vampirismo II; Fungo de Gualápoles/diminuir_carisma II; Raiz Mestra/aumentar_inteligencia II; Garra de Bruxa/diminuir_magia II.
6. **Vampirismo pode levar à transformação gradual em vampiro**; ainda não há mecanismo/limites aprovados. Não reduzir o efeito a simples roubo de PV. Preservar a regra **sem stamina** da curadoria.
7. `receitas.json` contém **fórmulas legadas** que ainda alimentam outros ofícios e produtos especiais. Não convertê-las em receitas emergentes automaticamente; manter forja, comida, escrita, encantamento e outras oficinas intactas. A potência, duração, instrumentação e tratamento de misturas contraditórias continuam pendentes de especificação.
8. A ficha atual da Pena de Gaivota usa `aumentar_constituicao` II; há texto histórico divergente sobre stamina no README. **JSON de curadoria é a evidência do estado presente**; não “corrigir” silenciosamente os dados.
9. O laboratório de itens continua **somente leitura**. Não transformar a bancada em editor nem alterar os catálogos a partir da UI.

## Fases de execução

| Marco | Escopo e produto | Critério objetivo de aceite | Estado |
| --- | --- | --- | --- |
| **M0 — Fonte única** | Trazer `phaser-lab/` e `phaser/assets/` para a linha principal; build Vite/Phaser com dados canônicos copiados, teste de invariantes alquímicos, documento de paridade. | Compilar e testar fonte no CI; `main` publicado permanece intocado; detectar qualquer drift no pacote | **Em execução nesta branch** |
| **M1 — Peren completo** | Equipar/desequipar, usar consumíveis, aprender grimórios, estudar, meditar, treinar com tutores, progressão/XP e ações diárias. | Testes comparativos por operação, materiais/ouro/ações descontados exatamente uma vez | Pendente |
| **M2 — Alquimia emergente** | Motor puro determinístico de ingredientes distintos/efeitos coincidentes; interface de seleção e descoberta; efeitos múltiplos, famílias visuais e produção serializável. Manter outras receitas legadas. | Pares AB/BA iguais; sem efeito compartilhado não produz efeito; por efeito exigir 2 fontes; nenhum dado canônico mutado; decisões de potência pendentes não presumidas | Especificar antes de implementar |
| **M3 — Mundo integral** | Nove cidades, viagens, dez regiões, seed e biomas, recursos, risco, 27 mercadores, estoques regionais e tutores. | Todas cidades/zonas acessíveis; produtos e estoques por IDs; mapas sem bloqueio de acesso/saída | Pendente |
| **M4 — Combate e grimório** | Motor orientado a catálogo de 222 criaturas e 354 magias, múltiplos inimigos, efeitos, status, consumíveis e relíquias; VFX com fallback honesto. | Nenhum feitiço desconhecido/sem MP; sem recompensas duplicadas; regras especiais testadas por tipo; visual não bloqueia mecânica | Pendente |
| **M5 — Mundo vivo e contratos** | 32 missões, recompensas, reputação, atividades de trabalho, encontros e narrativas emergentes do Modo Livre. | Aceitar, progredir, concluir, falhar/recuar e retomar sem duplicar XP/saque | Pendente |
| **M6 — Substituição** | Finalizar UI, acessibilidade, gamepad, mobile, PWA e proteção de saves **Phaser**. Promover Phaser ao endereço padrão; arquivar clássico como legado. | CI + QA Pages + playtest real; paridade funcional assinada; rota pública e cache validados | Pendente |

## Sequência operacional de cada PR
1. Identificar o módulo de origem real e o comando transacional correspondente; diferenciar código compilado de fonte.
2. Validar dependências dos dados; preservar `curadoria_ingredientes`, IDs, fórmulas legadas e regras já aprovadas.
3. Implementar no `phaser-lab/src/` com funções puras e testes (Node e navegador quando existir UI), depois fazer build reproduzível.
4. Conferir hash dos JSONs de entrada, regressões de economia, coleta, combate, PWA e ações diárias.
5. Publicar prévia Phaser isolada apenas após testes; **nunca** reescrever `game.js` ou a edição clássica.
6. Atualizar este roadmap com evidência de commits, CI, Pages e testes físicos; não chamar “concluído” uma feature apenas desenhada.

## Backlog de paridade (fonte: jogo clássico)
- [ ] Viagem e custo de rações/ouro; cidade atual e atividades locais
- [ ] Mercado por cidade/mercador e renovação de estoque
- [ ] Trabalhar, tutores e treino de proficiências
- [ ] Estudar, meditar, comprar/aprender grimórios
- [ ] Equipar/desequipar arma, armadura e relíquia; utilizar itens fora do combate
- [ ] Receitas de forja, cozinha, encantamento, escrita, curtume, joalheria e alquimia especial
- [ ] Preparos alquímicos comuns com receitas emergentes por efeitos coincidentes
- [ ] 32 missões e encontros/caça por região; recompensas especiais
- [ ] Conjuração generalizada, consumíveis, status e vários monstros em batalha
- [ ] HUD, controles, acessibilidade, dispositivos físicos, instalação offline
- [ ] Fonte + bundle Phaser reprodutíveis e substituição final do clássico

## Evidências e dependências
- [Auditoria alquímica](auditoria-alquimia-peren.md)
- [Roadmap executivo anterior](../ROADMAP.md)
- [Código clássico congelado](../game.js)
- [Fonte Phaser incorporada](../phaser-lab/src/)
- [Prévia atual no Pages](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf)


## Execução M0 — evidências de 30/10/2026
- PR de implementação: [#94](https://github.com/pedromaintenance/peren-o-bruxo/pull/94) em **draft**, sem publicação do Phaser como edição principal.
- Fonte Phaser e assets originais incorporados à branch de transição; `main` e `phaser-demo-m1hf/` não foram modificados.
- O build agora copia os JSONs da raiz (incluindo `curadoria_ingredientes.json`, missões e expedições) para `phaser-lab/public/data/` antes de empacotar. **Nenhuma receita legada é regenerada**.
- O atlas canônico 16×8 é rearranjado **somente em cópia de build** para o contrato histórico 32×4; o teste verifica igualdade RGBA de **todos os 128 quadros**, frame a frame.
- Geradores de variantes antigas M1h-A–D não são reaplicados à arte v5; candidatos já publicados são reutilizados como artefatos históricos, sem intervenção criativa.
- [CI Phaser M0](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/40998037074): **221 testes aprovados, 0 falhas; Vite compilou com sucesso**.
- [QA Modo Livre](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/40998037069): **aprovado**.
- [QA oficial de arte legado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/40998037195): **falhou** em comparação do gerador antigo de caminhada com o atlas v5. O diff desta PR não altera o clássico, mas a falha precisa ser esclarecida antes do merge. Não substituir o teste por aprovação fictícia.
- **Status real:** motor compilável e contratos centrais validados na PR, ainda **não mesclado** e **não lançado**. Próximo trabalho: paridade M1, iniciando pela transação de equipamentos e consumíveis.
