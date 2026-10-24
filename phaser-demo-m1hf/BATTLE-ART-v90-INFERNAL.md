# Peren v9.0 — Rajada Infernal refinada

**Direção artística aprovada:** folha enviada em 24/10/2026, com oito poses de Peren e fogo infernal avançando da mão em direção à direita. A arte não é regenerada nem reescalada durante a importação.

## Contrato de sprite

| Propriedade | Versão anterior | v9.0 |
|---|---|---|
| Textura Phaser | `peren-v84-infernal` | `peren-v90-infernal` |
| PNG | `infernal.png` | `infernal-v90.png` |
| Grade | 4 colunas × 2 linhas | **4 × 2**, sem quadros variáveis |
| Dimensão da célula | 512 × 341 | **543 × 362** |
| Atlas | 2.048 × 682 | **2.172 × 724** |
| Sequência | 8 quadros | **8 quadros** |
| Gatilho no combate | `spell:mag-raio-de-fogo` | **inalterado** |

**SHA-256 do atlas aprovado:** `b52a89a9737403071c898cfbcec428dbfd892a6e4ebc728f12a573892e785c0a`.

O runtime `battle-art-runtime-v90.mjs` e a folha `battle-asset-pack-v90.json` são versionados separadamente. Os outros sete PNGs de batalha e seus hashes continuam os mesmos da versão anterior. O PWA usa um novo identificador de cache para não confundir os tamanhos de quadros dos dois atlas.

Os quadros são equalizados geometricamente pela grade do próprio PNG; a importação **não altera os pixels**. Alguns elementos atingem os limites laterais de suas células na arte aprovada; o Phaser isola cada célula no sprite sheet e não deve ler pixels de uma célula vizinha. O enquadramento e a origem da mão ainda precisam ser avaliados nas capturas do combate real para comprovar a transição visual.

## Implementação já versionada na PR

- `phaser-demo-m1hf/battle-art-runtime-v90.mjs`: leitura do novo atlas, células de 543 × 362; sem alterações de dano/PM/saves.
- `phaser-demo-m1hf/index.html`: carrega o novo módulo.
- `phaser-demo-m1hf/demo-sw.js`: novo cache PWA e referência ao PNG v9.0.
- `phaser-demo-m1hf/art/battle/runtime-v84/battle-asset-pack-v90.json`: manifesto com os 8 hashes.
- `ferramentas/instalar_infernal_v90.py`: importador que verifica SHA do ZIP/PNG, tamanho e dimensões sem sobrescrever arte distinta.
- `tests/qa_peren_infernal_v90.mjs`: QA de grade, manifesto, integração, asset no repositório e SHA.
- `.github/workflows/peren-v90-import-infernal.yml`: ação de importação automática do ZIP anexado à branch.

## Bloqueio binário antes da publicação

A imagem de 2,39 MB foi gerada na conversa e entregue no ZIP **Peren_Infernal_v90_GitHub_Ingest.zip**. Ela precisa existir de verdade na branch, em:

```
phaser-demo-m1hf/art/battle/runtime-v84/infernal-v90.png
```

O conector GitHub disponível aqui aceita edição de texto e criação de blobs base64, mas não recebe diretamente os bytes do PNG gerado no container. Para concluir a importação sem instalar nada, abra `asset-ingest/` na branch da PR, escolha **Add file → Upload files** e envie **Peren_Infernal_v90_GitHub_Ingest.zip**. A Action irá conferir a integridade, gravar **apenas a nova imagem**, apagar o ZIP temporário e executar o QA de batalha.

**Não fazer merge antes que `tests/qa_peren_infernal_v90.mjs` e os testes do BattleScene estejam verdes.** O site publicado permanece na v8.9 até esse ponto.
