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

## Ciclo 4 — decisão aprovada: Alho (29/10/2026)

- **Aprovado pelo criador:** adicionar `curar_doenca` / **Curar Doença II** ao ingrediente `ing-garlic` (Alho), preservando seus três atributos anteriores e ID.
- Curadoria ativa atualizada em `data/curadoria_ingredientes.json` com o quarto atributo e equivalente legado `Cure Disease` para consistência interna de metadados.
- O efeito `curar_doenca` passa de 1 a 2 ingredientes na curadoria: **Pena de Gaivota III + Alho II**. A dupla também compartilha `aumentar_constituicao`, portanto a futura mistura dinâmica ativará ambos.
- **Não foi alterado** motor clássico, dados de itens/receitas, Phaser nem saves. As receitas antigas não passam a ser geradas automaticamente até integração futura.
- **Próxima decisão:** Cauda de Rato (`ing-skeever-tail`) — proposta adicionar `infligir_doenca` II.

## Ciclo 5 — decisão aprovada: Cauda de Rato (29/10/2026)

- **Aprovado:** adicionar `infligir_doenca` (**Infligir Doença II**) a `ing-skeever-tail` (Cauda de Rato).
- Mantidos todos os três atributos anteriores e o ID. Adicionado também o rótulo compatível `Inflict Disease` à lista legada `efeitos`, para consistência de metadados.
- O efeito `infligir_doenca` passa a ter dois ingredientes: Couro de Rato I e Cauda de Rato II. Uma futura mistura entre os dois ativará Infligir Doença; efeitos restantes só ativam se houver duas fontes.
- **Não alterados:** `data/itens.json`, `data/receitas.json`, runtime clássico, Phaser ou saves. Motor dinâmico ainda não integrado.
- **Próxima ficha para decisão:** Olho de Felino (`ing-eye-of-sabre-cat`) — adicionar `visao_a_distancia` II.

## Ciclo 6 — decisão aprovada: Olho de Felino (29/10/2026)

- **Aprovado pelo criador:** acrescentar `visao_a_distancia` (**Visão à Distância II**) a `ing-eye-of-sabre-cat` (Olho de Felino).
- Preservados os três atributos anteriores, descrição, raridade e ID. Adicionado o equivalente textual `Far Sight` ao campo legado `efeitos` para manter coerência de metadados (não equivale à integração do motor).
- Efeito antes isolado em Penas de Falcão III agora possui duas fontes: Olho de Felino II e Penas de Falcão III. O par compartilha Visão à Distância, sem compartilhar os outros efeitos.
- Sem alterações no motor clássico, Phaser, receitas fixas, itens ou saves. O crafting dinâmico continua pendente.
- **Próxima ficha:** Libélula Azul (`ing-blue-dartwing`) — sugestão `velocidade` II, condicionada à decisão do criador.

## Ciclo 7 — decisão aprovada: Libélula Azul (29/10/2026)

- **Aprovado pelo criador:** adicionar `velocidade` (**Velocidade II**) à Libélula Azul (`ing-blue-dartwing`).
- Preservados três atributos anteriores, descrição, raridade e ID; adicionado `Speed` ao campo legado `efeitos` para consistência descritiva, sem afirmar compatibilidade runtime.
- Velocidade passa de uma fonte (Penas de Falcão I) a duas (Libélula Azul II + Penas de Falcão I). Essa combinação compartilha apenas Velocidade e poderá gerar uma preparação correspondente quando o sistema dinâmico existir.
- Não foram alterados `data/itens.json`, `data/receitas.json`, Phaser, runtime clássico ou saves.
- **Próxima proposta para decisão:** Amanita Rubra (`ing-fly-amanita`) — adicionar `diminuir_sabedoria` II, permanecendo a distinção entre psicotropismo fictício, frenesi e debilitação de discernimento.

## Ciclo 8 — decisão: Amanita Rubra (29/10/2026)

Aprovado pelo criador: adicionar Diminuir Sabedoria II (`diminuir_sabedoria`) à Amanita Rubra (`ing-fly-amanita`). Mantidos os três atributos anteriores. O efeito compartilha agora duas fontes: Betta do Rio I e Amanita Rubra II. Não houve mudança de motor, receitas, itens ou saves. Próxima consulta: Coração de Espinheiros e Vampirismo II, cuja coerência ainda está em avaliação.

## Ciclo 9 — decisão aprovada: Coração de Espinheiros (29/10/2026)

- **Aprovado pelo criador:** acrescentar `vampirismo` (**Vampirismo II**) a `ing-briar-heart`, preservando os três atributos anteriores e o ID.
- **Descrição canônica revisada:** “Núcleo vegetal espinhoso e parasitário que concentra energia mágica, imobiliza suas presas e absorve a vitalidade de outros seres para sustentar a própria existência.”
- Adicionado rótulo legado `Vampirism` como metadado. Efeito agora compartilhado com Pó de Vampiro (Vampirismo III).
- **Decisão de design expressa:** Vampirismo **deve poder transformar alguém em vampiro com o tempo**. A progressão da transformação, condições, duração, acúmulo de exposição, resistência/reversão e consequências permanecem para definição futura; **não reduzir Vampirismo a simples drenagem de pontos de vida**.
- Não alterados runtime clássico, Phaser, `data/itens.json`, `data/receitas.json` ou saves. Alteração somente na curadoria e documentação.
- **Próxima ficha para decisão:** Fungo de Gualápoles (`ing-namira-s-rot`), possível `diminuir_carisma` II; associação ainda depende de justificativa de repulsa sobrenatural versus aspecto físico.

## Ciclo 10 — decisão aprovada: Fungo de Gualápoles (29/10/2026)

- **Aprovado pelo criador:** adicionar `diminuir_carisma` (**Diminuir Carisma II**) ao Fungo de Gualápoles (`ing-namira-s-rot`).
- **Descrição canônica revisada:** “Fungo de decomposição associado a rituais soturnos, cuja influência sobrenatural torna a presença de quem o utiliza perturbadora e socialmente repulsiva, enfraquecendo seu Carisma sem necessariamente alterar sua aparência.”
- A repulsa é **sobrenatural**, ligada à presença social e força de personalidade, e não se reduz à aparência física ou ao odor. Preservados os três efeitos anteriores e ID.
- Acrescentado metadado legado `Reduce Charisma`. O efeito agora tem duas fontes na curadoria: Couro de Rato III e Fungo de Gualápoles II. O par compartilha Diminuir Carisma.
- Sem mudanças no motor clássico, Phaser, itens, receitas ou saves. O crafting dinâmico continua pendente.
- **Próxima ficha para decisão:** Raiz Mestra (`ing-taproot`), possível `aumentar_inteligencia` II, antes suspensa por fundamentação fraca; apresentar alternativa e solicitar decisão do criador.

## Ciclo 11 — decisão aprovada: Raiz Mestra (29/10/2026)

- **Aprovado pelo criador:** adicionar `aumentar_inteligencia` (**Aumentar Inteligência II**) à Raiz Mestra (`ing-taproot`), mantendo seus três atributos anteriores.
- **Descrição canônica revista:** “Raiz profunda carregada de seiva encantada, cujas ramificações formam uma rede de memória vegetal que conserva impressões e conhecimentos absorvidos do ambiente; sua seiva favorece a recuperação de magia e pode ampliar a Inteligência.”
- A rede subterrânea de raízes funciona como memória vegetal; sua seiva pode ampliar temporariamente a cognição, além de recuperar energia mágica. Esse é um elemento ficcional da Carcaça.
- Metadado legado `Fortify Intelligence` acrescentado; sem integração automática à fabricação.
- `aumentar_inteligencia` passa a ter duas fontes na curadoria: Musgo Parassol I e Raiz Mestra II. A mistura futura poderá ativar Aumentar Inteligência.
- **Não alterados:** runtime clássico, Phaser, itens, receitas e saves.
- **Próxima decisão:** Garra de Bruxa (`ing-hagraven-claw`) para `diminuir_magia` II, distinguindo diminuição temporária da capacidade mágica do dano à reserva atual.

## Ciclo 12 — Garra de Bruxa aprovada; conectividade encerrada (29/10/2026)

- **Decisão aprovada:** Garra de Bruxa (`ing-hagraven-claw`) recebe `diminuir_magia` (**Diminuir Magia II**) como quarto atributo; os três anteriores foram preservados.
- **Nova descrição:** “Garra de feiticeira monstruosa utilizada em encantamentos, proteções e maldições capazes de reprimir temporariamente a capacidade mágica de outras criaturas.”
- O campo legado `efeitos` recebe o rótulo `Reduce Magicka`; nenhuma mudança foi feita nos motores, itens, receitas ou saves.
- A Garra de Bruxa II compartilha `diminuir_magia` com a Libélula Laranja, destravando o último efeito antes isolado no modelo de interseção.
- **Recontagem após os nove ajustes aprovados:** 111 ingredientes, 53 efeitos distintos, 0 efeitos presentes em uma única fonte. Todos os 53 efeitos possuem pelo menos duas fontes.

## Ciclo 13 — início da auditoria de conectividade geral (29/10/2026)

A ordenação por número de parceiros **não é avaliação de potência**, apenas de oportunidade de combinações. Menor conectividade: Penas de Falcão (3); Raiz de Trama (9); Seiva de Ent (9); Cogumelo Escamoso (9); Cogumelo Luminescente (10); Couro de Rato (11); Pó de Vampiro (12); Língua-de-Dragão (12); Coração de Demônio (13); Musgo Pendente (14).

**Próxima ficha participativa:** Penas de Falcão (`ing-hawk-feathers`), primeiro candidato a reavaliar porque era o ingrediente mais isolado, mesmo após a adição de Visão à Distância no Olho de Felino e Velocidade na Libélula Azul. Verificar novamente atributos, parceiros e possibilidades de combinação; não alterar sem decisão do criador.

## Ciclo 14 — decisão concluída: Penas de Falcão (29/10/2026)

- **Decisão explícita do criador:** manter integralmente a ficha de Penas de Falcão (`ing-hawk-feathers`) **sem alterações**.
- Permanecem Visão à Distância III, Voo II e Velocidade I, a raridade comum, a descrição e o ID. Seus 3 parceiros identificados são Pena de Gaivota (Voo), Olho de Felino (Visão à Distância) e Libélula Azul (Velocidade).
- **Conclusão:** baixa conectividade não é erro por si só; três efeitos com um parceiro distinto cada já permitem experimentação. Não acrescentar atributos apenas por meta numérica.
- `data/curadoria_ingredientes.json` **não modificado** nesta decisão. Próxima ficha para consulta: Raiz de Trama (`ing-trama-root`), com 9 parceiros, três atributos e sem proposta de alteração automática.

## Ciclo 15 — decisão concluída: Raiz de Trama (29/10/2026)

