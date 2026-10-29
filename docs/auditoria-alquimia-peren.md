# Auditoria alquímica — Peren, o Bruxo

> Registro persistente de decisões, evidências e continuidade. Data: 2026-10-29. Fonte auditada: `data/curadoria_ingredientes.json` na branch `main`.
> **Estado:** diagnóstico e propostas documentados; nenhuma mudança de regras/runtime, ingredientes, itens, receitas, economia ou saves foi aplicada neste ciclo.

## Decisões aprovadas pelo criador (não rediscutir sem nova orientação)

1. O jogo é fundamentalmente de **coleta e crafting**. Efeitos extremamente poderosos são válidos e desejáveis. **Não nerfar** ingredientes por balanceamento de combate.
2. Alquimia comum inspirada em Skyrim: a preparação é **gerada pelos efeitos coincidentes de pelo menos dois ingredientes distintos**, em vez de buscar uma receita fixa por produto.
3. Diferentes pares podem produzir o mesmo efeito; uma mistura pode ter vários efeitos simultâneos, inclusive benéficos e nocivos.
4. Poções, venenos e misturas **compartilham sprites por família de recipiente/preparação**, sem criar asset individual para cada combinação.
5. Preservar lore da Carcaça, coerência material dos ingredientes e identidades/IDs dos dados; raridade não equivale automaticamente a poder.
6. A curadoria existente especifica mínimo de 3 atributos por ingrediente, intensidade 1–3 e atributos extras somente por revisão manual. **Esses são dados atualmente vigentes, não um teto geral de poder decidido para o gameplay.**
7. O laboratório de itens é somente leitura. Alterações futuras devem preservar edição clássica, Phaser, combate, coleta, economia, assets, PWA e saves.

## Evidências do catálogo atual (análise transversal)

- **111 ingredientes** encontrados em `curadoria_ingredientes.json`.
- **53 IDs de efeitos** distintos.
- **9 efeitos isolados**, existentes em um único ingrediente cada. Com a regra simples de interseção entre dois ingredientes diferentes, nenhum deles produzirá uma poção por enquanto.
- A contagem de parceiros significa número de **outros ingredientes** com pelo menos um efeito compartilhado. Não mede potência, qualidade nem número total de receitas.

### Efeitos isolados — fila de conectividade

| ID do efeito | Nome | Ingrediente único | Intensidade |
|---|---|---|---:|
| `curar_doenca` | Curar doença | Pena de Gaivota (`ing-felsaad-tern-feathers`) | 3 |
| `vampirismo` | Vampirismo | Pó de Vampiro (`ing-vampire-dust`) | 3 |
| `diminuir_carisma` | Diminuir Carisma | Couro de Rato (`ing-charred-skeever-hide`) | 3 |
| `infligir_doenca` | Infligir Doença | Couro de Rato (`ing-charred-skeever-hide`) | 1 |
| `visao_a_distancia` | Visão à Distância | Penas de Falcão (`ing-hawk-feathers`) | 3 |
| `velocidade` | Velocidade | Penas de Falcão (`ing-hawk-feathers`) | 1 |
| `diminuir_sabedoria` | Diminuir Sabedoria | Betta do Rio (`ing-river-betty`) | 1 |
| `aumentar_inteligencia` | Aumentar Inteligência | Musgo Parassol (`ing-emperor-parasol-moss`) | 1 |
| `diminuir_magia` | Diminuir Magia | Libélula Laranja (`ing-orange-dartwing`) | 1 |

**Tratativa:** não remover nem enfraquecer esses efeitos. Encontrar um segundo ingrediente compatível dentro do catálogo, com justificativa material e geográfica. Nenhuma atribuição nova foi aprovada ou implementada.

### Primeiro lote de 12 ingredientes

