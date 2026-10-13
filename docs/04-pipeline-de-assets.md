# Pipeline de produção artística, por ID

**Todos os assets são tarefas rastreadas individualmente;** a produção pode usar ferramentas compartilhadas, mas o resultado final de cada objeto deve ter identidade própria.

## Etapas para cada asset

1. **Inventário**: usar `python tools/generate_visual_manifest.py`, que lê `data/*.json` e produz `phaser/assets/manifest.generated.json` com um registro por entidade/receita/menu.
2. **Brief**: registrar ID, referência da Carcaça, espécie, perfil, tamanho, vista, cores, movimento e outros requisitos de cena.
3. **Arte-base**: concept aprovado; escopo e proveniência/licença anotados.
4. **Sprites**: desenho base, transparência e pontos de apoio/ancoragem; para criaturas/atores, atlas de animações completo.
5. **Efeitos**: som, partículas, microanimações, transições e sinais visuais de ação concluída.
6. **Integração**: conferir path de arquivos, hashes se necessário, `key` Phaser e `animation clips` no manifesto.
7. **QA**: animação sem salto entre frames, Peren não atravessa colisões, clipping, textura carregada offline, FPS e legibilidade no Android.
8. **Aprovação**: mudar status para `aprovado` **somente após** os testes e inspeção visual.

## Convenções

- Diretórios: `phaser/assets/characters/{id}/`, `monsters/{id}/`, `npcs/{id}/`, `spells/{id}/`, `items/{id}/`, `regions/{id}/`, `cities/{id}/`, `ui/{id}/`.
- Exemplo: `phaser/assets/monsters/mob-aarakocra/atlas.webp` + `atlas.json` + `portrait.webp` + `meta.json`.
- Animações típicas: `idle`, `walk`, `attack`, `hurt`, `death`, `special`, `cast`. Registrar FPS por clip; não pressupor clips inexistentes.
- Consistência: ID sempre igual ao `data/*.json`; jamais gerar nomes por índice/posição de array.
- O gerador de manifesto não deve sobrescrever status anotado manualmente. Manter revisões em `phaser/assets/review.json`, com chave por ID, e mesclar na geração.
- Propriedade/licença: para assets externos, `author`, `source_url`, `license`, `license_url`, `modifications`. Não permitir campo de licença vazio em entregas finais.
- Dados binários grandes: comprimir WebP/AVIF/PNG conforme compatibilidade e manter atlas divididos por zona; não precachear todo o bestiário no primeiro lançamento. Cache por pacote para cada local e fallback offline explícito.

## Produção por lotes

Ordem sugerida: Peren → Floresta de Mürin → monstros/feitiços iniciais → Portomonte e seus três vendedores → sistema de combate → nove cidades/dez biomas → cobertura integral (222 criaturas/354 feitiços/2.785 ícones/2.316 sequências de receitas). Cada lote precisa de revisão visual antes de iniciar o seguinte.

## Definition of Done

Um monstro não está concluído porque aparece no catálogo: **portrait + sprite único + todas as animações pertinentes + colisões + VFX + integração + QA**. Uma magia não está concluída porque solta partículas genéricas: **identidade visual distinguível + carga/efeito/impacto + integração + QA**. Um item não está concluído sem seu ícone individual e apresentação contextual.