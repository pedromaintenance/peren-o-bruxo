# Pacote de decisão editorial — ingredientes de Peren

**Emissão:** 03/11/2026. **Status:** propostas de texto, **não aplicadas**. **Escopo:** somente apresentação e metadados; nenhuma alteração em efeitos, IDs, raridades, intensidades, efeitos isolados, receitas, loot, inventário, motor, menus, saves ou economia.

## Bases verificadas

- Repositório: `pedromaintenance/peren-o-bruxo`, branch `main`.
- Catálogo ativo e regras de composição: `data/curadoria_ingredientes.json` (blob `57cf86f623ecabb4c30eb3a052384d627b615aa8`).
- Auditoria histórica: `docs/auditoria-alquimia-peren.md` (Ciclos 14–124).
- Matriz ecológica: `data/auditoria_ecologica_ingredientes.json` (**111/111**, 25 registros retroativos com `ciclo_historico` 14–38).
- Referência de ambientação: `pedromaintenance/monstros-carcaca` no commit `9514fef2a7f22be2bccfad58bd50b983878ad000`.
- As propostas exigem deliberação do criador e integração coordenada com o fluxo de mecânicas, porque `.github/workflows/sincronizar-curadoria-ingredientes.yml` pode propagar alterações no arquivo ativo.

## 1. Descrições: três correções candidatas

As substituições abaixo são propostas explícitas e **não** foram realizadas na curadoria ativa.

### 1. Betta do Rio — `ing-river-betty`

- **Campo:** `descricao`
- **Texto atual:** ausente (chave não existe)
- **Texto candidato:** “Peixe de rio empregado em preparados que aumentam Força e Destreza, mas também podem diminuir a Sabedoria.”
- **Fundamento:** Os três atributos existentes respaldam o texto; origem geográfica do peixe continua indeterminada.
- **Impacto esperado:** texto de apresentação e busca; **nenhum** atributo ou potência deve ser modificado.

### 2. Beladona — `ing-nightshade`

- **Campo:** `descricao`
- **Texto atual:** “Planta tóxica de sombra, conhecida pelo dano lento e por interferir na recuperação mágica.”
- **Texto candidato:** “Planta tóxica de sombra, usada em preparados que causam dano à saúde, mas também ampliam reservas mágicas e fortalecem feitiços de Ilusão.”
- **Fundamento:** Substitui alegação sobre recuperação mágica, ausente nos atributos.
- **Impacto esperado:** texto de apresentação e busca; **nenhum** atributo ou potência deve ser modificado.

### 3. Escamas de Piranha — `ing-slaughterfish-scales`

- **Campo:** `descricao`
- **Texto atual:** “Escamas grossas usadas em preparados protetores e antídotos para ambientes gelados.”
- **Texto candidato:** “Escamas espessas de peixe predador, utilizadas em preparados de proteção e resistência ao frio; o extrato concentrado também pode ferir a saúde.”
- **Fundamento:** Retira alegação de antídoto, não apoiada nos três atributos.
- **Impacto esperado:** texto de apresentação e busca; **nenhum** atributo ou potência deve ser modificado.

## 2. Campo `origem` do Betta — correção de interpretação da proveniência

**Constatação técnica posterior (03/11/2026):** `origem` **não é o habitat nem a zona de coleta**. No código de geração `ferramentas/build_data.py`, os ingredientes recebem inicialmente `origem: "adaptado_skyrim_alquimia"`, enquanto `zona` é uma dimensão separada. Quando a curadoria existe, ela é aplicada por `item.update(override)` e sobrescreve o campo de proveniência. Em **110 de 111** fichas da curadoria, `origem: "curadoria_original_carcaca"`; o Betta é a exceção cuja chave está ausente no **override**. Logo, pela lógica do gerador, o Betta conserva a etiqueta de origem da importação se o override não a especificar. Não confundir ausência em `data/curadoria_ingredientes.json` com garantia de ausência em `data/itens.json`.

**Encaminhamento proposto:** investigar se a ficha do Betta passou pelo mesmo ato de curadoria original que as demais. Se a proveniência documental for confirmada, avaliar acrescentar `origem: "curadoria_original_carcaca"` em mudança mínima coordenada. **Não inventar uma zona no Rio Ancestral**: habitat e prova de ocorrência são questão diferente, não resolvida por esse campo.