| Ingrediente | ID | Parceiros | Atributos atuais (intensidade) |
|---|---|---:|---|
| Pena de Gaivota | `ing-felsaad-tern-feathers` | 21 | Curar doença 3; Voar 1; Aumentar Constituição 2 |
| Carapaça de Caranguejo | `ing-mudcrab-chitin` | 31 | Aumentar Força 2; Aumentar Constituição 3; Resistência a Veneno 1 |
| Pó de Vampiro | `ing-vampire-dust` | 11 | Vampirismo 3; Invisibilidade 2; Regenerar Saúde 1 |
| Couro de Rato | `ing-charred-skeever-hide` | 9 | Diminuir Carisma 3; Resistência a Veneno 2; Infligir Doença 1 |
| Penas de Falcão | `ing-hawk-feathers` | 1 | Visão à Distância 3; Voo 2; Velocidade 1 |
| Raiz Botulínica | `ing-jarrin-root` | 42 | Dano à Saúde 3; Diminuir Constituição 3; Diminuir Destreza 3; Diminuir Força 3 |
| Betta do Rio | `ing-river-betty` | 26 | Aumentar Força 2; Aumentar Destreza 3; Diminuir Sabedoria 1 |
| Musgo Parassol | `ing-emperor-parasol-moss` | 26 | Regenerar Saúde 2; Aumentar Inteligência 1; Dano à Saúde 1 |
| Raiz Velada | `ing-nirnroot` | 24 | Invisibilidade 3; Resistência à Magia 2; Diminuir Destreza 1 |
| Raiz Velada Rubra | `ing-crimson-nirnroot` | 33 | Invisibilidade 3; Dano à Saúde 2; Diminuir Constituição 3 |
| Sino da Morte | `ing-deathbell` | 24 | Dano à Saúde 2; Diminuir Velocidade 2; Fraqueza a Veneno 1 |
| Flor Venenosa | `ing-poison-bloom` | 24 | Dano à Saúde 3; Medo 2; Diminuir Velocidade 1 |

**Achados:** Penas de Falcão só encontra **1 parceiro** e tem dois efeitos isolados; Raiz Botulínica encontra **42 parceiros** e seus quatro efeitos III são válidos (não balancear para baixo). Carapaça de Caranguejo, Raiz Velada, Raiz Velada Rubra, Sino da Morte e Flor Venenosa não exigem correção por potência. Pó de Vampiro mantém Vampirismo III, mas esse efeito precisa de uma segunda fonte para ser fabricável por interseção.

## Divergência documental a resolver

O `README.md` registra uma etapa anterior da Pena de Gaivota como **Restaurar stamina 2**, mas a fonte atualmente auditada em `data/curadoria_ingredientes.json` registra **Aumentar Constituição 2**. Não substituir silenciosamente um pelo outro: verificar histórico da curadoria e runtime antes de ajustar o README ou dados. Esta auditoria usa o **JSON atual** como evidência do estado presente.

## Regra de geração proposta — ainda não implementada

```text
selecionar ingredientes A e B (IDs distintos)
interseção = IDs de efeitos presentes em A e B
se interseção vazia: resultado = mistura fracassada
senão: criar preparação com a lista de efeitos coincidentes
persistir composição, efeitos calculados, intensidades e eventual qualidade
escolher sprite por família de recipiente/efeitos, não por receita única
```

**Decisões ainda abertas:** fórmula de potência (não assumir média), contribuição de 3+ ingredientes, efeitos contraditórios, descoberta/visibilidade de propriedades, duração, qualidade de instrumentos, custo e consumo, semântica de poção versus veneno, stacking, aplicação e migração de saves.

**Importante:** `data/receitas.json` ainda contém receitas legadas. Não apagar nem migrar automaticamente até mapear dependências do runtime e escolher estratégia reversível para receitas especiais e produtos legados.

## Continuidade operacional — próximo ciclo

1. Verificar cada um dos 9 efeitos isolados contra os 111 ingredientes, lore e origem; propor novos parceiros **sem aplicar automaticamente**.
2. Auditar o restante do catálogo por conectividade, incoerências semânticas, IDs equivalentes e duplicidade; **não usar balanceamento de poder como critério**.
3. Examinar `game.js`, os módulos de crafting do clássico e do Phaser, `data/receitas.json`, `data/itens.json` e o laboratório para desenhar adaptador de geração compatível.
4. Especificar testes determinísticos: A+B = B+A, dois efeitos em comum geram ambos, nenhum efeito gera falha, ingredientes distintos exigidos, sprites compartilhados, não perder saves.
5. Implementar em mudança separada, testável e reversível, depois de concluir o desenho da migração.

