# QA — Recursos alquímicos (Saúde, Magia, Capacidade e Regeneração)

**05/11/2026 · Todos os resultados são PROPOSTAS DE DESIGN.**
Arquivos experimentais: [simulador puro](recursos-alquimicos-experimental.mjs), [testes de recursos](recursos-alquimicos-experimental.test.mjs), [painel HTML](painel-recursos-alquimicos-v1.html) e [contrato de pesquisa JSON](../data/contrato-recursos-alquimicos-proposta.json).
Estudo interpretativo: [`docs/estudo-recursos-alquimicos-v1.md` na main](https://github.com/pedromaintenance/peren-o-bruxo/blob/main/docs/estudo-recursos-alquimicos-v1.md).

## Testes executados no ciclo

- **31/31** verificações de operações matemáticas, invariantes, exceções de capacidade, regeneração e compatibilidade legada passaram em JavaScript V8 isolado. O arquivo `.test.mjs` utiliza `node:test` para reproduzir os testes em checkout, **mas ainda não foi executado em CI Node real**.
- **14/14** checagens da interface passaram em DOM simulado, incluindo cinco cenários, diferenças de ordem, preservação de PV máximo, hipóteses para Diminuir Magia, taxas positivas/negativas e correspondência entre alternativas.
- Arquivos de runtime `game.js`, Phaser, `data/curadoria_ingredientes.json`, `data/itens.json`, receitas e saves **não foram alterados**.
- **Ainda pendentes:** browser renderizado, responsividade mobile/Xbox, acessibilidade leitor de tela, integração com o estado real do jogo, prova de persistência e teste visual do usuário.

## Roteiro para revisão humana (sem aplicar regras)

1. **Dano + cura:** selecionar 40 como magnitude de QA com personagem 95/100 PV. Dano antes da cura → **95/100 PV**; cura antes do dano → **60/100 PV**; saldo simultâneo → **95/100 PV**. Registrar preferência sem aprovar ainda.
2. **Aumentar Saúde:** base 60/100 PV, aumento máximo de 30 em QA. Preservar atual → **60/130**; preservar deficit → **90/130**; preservar proporção → **78/130**.
3. **Diminuir Magia:** base 70/80 MP, redução fictícia de 40. Reduzir máximo/preservar atual → **40/40 MP**; reduzir máximo/preservar deficit → **30/40 MP**; opção "reduzir eficácia" → atributo indisponível, **MP permanece 70/80**; não implica que efeito não exista no cânone.
4. **Regenerar Saúde:** base 98/100 PV, taxa 2 mais magnitude de QA, três intervalos fictícios. O PV não ultrapassa 100; taxa não causa cura antes de um intervalo.
5. **Regenerar + Diminuir Regeneração de Magia:** base 30/80 MP e taxa 1, aumento de QA versus redução de 2. Diminuir taxa apenas não reduz MP atual neste estudo.
6. Conferir legenda PROPOSTA e ausência de poder de gravar ingredientes, consumir poção ou mexer no save.
7. Validar em 360×800, 390×844 e 1280×800; com teclado, zoom e leitor de tela se disponível.
8. Verificar **legado**: `game.js` atualmente trata `Regenerate Health/Magicka` como recuperação instantânea. Migrar isso sem decisão expressa quebraria semântica de itens em uso.

## Limitações e decisões que ainda bloqueiam implementação

**Ainda não existem** magnitude de efeito derivada de I–III, duração, alvo, custo, disparo de ações, resistência, empilhamento, efeitos no PV zero, expiração de buffs, reversão de capacidade nem política de simultaneidade aprovada. O simulador clampa recursos a 0…máximo e registra `baseRate` só como hipóteses. Não interpretar resultado de QA como regra de combate ou ressurreição.

**Proteção acrescentada ao experimento:** quatro testes adicionais exigem que a passagem de **0 PV para valores positivos** por cura, saldo simultâneo, aumento de máximo ou regeneração seja **rejeitada** enquanto não existir decisão de derrota/revivificação. Isso não estabelece regra de ressurreição nem altera o comportamento do clássico.\n\n**Reprodução em checkout:** `node --test prototipos/recursos-alquimicos-experimental.test.mjs`.

**Gate:** decidir REC-D01 a REC-D07 antes de carregar qualquer arquivo experimental no Phaser, alterar `useItem`, modificar inventário ou anunciar bônus de duração/potência aos jogadores.
