# Peren v9.0 — Rajada Infernal publicada por integração direta

**Arte de referência:** PNG RGBA fornecido pelo criador em 24/10/2026, preservado byte a byte. A nova animação substitui somente a Rajada Infernal, sem alterar as artes Idle, Void Rift, Summon, retratos ou a mecânica de combate.

| Propriedade | v9.0 |
|---|---|
| Phaser texture key | `peren-v90-infernal` |
| Arquivo | `phaser-demo-m1hf/art/battle/runtime-v84/infernal-v90.png` |
| Atlas | **2048 × 682 px**, RGBA |
| Grade | **4 colunas × 2 linhas** |
| Quadro | **512 × 341 px** (8 quadros iguais) |
| Bytes | **2.208.337** |
| SHA-256 | `fc2ecca170a76c76e89ad846709b0d9659e57699eb0611441736ce81a17b22c9` |
| Feitiço | `spell:mag-raio-de-fogo` |

A versão anterior usava a mesma dimensão de célula; a troca v9.0 é **visual**, com fumaça e crânios de fogo refinados, identidade de textura independente e cache PWA atualizado. Não reescalar, regenerar ou recomprimir este PNG.

## Publicação e regressão

1. O PNG foi registrado diretamente como blob Git e incluído na PR #71.
2. O manifesto `battle-asset-pack-v90.json` e o teste `qa_peren_infernal_v90.mjs` verificam dimensões, tamanho e integridade criptográfica.
3. O Service Worker utiliza novo cache `preview-infernal-v90-20261024-source2048`.
4. A PR roda `Peren Official Art QA`, inclusive teste real da BattleScene, PWA offline e Single Free Mode.
5. Mesclar apenas quando os checks da PR estiverem verdes. A publicação final depende do deploy da branch `main`.

**Não há upload manual, ZIP de importação ou instalação local necessários para este atlas.**