## Rastreamento

- **Ciclo 1 (29/10/2026):** 111 ingredientes, 53 IDs de efeitos, 9 isolados; 12 primeiras fichas enumeradas; regra de crafting emergente registrada; nenhuma mutação do gameplay.
- **Para retomada do chat:** ler este arquivo **antes** de sugerir alterações. A meta é maximizar descoberta e conectividade, não equilibrar combate.


## Ciclo 2 — propostas de conectividade dos 9 efeitos isolados (29/10/2026)

**Status: propostas, NÃO aplicadas à curadoria.** Todos os ingredientes sugeridos já existem no catálogo; acrescentar um quarto atributo requer curadoria explícita. Intensidades abaixo são hipóteses de trabalho (1–3), não dados canônicos.

| Efeito isolado | Novo ingrediente-par sugerido (ID) | Intensidade proposta | Razão ficcional | Risco a verificar |
|---|---|---:|---|---|
| `curar_doenca` | Alho (`ing-garlic`) | 2 | Planta associada a proteção contra enfermidades; já tem regeneração e resistência a veneno | Não confundir resistência a veneno com cura de doença |
| `vampirismo` | Coração de Espinheiros (`ing-briar-heart`) | 2 | Coração ritualmente animado que pode absorver vida de outros seres | Precisar definir absorção de vida versus regeneração |
| `diminuir_carisma` | Fungo de Gualápoles (`ing-namira-s-rot`) | 2 | Fungo corruptor, associado a medo e degradação social/sensorial | Carisma é atributo complexo: evitar confundir aparência com carisma |
| `infligir_doenca` | Cauda de Rato (`ing-skeever-tail`) | 2 | Vetor de patógenos plausível na ficção alquímica | Diferenciar doença de dano à saúde |
| `visao_a_distancia` | Olho de Felino (`ing-eye-of-sabre-cat`) | 2 | Órgão visual predatório já associado à percepção | Distinguir visão à distância de bônus genérico de percepção |
| `velocidade` | Libélula Azul (`ing-blue-dartwing`) | 2 | Mobilidade veloz e ágil, já com aumento de Destreza | Diferenciar deslocamento de velocidade de reação/Destreza |
| `diminuir_sabedoria` | Amanita Rubra (`ing-fly-amanita`) | 2 | Cogumelo fantástico relacionado a frenesi/desorientação | O efeito não deve implicar farmacologia real nem igualar frenesia a redução de sabedoria |
| `aumentar_inteligencia` | Raiz Mestra (`ing-taproot`) | 2 | Raiz de tradição arcana que já manipula regeneração e restauração mágicas | Fundamentação fraca: exigir lore ou substituir candidato |
| `diminuir_magia` | Garra de Bruxa (`ing-hagraven-claw`) | 2 | Garra ritual já associada a dano de magia, potencial para supressão | **Dano à Magia não é necessariamente Diminuir Magia:** definir semântica |

### Verificação preliminar dos candidatos

- Todos os nove IDs candidatos constam no catálogo atual e nenhum deles contém o respectivo efeito antes da proposta.
- Cada adição criaria pelo menos um par válido para o efeito isolado, **se** o motor adotar a regra de interseção.
- Não introduzimos ingredientes novos, não removemos atributos existentes e não reduzimos qualquer potência.
- A proposta de `aumentar_inteligencia` é de confiança **baixa**; `diminuir_magia` é **média/baixa**, pois há possível sobreposição semântica com `dano_magia`.
- As demais são hipóteses ficcionais coerentes, ainda sujeitas à análise de descrições, lore e consequências das combinações.

### Questões identificadas para a próxima auditoria