- **Decisão expressa do criador:** manter integralmente sem alterações a ficha da Raiz de Trama (`ing-trama-root`).
- Permanecem **Diminuir Velocidade II**, **Aumentar Capacidade de Carga II** e **Fraqueza à Eletricidade I**, assim como nome, descrição, raridade incomum e ID.
- Foram identificados 9 ingredientes parceiros, distribuídos pelas três propriedades. A explicação hipotética das fibras condutoras **não foi aprovada** e portanto não foi incluída na descrição.
- **Somente este dossiê foi atualizado**; nenhum arquivo de curadoria, receita, motor ou save foi modificado.
- **Próxima ficha para decisão:** Seiva de Ent (`ing-spriggan-sap`), com 9 parceiros; não modificar antes de nova aprovação.

## Ciclo 16 — decisão concluída: Seiva de Ent (29/10/2026)

- **Decisão expressa do criador:** manter integralmente sem alterações a ficha da Seiva de Ent (`ing-spriggan-sap`).
- Permanecem **Aumentar Encantamento III**, **Aumentar Alteração II** e **Aumentar Ferraria II**; também se mantêm a descrição, raridade rara e identidade/ID.
- Os nove parceiros já encontrados justificam sua conectividade. A expansão hipotética da descrição sobre transformação da matéria **não foi aprovada** e não deve ser aplicada.
- **Somente este dossiê foi atualizado**; o JSON de curadoria, itens, receitas, motores e saves não sofreram alterações.
- **Próxima ficha participativa:** Cogumelo Escamoso (`ing-scaly-pholiota`), com nove parceiros. Analisar e solicitar decisão sem alterar previamente.

## Ciclo 17 — decisão concluída: Cogumelo Escamoso (29/10/2026)

- **Decisão explícita do criador:** manter integralmente sem alterações a ficha do Cogumelo Escamoso (`ing-scaly-pholiota`).
- Permanecem **Aumentar Capacidade de Carga II**, **Aumentar Ilusão II** e **Fraqueza à Magia I**, além de descrição, raridade comum, nome e ID.
- Observação de conectividade: 9 parceiros; Tufo Rastejante compartilha dois efeitos (Capacidade de Carga e Fraqueza à Magia). Não adicionar um quarto atributo apenas para elevar conectividade.
- **Somente o dossiê foi atualizado**, sem modificar curadoria, itens, receitas, motor ou saves.
- **Próxima ficha para decisão:** Cogumelo Luminescente (`ing-glowing-mushroom`), mantendo a revisão participativa.

## Ciclo 18 — decisão concluída: Cogumelo Luminescente (29/10/2026)

- **Decisão explícita do criador:** manter integralmente sem alterações a ficha do Cogumelo Luminescente (`ing-glowing-mushroom`).
- Preservados **Aumentar Destruição II**, **Aumentar Ferraria II** e **Resistência à Eletricidade I**, assim como nome, descrição, raridade comum e ID.
- O ingrediente apresenta 10 parceiros; Poeira Luminosa compartilha Aumentar Destruição e Resistência à Eletricidade, oferecendo combinação de dois efeitos. Expansão energética ou metalúrgica da descrição foi apenas proposta, **não aprovada**.
- Atualizado **somente o dossiê**; `data/curadoria_ingredientes.json`, receitas, itens, runtimes e saves permanecem intocados neste ciclo.
- **Próxima ficha participativa:** Couro de Rato (`ing-charred-skeever-hide`), para avaliação de coerência e conectividade, sem alteração automática.

## Ciclo 19 — decisão concluída: Couro de Rato (29/10/2026)

- **Decisão explícita do criador:** manter integralmente sem alterações a ficha de Couro de Rato (`ing-charred-skeever-hide`).
- Preservados **Diminuir Carisma III**, **Resistência a Veneno II** e **Infligir Doença I**, além de nome, descrição, raridade comum e ID.
- Onze parceiros detectados; entre eles Fungo de Gualápoles (Diminuir Carisma), Cauda de Rato (Infligir Doença) e Alho (Resistência a Veneno). Não foi autorizada reformulação narrativa nem atributo adicional.
- **Somente este dossiê foi atualizado.** Não modificar JSON de curadoria, itens, receitas, runtimes ou saves nesta decisão.
- **Próxima ficha participativa:** Pó de Vampiro (`ing-vampire-dust`), com doze parceiros; apresentar para aprovação sem mudanças prévias.

## Ciclo 20 — decisão concluída: Pó de Vampiro (29/10/2026)

- **Decisão explícita do criador:** manter integralmente sem alterações a ficha do Pó de Vampiro (`ing-vampire-dust`).
- Preservados **Vampirismo III**, **Invisibilidade II** e **Regenerar Saúde I**, além de descrição, raridade rara, nome e ID.
- Possui 12 parceiros no catálogo auditado; Coração de Espinheiros compartilha Vampirismo, e Asa de Mariposa Lunar compartilha Invisibilidade e Regenerar Saúde.
- **Continua válida a decisão canônica anterior:** Vampirismo pode causar transformação gradual em vampiro. Essa regra não exige alterar a ficha do Pó de Vampiro, nem foi implementada no runtime.
- **Somente o dossiê foi atualizado**; curadoria, itens, receitas, runtimes e saves inalterados neste ciclo.
- **Próxima ficha participativa:** Língua-de-Dragão (`ing-dragon-s-tongue`). Solicitar decisão antes de qualquer alteração.

## Ciclo 21 — decisão concluída: Língua-de-Dragão (29/10/2026)

- **Decisão explícita do criador:** manter integralmente sem alterações a ficha da Língua-de-Dragão (`ing-dragon-s-tongue`).
- Permanecem **Resistência ao Fogo II**, **Aumentar Ilusão II** e **Aumentar Carisma I**, a descrição botânica original, raridade incomum, nome e ID.
- O ingrediente possui 12 parceiros no catálogo atual: o Coração de Demônio compartilha Aumentar Carisma, Beladona e Cogumelo Escamoso compartilham Aumentar Ilusão, e outros compartilham Resistência ao Fogo.
- **Não foi aprovada** a ampliação hipotética da descrição botânica/mágica. A criatura dragão não é origem literal do ingrediente na ficha atual.
- **Somente o dossiê foi modificado**; curadoria, itens, receitas, runtimes e saves permanecem intactos.
- **Próxima ficha participativa:** Coração de Demônio (`ing-daedra-heart`). Apresentar para decisão antes de fazer qualquer alteração.

## Ciclo 22 — Coração de Demônio: manutenção aprovada (29/10/2026)

O criador decidiu preservar integralmente `ing-daedra-heart`: Aumentar Magia III, Medo III e Aumentar Carisma III. Nome, descrição, raridade épica e ID permanecem. Seus 13 parceiros alquímicos são suficientes; potência III não exige redução. Não houve autorização para atributo novo, alteração de lore ou transformação. Somente esta documentação deve ser atualizada, sem modificar a curadoria, receitas, itens, runtime ou saves. Próxima ficha: Musgo Pendente (`ing-hanging-moss`).

## Ciclo 23 — decisão concluída: Musgo Pendente (29/10/2026)

- **Decisão explícita do criador:** manter integralmente sem alterações a ficha de Musgo Pendente (`ing-hanging-moss`).
- Preservados **Aumentar Saúde II**, **Dano à Magia I** e **Diminuir Regeneração de Magia I**, além de nome, descrição, raridade comum e ID.
- São 14 ingredientes parceiros no estado auditado. A ampliação da descrição sobre vitalidade orgânica e interferência mágica foi somente uma hipótese, **não aprovada**.
- **Somente o dossiê foi atualizado.** Não alterar curadoria, itens, receitas, motor clássico, Phaser ou saves nesta decisão.
- **Próxima ficha:** Penas de Bruxa (`ing-hagraven-feathers`), a apresentar para aprovação individual.

## Ciclo 24 — decisão concluída: Penas de Bruxa (29/10/2026)

- **Decisão explícita do criador:** manter a ficha de Penas de Bruxa (`ing-hagraven-feathers`) integralmente sem alterações.
- Permanecem **Aumentar Conjuração III**, **Frenesi II**, **Fraqueza à Eletricidade I**, nome, descrição, raridade rara e ID.
- Há 15 parceiros por interseção de efeitos. A proposta de aprofundar a descrição ritual ou de incluir um quarto atributo **não foi aprovada**.
- **Alteração apenas documental:** `data/curadoria_ingredientes.json`, itens, receitas, motores e saves não foram modificados.
- **Próxima ficha para decisão:** Peixe-Espada do Sangue (`ing-abecean-longfin`), sem alterações prévias.

## Ciclo 25 — decisão concluída: Peixe-Espada do Sangue (29/10/2026)

- **Decisão explícita do criador:** manter a ficha de Peixe-Espada do Sangue (`ing-abecean-longfin`) integralmente sem alterações.
- Permanecem **Aumentar Furtividade II**, **Aumentar Restauração II** e **Fraqueza ao Gelo I**, além do nome, descrição, raridade incomum e ID.
- Possui 15 parceiros por efeito coincidente. A sugestão de aprofundar o habitat ou biologia no Mar de Sangue não foi aprovada e não deve ser incorporada automaticamente.
- **Alteração apenas documental**; curadoria, itens, receitas, motores e saves não modificados.
- **Próxima ficha participativa:** Craca de Rio (`ing-nordic-barnacle`), com 16 parceiros, aguardando decisão do criador.

## Ciclo 26 — decisão concluída: Craca de Rio (29/10/2026)

- **Decisão explícita do criador:** manter integralmente sem alterações a ficha da Craca de Rio (`ing-nordic-barnacle`).
- Preservados **Respirar na Água II**, **Regenerar Saúde I** e **Dano à Magia I**, além do nome, descrição, raridade comum e ID.
- São 16 parceiros por efeito coincidente. A hipótese de aprofundamento sobre o Rio Ancestral não foi aprovada; não inventar habitat específico.
- **Somente o dossiê foi atualizado**: curadoria, itens, receitas, motores e saves intactos.
- **Próxima ficha participativa:** Fungo de Bolha (`ing-blisterwort`), sem alterações prévias.

## Ciclo 27 — decisão concluída: Fungo de Bolha (29/10/2026)

- **Decisão explícita do criador:** manter integralmente sem alterações a ficha do Fungo de Bolha (`ing-blisterwort`).
- Permanecem **Restaurar Saúde II**, **Frenesi II** e **Diminuir Força I**; preservados nome, descrição, raridade comum e ID.
- O ingrediente tem 16 parceiros por interseção de efeitos; Asa de Borboleta compartilha Restaurar Saúde e Diminuir Força. Não houve aprovação para aprofundamento da descrição nem quarto atributo.
- **Somente o documento de auditoria foi alterado.** Nenhuma mudança na curadoria, receitas, itens, jogo ou saves.
- **Próximo ingrediente para deliberação:** Mirra da Geada (`ing-frost-mirriam`), com 16 parceiros.

## Ciclo 28 — decisão concluída: Mirra da Geada (29/10/2026)

- **Decisão explícita do criador:** manter integralmente sem alterações a ficha da Mirra da Geada (`ing-frost-mirriam`).
- Preservados **Aumentar Furtividade II**, **Resistência ao Gelo II** e **Diminuir Regeneração de Magia I**, além de nome, descrição, raridade incomum e ID.
- O ingrediente possui 16 parceiros por efeito coincidente, incluindo Flor Violeta com duas interseções. Não houve aprovação para descrição adicional ou quarto atributo.
- **Atualização exclusiva do dossiê.** Curadoria, itens, receitas, runtimes e saves permanecem intactos.
- **Próxima ficha participativa:** Dentes de Espectro Gelado (`ing-ice-wraith-teeth`), aguardando deliberação.

