# Importação de battlers para a PR #69

Esta pasta é uma caixa de entrada temporária, não faz parte dos assets carregados pelo jogo.

## Como enviar (sem instalar programas)

1. Baixe o arquivo **Peren_v84_BattleScene_Assets.zip** entregue no chat.
2. No GitHub, abra esta pasta na branch `feature/peren-battle-v85-release-qa`.
3. Clique em **Add file → Upload files**; selecione o ZIP sem descompactar.
4. Confirme que o nome é exatamente `Peren_v84_BattleScene_Assets.zip` e faça commit **na mesma branch**, nunca na `main`.

O workflow `Peren v8.6 Auto Import Battle PNGs` verificará o SHA-256 do ZIP **completo** antes de extrair qualquer coisa. Se estiver correto, validará os oito PNGs, seus hashes e as dimensões, executará testes, fará commit dos oito arquivos + manifesto na mesma branch e excluirá o ZIP temporário.

**SHA-256 do ZIP aceito:** `c185e95e47d684a49e5ddf0ae576d311d652dad50f21d0dd489efbed2185ba41`. Arquivos renomeados ou recomprimidos não são intercambiáveis.

O upload é uma ação do usuário no site do GitHub. O assistente não tem acesso a transferir os binários do container para a API GitHub diretamente. Um workflow verde de importação não substitui a revisão visual; verificar screenshots e gate de release antes do merge.