1. **Colisão de nomes:** o catálogo contém dois IDs diferentes chamados *Ovo de Tordo* (`ing-rock-warbler-egg`, `ing-pine-thrush-egg`), com propriedades distintas. Decidir nomes que permitam distingui-los sem alterar IDs.
2. **Taxonomia de efeitos:** estabelecer distinções objetivas entre `dano_magia` / `diminuir_magia`, `aumentar_percepcao` / `visao_a_distancia`, `aumentar_destreza` / `velocidade` e `dano_saude` / `infligir_doenca`.
3. **Misturas de múltiplos ingredientes:** a condição de ativação por duas fontes deve ser contada **por efeito**, não por quantidade total de ingredientes. Um efeito com uma única fonte em um frasco de três ingredientes não ativa.
4. **Sprites:** escolha por família visual; evitar nomes de arquivos associados a cada receita específica.

### Próxima etapa segura

Auditar as descrições existentes dos nove candidatos e testar combinações novas **em simulação**, comparando com efeitos legados, antes de propor uma mudança de dados ativa. Depois, localizar pontos de consumo de receitas no clássico e no Phaser para planejar integração reversível.

**Rastro:** segundo ciclo não modifica `data/curadoria_ingredientes.json`, `data/itens.json`, `data/receitas.json` nem runtime.


## Ciclo 3 — validação das descrições e integração (29/10/2026)

**Fonte da avaliação:** descrições e atributos vigentes dos nove ingredientes candidatos em `data/curadoria_ingredientes.json`; inspeção estática de `game.js` e diretórios `phaser-demo-m1hf/` e `laboratorio-itens/`. Não foram executados testes em navegador. **Nenhum dado jogável alterado.**

### Validação dos nove candidatos da etapa anterior

| Efeito desejado | Candidato | Compatibilidade com descrição atual | Decisão da auditoria |
|---|---|---|---|
| Curar Doença | Alho | Alta: bulbo usado tradicionalmente em remédios/proteção | **Recomendado** como quarto atributo II |
| Vampirismo | Coração de Espinheiros | Baixa/média: concentração de energia mágica, sem referência explícita a drenagem vital | **Suspenso** até justificar a transferência de vitalidade no lore |
| Diminuir Carisma | Fungo de Gualápoles | Baixa: decomposição e ritos soturnos não implicam necessariamente diminuição de carisma | **Suspenso**; avaliar maldição social/repulsa sobrenatural em vez de aparência |
| Infligir Doença | Cauda de Rato | Alta: roedor de docas, venenos debilitantes | **Recomendado** como quarto atributo II |
| Visão à Distância | Olho de Felino | Alta: sentido de caça, já possui Aumentar Percepção II | **Recomendado** como quarto atributo II, distinguir de percepção geral |
| Velocidade | Libélula Azul | Alta: inseto ágil, efeito de destreza preexistente | **Recomendado** como quarto atributo II, velocidade física ≠ destreza |
| Diminuir Sabedoria | Amanita Rubra | Média/alta: cogumelo psicoativo usado em preparações de combate, já tem Frenesi | **Recomendado sob definição** como quarto atributo II; efeito fantástico, não alegação farmacológica |
| Aumentar Inteligência | Raiz Mestra | Baixa: descrição afirma recuperação mágica, não cognição | **Suspenso**; buscar ingrediente de memória/conhecimento mais coerente |
| Diminuir Magia | Garra de Bruxa | Média: encantamento e proteção arcanas, já causa Dano à Magia I | **Suspenso** enquanto não diferenciar supressão temporária e dano à reserva |

**Resultado:** cinco candidatos com fundamentação suficiente para recomendação editorial, quatro suspensos. **Nenhum está aprovado para ser aplicado automaticamente.** Não se deve declarar os nove efeitos resolvidos enquanto não houver mudança de dados validada.

### Semântica de efeitos proposta