## Ciclo 29 — decisão concluída: Dentes de Espectro Gelado (29/10/2026)

- **Decisão explícita:** manter integralmente sem alterações `ing-ice-wraith-teeth`.
- Preservados **Invisibilidade II**, **Aumentar Defesa II**, **Fraqueza ao Fogo II**, descrição, raridade rara, nome e ID.
- O catálogo conta 17 parceiros por coincidência de efeito, incluindo Coroa Sangrenta com duas interseções. Mantém-se a correspondência legada `Fortify Heavy Armor` com atributo revisado `Aumentar Defesa`, sem redefinir mecanicamente agora.
- **Somente este dossiê foi modificado**, sem edição da curadoria, receitas, itens, código ou saves. Nenhum quarto atributo ou mudança descritiva foi autorizado.
- **Próxima ficha para deliberação:** Poeira Luminosa (`ing-glow-dust`), com 18 parceiros.

## Ciclo 30 — Poeira Luminosa (30/10/2026)

Decisão explícita: manter integralmente `ing-glow-dust`, sem alterações. Atributos preservados: Aumentar Destruição II, Resistência à Eletricidade II e Dano à Magia I. Nome, descrição, raridade e ID preservados. Conectividade: 18 parceiros, incluindo Cogumelo Luminescente com dois efeitos comuns. Sem aprovação para modificações de descrição ou quarto atributo. Este ciclo modifica somente o documento de auditoria; curadoria e arquivos do jogo intactos.

## Ciclo 31 — Asa de Mariposa Lunar (30/10/2026)

Decisão explícita: manter integralmente `ing-luna-moth-wing`, sem alterações. Atributos preservados: Invisibilidade II, Regenerar Saúde II e Dano à Magia I. Nome, descrição, raridade incomum e ID preservados. O ingrediente tem 18 parceiros no catálogo; Pó de Vampiro compartilha Invisibilidade e Regenerar Saúde, e Craca de Rio compartilha Regenerar Saúde e Dano à Magia. Não foi aprovada nenhuma expansão da descrição nem quarto atributo. Somente o dossiê é atualizado; não modificar curadoria, receitas ou motor. Próxima ficha participativa: Madeira de Ent Carbonizado (`ing-burnt-spriggan-wood`).

## Ciclo 32 — Madeira de Ent Carbonizado (30/10/2026)

**Decisão expressa do criador:** manter integralmente sem alterações a ficha `ing-burnt-spriggan-wood`. Permanecem Aumentar Alteração III, Diminuir Destreza II, Fraqueza ao Fogo I; preservados também nome, descrição, raridade rara e identificador. São 18 ingredientes parceiros por coincidência de efeitos, entre eles Seiva de Ent (Aumentar Alteração) e Dentes de Espectro Gelado (Fraqueza ao Fogo). Ideias de aprofundamento narrativo e quarto atributo não foram aprovadas. **Somente este dossiê foi modificado neste ciclo**; `data/curadoria_ingredientes.json`, itens, receitas, código e saves não devem ser alterados. **Próxima ficha para decisão:** Tufo Rastejante (`ing-creep-cluster`).

## Ciclo 33 — Tufo Rastejante (30/10/2026)

**Decisão explícita do criador:** manter integralmente sem alterações a ficha `ing-creep-cluster`. Preservados Aumentar Capacidade de Carga II, Restaurar Magia II e Fraqueza à Magia I, além de nome, descrição, raridade comum e ID. São 18 parceiros por efeitos compartilhados; Cogumelo Escamoso compartilha Aumentar Capacidade de Carga e Fraqueza à Magia, Óleo de Autômato compartilha Restaurar Magia e Fraqueza à Magia. Não foram aprovados novos atributos nem mudanças descritivas. **Somente este dossiê foi alterado**, sem mudanças no JSON da curadoria, receitas, itens, código ou saves. **Próximo ingrediente para decisão:** Gelatina de Gafanhoto (`ing-ash-hopper-jelly`).

## Ciclo 34 — Gelatina de Gafanhoto (30/10/2026)

**Decisão explícita do criador:** manter integralmente sem alterações a ficha `ing-ash-hopper-jelly`. Preservados Resistência à Eletricidade II, Restaurar Saúde II e Fraqueza ao Gelo I, juntamente com nome, descrição, raridade incomum e ID. O ingrediente tem 18 parceiros por coincidência de efeitos, incluindo Fungo do Pântano com dois efeitos comuns (Restaurar Saúde e Resistência à Eletricidade). Não foram aprovadas mudanças descritivas ou atributos adicionais. **Somente o dossiê foi atualizado**, sem modificar curadoria, itens, receitas, código do jogo ou saves. **Próxima ficha para deliberação:** Sais Ígneos (`ing-fire-salts`).

## Ciclo 35 — Sais Ígneos (30/10/2026)

**Decisão explícita do criador:** manter integralmente sem alterações a ficha `ing-fire-salts`. Preservados Resistência ao Fogo III, Regenerar Magia II e Fraqueza ao Gelo II, assim como nome, descrição, raridade rara e ID. O catálogo contém 18 parceiros por interseção de efeitos; Orelha-de-Elfo compartilha Resistência ao Fogo e Fraqueza ao Gelo. Não foram autorizados novos atributos, ajustes de intensidade ou ampliações narrativas. **Atualização exclusiva do dossiê:** não houve edição de `data/curadoria_ingredientes.json`, itens, receitas, código ou saves. **Próxima ficha participativa:** Fungo de Gualápoles (`ing-namira-s-rot`), a avaliar sem modificações prévias.

## Ciclo 36 — Fungo de Gualápoles (30/10/2026)

**Decisão explícita do criador:** manter integralmente sem alterações a ficha revisada `ing-namira-s-rot`. Preservados **Medo II**, **Regenerar Saúde I**, **Dano à Magia I** e **Diminuir Carisma II**, além de nome, descrição revisada, raridade comum e ID. A descrição mantém a ideia de repulsão social sobrenatural sem alteração necessária da aparência. O quarto atributo, incluído e aprovado em ciclo anterior, permanece canônico. São **19 ingredientes parceiros** por pelo menos um efeito compartilhado; Couro de Rato compartilha Diminuir Carisma e Asa de Mariposa Lunar compartilha Regenerar Saúde e Dano à Magia. Não foram aprovados outros atributos, intensidades ou reescritas. **Somente o dossiê foi atualizado**, sem modificação na curadoria, itens, receitas, código ou saves. **Próxima ficha para deliberação:** Asa de Borboleta Azul (`ing-blue-butterfly-wing`).

## Ciclo 37 — Asa de Borboleta Azul (31/10/2026)

**Decisão explícita do criador:** manter integralmente sem alterações a ficha `ing-blue-butterfly-wing`. Preservados **Aumentar Encantamento II**, **Diminuir Destreza I** e **Diminuir Regeneração de Magia I**, além de nome, descrição original, raridade comum e ID. São **19 parceiros** por pelo menos um efeito compartilhado; Antena de Verme Gigante compartilha dois efeitos (Aumentar Encantamento e Diminuir Destreza). A expansão da descrição e a adição de quarto atributo foram propostas, mas não aprovadas. **Somente este dossiê foi alterado:** JSON da curadoria, itens, receitas, motor e saves permanecem intactos. **Próxima ficha para deliberação:** Vagem Cinzenta (`ing-ashen-grass-pod`), sem alterações prévias.

## Ciclo 38 — Vagem Cinzenta (03/11/2026)

**Decisão explícita do criador:** manter integralmente sem alterações a ficha `ing-ashen-grass-pod`. Preservados **Aumentar Furtividade II**, **Resistência ao Fogo II** e **Fraqueza à Eletricidade I**, assim como nome, descrição original, raridade comum e identificador. O ingrediente tem **19 parceiros** por compartilhamento de efeitos; Sais Ígneos compartilha Resistência ao Fogo, e Penas de Bruxa compartilha Fraqueza à Eletricidade. Não houve aprovação para quarto atributo ou aprofundamento da descrição botânica. **Somente o dossiê foi alterado**: o JSON da curadoria, as receitas, os itens, os motores e os saves permanecem intactos. **Próxima ficha para decisão:** Fungo do Pântano (`ing-swamp-fungal-pod`).

## Escopo operacional da curadoria — 03/11/2026

