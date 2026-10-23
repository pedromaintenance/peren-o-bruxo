# Peren · Ciclo v8.1 — restauração seletiva dos battlers

**Data:** 22/10/2026. **Status:** script e motor de preview integrados à branch, PNGs corrigidos fornecidos em artefato da conversa mas ainda não publicados via GitHub. **Não é merge nem deploy final.**

## Verificação dos 28 quadros de origem

| Arte | Antes → depois | Resultado |
| --- | --- | --- |
| Idle 4 quadros | 479×821 → **560×821** por quadro; contatos entre células: **[98,56,20] → [0,0,0]** | Candidato a teste em BattleScene |
| Summon Greater Demon 8 quadros | **512×512**, sem alteração de pixels, **2380 ms** | Aprovado tecnicamente |
| Rajada Infernal 8 quadros | **512×341**, cromatismo verde e números removidos por máscara; contatos nas junções **[47,85,109,154,167,200] → [0,6,0,4,132,5]** | **Ainda não liberar**: contato alto entre 6→7 e corte do disparo |
| Void Rift 8 quadros | **543×362**, cromatismo verde e números removidos; contatos nas junções **[41,85,101,145,155,159] → [0,9,0,4,146,0]** | **Ainda não liberar**: contato alto entre 6→7 e corte do disparo |

O tratamento é não generativo e preserva a maior parte dos pixels existentes. A remoção de verde usa máscara por predominância do canal G; não garante remoção de toda franja ciano. Chroma/background removidos não recompõem partes de feixe ausentes. A numeração impressa e vários fragmentos vizinhos foram suprimidos; inspeção artística final ainda deve ser feita nos dois efeitos antes de afirmar aprovação.

No Idle, os componentes separados de mão e manto deslocados à célula seguinte foram parcialmente associados ao quadro correto; todos os frames foram recompostos em canvas de 560×821, sem reamostrar pixels nem alterar altura dos pés. O Summon mantém byte a byte a composição RGBA.

## Camadas de aprovação

**Caminho que o jogo poderá carregar quando o ZIP for instalado:**
`phaser-demo-m1hf/art/battle/runtime-v81/` — `idle.png`, `summon.png`, `portrait_01..04.png`, `battle-asset-pack-v81.json`.

**Exclusivamente na entrega local de arte, fora do runtime:** `revisao-pendente/infernal.png` e `revisao-pendente/void.png`, além dos masters originais. O jogo não os solicita e conserva os efeitos legados de fogo/arcano por enquanto.

O `battle-art-runtime-v81.mjs` é carregado pelo `index.html`, mas permanece inativo sem o manifesto e seis PNGs corretos. Isso impede erro 404 e preserva saves, notas de loot e PWA. Quando presentes, a prévia de Summon continua **sem custo de mana e sem criatura mecânica persistente**; nenhum comando novo foi adicionado a `combat.js`.

## Entrega reproduzível

O pacote completo foi gerado em `Peren_Ciclo_v81_Battlers_Corrigidos.zip`, contendo comparador `preview.html`, os quatro atlas tratados e os originais, relatório de métricas, visualizadores GIF e seis imagens selecionadas para produção.

Para importar no clone do repositório após baixar o ZIP:

```bash
python ferramentas/instalar_battlers_v81.py Peren_Ciclo_v81_Battlers_Corrigidos.zip
node --test tests/qa_peren_battler_v81.mjs
git add phaser-demo-m1hf/art/battle/runtime-v81
git commit -m "assets(peren): import SHA-verified v8.1 idle and summon atlases"
git push
```

**Hashes dos atlas candidatos:** Idle `f597da9909787090ac48e1291ca692295a323dc4461638e773073dd1715543d4`, Summon `0a31ff32b60a0e793e4fa9ea405cd4da7cfc892c24f2226dccec5ee8c243935c`. O instalador também confere os quatro portraits.

## Critérios pendentes e validação

- [x] Correção do Idle sem atravessar junções.
- [x] Summon preservado e validado sem modificar pixels.
- [x] Arquivos Infernal e Void Rift tratados como candidatos com bloqueio funcional.
- [x] Prévia local, métricas e hashes documentados.
- [x] Módulo Phaser aponta apenas para Idle/Summon e quatro retratos na v8.1.
- [ ] PNGs incluídos de fato no GitHub (conector disponível não transfere binário local).
- [ ] Teste visual do Peren novo em combate real 390×844 e 1280×800.
- [ ] Revisão manual de Infernal e Void Rift e correção do feixe cortado.
- [ ] PRs aprovadas, merge e GitHub Pages verificados.

**Não afirmar que o site público usa o novo battler enquanto o pacote binário não estiver presente no Pages.**
