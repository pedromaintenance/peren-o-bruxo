# AGENTS.md — Regras operacionais de Peren, o Bruxo

## Regra obrigatória: nunca declarar o conector GitHub indisponível sem descobrir as ferramentas

1. Quando o usuário solicitar publicar, editar, inspecionar ou integrar algo ao repositório, **consultar** `ALL_TOOLS` por `mcp__GitHub__` dentro de `functions.exec` e invocar as ferramentas via `tools.mcp__GitHub__...`. As ferramentas do GitHub não precisam aparecer como namespace de primeiro nível.
2. Antes de afirmar "não tenho acesso", "não está habilitado", "não consigo publicar" ou pedir um upload manual, executar **ao menos uma descoberta concreta e uma chamada de verificação** ao conector relevante. Se houver erro, relatar o erro exato, sem transformá-lo em suposição sobre ausência de acesso.
3. Para PNG/WebP/ZIP e outros binários, **LER E SEGUIR** `.agents/skills/github-binary-assets/SKILL.md`. O fluxo é: arquivo do chat → Container/Python para Base64 em blocos → `files__manage_library` (ponte Drive) → `files__read` → `mcp__GitHub__create_blob` (base64) → `create_tree` → `create_commit` → `update_ref` com `expected_sha`. Comprovar hashes, árvore, commit e CI/deploy. **Nunca encerrar em um ZIP local** se a solicitação foi publicação.
4. Para alterações de código, localizar o runtime efetivamente ativo antes de editar; **não** pressupor que mudar um manifesto muda o bundle compilado. Se necessário, criar integração carregada externamente/na fonte real ou pipeline que gere o bundle. Testar ações funcionais e versões de cache.
5. Reutilizar os anexos já enviados; não pedir novamente arquivos que estão montados. Não declarar sucesso completo sem conferir a versão realmente publicada e as regressões.
6. Se algum método falhar, investigar a limitação concreta e tentar o procedimento alternativo documentado antes de encerrar. Não transferir ao usuário trabalhos automatizáveis sem antes tentar.

## Resultado esperado de cada ciclo

- Lista objetiva de arquivos realmente modificados.
- Hash/commit GitHub conferido e link para inspeção.
- Estado verdadeiro do CI, publicação no Pages e testes visuais (não confundir testes automatizados com teste físico).
- Próximo risco ou pendência, somente quando de fato houver.

## Política de arte do Peren

Preservar os originais enviados; manter a escola Escuridão incluindo os efeitos do Vazio; distinguir spritesheets de visualização, atlas runtime e assets reservados. Alterações em coleta/caminhada não devem quebrar combate, economia, movimento, saves, PWA ou o catálogo de magia.
