# Peren v8.4 — promoção artística e integração efetiva ao BattleScene

**Escopo:** evolução aprovada pelo criador após v8.3: Rajada Infernal com **fumaça e caveiras**, Void Rift com final menos brusco, Idle e Summon preservados. Código conectado às magias existentes. **Sem alterar dano, acerto, PV, PM, itens, regras de invocação ou saves**.

## Fontes e contrato do atlas

| Conjunto | Células | Imagem PNG | Uso |
|---|---|---|---|
| Idle | 4 × (560×821) | 2240×821 | Espera, 4 FPS, loop |
| Rajada Infernal | 8 × (512×341) | 2048×682 | `spell:mag-raio-de-fogo` |
| Void Rift | **11 × (640×362)** | **2560×1086**, matriz 4×3 | `spell:mag-misseis-magicos` |
| Summon Greater Demon | 8 × (512×512) | 2048×1024 | Prévia visual sem custo, 2.380 ms |
| Portraits | 4 × (362×1086) | quatro PNGs individuais | Galeria de cenas |

A Rajada Infernal foi reconstruída usando a folha de fumaça com caveiras recebida em v8.3, substituindo definitivamente o uso incorreto de raios de fogo.

O Void Rift utiliza a folha v8.3 de oito quadros e acrescenta **três transições intermediárias** entre o antigo quadro 7 e o quadro de dissipação final. O Peren do final fica estável e o resíduo arcano da versão estendida perde opacidade em três passos. Os quadros intermediários reutilizam os pixels da folha enviada, sem geração de novo desenho. O 12º espaço da matriz está **totalmente transparente** e não é reproduzido.

Os originais e versões anteriores devem continuar acessíveis no pacote de homologação. A composição pode reter imperfeições herdadas, especialmente pequenos fragmentos nas bordas do Void Rift; a transição mais longa é uma correção temporal, não uma reconstrução integral da ponta do projétil.

## Contrato do aplicativo

`phaser-demo-m1hf/battle-art-runtime-v84.mjs` agora:

1. Verifica `art/battle/runtime-v84/battle-asset-pack-v84.json` e a existência de **todos os oito PNGs** no GitHub Pages via HEAD antes de ativar arte nova.
2. Ao carregar em `BattleScene`, cria spritesheets com tamanhos compatíveis com os atlas realmente gerados. O `Void Rift` usa `endFrame:10`.
3. Mantém `BattleScene.animatePlayer` e seus eventos de dano originais, reproduzindo o efeito visual do feitiço em paralelo, sem alterar `combat.js`.
4. Na espera, esconde apenas o sprite legado da batalha, substituindo por Idle 560×821; os sprites da exploração **não são substituídos**.
5. Trata a eventual corrida de inicialização: se a batalha já tiver iniciado quando a verificação de arquivos terminar, faz **hot-hydration** na cena ativa, sem reiniciar a luta.
6. Summon Greater Demon continua sendo **somente uma prévia** com oito quadros e durações 190/210/250/300/330/400/380/320 ms; não registra entidade ou consumo de PM.
7. Exibe quatro portraits no diálogo de inspeção. Usa fallback completo ao combate original quando faltar qualquer arquivo do pacote, evitando tela quebrada e requisições de PNG ausentes.

O `index.html` importa o módulo v8.4 e `demo-sw.js` atualiza versão/cache do módulo JS. **Os oito PNGs não foram acrescentados ao precache enquanto não constarem no repositório**, para evitar que um `cache.addAll` rejeitado prejudique a instalação offline.

## Distribuição do pacote binário

O ZIP `Peren_v84_BattleScene_Assets.zip`, entregue no chat, contém os oito PNGs RGBA reais e o marcador de SHA-256 em `phaser-demo-m1hf/art/battle/runtime-v84/`, além de um viewer standalone e uma folha de inspeção.

O instalador versionado `ferramentas/instalar_battle_v84.py` valida o manifesto, todos os hashes, assinaturas PNG e dimensões e recusa arquivos divergentes:

```bash
python ferramentas/instalar_battle_v84.py Peren_v84_BattleScene_Assets.zip
node --test tests/qa_peren_battle_v84.mjs
git add phaser-demo-m1hf/art/battle/runtime-v84
git commit -m "assets(peren): add verified BattleScene art v8.4"
git push
```

**Bloqueio restante:** neste ambiente os binários locais ainda não foram enviados pelo conector ao GitHub. Assim, a PR inclui código-fonte, testes e instalador; o ZIP está entregue nesta conversa, mas os efeitos v8.4 **não estão online**. O jogo público continuará exibindo o battler antigo até instalar os PNGs, incorporar e validar a revisão em Pages.

## Homologação e regressão

- [x] Atlas finais com SHA-256 e dimensões verificados no ZIP: **8 arquivos**.
- [x] Idle, Summon e quatro portraits preservados do conjunto v8.1.
- [x] Rajada Infernal corrigida para o material de fumaça com caveiras.
- [x] Void Rift com 11 quadros e duração de transição estendida.
- [x] Código de BattleScene atualizado na branch e estado legado preservado.
- [x] Testes de integração Node criados, cobrindo arquivo ausente, nomes de magias, frames corretos, late hydration e reprodução de Summon.
- [ ] PNGs realmente comitados ao GitHub no mesmo PR, o que habilita o manifesto.
- [ ] Teste Browser em `BattleScene` com arquivos reais e renderização 390×844 e 1280×800, especialmente HUD livre de sobreposição.
- [ ] Revisão final de halos, arte entre células e estética da transição do Void Rift com o usuário.
- [ ] PR aprovada, merge e GitHub Pages verificados.

**Importante:** testes de código e viewer standalone não substituem o teste real da tela de combate. Não declarar publicação antes da última etapa.