- `dano_magia`: dano direto ou degradação da reserva atual de magia; não confundir com redução do máximo.
- `diminuir_magia`: redução temporária da capacidade máxima de magia (ou potência arcana, conforme futura definição); escolha **ainda aberta** para compatibilidade com mecânicas reais.
- `aumentar_percepcao`: melhora geral de percepção sensorial/atenção.
- `visao_a_distancia`: capacidade de ver detalhes/alvos em distância superior à normal; não confundir com visão remota através de paredes.
- `aumentar_destreza`: melhora coordenação, precisão ou testes relacionados ao atributo.
- `velocidade`: melhora deslocamento/mobilidade, não aumenta automaticamente Destreza.
- `dano_saude`: perda imediata de pontos de vida.
- `infligir_doenca`: aplica estado de doença com consequências próprias, mesmo sem dano imediato.
- `diminuir_sabedoria`: debilita discernimento/julgamento; não precisa representar doença real.
- `vampirismo`: retira vitalidade de alvo para beneficiar usuário (definir aplicação, custo e limite de alvo).

Todas essas são **definições de design propostas**, sujeitas a revisão conforme o motor e a interface.

### Integração observada no clássico

Em `game.js`, a lista `FILES` carrega `itens`, `receitas` e outros JSON, mas **não** `curadoria_ingredientes`; portanto não se pode afirmar que os atributos revisados já governam o craft clássico.

- `setupIndex` indexa `receitas` por ID.
- `canCraft(r)` verifica acesso à receita, perícia, nível e estoque de ingredientes.
- `craftView()` filtra `DB.receitas` por estação e nome.
- `craft(id)` recebe um ID de receita, valida e consome materiais.
- Para substituir crafting alquímico comum, será necessário integrar a curadoria ao carregamento, implementar gerador de efeitos, criar representação serializável do produto e atualizar UI/inventário.
- Não substituir diretamente `craft(id)` de todas as estações: preservar forja, alimentos, encantamento, rituais e receitas especiais.

### Integração Phaser e laboratório

- A edição Phaser possui **cópias próprias** de `data/itens.json` e `data/receitas.json`, além de módulos e assets próprios. A mudança no JSON da raiz **não sincronizará** automaticamente a prévia Phaser; localizar o código runtime exato antes de editar.
- O laboratório possui `laboratorio-itens/app.js`, `README.md` e painel somente leitura. Futuramente deve mostrar a conectividade de atributos e prévia de combinações sem gravar nada.
- A arquitetura deverá manter ambas as experiências técnicas como o mesmo jogo e preservar saves com versionamento e migração aditiva.

### Contrato de algoritmo recomendado (não implementado)

```js
// ilustração conceitual, não código do runtime
const contagem = new Map();
for (const ingrediente of ingredientesDistintos) {
  for (const efeito of ingrediente.atributos) {
    if (!contagem.has(efeito.id)) contagem.set(efeito.id, []);
    contagem.get(efeito.id).push({ ingrediente: ingrediente.id, intensidade: efeito.intensidade });
  }
}
const efeitosGerados = [...contagem]
  .filter(([, origens]) => origens.length >= 2)
  .map(([id, origens]) => ({ id, origens, potencia: calcularPotencia(origens, processo) }));
```

**Invariantes:** IDs de ingrediente não duplicados no conjunto considerado; ordem de seleção não altera o resultado; potência determinística para mesmos materiais/processo; efeitos independentes não se anulam automaticamente; classificação visual não cria item fixo nem sprite individual; não interpretar um efeito com fonte única como ativado por haver três ingredientes no total.

### Pendências e próximos passos

1. Resolver os quatro candidatos suspensos com análise comparativa do restante da lore/descrições. Pode-se preferir acrescentar atributos novos em ingredientes atuais a alterar os nove ingredientes-fonte.
2. Simular, sem mutação, o impacto das cinco propostas recomendadas sobre o grafo de combinações e a frequência dos efeitos.
3. Inspecionar as implementações exatas de Phaser e o armazenamento de saves (não apenas a existência de diretórios).
4. Produzir **teste de compatibilidade** antes de mexer em `receitas.json` e `itens.json`.
5. Consultar a divergência Pena de Gaivota (README ≠ curadoria) antes de alterar definições.