O criador dividiu o desenvolvimento: **este fluxo audita e prepara itens/ingredientes**, enquanto **outro chat implementa mecânica, menus, integração e gameplay**. O repositório [`pedromaintenance/monstros-carcaca`](https://github.com/pedromaintenance/monstros-carcaca) torna-se referência cruzada obrigatória de **taxonomia, ecologia, habitats, culturas e geografia**, distinguindo `documentado/confirmado` de `proposto/inferido/rascunho` e registros importados. Ver [`docs/curadoria-itens-consistencia-carcaca.md`](curadoria-itens-consistencia-carcaca.md). A ficha do Fungo do Pântano permanece sem alteração e aguardará o próximo lote de curadoria autônoma. Nenhum item, receita, motor, save ou asset foi alterado por esta definição de escopo.


## Lote autônomo de curadoria — Ciclos 39–46 (03/11/2026)

**Mandato:** a Constituição de Design v1.0 autoriza auditoria editorial sem voto individual; este lote **não constitui nova aprovação pessoal do criador para cada ficha**. Foram preservados nome, descrição, raridade, três atributos e intensidades de todas as oito fichas. Fonte ecológica cruzada: [`monstros-carcaca`](https://github.com/pedromaintenance/monstros-carcaca/tree/b08b0f69c8d6d4ed332540565b61fa32ac3ae076) (`b08b0f69c8d6`). A falta de habitat específico **não é contradição**. Metadados do lote: [`data/auditoria_ecologica_ingredientes.json`](../data/auditoria_ecologica_ingredientes.json).

### Ciclo 39 — Fungo do Pântano (`ing-swamp-fungal-pod`)

**Preservar integralmente por auditoria delegada:** Restaurar Saúde II; Paralisia II; Resistência à Eletricidade I. **19 parceiros** no catálogo; exemplo de dupla com múltiplos efeitos: Fungo de Diabrete (restaurar_saude, paralisia). **Cruzamento ecológico:** Nenhum pântano de origem desta espécie foi confirmado no atlas consultado; ambientes úmidos da foz não comprovam a presença deste fungo. **Decisão editorial:** Conservar a ambivalência entre cura e paralisia, e a resistência elétrica leve. Sem edição de `data/curadoria_ingredientes.json`.

### Ciclo 40 — Gordura de Troll (`ing-troll-fat`)

**Preservar integralmente por auditoria delegada:** Resistência a Veneno II; Aumentar Força II; Frenesi I. **20 parceiros** no catálogo; exemplo de dupla com múltiplos efeitos: Carapaça de Caranguejo (resistencia_veneno, aumentar_forca). **Cruzamento ecológico:** As fichas autorais consultadas não vinculam este material a um troll específico ou a uma população regional. Isso não prova inexistência de trolls na Carcaça. **Decisão editorial:** Não classificar o troll como monstro obrigatório, nem atribuir habitat ou forma de obtenção sem fonte. Sem edição de `data/curadoria_ingredientes.json`.

### Ciclo 41 — Sais do Vazio (`ing-void-salts`)

**Preservar integralmente por auditoria delegada:** Aumentar Magia III; Resistência à Magia II; Fraqueza à Eletricidade I. **20 parceiros** no catálogo; exemplo de dupla com múltiplos efeitos: Algodão da Tundra (aumentar_magia, resistencia_magia). **Cruzamento ecológico:** A palavra 'Vazio' na ficha não prova relação física com a Não-Existência definida como exterior a Corau; origem dos cristais não documentada. **Decisão editorial:** Manter os três efeitos existentes sem reinterpretar o Vazio como entidade, plano habitável ou extração fora de Corau. Sem edição de `data/curadoria_ingredientes.json`.

### Ciclo 42 — Asa de Borboleta (`ing-butterfly-wing`)

**Preservar integralmente por auditoria delegada:** Restaurar Saúde II; Dano à Magia I; Diminuir Força I. **20 parceiros** no catálogo; exemplo de dupla com múltiplos efeitos: Fungo de Bolha (restaurar_saude, diminuir_forca). **Cruzamento ecológico:** Não há identificação autoral de espécie ou distribuição regional para esta borboleta nos registros consultados. **Decisão editorial:** Não presumir que a asa vem da mesma espécie que a Asa de Borboleta Azul. Sem edição de `data/curadoria_ingredientes.json`.

### Ciclo 43 — Asa de Mariposa Ancestral (`ing-ancestor-moth-wing`)

**Preservar integralmente por auditoria delegada:** Aumentar Encantamento III; Aumentar Conjuração II; Diminuir Constituição I. **20 parceiros** no catálogo; exemplo de dupla com múltiplos efeitos: Antena de Verme Gigante (aumentar_encantamento, aumentar_conjuracao). **Cruzamento ecológico:** O adjetivo 'ancestral' não estabelece associação com os primordiais Kindau, Dialel ou Corau nem com uma tradição específica sem fonte. **Decisão editorial:** Preservar evocação e encantamento; não criar espécie, culto ou ritual adicional. Sem edição de `data/curadoria_ingredientes.json`.

### Ciclo 44 — Antena de Verme Gigante (`ing-chaurus-hunter-antennae`)

**Preservar integralmente por auditoria delegada:** Aumentar Encantamento II; Aumentar Conjuração II; Diminuir Destreza I. **20 parceiros** no catálogo; exemplo de dupla com múltiplos efeitos: Asa de Mariposa Ancestral (aumentar_encantamento, aumentar_conjuracao). **Cruzamento ecológico:** O catálogo de Peren fala em verme gigante, mas não há associação autoral confirmada a espécie, bioma ou povo da Carcaça. **Decisão editorial:** Não importar automaticamente a biologia do Chaurus de Skyrim nem transformar 'verme' em classificação zoológica oficial. Sem edição de `data/curadoria_ingredientes.json`.

### Ciclo 45 — Tufo Cinzento (`ing-ash-creep-cluster`)

**Preservar integralmente por auditoria delegada:** Resistência ao Fogo II; Aumentar Destruição II; Diminuir Constituição I. **20 parceiros** no catálogo; exemplo de dupla com múltiplos efeitos: Cinzas Mortuárias (resistencia_fogo, diminuir_constituicao). **Cruzamento ecológico:** A descrição do ingrediente menciona cinzas quentes, mas as paisagens secas da Caatinga e outros biomas não confirmam esse vegetal ou habitat de cinzas. **Decisão editorial:** Diferenciar vegetação adaptada a material queimado de um incêndio regional canônico. Sem edição de `data/curadoria_ingredientes.json`.

### Ciclo 46 — Óleo de Autômato (`ing-dwarven-oil`)

**Preservar integralmente por auditoria delegada:** Regenerar Magia II; Restaurar Magia II; Fraqueza à Magia I. **20 parceiros** no catálogo; exemplo de dupla com múltiplos efeitos: Tufo Rastejante (restaurar_magia, fraqueza_magia). **Cruzamento ecológico:** O manuscrito documenta forjas e galerias anãs em Thargrid, mas não confirma que esses autômatos e o óleo sejam fabricados ou encontrados especificamente ali. **Decisão editorial:** Não atribuir fabrico ou cadeia de comércio a uma cidade sem referência; manter a descrição do item em Peren. Sem edição de `data/curadoria_ingredientes.json`.



## Lote autônomo de curadoria — Ciclos 47–56 (03/11/2026)

**Escopo:** dez fichas na sequência de conectividade, sem alteração dos IDs, das descrições ou dos atributos. A revisão cruza a curadoria de Peren com a fonte autoral [`Monstros da Carcaça`](https://github.com/pedromaintenance/monstros-carcaca/tree/b08b0f69c8d6d4ed332540565b61fa32ac3ae076) (`b08b0f69c8d6`). **Diferença documental corrigida neste lote:** o README legava *Restaurar Stamina II* à Pena de Gaivota; a ficha canônica vigente desde a curadoria registra *Aumentar Constituição II*. A correção é apenas textual no README. As incertezas ecológicas e sugestões de interface não foram convertidas em lore ou gameplay. Matriz estruturada: [`data/auditoria_ecologica_ingredientes.json`](../data/auditoria_ecologica_ingredientes.json).

### Ciclo 47 — Pena de Gaivota (`ing-felsaad-tern-feathers`)

**Auditoria autônoma: preservar a ficha vigente.** Atributos: Curar doença III; Voar I; Aumentar Constituição II. **21 parceiros** por efeito; dupla de efeitos compartilhados: Alho (curar_doenca, aumentar_constituicao). **Evidência de Monstros da Carcaça:** A exclusividade das gaivotas em Portomonte e o vínculo das penas à cura de doenças constam de decisão expressa da curadoria de Peren. O atlas autoral confirma Portomonte, templo de Deméter e purificação local das águas, mas não comprova ecologia/espécie de gaivota ou alcance da magia curativa das penas. **Tratativa:** Manter o registro integral; corrigir apenas o README desatualizado que ainda cita Stamina II, substituindo por Aumentar Constituição II; não inventar potabilidade nem mecanismo da bênção. **Fonte:** `docs/ATLAS_DEMETER_PORTOMONTE_CICLO51.md`, `data/atlas/portomonte-demeter-decisoes-ciclo51.json`. Sem modificação da ficha em `data/curadoria_ingredientes.json`.

### Ciclo 48 — Peixe de Escamas Finas (`ing-cyrodilic-spadetail`)

**Auditoria autônoma: preservar a ficha vigente.** Atributos: Aumentar Restauração II; Medo I; Diminuir Constituição I. **21 parceiros** por efeito; não foi identificada dupla com dois efeitos compartilhados nesta ficha. **Evidência de Monstros da Carcaça:** O Rio Ancestral existe e atravessa a Carcaça, porém o atlas não atribui a este peixe uma ocorrência, bacia, cardume ou época de reprodução. Ser peixe de água doce não permite presumi-lo nativo do Rio inteiro. **Tratativa:** Preservar os três atributos e a descrição; manter a proveniência geográfica desta espécie como não documentada. **Fonte:** `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`. Sem modificação da ficha em `data/curadoria_ingredientes.json`.

### Ciclo 49 — Pó de Presa de Mamute (`ing-powdered-mammoth-tusk`)

**Auditoria autônoma: preservar a ficha vigente.** Atributos: Aumentar Força III; Aumentar Furtividade I; Fraqueza ao Fogo I. **21 parceiros** por efeito; não foi identificada dupla com dois efeitos compartilhados nesta ficha. **Evidência de Monstros da Carcaça:** A descrição de Peren declara um material fossilizado, não uma população viva. O atlas registra ossos ancestrais, cavernas e regiões montanhosas, mas não documenta mamutes locais nem depósitos desse fóssil. **Tratativa:** Preservar força III e as propriedades associadas; não introduzir mamutes vivos, jazidas ou caçadas em Thargrid como fatos. **Fonte:** `docs/ATLAS_MACROAMBIENTES_CICLO35.md`, `docs/ATLAS_GEOGRAFIA_FISICA_CICLO34.md`. Sem modificação da ficha em `data/curadoria_ingredientes.json`.

### Ciclo 50 — Coroa Sangrenta (`ing-bleeding-crown`)

**Auditoria autônoma: preservar a ficha vigente.** Atributos: Resistência à Magia II; Aumentar Defesa II; Fraqueza ao Fogo I. **21 parceiros** por efeito; dupla de efeitos compartilhados: Dentes de Espectro Gelado (aumentar_defesa, fraqueza_fogo). **Evidência de Monstros da Carcaça:** A taxonomia admite fungos como flora da Carcaça; o nome Coroa Sangrenta não prova origem no Mar de Sangue nem ligação com ritos de sangue. Não há distribuição da espécie no atlas consultado. **Tratativa:** Preservar resistência mágica, defesa e vulnerabilidade ao fogo; não associar ao mar vermelho sem evidência. **Fonte:** `data/taxonomia_carcaca.json`, `docs/ATLAS_MACROAMBIENTES_CICLO35.md`. Sem modificação da ficha em `data/curadoria_ingredientes.json`.

### Ciclo 51 — Casca de Colmeia (`ing-beehive-husk`)

**Auditoria autônoma: preservar a ficha vigente.** Atributos: Resistência a Veneno II; Aumentar Furtividade I; Aumentar Defesa I. **21 parceiros** por efeito; dupla de efeitos compartilhados: Ramo de Cardo (resistencia_veneno, aumentar_defesa). **Evidência de Monstros da Carcaça:** O material de colmeia é coerente como produto biológico, mas nenhum vínculo regional específico, espécie de inseto ou organização de apicultura foi confirmado pelos documentos consultados. **Tratativa:** Preservar atributos defensivos e de furtividade; não criar apiários de Portomonte ou Aldeias de apicultores por inferência. **Fonte:** `docs/ATLAS_MACROAMBIENTES_CICLO35.md`, `docs/ATLAS_DEMETER_PORTOMONTE_CICLO51.md`. Sem modificação da ficha em `data/curadoria_ingredientes.json`.

### Ciclo 52 — Bagas da Neve (`ing-snowberries`)

**Auditoria autônoma: preservar a ficha vigente.** Atributos: Resistência ao Gelo II; Resistência ao Fogo I; Aumentar Encantamento I. **21 parceiros** por efeito; dupla de efeitos compartilhados: Cinzas de Criatura (resistencia_fogo, aumentar_encantamento). **Evidência de Monstros da Carcaça:** O atlas confirma picos nevados nas montanhas de Thargrid, mas não estabelece a distribuição destas bagas nem a origem de sua resistência a calor e gelo. **Tratativa:** Manter os três efeitos; a coincidência 'neve' é indício ecológico, não autorização para declarar Thargrid como fonte exclusiva. **Fonte:** `docs/ATLAS_MACROAMBIENTES_CICLO35.md`, `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`. Sem modificação da ficha em `data/curadoria_ingredientes.json`.

### Ciclo 53 — Dente de Grande Felino (`ing-sabre-cat-tooth`)

**Auditoria autônoma: preservar a ficha vigente.** Atributos: Aumentar Força II; Aumentar Defesa II; Fraqueza a Veneno I. **21 parceiros** por efeito; não foi identificada dupla com dois efeitos compartilhados nesta ficha. **Evidência de Monstros da Carcaça:** A categoria geral fauna está prevista pela taxonomia autoral, mas não há correspondência confirmada deste material com uma espécie, território ou povo específico. O termo Grande Felino é descritivo na ficha de Peren. **Tratativa:** Preservar Força II, Defesa II e Fraqueza a Veneno I; não atribuir automaticamente ao sabre-cat de Skyrim ou a felinos reais. **Fonte:** `data/taxonomia_carcaca.json`, `docs/ATLAS_MACROAMBIENTES_CICLO35.md`. Sem modificação da ficha em `data/curadoria_ingredientes.json`.

### Ciclo 54 — Raiz Mestra (`ing-taproot`)

**Auditoria autônoma: preservar a ficha vigente.** Atributos: Regenerar Magia III; Restaurar Magia II; Fraqueza à Magia I; Aumentar Inteligência II. **21 parceiros** por efeito; dupla de efeitos compartilhados: Tufo Rastejante (restaurar_magia, fraqueza_magia). **Evidência de Monstros da Carcaça:** A rede de memória vegetal e Aumentar Inteligência II já foram aprovados na curadoria de Peren; não há fonte ligando esta raiz a Eldroth, a uma consciência primordial ou a uma rede espiritual específica. **Tratativa:** Respeitar o quarto atributo aprovado e a explicação vegetal; não reinterpretar conhecimento da planta como memória de Kindau ou tecnologia de um povo. **Fonte:** `docs/LORE_HACK_CARCACA_DW.md`, `docs/ATLAS_MACROAMBIENTES_CICLO35.md`. Sem modificação da ficha em `data/curadoria_ingredientes.json`.

### Ciclo 55 — Sal do Sangue (`ing-salt-pile`)

**Auditoria autônoma: preservar a ficha vigente.** Atributos: Regenerar Magia II; Aumentar Restauração I; Diminuir Destreza I. **21 parceiros** por efeito; não foi identificada dupla com dois efeitos compartilhados nesta ficha. **Evidência de Monstros da Carcaça:** A presença do Mar de Sangue é canônica; a descrição de Peren atribui o sal às águas rubras. O atlas não fixa salinidade, método de extração, escala produtiva nem distribuição de salinas ou rota mercantil. **Tratativa:** Preservar nome e atributos sem inventar salinas, monopolização, transporte ou concentração de sal. A fronteira entre águas rubras e azuis permanece móvel. **Fonte:** `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`, `docs/MAR_SANGUE_ECOLOGIA_POLITICA_CICLO5.md`. Sem modificação da ficha em `data/curadoria_ingredientes.json`.

### Ciclo 56 — Amanita Rubra (`ing-fly-amanita`)

**Auditoria autônoma: preservar a ficha vigente.** Atributos: Resistência ao Fogo II; Aumentar Força II; Frenesi II; Diminuir Sabedoria II. **21 parceiros** por efeito; dupla de efeitos compartilhados: Betta do Rio (aumentar_forca, diminuir_sabedoria). **Evidência de Monstros da Carcaça:** Diminuir Sabedoria II é uma adição expressamente aprovada na curadoria. A fonte de Monstros da Carcaça não estabelece população da espécie, medicina ritual nem efeito farmacológico real. **Tratativa:** Manter os quatro atributos e Frenesi II; não transpor alegações médicas sobre fungos reais ou inventar guildas/uso ritual regional. **Fonte:** `data/taxonomia_carcaca.json`, `docs/ATLAS_MACROAMBIENTES_CICLO35.md`. Sem modificação da ficha em `data/curadoria_ingredientes.json`.


## Lote autônomo de curadoria — Ciclos 57–66 (03/11/2026)

**Método:** 10 fichas seguintes por conectividade, ordem de inserção como desempate. Revisão cruzada com [Monstros da Carcaça na revisão `b08b0f69c8d6`](https://github.com/pedromaintenance/monstros-carcaca/tree/b08b0f69c8d6d4ed332540565b61fa32ac3ae076). A presença de mortos-vivos, cultos ou florestas no mundo **não comprova a origem de um item**. Não há novos atributos ou mudanças em raridades, intensidades, descrições e IDs. Dados anexos em [`data/auditoria_ecologica_ingredientes.json`](../data/auditoria_ecologica_ingredientes.json).

### Ciclo 57 — Cinzas Mortuárias (`ing-berit-s-ashes`)

**Ficha preservada:** Aumentar Conjuração II; Resistência ao Fogo II; Diminuir Constituição II; raridade **raro**; **22 parceiros**. Exemplo de mistura de dois efeitos compartilhados: Asa de Mariposa Ancestral (aumentar_conjuracao, diminuir_constituicao). **Achado:** A ficha de Peren indica cinzas preservadas de um escriba. O acervo autoral registra os Kappa-Escribas no Arquivo e mortos-vivos em Vandar, mas não oferece vínculo deste resíduo com eles; nenhuma prática de cremação de Vandar foi confirmada. **Diretriz de curadoria:** Preservar conjuração II, resistência ao fogo II e diminuição de Constituição II. Não atribuir às cinzas origem yokai, vandariana ou culto funerário; tratar restos de pessoa como material de proveniência potencialmente sensível, não mercadoria de fonte presumida. **Fonte:** `docs/VANDAR_POLITICA_DOS_MORTOS_CICLO17.md`; `docs/ECOLOGIA_ARQUIVO_DOS_MORTOS_AFOGADOS.md`. Nenhuma mudança no catálogo jogável.

### Ciclo 58 — Farinha de Ossos (`ing-bone-meal`)

**Ficha preservada:** Resistência ao Fogo I; Aumentar Conjuração II; Diminuir Constituição I; raridade **comum**; **22 parceiros**. Exemplo de mistura de dois efeitos compartilhados: Asa de Mariposa Ancestral (aumentar_conjuracao, diminuir_constituicao). **Achado:** O continente é sobre Golzdov, mas o produto descrito em Peren é farinha de ossos sem indicação de quem os produziu. Nem todas as ossadas do cenário são restos primordiais, humanos ou mortos-vivos de Vandar. **Diretriz de curadoria:** Preservar os três efeitos. Não classificar automaticamente como material de Kindau, ossário ritual ou saque de sepulturas; exigir evidência se a procedência vier a ser individualizada. **Fonte:** `docs/COSMOLOGIA_PRIMORDIAL_KINDAU_UBIACA_V0_3_1.md`; `docs/VANDAR_POLITICA_DOS_MORTOS_CICLO17.md`. Nenhuma mudança no catálogo jogável.

### Ciclo 59 — Flor Luminescente (`ing-gleamblossom`)

**Ficha preservada:** Regenerar Saúde II; Resistência à Magia II; Paralisia I; raridade **incomum**; **22 parceiros**. Não foi encontrado parceiro que compartilhe simultaneamente dois efeitos nesta ficha. **Achado:** O atlas autoral identifica grandes famílias florestais e outros ambientes, mas não comprova a espécie luminescente, sua área de crescimento ou associação com relíquias feéricas. **Diretriz de curadoria:** Conservar a propriedade medicinal, a resistência mágica e a paralisia; não atribuir a planta à floresta de Eldroth ou a uma corte sem fonte específica. **Fonte:** `docs/ATLAS_MACROAMBIENTES_CICLO35.md`; `data/taxonomia_carcaca.json`. Nenhuma mudança no catálogo jogável.

### Ciclo 60 — Cinzas de Criatura (`ing-spawn-ash`)

**Ficha preservada:** Resistência ao Fogo II; Aumentar Encantamento II; Diminuir Constituição II; raridade **incomum**; **22 parceiros**. Exemplo de mistura de dois efeitos compartilhados: Asa de Mariposa Ancestral (aumentar_encantamento, diminuir_constituicao). **Achado:** O adjetivo 'sobrenatural' na curadoria de Peren não identifica uma criatura única de `dist/carcaca/creatures.json`, uma entidade demoníaca ou vítima da necromancia de Vandar. **Diretriz de curadoria:** Manter o nome genérico e os atributos. Não atribuir automaticamente drop às criaturas únicas do Arquivo dos Mortos Afogados; distinguir de Cinzas Mortuárias. **Fonte:** `docs/ECOLOGIA_ARQUIVO_DOS_MORTOS_AFOGADOS.md`; `data/taxonomia_carcaca.json`. Nenhuma mudança no catálogo jogável.

### Ciclo 61 — Açúcar Lunar (`ing-moon-sugar`)

**Ficha preservada:** Restaurar Magia II; Regenerar Magia II; Fraqueza ao Fogo I; raridade **incomum**; **22 parceiros**. Exemplo de mistura de dois efeitos compartilhados: Sais da Geada (restaurar_magia, fraqueza_fogo). **Achado:** A Carcaça possui o Templo da Lua no Rio Ancestral, mas o nome 'Açúcar Lunar' não demonstra vínculo com Severina, fases lunares, sacerdócio, rituais ou produção nesse local. **Diretriz de curadoria:** Preservar a identidade do cristal e seus três atributos, sem inserir proveniência lunar institucional ou transformar o ingrediente em monopólio do templo. **Fonte:** `docs/TEMPLO_LUA_SEVERINA_CICLO29.md`. Nenhuma mudança no catálogo jogável.

### Ciclo 62 — Faixas de Espírito (`ing-wisp-wrappings`)

**Ficha preservada:** Resistência à Magia III; Aumentar Destruição II; Diminuir Constituição I; raridade **raro**; **23 parceiros**. Exemplo de mistura de dois efeitos compartilhados: Tufo Cinzento (aumentar_destruicao, diminuir_constituicao). **Achado:** A existência de mortos-vivos nas ruínas de Vandar não prova que sejam aparições com faixas coletáveis. O atlas diferencia categorias de criaturas e regiões, e o material não cita espécie ou prática de obtenção. **Diretriz de curadoria:** Manter Resistência à Magia III e os demais efeitos. Não atribuir o material a todo morto-vivo de Vandar nem criar uma caça massiva de aparições como fato canônico. **Fonte:** `docs/VANDAR_POLITICA_DOS_MORTOS_CICLO17.md`; `data/taxonomia_carcaca.json`. Nenhuma mudança no catálogo jogável.

### Ciclo 63 — Chapéu Branco (`ing-white-cap`)

**Ficha preservada:** Restaurar Magia II; Aumentar Defesa I; Fraqueza ao Gelo I; raridade **comum**; **23 parceiros**. Exemplo de mistura de dois efeitos compartilhados: Orelha-de-Elfo (restaurar_magia, fraqueza_gelo). **Achado:** A taxonomia autoral enquadra fungos como flora, mas o acervo geográfico não estabelece local, clima ou cultura de extração deste fungo. **Diretriz de curadoria:** Preservar os três atributos e a raridade comum; não mapear cogumelo a todas as cavernas de Thargrid ou florestas por associação temática. **Fonte:** `data/taxonomia_carcaca.json`; `docs/ATLAS_MACROAMBIENTES_CICLO35.md`. Nenhuma mudança no catálogo jogável.

### Ciclo 64 — Raiz Velada (`ing-nirnroot`)

**Ficha preservada:** Invisibilidade III; Resistência à Magia II; Diminuir Destreza I; raridade **raro**; **24 parceiros**. Não foi encontrado parceiro que compartilhe simultaneamente dois efeitos nesta ficha. **Achado:** A raiz é canônica no catálogo de Peren com Invisibilidade III. As florestas de Eldroth e Ironwood existem, mas a origem desta planta ou a participação da Corte não foi documentada pela referência autoral. **Diretriz de curadoria:** Preservar invisibilidade e a descrição, sem reimportar o habitat de Nirnroot de Skyrim ou criar controle feérico sobre a espécie. **Fonte:** `docs/ATLAS_MACROAMBIENTES_CICLO35.md`; `docs/LORE_HACK_CARCACA_DW.md`. Nenhuma mudança no catálogo jogável.

### Ciclo 65 — Sino da Morte (`ing-deathbell`)

**Ficha preservada:** Dano à Saúde II; Diminuir Velocidade II; Fraqueza a Veneno I; raridade **comum**; **24 parceiros**. Exemplo de mistura de dois efeitos compartilhados: Flor Venenosa (dano_saude, diminuir_velocidade). **Achado:** O nome 'Sino da Morte' e o efeito de dano não comprovam que a flor venha de Vandar, de funerais ou da magia de Damaris; o atlas não documenta a espécie. **Diretriz de curadoria:** Manter dano, lentidão e fraqueza a veneno como propriedades do ingrediente. Não atribuir necromancia ou cerimônia funerária por associação nominal. **Fonte:** `docs/VANDAR_POLITICA_DOS_MORTOS_CICLO17.md`; `docs/ATLAS_MACROAMBIENTES_CICLO35.md`. Nenhuma mudança no catálogo jogável.

### Ciclo 66 — Flor Venenosa (`ing-poison-bloom`)

**Ficha preservada:** Dano à Saúde III; Medo II; Diminuir Velocidade I; raridade **incomum**; **24 parceiros**. Exemplo de mistura de dois efeitos compartilhados: Sino da Morte (dano_saude, diminuir_velocidade). **Achado:** A descrição menciona terreno hostil sem designar região, e o atlas não fornece área de ocorrência; nome, seiva e propriedades tóxicas não demonstram exclusividade na Caatinga, Eldroth ou Mar de Sangue. **Diretriz de curadoria:** Preservar Dano à Saúde III, Medo II e Diminuir Velocidade I. Registrar que a origem e os consumidores naturais permanecem desconhecidos. **Fonte:** `docs/ATLAS_MACROAMBIENTES_CICLO35.md`; `data/taxonomia_carcaca.json`. Nenhuma mudança no catálogo jogável.


## Lote autônomo de curadoria — Ciclos 67–76 (03/11/2026)

**Escopo:** dez ingredientes revisados em ordem crescente de conectividade com desempate por ordem no JSON. Base autoral cruzada: [Monstros da Carcaça `182622fe6d0e`](https://github.com/pedromaintenance/monstros-carcaca/tree/182622fe6d0edca18b32c3972641ebd9c72d58cb). Preservados IDs, raridades, efeitos, intensidades e nomes. **Achados de dados**: Betta do Rio não possui `descricao` nem `origem`; descrição da Beladona alude à recuperação mágica sem atributo correspondente. Essas diferenças são propostas documentais pendentes, **não** alterações no JSON ativo. O workflow de sincronização de ingredientes possui gatilho em alterações da curadoria e pode editar arquivos de dados consumidos pelos runtimes; por isso, os reparos de dados ficam isolados da presente rodada. Referências detalhadas na [matriz ecológica](../data/auditoria_ecologica_ingredientes.json).

### Ciclo 67 — Vagem da Charneca (`ing-grass-pod`)

**Ficha vigente preservada:** Resistência a Veneno II; Aumentar Alteração II; Restaurar Magia I; raridade **comum**; **24 parceiros**. Sem parceiro que compartilhe dois efeitos simultaneamente. **Análise ecológica:** A descrição de Peren menciona solo úmido, mas o atlas macrorregional não estabelece um lugar denominado Charneca nem prova ocorrência desse vegetal em região específica. **Tratativa:** Preservar Resistência a Veneno II, Aumentar Alteração II e Restaurar Magia I. Não presumir que a palavra charneca seja uma unidade geográfica já cartografada. Fontes: `docs/ATLAS_MACROAMBIENTES_CICLO35.md`; `data/atlas/macroambientes-ciclo35.json`. 

### Ciclo 68 — Ramo de Cardo (`ing-thistle-branch`)

**Ficha vigente preservada:** Resistência a Veneno II; Aumentar Defesa I; Diminuir Destreza I; raridade **comum**; **24 parceiros**. Parceiro com vários efeitos compartilhados: **Favo de Mel** (`aumentar_defesa`, `diminuir_destreza`). **Análise ecológica:** Existe no dossiê de Eldroth uma criatura vegetal proposta chamada 'Cardos que Bebem Cinza', mas o documento registra explicitamente esse fenômeno como não canonizado. Isso não a torna fonte do Ramo de Cardo. **Tratativa:** Manter três atributos e o nome genérico. Não associar à proposta de Eldroth nem interpretar a resistência a veneno como prova de uso terapêutico regional. Fontes: `docs/ECOLOGIA_MONSTRUOSA_ELDROTH_CICLO12.md`; `data/taxonomia_carcaca.json`. 

### Ciclo 69 — Orelha-de-Elfo (`ing-elves-ear`)

**Ficha vigente preservada:** Restaurar Magia II; Resistência ao Fogo I; Fraqueza ao Gelo I; raridade **comum**; **24 parceiros**. Parceiro com vários efeitos compartilhados: **Chapéu Branco** (`restaurar_magia`, `fraqueza_gelo`). **Análise ecológica:** A ficha do item o define como fungo de tronco; o termo 'elfo' descreve seu formato e não autoriza inferir que se trate de parte do corpo de um elfo ou que exista um rito dos povos élficos para obtê-lo. **Tratativa:** Preservar os efeitos. Classificar a origem material em termos fúngicos, não como drop de pessoa ou criatura inteligente; região específica não demonstrada. Fontes: `data/taxonomia_carcaca.json`; `docs/ATLAS_MACROAMBIENTES_CICLO35.md`. 

### Ciclo 70 — Chifres de Cervo (`ing-small-antlers`)

**Ficha vigente preservada:** Aumentar Restauração II; Fraqueza a Veneno I; Aumentar Destreza I; raridade **comum**; **25 parceiros**. Parceiro com vários efeitos compartilhados: **Ovo de Tordo** (`fraqueza_veneno`, `aumentar_destreza`). **Análise ecológica:** O 'Cervo dos Galhos Invertidos' aparece apenas como fera sobrenatural proposta na ecologia de Eldroth; não há prova de que ele produza estes chifres ou que o item provenha daquela floresta. **Tratativa:** Preservar o nome, origem genérica e os três efeitos. Evitar identificar o animal com a proposta não homologada ou atribuir coleta a uma região. Fontes: `docs/ECOLOGIA_MONSTRUOSA_ELDROTH_CICLO12.md`; `data/taxonomia_carcaca.json`. 

### Ciclo 71 — Garra de Bruxa (`ing-hagraven-claw`)

**Ficha vigente preservada:** Aumentar Encantamento III; Resistência à Magia II; Dano à Magia I; Diminuir Magia II; raridade **raro**; **25 parceiros**. Sem parceiro que compartilhe dois efeitos simultaneamente. **Análise ecológica:** A curadoria de Peren afirma uma feiticeira monstruosa, mas o atlas de Monstros da Carcaça não determina espécie, linhagem, facção ou habitat para esse ser. Mulheres que praticam magia, povos e tradição de bruxaria não são automaticamente essa categoria monstruosa. **Tratativa:** Preservar o quarto atributo Diminuir Magia II, expressamente aprovado no Ciclo 12, além dos outros três. Não confundir a garra com um material humano genérico nem importar a biologia de Skyrim. Fontes: `data/taxonomia_carcaca.json`; `docs/LORE_HACK_CARCACA_DW.md`. 

### Ciclo 72 — Sais da Geada (`ing-frost-salts`)

**Ficha vigente preservada:** Resistência ao Gelo III; Restaurar Magia II; Fraqueza ao Fogo II; raridade **raro**; **25 parceiros**. Parceiro com vários efeitos compartilhados: **Açúcar Lunar** (`restaurar_magia`, `fraqueza_fogo`). **Análise ecológica:** Há picos com neve persistente em Thargrid, mas a existência de gelo não comprova jazidas de Sais da Geada, seus produtores, comércio ou localização. A descrição 'usados em ... conjuração' é uma finalidade narrativa, não o atributo Aumentar Conjuração. **Tratativa:** Manter Resistência ao Gelo III, Restaurar Magia II e Fraqueza ao Fogo II. Não fixar origem em Thargrid só pela associação térmica. Fontes: `docs/ATLAS_MACROAMBIENTES_CICLO35.md`; `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`. 

### Ciclo 73 — Betta do Rio (`ing-river-betty`)

**Ficha vigente preservada:** Aumentar Força II; Aumentar Destreza III; Diminuir Sabedoria I; raridade **incomum**; **26 parceiros**. Parceiro com vários efeitos compartilhados: **Amanita Rubra** (`aumentar_forca`, `diminuir_sabedoria`). **Análise ecológica:** A ficha `ing-river-betty` é a única entre 111 sem as chaves `descricao` e `origem`. O nome 'Betta do Rio' não demonstra ocorrência específica no Rio Ancestral, e não existe habitat de espécie documentado no atlas consultado. **Tratativa:** Abrir pendência para completar a descrição com texto estritamente baseado no nome e nos efeitos, e investigar a origem editorial; NÃO editar a curadoria ativa nesta etapa porque o workflow sincroniza `data/itens.json` e builds Phaser automaticamente. Fontes: `docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`; `docs/CONSULTA_CURADORIA.md`. **Redação candidata não canônica:** “Peixe de rio empregado em preparados que aumentam Força e Destreza, mas também podem diminuir a Sabedoria.”

### Ciclo 74 — Beladona (`ing-nightshade`)

**Ficha vigente preservada:** Dano à Saúde III; Aumentar Magia III; Aumentar Ilusão II; raridade **incomum**; **26 parceiros**. Parceiro com vários efeitos compartilhados: **Ectoplasma** (`dano_saude`, `aumentar_magia`). **Análise ecológica:** A descrição diz que a Beladona interfere na 'recuperação mágica', mas seus atributos são Dano à Saúde III, Aumentar Magia III e Aumentar Ilusão II: não há atributo de redução/alteração de regeneração mágica. O efeito tóxico e as escolas mágicas são canônicos; habitat ainda não foi localizado. **Tratativa:** Propor revisão DESCRITIVA que corresponda aos três atributos, sem adicionar um quarto efeito por causa da redação; não editar o JSON ativo enquanto a sincronização automática estiver vinculada a essa alteração. Fontes: `docs/ATLAS_MACROAMBIENTES_CICLO35.md`; `data/taxonomia_carcaca.json`. **Redação candidata não canônica:** “Planta tóxica de sombra, usada em preparados que causam dano à saúde, mas também ampliam reservas mágicas e fortalecem feitiços de Ilusão.”

### Ciclo 75 — Olho de Felino (`ing-eye-of-sabre-cat`)

**Ficha vigente preservada:** Aumentar Destreza II; Aumentar Percepção II; Restaurar Saúde I; Visão à Distância II; raridade **incomum**; **26 parceiros**. Parceiro com vários efeitos compartilhados: **Ovo de Falcão** (`aumentar_destreza`, `aumentar_percepcao`). **Análise ecológica:** O atributo Visão à Distância II foi aprovado anteriormente pelo criador; o documento da Carcaça não oferece espécie, população regional ou modo de obtenção dessa parte. A semântica de visão distante é distinta de Percepção. **Tratativa:** Conservar explicitamente os quatro atributos, inclusive Visão à Distância II, sem reduzi-lo a Aumentar Percepção. Não criar espécies de grandes felinos para acomodar o item. Fontes: `data/taxonomia_carcaca.json`; `docs/ATLAS_MACROAMBIENTES_CICLO35.md`. 

### Ciclo 76 — Garras de Urso (`ing-bear-claws`)

**Ficha vigente preservada:** Aumentar Constituição II; Aumentar Força II; Aumentar Saúde I; raridade **comum**; **26 parceiros**. Parceiro com vários efeitos compartilhados: **Carapaça de Caranguejo** (`aumentar_constituicao`, `aumentar_forca`). **Análise ecológica:** A curadoria nomeia urso, mas a presença do animal em algum setor específico da Carcaça não foi confirmada nas fontes consultadas. Os efeitos de força, constituição e saúde não demonstram linhagem sobrenatural. **Tratativa:** Preservar os três atributos e a raridade comum. Não atribuir fauna local a Eldroth, Thargrid ou Caatinga por analogia com biomas terrestres. Fontes: `data/taxonomia_carcaca.json`; `docs/ATLAS_MACROAMBIENTES_CICLO35.md`. 


## Lote autônomo — Ciclos 77–86 (03/11/2026)

**Escopo:** dez fichas na ordem de conectividade, com todas as propriedades, descrições, raridades e IDs preservados. Verificação ecológica contra [Monstros da Carcaça](https://github.com/pedromaintenance/monstros-carcaca/tree/182622fe6d0edca18b32c3972641ebd9c72d58cb), com separação de fatos autorais, hipóteses biológicas e ocorrências regionais não documentadas. A [matriz JSON](../data/auditoria_ecologica_ingredientes.json) guarda as evidências por item. **Nenhum dado jogável ou runtime foi alterado.**

### Ciclo 77 — Coração de Espinheiros (`ing-briar-heart`)

**Preservado:** aumentar_magia III; restaurar_magia II; paralisia I; vampirismo II; raridade **raro**, **26 parceiros**. Exemplo de par com múltiplos efeitos: **Ectoplasma** (`aumentar_magia`, `restaurar_magia`). **Análise:** Vampirismo II e transformação progressiva já aprovados no Ciclo 9; planta não se torna espécie vampírica por isso. **Diretriz editorial:** Preservar efeito transformativo, sem atribuir origem demoníaca ou habitat regional. **Fonte:** `monstros-carcaca/docs/ATLAS_MACROAMBIENTES_CICLO35.md`. **Nenhuma alteração em `data/curadoria_ingredientes.json`.**

### Ciclo 78 — Ovo de Tordo (`ing-pine-thrush-egg`)

**Preservado:** aumentar_destreza II; resistencia_eletricidade I; fraqueza_veneno I; raridade **comum**, **26 parceiros**. Exemplo de par com múltiplos efeitos: **Chifres de Cervo** (`aumentar_destreza`, `fraqueza_veneno`). **Análise:** Um dos dois itens Ovo de Tordo; esta ficha possui Aumentar Destreza II e Resistência à Eletricidade I, não é a versão curativa. **Diretriz editorial:** Rótulo não canônico: Ovo de Tordo — agilidade. Não renomear espécie nem ID. **Fonte:** `monstros-carcaca/data/taxonomia_carcaca.json`. **Nenhuma alteração em `data/curadoria_ingredientes.json`.**

### Ciclo 79 — Pérola Pequena (`ing-small-pearl`)

**Preservado:** aumentar_destreza I; resistencia_gelo II; aumentar_restauracao I; raridade **comum**, **26 parceiros**. Exemplo de par com múltiplos efeitos: **Chifres de Cervo** (`aumentar_destreza`, `aumentar_restauracao`). **Análise:** Não há molusco produtor ou localidade documentados; nem as águas do Mar de Sangue nem as águas azuis demonstram sua origem. **Diretriz editorial:** Não inventar bancos de pérolas ou exclusividade comercial. **Fonte:** `monstros-carcaca/docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`. **Nenhuma alteração em `data/curadoria_ingredientes.json`.**

### Ciclo 80 — Musgo Parassol (`ing-emperor-parasol-moss`)

**Preservado:** regenerar_saude II; aumentar_inteligencia I; dano_saude I; raridade **comum**, **27 parceiros**. Sem pares com múltiplos efeitos nesta ficha. **Análise:** Substrato documentado na ficha de Peren; não associar à proposta do Micélio das Vozes Partidas ou supor ocorrência em Eldroth. **Diretriz editorial:** Preservar Regenerar Saúde e Dano à Saúde simultâneos. **Fonte:** `monstros-carcaca/docs/ECOLOGIA_MONSTRUOSA_ELDROTH_CICLO12.md`. **Nenhuma alteração em `data/curadoria_ingredientes.json`.**

### Ciclo 81 — Ovo de Falcão (`ing-hawk-s-egg`)

**Preservado:** aumentar_percepcao II; aumentar_destreza II; resistencia_magia I; raridade **incomum**, **27 parceiros**. Exemplo de par com múltiplos efeitos: **Olho de Felino** (`aumentar_percepcao`, `aumentar_destreza`). **Análise:** Ausência de ninhos e reprodução regional documentados; o 'vigor' do texto não define atributo adicional. **Diretriz editorial:** Conservar percepção, destreza e resistência mágica; não fabricar fauna local. **Fonte:** `monstros-carcaca/docs/ATLAS_MACROAMBIENTES_CICLO35.md`. **Nenhuma alteração em `data/curadoria_ingredientes.json`.**

### Ciclo 82 — Raiz Canina (`ing-canis-root`)

**Preservado:** paralisia II; aumentar_destreza II; diminuir_forca I; raridade **incomum**, **27 parceiros**. Sem pares com múltiplos efeitos nesta ficha. **Análise:** A palavra Canina não demonstra origem animal nem associação com cães; distribuição vegetal não comprovada. **Diretriz editorial:** Manter a origem vegetal e os três efeitos. **Fonte:** `monstros-carcaca/data/taxonomia_carcaca.json`. **Nenhuma alteração em `data/curadoria_ingredientes.json`.**

### Ciclo 83 — Libélula Azul (`ing-blue-dartwing`)

**Preservado:** aumentar_destreza II; resistencia_eletricidade II; medo I; velocidade II; raridade **comum**, **27 parceiros**. Exemplo de par com múltiplos efeitos: **Bico de Falcão** (`aumentar_destreza`, `resistencia_eletricidade`). **Análise:** Velocidade II já aprovada no Ciclo 7, independente de Aumentar Destreza; o atlas não localiza a espécie. **Diretriz editorial:** Preservar quatro atributos, sem presumir coleta no Rio Ancestral ou Portomonte. **Fonte:** `monstros-carcaca/docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`. **Nenhuma alteração em `data/curadoria_ingredientes.json`.**

### Ciclo 84 — Bico de Falcão (`ing-hawk-beak`)

**Preservado:** aumentar_destreza II; resistencia_gelo II; resistencia_eletricidade I; raridade **incomum**, **27 parceiros**. Exemplo de par com múltiplos efeitos: **Libélula Azul** (`aumentar_destreza`, `resistencia_eletricidade`). **Análise:** Nome comum com outras partes de falcão não comprova mesma espécie ou população; procedência não documentada. **Diretriz editorial:** Manter três atributos, sem cadeia de coleta inventada. **Fonte:** `monstros-carcaca/data/taxonomia_carcaca.json`. **Nenhuma alteração em `data/curadoria_ingredientes.json`.**

### Ciclo 85 — Ovas de Salmão (`ing-salmon-roe`)

**Preservado:** respirar_na_agua II; regenerar_magia II; aumentar_constituicao I; raridade **incomum**, **27 parceiros**. Exemplo de par com múltiplos efeitos: **Carpa de Pedra** (`respirar_na_agua`, `aumentar_constituicao`). **Análise:** O atlas não documenta desova, migração ou habitat de salmões; não importar ecologia terrestre como fato da Carcaça. **Diretriz editorial:** Preservar efeitos e evitar atribuir origem ao Rio Ancestral ou Mar de Sangue. **Fonte:** `monstros-carcaca/docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`. **Nenhuma alteração em `data/curadoria_ingredientes.json`.**

### Ciclo 86 — Flor Violeta (`ing-purple-mountain-flower`)

**Preservado:** aumentar_destreza II; aumentar_furtividade I; resistencia_gelo I; raridade **comum**, **27 parceiros**. Exemplo de par com múltiplos efeitos: **Mirra da Geada** (`aumentar_furtividade`, `resistencia_gelo`). **Análise:** A descrição de Peren documenta encostas e bruma; Thargrid nevado não confirma ocorrência desta espécie. **Diretriz editorial:** Manter atributos e não declarar exclusividade em Thargrid. **Fonte:** `monstros-carcaca/docs/ATLAS_MACROAMBIENTES_CICLO35.md`. **Nenhuma alteração em `data/curadoria_ingredientes.json`.**



## Lote autônomo de curadoria — Ciclos 87–96 (03/11/2026)

**Metodologia:** revisão de dez fichas por ordem crescente de conectividade, com desempate pela posição no catálogo. As fontes da [Carcaça](https://github.com/pedromaintenance/monstros-carcaca/tree/338dfc5ff4304e6ec2519e06b08cbb1de0947bd6) foram empregadas para determinar o que está documentado, não para presumir fauna, bioma, povo, obtenção ou comércio. A análise **preserva integralmente nome, raridade, descrição, IDs, efeitos e intensidades**. A [matriz ecológica](../data/auditoria_ecologica_ingredientes.json) inclui provas, limites e pendências para todos os itens. A camada jogável não foi editada.

### Ciclo 87 — Ovo de Tordo (`ing-rock-warbler-egg`)

**Manter integralmente:** Restaurar Saúde II; Aumentar Destreza I; Fraqueza à Magia I; raridade **comum**; **28 ingredientes parceiros**. Exemplo de par com dois efeitos compartilhados: **Olho de Felino** (`restaurar_saude`, `aumentar_destreza`). **Cruzamento com Carcaça:** É o segundo Ovo de Tordo, com Restaurar Saúde II, Aumentar Destreza I e Fraqueza à Magia I; o primeiro (`ing-pine-thrush-egg`) aumenta Destreza II e resiste à eletricidade. Nenhuma fonte autoral consultada identifica ambas as aves como espécies diferentes. **Tratativa:** Concluir análise do par. Propor rótulo funcional 'Ovo de Tordo — restauração', sem renomear espécies, mudar IDs ou sincronizar receitas. **Fontes:** `monstros-carcaca/data/taxonomia_carcaca.json`; `monstros-carcaca/docs/ATLAS_MACROAMBIENTES_CICLO35.md`. Nenhum dado jogável modificado.

### Ciclo 88 — Carpa de Pedra (`ing-histcarp`)

**Manter integralmente:** Respirar na Água II; Aumentar Magia II; Aumentar Constituição I; raridade **incomum**; **28 ingredientes parceiros**. Exemplo de par com dois efeitos compartilhados: **Algodão da Tundra** (`aumentar_magia`, `aumentar_constituicao`). **Cruzamento com Carcaça:** O nome Carpa de Pedra descreve o material em Peren, mas não comprova corpo pétreo, procedência das ossadas de Golzdov, distribuição pelo Rio Ancestral ou ocorrência no Mar de Sangue. **Tratativa:** Preservar Respiração na Água II, Aumentar Magia II e Constituição I; não criar origem mineral nem migração para compatibilizar propriedades. **Fontes:** `monstros-carcaca/docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`; `monstros-carcaca/data/taxonomia_carcaca.json`. Nenhum dado jogável modificado.

### Ciclo 89 — Presa de Javali (`ing-boar-tusk`)

**Manter integralmente:** Aumentar Força II; Aumentar Constituição II; Frenesi I; raridade **comum**; **28 ingredientes parceiros**. Exemplo de par com dois efeitos compartilhados: **Carapaça de Caranguejo** (`aumentar_forca`, `aumentar_constituicao`). **Cruzamento com Carcaça:** O item é parte de fauna descrita em Peren. O atlas não autoriza atribuir javalis à Caatinga, Ironwood ou Eldroth, nem identificar o javali com criaturas sobrenaturais propostas. **Tratativa:** Conservar Força II, Constituição II e Frenesi I; evitar inventar caça regional ou fazenda de javalis. **Fontes:** `monstros-carcaca/docs/ATLAS_BASE_REGIOES_ASSENTAMENTOS_CULTURAS_MONSTROS_V0_1.md`; `monstros-carcaca/data/taxonomia_carcaca.json`. Nenhum dado jogável modificado.

### Ciclo 90 — Orelha de Troglodita (`ing-falmer-ear`)

**Manter integralmente:** Resistência a Veneno II; Aumentar Percepção II; Dano à Saúde I; raridade **incomum**; **29 ingredientes parceiros**. Exemplo de par com dois efeitos compartilhados: **Ovas de Piranha** (`resistencia_veneno`, `dano_saude`). **Cruzamento com Carcaça:** A curadoria de Peren informa tecido de criatura subterrânea, mas o nome Troglodita não prova tipo Carcaça, filiação cultural, inteligência, espécie ou ocorrência nas cavernas de Thargrid. Não está estabelecido se o material é parte de um povo sapiente. **Tratativa:** Manter os efeitos e a nomenclatura vigente; abrir revisão de taxonomia e proveniência antes de vincular a coleta a qualquer comunidade, violência ou fonte de loot. **Fontes:** `monstros-carcaca/data/taxonomia_carcaca.json`; `monstros-carcaca/docs/ATLAS_BASE_REGIOES_ASSENTAMENTOS_CULTURAS_MONSTROS_V0_1.md`. Nenhum dado jogável modificado.

### Ciclo 91 — Gelatina de Medusa (`ing-netch-jelly`)

**Manter integralmente:** Aumentar Capacidade de Carga II; Aumentar Constituição I; Paralisia II; raridade **incomum**; **29 ingredientes parceiros**. Nenhum par com dois efeitos compartilhados nesta ficha. **Cruzamento com Carcaça:** A descrição fala de criatura flutuante. O nome Medusa não demonstra que seja a górgona mitológica, uma água-viva, um povo ou espécie específica; o atlas não oferece correspondência com criatura identificada. **Tratativa:** Conservar Carga II, Constituição I e Paralisia II. Não atribuir origem exclusivamente marítima, habitat no Mar de Sangue ou petrificação por analogia. **Fontes:** `monstros-carcaca/data/taxonomia_carcaca.json`; `monstros-carcaca/docs/ATLAS_HIDROGRAFIA_CONTINENTAL_CICLO39.md`. Nenhum dado jogável modificado.

### Ciclo 92 — Carne Humana (`ing-human-flesh`)

**Manter integralmente:** Paralisia III; Aumentar Furtividade II; Dano à Saúde I; raridade **raro**; **30 ingredientes parceiros**. Exemplo de par com dois efeitos compartilhados: **Fungo de Diabrete** (`paralisia`, `dano_saude`). **Cruzamento com Carcaça:** O catálogo contém o ingrediente Carne Humana e menciona negociação clandestina; isso não documenta origem em Drakport, assassinato, canibalismo, ritual ou disponibilidade legítima de corpos. O dossiê de Drakport confirma tráfico humano, mas veta tratar pessoas como mercadorias neutras. **Tratativa:** Preservar a ficha histórica e atributos sem fabricar fonte. Marcar para revisão de procedência e representação: não associar automaticamente vítimas da escravidão a estoque, drop, mercado ou produção; mudanças de natureza do conteúdo exigem decisão do criador. **Fontes:** `monstros-carcaca/docs/RIO_DRAKPORT_CICLO28.md`; `monstros-carcaca/data/taxonomia_carcaca.json`. Nenhum dado jogável modificado.

### Ciclo 93 — Ovo de Verme Gigante (`ing-chaurus-eggs`)

**Manter integralmente:** Invisibilidade II; Aumentar Constituição II; Fraqueza a Veneno I; raridade **raro**; **30 ingredientes parceiros**. Nenhum par com dois efeitos compartilhados nesta ficha. **Cruzamento com Carcaça:** A curadoria descreve vermes subterrâneos. A Antena de Verme Gigante é outro ingrediente, mas a coincidência nominal não comprova a mesma espécie, fase biológica, ninho ou região subterrânea; cavernas documentadas tampouco provam a ocorrência. **Tratativa:** Preservar Invisibilidade II, Constituição II e Fraqueza a Veneno I; não inferir cadeia de coleta automática ou pertencimento a criatura importada de outro RPG. **Fontes:** `monstros-carcaca/docs/ATLAS_MACROAMBIENTES_CICLO35.md`; `monstros-carcaca/data/taxonomia_carcaca.json`. Nenhum dado jogável modificado.

### Ciclo 94 — Bagas de Zimbro (`ing-juniper-berries`)

**Manter integralmente:** Regenerar Saúde II; Aumentar Destreza I; Fraqueza ao Fogo I; raridade **comum**; **30 ingredientes parceiros**. Nenhum par com dois efeitos compartilhados nesta ficha. **Cruzamento com Carcaça:** O nome de espécie e aroma constam de Peren, mas os setores agrícolas da Carcaça não comprovam produção, comércio ou coleta de zimbro em nenhum povoado ou região. **Tratativa:** Manter Regenerar Saúde II, Destreza I e Fraqueza ao Fogo I. Não adicionar cultivo comercial, sazonalidade ou ecossistema exclusivo sem fonte. **Fontes:** `monstros-carcaca/docs/ATLAS_BASE_REGIOES_ASSENTAMENTOS_CULTURAS_MONSTROS_V0_1.md`; `monstros-carcaca/docs/POVOAMENTO_ECOLOGIA_ALEM_SUL_CICLO54.md`. Nenhum dado jogável modificado.

### Ciclo 95 — Uvas de Jasmim (`ing-jazbay-grapes`)

**Manter integralmente:** Regenerar Magia II; Aumentar Magia II; Dano à Saúde I; raridade **incomum**; **30 ingredientes parceiros**. Exemplo de par com dois efeitos compartilhados: **Ectoplasma** (`aumentar_magia`, `dano_saude`). **Cruzamento com Carcaça:** A Carcaça possui agricultores e sociedades comerciais, mas não há comprovação de vinhedos, produção de Uvas de Jasmim, rota de abastecimento ou método ritual de processamento. **Tratativa:** Preservar Regenerar Magia II, Aumentar Magia II e Dano à Saúde I; não presumir monocultura nem inventar origem colonial ou nobre. **Fontes:** `monstros-carcaca/docs/ATLAS_BASE_REGIOES_ASSENTAMENTOS_CULTURAS_MONSTROS_V0_1.md`; `monstros-carcaca/docs/POVOAMENTO_ECOLOGIA_ALEM_SUL_CICLO54.md`. Nenhum dado jogável modificado.

### Ciclo 96 — Tórax de Vaga-lume (`ing-torchbug-thorax`)

**Manter integralmente:** Aumentar Destreza II; Dano à Magia I; Fraqueza à Magia I; raridade **comum**; **30 ingredientes parceiros**. Exemplo de par com dois efeitos compartilhados: **Ovo de Tordo** (`aumentar_destreza`, `fraqueza_magia`). **Cruzamento com Carcaça:** O catálogo registra um inseto luminoso, mas não comprova a espécie ou presença nos biomas da Carcaça. Os Besouros da Casca Riscada de Eldroth são apenas proposta e não devem ser equiparados ao vaga-lume. **Tratativa:** Preservar Destreza II, Dano à Magia I e Fraqueza à Magia I. Não criar vínculo com inseto inteligente, rito, povo ou localidade. **Fontes:** `monstros-carcaca/docs/ECOLOGIA_MONSTRUOSA_ELDROTH_CICLO12.md`; `monstros-carcaca/data/taxonomia_carcaca.json`. Nenhum dado jogável modificado.

**Conclusão do lote:** os dois Ovos de Tordo já foram auditados nos Ciclos 78 e 87; seus rótulos funcionais não canônicos são “Ovo de Tordo — agilidade” e “Ovo de Tordo — restauração”. Há novas pendências de procedência para Carne Humana e Orelha de Troglodita e de identidade zoológica para Gelatina de Medusa; nenhuma foi resolvida por suposição. **Próximo ingrediente:** Carapaça de Caranguejo (`ing-mudcrab-chitin`), Ciclo 97. **Escopo limitado a documentação/curadoria**; menus, receitas, loot, mecânicas e saves pertencem ao outro fluxo.
