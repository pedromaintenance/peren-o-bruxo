# M1h-F.4 — Resgate seguro de saves de teste

> Estado: **implementado na branch, pendente de validação e publicação**. Não é uma migração de saves clássicos. A recuperação é exclusiva da build `VITE_PEREN_M1HF_PREVIEW=1` e da chave `peren_phaser_save_m1hf_preview_v1`.

## Problema que resolve

Na build anterior, um JSON inválido em `localStorage` fazia `createProgressBridge()` lançar uma exceção durante o bootstrap. O Phaser não iniciava e o jogador só recebia uma mensagem genérica. Era impossível usar o botão normal de exportação ou restauração da cidade.

## Solução

- No bootstrap da **prévia M1h-F**, se o save do próprio protótipo não puder ser validado, exibir um painel independente antes de criar o jogo. Sem reset automático, sem tentar usar save clássico.
- **1. Baixar save danificado:** exportação local e voluntária do conteúdo original para `peren-m1hf-save-danificado.txt`. Isso preserva a matéria-prima da recuperação.
- **2. Recuperar:** somente após solicitar o download, permitir selecionar backup Phaser v2 (.json, máximo 2 MB) ou reiniciar **somente a prévia**. Ambas as escolhas exigem confirmação humana.
- **Backup restaurado:** `validatePhaserBackup` confere esquema, personagem e ledger com os catálogos existentes antes da escrita. Se o arquivo não for compatível, o conteúdo danificado permanece intacto. Um backup válido recebe nova revisão.
- **Reinício isolado:** somente após confirmação, remover exclusivamente a chave do protótipo `peren_phaser_save_m1hf_preview_v1`. O próprio Phaser cria uma nova campanha ao recarregar.
- **Conflito entre abas:** antes de gravar ou apagar, comparar o valor atual do save com o encontrado ao abrir o painel. Se mudou, não continuar e solicitar recarregamento.
- **Erro de armazenamento / quota:** preservar o estado ao falhar `setItem`/`removeItem`, sem limpar caches nem mexer em outros jogos.
- Botão regular de exportação na cidade usa nome `peren-m1hf-dia-N-backup.json`, tornando óbvio que é um backup **do protótipo**, não do clássico.

## Escopo de proteção

| Chave | Política |
| --- | --- |
| `peren_phaser_save_m1hf_preview_v1` | Pode ser substituída ou removida exclusivamente após download e confirmação |
| `peren_carcaca_save_v1` | **Nunca ler, modificar ou apagar no fluxo de recuperação** |
| `peren_phaser_save_m1d_v1` | **Nunca ler, modificar ou apagar no fluxo de recuperação** |
| Cache PWA, IndexedDB e outras origens | **Não modificar** |

O arquivo danificado contém o save bruto escolhido pelo jogador, inclusive itens/histórico: é privado e **nunca enviado automaticamente**. O relatório de diagnóstico separado continua limitado a metadados técnicos e não é o mesmo arquivo de recuperação.

## Testes e gates

- `tests/save-recovery.test.mjs`: download e confirmação, arquivos inválidos e grandes, backup v2 válido, controle concorrente, falhas de storage, exclusividade da chave e ausência de rede.
- `scripts/m1hf-save-rescue-browser.mjs`: Chromium **390×844 e 1280×800** cobrindo save danificado, download original, restauração válida, reinício isolado, cancelamento e conflito.
- `.github/workflows/phaser-m1hf-pages.yml`: `npm test`, build com `VITE_PEREN_M1HF_PREVIEW=1`, QA de combate e QA de recuperação antes da publicação da branch de prévia.
- `.github/workflows/phaser-m1hf-pages-live.yml`: repetir as verificações sobre a URL pública **depois** de publicar o pacote experimental.
- Conferir diff: somente `phaser-demo-m1hf/` pode ir para `main`; a PR de fonte #24 segue em draft. **Não exigir limpar cache nem dados do navegador.**

## Próximos passos

- Testar recuperação em **Android físico**, inclusive download real do TXT, seleção de arquivo e confirmação.
- Desenvolver mecanismos opcionais de múltiplos backups e indicadores de integridade, evitando gravações repetidas, armazenamento excessivo e perda de dados.
- Não promover mudanças de save para o jogo clássico sem um plano de migração independente.
