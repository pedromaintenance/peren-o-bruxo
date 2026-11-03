# UX — Descoberta de Combos e Caderno Alquímico (proposta v1.0)

> **Peren, o Bruxo · 03/11/2026 · DESIGN, não código de gameplay.**
> **Autoridades:** [Constituição v1.0 — Emenda A2](constituicao-design-v1.md), [roadmap de mecânicas e menus](roadmap-crafting-mecanicas-menus.md), [catálogo de combos por efeitos](../data/catalogo-combos-alquimicos.json).
> **Protótipo ilustrativo:** [PR #95 — UX de combos e Caderno](https://github.com/pedromaintenance/peren-o-bruxo/pull/95) · [arquivo HTML standalone em branch isolada](https://github.com/pedromaintenance/peren-o-bruxo/blob/design/ux-combos-caderno-v1-20261103/prototipos/ux-combos-caderno-v1.html). Para executar fora do jogo, abrir o HTML baixado em um navegador; não exige servidor, rede, save ou dependências. **Não** substituir o Phaser nem publicar a interface como jogabilidade real.
> **Classificação:** canônico = regra explícita do criador; **PROPOSTA** = UX, estrutura de evento, persistência e apresentação ainda sujeitos a teste.

## 1. Momento da descoberta — sem criar outro sistema de crafting

**[CANÔNICO]** O jogador fabrica normalmente; cada efeito ativo exige fontes de dois **tipos diferentes** de ingredientes. Ordem de seleção não muda a composição. A resolução segue: **efeitos reais → incompatibilidades aprovadas (Impuro) → sinergias aprovadas (nome especial) → comum (nome do efeito mais intenso)**. Efeitos secundários não somem. Uma combinação de dois efeitos benéficos não é automaticamente sinergia.

**[PROPOSTA]** A tela de descoberta é uma consequência da **transação bem-sucedida**, nunca uma receita, uma escolha de família que filtre efeitos ou um bônus novo. Fluxo:

1. A mistura é concluída e debitada pelo motor. O motor fornece `effectIds` realmente ativados, `ingredientIds` e identificador único da transação; os dados canônicos não mudam.
2. Classificar somente usando a lista **aprovada** de sinergias/incompatibilidades. O array `candidatos_sinergia` é **editorial e proibido** para nomear produtos jogáveis.
3. O conhecimento do personagem é atualizado **pela regra atual de fabricação/estudo**; no protótipo Phaser, mistura bem-sucedida descobre os efeitos compartilhados nos ingredientes usados.
4. Verificar se **Peren reconhece** os efeitos de assinatura da sinergia. A classificação interna nunca precisa revelar ao jogador propriedades não descobertas.
5. Se `comboId` está aprovado, a mistura não é Impura e o personagem reconhece a assinatura **pela primeira vez**, gravar a descoberta no save Phaser **na mesma transação**, com chave `comboId`. Apresentar a celebração **uma vez**; nunca premiar XP, moedas ou outro bônus só por mostrar uma tela sem regra aprovada.
6. Se a sinergia já foi descoberta, mostrar resultado comum com nome especial e botão `Ver no Caderno`. Se a mistura contiver incompatibilidade aprovada, a classificação principal é **Impuro** e o alerta deve preceder qualquer nome sinérgico. Se o combo ainda não foi reconhecido pelo personagem, usar apresentação limitada ao conhecimento real, sem spoiler.
7. Fechar o resultado sempre leva de volta à bancada sem repetir a fabricação. `Abrir no Caderno` navega para a ficha, sem fabricar novamente.

**Casos reais e canônicos:** `aumentar_carisma` + `aumentar_ilusao` → **Poção da Fada**; `aumentar_carisma` + `diminuir_forca` → **Impuro**; `aumentar_forca` + `resistencia_eletricidade` → mistura compatível **sem nome especial**. Todos esses identificadores existem na curadoria. As demais 8 assinaturas são candidatas **não aprovadas**.

## 2. Tela de resultado: hierarquia visual e microtexto

### 2.1 Primeiro combo conhecido [PROPOSTA]

```text
┌──────────────────────────────────────────────┐
│  BANCADA DE ALQUIMIA       RESULTADO         │
│                                              │
│       ✦ NOVA SINERGIA DESCOBERTA ✦          │
│                                              │
│               POÇÃO DA FADA                  │
│      Aumentar Carisma + Aumentar Ilusão      │
│                                              │
│  [Frasco da família + FX reservado pelo ID]  │
│                                              │
│  Os efeitos se reforçam numa arte comum.     │
│  Outros efeitos do preparo: [conhecidos]     │
│                                              │
│  Registrada no Caderno do Bruxo.             │
│                                              │
│       [CONTINUAR]   [VER NO CADERNO]         │
└──────────────────────────────────────────────┘
```

A descrição acima é **copy de UX provisória**, não um efeito novo, multiplicador ou nova regra de duração. A ilustração usa **frasco padrão de Poções** até existir arte aprovada. O `comboId` permite no futuro aplicar camada animada sem multiplicar assets por receita.

### 2.2 Estados alternativos

| Estado | Cabeçalho / alerta | Comportamento |
| --- | --- | --- |
| Novo combo, efeitos identificados | `Nova sinergia descoberta` e nome especial | Registra primeiro encontro e revela a ficha; sem bônus oculto |
| Combo conhecido, fabricado novamente | `Poção da Fada` | Sem comemoração repetida, atualiza histórico de lotes |
| Mistura compatível sem combo aprovado | Nome do maior efeito conhecido | Outros efeitos conhecidos na descrição; sem Impuro e sem animação especial |
| Efeitos incompatíveis | `Impuro`, foco nos riscos identificados | Incompatibilidade sobrepõe sinergia; todos efeitos permanecem |
| Combo interno não reconhecido pelo personagem | Nome genérico conforme conhecimento | Sem spoiler, sem registro prematuro no índice visível |
| Candidato editorial | Comportamento da mistura comum | Nome candidato/FX não aparecem no jogo |
| Mistura fracassada | Resultado de falha já existente | Não cria preparação nem desbloqueia combo |

**[ABERTO]** Convenção exata de título quando o maior efeito ainda não está identificado; fórmula de potência; empates; múltiplos combos aprovados simultâneos; possibilidade de mostrar um sinal de Impuro sem revelar efeitos. Não resolver essas questões usando a ordem do JSON.

## 3. Caderno do Bruxo — nova seção de conhecimento

**[PROPOSTA]** `Caderno do Bruxo → Alquimia → Combos Descobertos → [comboId]`.

A navegação tem dois modos que compartilham as mesmas fichas: **índice de combos já reconhecidos** no Caderno e **atalho Combos conhecidos** dentro da bancada (família Poções, Venenos ou Tônicos conforme catálogo). Os oito candidatos não aprovados **não entram** nesses menus, tampouco em silhuetas com nomes disfarçados.

**Estado vazio:** “Peren ainda não reconheceu nenhuma sinergia. Experimente ingredientes ou estude suas propriedades.” Atalho **Voltar à Bancada**. Não listar quantidades totais de combos por descobrir, que denunciariam segredo editorial.

**Cartão de combo reconhecido:** nome e ícone da família; assinatura de **efeitos conhecidos**, descrição curada, primeira descoberta, número de lotes produzidos, status de posse **atual** e botão `Ver fontes conhecidas`. Quando existir arte, a animação é acessível sem depender de renderizar todos os efeitos no mapa.

**Detalhe:** explica o propósito conjunto, sem novas propriedades. Organiza fontes de cada efeito conhecidas por Peren. Se um conjunto possuído ainda não garante duas fontes por efeito, o botão `Preparar` fica desabilitado com explicação. A lista de pares/trios testados é **histórico**, não fórmula exclusiva. Não exibir ingredientes desconhecidos nem cruzar diretamente com todos os dados brutos do catálogo.

**Múltiplos efeitos:** a ficha mostra a **assinatura do combo** e uma subseção “Outros efeitos neste lote”, sem dizer que os extras fazem parte da assinatura. Uma versão do lote pode apresentar Impuro por efeito adicional incompatível; a ficha abstrata do combo não o oculta.

## 4. Contrato de dados proposto — separado da curadoria

O catálogo editorial `data/catalogo-combos-alquimicos.json` identifica conceitos, nomes e futuros assets **aprovados**; não precisa representar a experiência de cada personagem.

Um save **somente Phaser**, **futuro**, pode carregar uma estrutura versionada:
```json
{
  "alchemy": {
    "knownCombos": {
      "combo-pocao-da-fada": {
        "firstDiscoveryEvent": "tx-123",
        "firstDiscoveryDay": 15,
        "timesProduced": 1
      }
    },
    "comboLog": [
      {
        "transactionId": "tx-123",
        "comboId": "combo-pocao-da-fada",
        "preparationId": "preparo-123",
        "ingredientIds": ["ing-daedra-heart", "ing-dragon-s-tongue", "ing-scaly-pholiota"]
      }
    ]
  }
}
```
**Exemplo de contrato, não save real**: números/datas fictícios; os ingredientes representam um conjunto materialmente possível de três tipos. Repetir a transação **não** aumenta `timesProduced` e não mostra a descoberta novamente. `knownCombos` deve ser computado/transacionado de forma consistente, sem criar uma chave no save clássico ou alterar dados de navegação fora do Phaser. Limites do histórico e migração futura de schema permanecem abertos.

**Regras de estabilidade:** o ID do combo é a identidade de descoberta; a assinatura usa IDs dos **efeitos**, não os nomes visíveis nem a lista específica de ingredientes. IDs sobrevivem a traduções, variações de grafia, ordenação de materiais e futuras animações. O JSON de curadoria e as receitas legadas não mudam.

## 5. Reserva de animação e acessibilidade

**Contrato visual proposto:**
- `comboId` → `visual.chave_reservada` → recurso por **família visual** + camada visual opcional (partículas/quadros/iluminação).
- `animacao.estado=pendente|nao_produzido` significa **fallback imediato** ao frasco da família, sem asset quebrado.
- Uma única introdução **breve e dispensável** na descoberta; opção `Pular`/tecla de retorno; `prefers-reduced-motion` e controles de acessibilidade devem eliminar movimento obrigatório.
- Comunicar a descoberta **por texto e ícone**, não apenas por cores ou partículas. Nenhuma sobreposição animada bloqueia botões, leitura ou foco de teclado.
- Nenhum visual sugerido de candidato editorial aparece no jogo antes de promoção com decisão do criador.

**Tela pequena (360–390 px):** uma coluna, texto principal em até duas linhas, botões grandes de toque, resultado rolável, rodapé fixo apenas se não encobrir dados. **Xbox/gamepad:** foco inicial em Continuar; A confirma, B volta, setas/analógico navegam, sem prender foco em modal. Teclado: Tab/Shift+Tab, Enter/Espaço e Esc; leitor de tela anuncia o título sem repetir alertas; foco retorna ao botão que iniciou a fabricação.

## 6. QA de design e interface antes de integrar ao runtime

- **UX-C01:** primeira fabricação com assinatura canônica e reconhecida gera evento de descoberta **uma única vez**.
- **UX-C02:** repetir com outros ingredientes dá o **mesmo comboId**, sem reapresentar primeira descoberta nem exigir receita específica.
- **UX-C03:** candidatos `proposto_nao_aprovado` nunca aparecem como nomes especiais, botões secretos ou FX.
- **UX-C04:** a presença de incompatibilidade catalogada faz o preparado ser Impuro e prevalece sobre nome de combo, sem suprimir efeitos.
- **UX-C05:** efeitos extras, sem incompatibilidade, mantêm a identidade do combo aprovado.
- **UX-C06:** mesmo efeito presente em um único tipo de ingrediente não conta; 3+ fontes são avaliadas por efeito, não por total de componentes.
- **UX-C07:** UI e Caderno não mostram propriedades ou ingredientes ainda não conhecidos pelo personagem; nenhum spoiler em tooltip, atributo HTML ou leitores de tela.
- **UX-C08:** save Phaser guarda combo e lote de forma atômica; reload e repetição da mesma transação não duplicam histórico/descoberta.
- **UX-C09:** frasco-base aparece sem animação cadastrada; `prefers-reduced-motion` mantém todos os textos e ações acessíveis.
- **UX-C10:** fluxos mobile/teclado/gamepad/retorno à bancada funcionam sem perda de foco ou fabricação duplicada.

## 7. Handoff

**Agente de curadoria:** mantém **somente** o catálogo de sinergias/incompatibilidades, seus estados de aprovação, nomes e futuros briefings de arte. **Agente de mecânicas:** implementa reconhecimento posterior à fabricação, estado de descoberta no Phaser, menu, Caderno, acessibilidade e consumo apenas de registros aprovados. **Direção de arte:** mais tarde associa `comboId` a sprite/FX, sem recadastrar receitas e sem modificar efeitos.

**Backlog:** **CRAFT-D20** (resultado de descoberta), **CRAFT-D21** (Caderno), **CRAFT-D22** (identidade visual opcional e fallback), **CRAFT-D23** (persistência de conhecimento no save Phaser). **Gate:** UX-C01–C10 + QA em branch isolada; nenhuma promoção automática ao Pages.

**Estado em 03/11/2026:** especificação v1.0; não implementada no runtime, não publicada como jogo.