**Risco adicional do gerador:** `ferramentas/build_data.py` atribui `zona=CITIES[(i*7)%len(CITIES)][0]` aos ingredientes de base. Somente **uma** das 111 fichas do override curatorial possui `zona` ou `zona_exclusiva`: Pena de Gaivota em Portomonte. Isso não prova que os outros locais estejam errados nem que não existam decisões autorais em outras fontes, mas **o algoritmo de distribuição original não é evidência ecológica da Carcaça**. O painel `laboratorio-itens/app.js` apresenta o campo `zona` como “Origem de coleta”, o que pode transmitir certeza que o catálogo ecológico ainda não sustenta. Encaminhar esta interface e a distribuição regional ao fluxo de mecânicas e menus, sem corrigir regiões automaticamente neste chat.

## 3. Dois ovos, mesmo nome

| ID estável | Rótulo vigente | Rótulo de consulta proposto, não canônico | Perfil |
|---|---|---|---|
| `ing-rock-warbler-egg` | Ovo de Tordo | **Ovo de Tordo — restauração** | Restaurar Saúde II; Destreza I; Fraqueza à Magia I |
| `ing-pine-thrush-egg` | Ovo de Tordo | **Ovo de Tordo — agilidade** | Destreza II; Resistência à Eletricidade I; Fraqueza a Veneno I |

Não afirmar que são espécies zoológicas identificadas; os sufixos são apenas distinção funcional para usuários do catálogo. Não renomear no jogo nem atualizar receitas/saves sem decisão e análise de referências.

## 4. Dois rótulos para um mesmo efeito

| ID do efeito | Variante encontrada | Padronização candidata |
|---|---|---|
| `curar_doenca` | “Curar doença” / “Curar Doença” | **Curar Doença** |
| `voar` | “Voar” / “Voo” | **Voo** |

As sugestões são cosméticas. A identidade dos efeitos reside nos **IDs**, que não devem mudar. Conferir apresentação e filtros com o outro fluxo antes da aplicação.

## 5. Proveniência sensível e taxonomia

**Continuam sem liberação de integração automática:** Carne Humana, Coração Humano, Dedo de Gigante e Orelha de Troglodita, por ausência de fontes sobre obtenção e agência dos envolvidos; Gelatina de Medusa, cuja criatura não foi classificada; e vínculos indevidos sugeridos por nomes de lugares, fauna, religiões ou cosmologia. A documentação ecológica não autoriza transformar materiais de pessoas em drops comuns ou adicionar biomas e regiões fictícias.

## 5.1 Impacto verificado da sincronização e do painel

- O workflow `.github/workflows/sincronizar-curadoria-ingredientes.yml` é acionado por alterações no **JSON ativo** da curadoria ou no próprio workflow. Edições apenas neste pacote ou nos pareceres curatoriais **não** disparam esse workflow pelos filtros atuais.
- O workflow propaga sobreposições do `data/curadoria_ingredientes.json` para até três catálogos de `itens.json`: raiz de dados, demo Phaser e demo M1h-F. Substituições em `renomeacoes_textuais` também percorrem os nomes das receitas.
- O gerador `ferramentas/build_data.py` reaplica os overrides **após** gerar a base e aplica renomeações. Não mexer no campo `id`, no nome de receita, no mapa de renomeações nem em `zona` sem testar impacto real.
- O laboratório `laboratorio-itens/app.js` lê `data/itens.json`, `data/receitas.json` e `data/manifesto_dados.json` no carregamento: a curadoria chega ao painel **indiretamente**, por sincronização/build, não por leitura ao vivo do JSON de override.
- Essa verificação é **inspeção estática de código**, sem execução do workflow, sem teste do jogo, sem auditoria de saves ou validação no navegador real.

## 6. Protocolo para decisão e integração posterior

1. Aprovar, rejeitar ou reescrever **cada** proposta separadamente; nenhuma está aprovada apenas por constar aqui.
2. Registrar decisão autoral no dossiê antes de editar `data/curadoria_ingredientes.json`.
3. Para a mudança aprovada, produzir diff textual mínimo por ID, inspecionando o workflow de sincronização.
4. Validar o contrato dos consumidores: 111 IDs estáveis; três ou mais atributos por ficha; intensidade I–III; 53 efeitos distintos; zero efeitos isolados; zero colisões de ID; nenhuma alteração de mecânica, receitas, menus ou saves.
5. Entregar ao fluxo de integração o commit com as decisões, resultados de QA e eventuais riscos residuais.

**Estado de entrega:** pronto para análise autoral; **sem mutação do catálogo ativo**.
