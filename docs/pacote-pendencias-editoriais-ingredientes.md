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

## 2. Lacuna de origem — Betta do Rio

A chave `origem` **não existe** na ficha `ing-river-betty`. Não preencher automaticamente com `curadoria_original_carcaca`: esse valor reproduziria uma presunção de proveniência ainda não confirmada. Uma origem geográfica específica no Rio Ancestral tampouco é comprovada pelos registros ecológicos. **Decisão pendente:** como registrar tecnicamente a origem desconhecida sem quebrar os consumidores da curadoria. A descrição candidata da seção anterior pode ser avaliada de modo independente.

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

## 6. Protocolo para decisão e integração posterior

1. Aprovar, rejeitar ou reescrever **cada** proposta separadamente; nenhuma está aprovada apenas por constar aqui.
2. Registrar decisão autoral no dossiê antes de editar `data/curadoria_ingredientes.json`.
3. Para a mudança aprovada, produzir diff textual mínimo por ID, inspecionando o workflow de sincronização.
4. Validar o contrato dos consumidores: 111 IDs estáveis; três ou mais atributos por ficha; intensidade I–III; 53 efeitos distintos; zero efeitos isolados; zero colisões de ID; nenhuma alteração de mecânica, receitas, menus ou saves.
5. Entregar ao fluxo de integração o commit com as decisões, resultados de QA e eventuais riscos residuais.

**Estado de entrega:** pronto para análise autoral; **sem mutação do catálogo ativo**.
