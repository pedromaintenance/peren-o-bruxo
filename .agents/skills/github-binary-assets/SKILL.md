---
name: github-binary-assets
description: Publique PNG/WebP de Peren, o Bruxo diretamente no GitHub via ponte Files/Google Drive → Base64 → Git blobs → tree/commit, sem exigir upload manual, preservando os bytes finais aprovados e a integridade dos sprites.
---

# Skill: Assets binários de Peren, o Bruxo por ponte Files/Google Drive

**Procedimento comprovado em 26/10/2026 no projeto O Mar de Sangue e adaptado ao Peren.** Para o repositório `pedromaintenance/peren-o-bruxo`, priorize a ponte Files/Google Drive quando o conector GitHub não puder receber diretamente o arquivo binário montado. Não declare o upload impossível nem transfira essa etapa ao usuário antes de tentar a ponte e confirmar os resultados. Fonte: https://github.com/pedromaintenance/o-mar-de-sangue/blob/main/.agents/skills/github-binary-assets/SKILL.md.

## Quando usar

O usuário fornece imagem/spritesheet PNG/WebP para incluir, atualizar ou integrar no repositório do Peren. **Preserve exatamente o arquivo final aprovado**, sem redimensionar, redesenhar, recomprimir ou mudar transparência sem pedido. Se o usuário solicitar transformação (por exemplo, remover o fundo preto do `peren-casting-ice`), gere e valide essa versão primeiro; a partir dela, publique os mesmos bytes (hash idêntico). Não altere animações de outras magias, física, dano, mana, rotação, colisões ou saves sem autorização.

## Ferramentas

1. Container/Python: acesso ao anexo montado em `/mnt/data`, Base64 em arquivos texto temporários, Pillow para dimensões, `hashlib` para integridade.
2. Files: `files__manage_library` para `create_folder` e `upload` dos `.txt` em `/Google Drive/peren-github-bridge`; `files__read` para recuperar os blocos do Drive por `file_id` completo. Opcional: `mcp__Google_Drive__list_folder` para recuperar IDs e nomes da pasta, nunca usar uma ID inventada.
3. GitHub: `mcp__GitHub__create_blob({repository_full_name,content,encoding:"base64"})`, `create_tree`, `create_commit`, `update_ref`, `fetch_file`, PR e CI.
4. As ferramentas se comunicam por `functions.exec` (`tools.<nome>`); a transferência de megabytes deve ocorrer **dentro do código de ferramenta**, não no texto da resposta.

## Receita verificada

### 1. Preparar blocos de Base64 locais

```python
from pathlib import Path
from PIL import Image
import base64, hashlib
source = Path('/mnt/data/SEU_SPRITE_ORIGINAL.png')
img = Image.open(source)
data = source.read_bytes()
base64_text = base64.b64encode(data).decode('ascii')
stage = Path('/mnt/data/peren_binary_stage'); stage.mkdir(exist_ok=True)
prefix = 'seu_sprite_unico'
names = []
for i, start in enumerate(range(0, len(base64_text), 160_000)):
    block = base64_text[start:start+160_000]
    name = f'{prefix}_part_{i:03d}.txt'
    (stage/name).write_text('\n'.join(block[k:k+4000] for k in range(0,len(block),4000)), encoding='ascii')
    names.append(name)
print('dimensions', img.size, 'mode', img.mode, 'bytes', len(data), 'b64', len(base64_text))
print('sha256', hashlib.sha256(data).hexdigest())
print('git_blob_sha1', hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest())
print('names', names)
```

Os tamanhos **160.000 caracteres por arquivo** com linhas de **4.000 caracteres** foram testados. A divisão é textual, não recorta a spritesheet. Guardar todos os nomes **na ordem** e os hashes esperados.

### 2. Enviar os blocos texto ao Drive conectado

```javascript
await tools.files__manage_library({operations:[
  {operation:'create_folder',path:'/Google Drive/peren-github-bridge',parents:true}
]});
const names = ['peren_casting_ice_part_000.txt', 'peren_casting_ice_part_001.txt']; // completar todos
const r = await tools.files__manage_library({operations:names.map(n=>({
  operation:'upload',
  container_path:'/mnt/data/peren_binary_stage/'+n,
  destination_path:'/Google Drive/peren-github-bridge/'+n
}))});
```

Enviar **até 20 uploads por chamada**, verificar `status:'succeeded'`, armazenar os `file_id` completos associados a cada nome. Não usar `overwrite:true`: nesta execução o Drive retornou `overwrite_not_supported`. Utilizar nomes exclusivos; pode listar a pasta real com `mcp__Google_Drive__list_folder`, usando URL/ID retornado pela criação, se for necessário redescobrir as partes.

### 3. Reconstituir e criar um blob Git com os mesmos bytes

Executar dentro de **uma** chamada `functions.exec`:

```javascript
const repo='pedromaintenance/peren-o-bruxo';
const ids=[/* file_id completo na ordem dos blocos */];
const chunks=[];
for(let start=0;start<ids.length;start+=5){
  const r=await tools.files__read({read:ids.slice(start,start+5).map(id=>({
    ref_id:id, mode:'full'
  }))});
  for(const item of r.results){
    if(item.has_more) throw Error('Bloco incompleto');
    const b64=(item.content||[]).filter(v=>typeof v==='string')
      .join('\n').replace(/\s+/g,'');
    if(!b64) throw Error('Bloco vazio');
    chunks.push(b64);
  }
}
const full=chunks.join('');
if(full.length!==B64_LENGTH_ESPERADO)throw Error('Comprimento Base64 incorreto');
const blob=await tools.mcp__GitHub__create_blob({
  repository_full_name:repo, content:full, encoding:'base64'
});
if(blob.result.sha!==GIT_SHA1_ESPERADO)throw Error('Arte incorreta ou corrompida');
text({blobSha:blob.result.sha,verificado:true});
```

**Histórico de verificação no repositório de origem (O Mar de Sangue):** PNG Dagon 2.948.725 bytes → Git blob `fff55128bf2529933a8e4911cf6334824c16f604`; PNG Cortejo dos Afogados 2.454.849 bytes → blob `12a545e9b030cea673289758605131696eef46ad`. Ambos os SHA Git conferiram exatamente. **Criar blob não basta para publicar**.

### 4. Integrar o blob à árvore Git da branch

Obter HEAD atual da branch e tree SHA via GitHub API `GET /repos/{owner}/{repo}/git/commits/{head_sha}` (ação `mcp__GitHub__fetch`). Não inventar hashes. Depois:

```javascript
const tree=await tools.mcp__GitHub__create_tree({
  repository_full_name:repo,
  base_tree_sha:TREE_SHA_ATUAL,
  tree_elements:[{path:'phaser-demo-m1hf/art/characters/peren/battler/casting/peren-casting-ice.png',mode:'100644',type:'blob',sha:BLOB_SHA}]
});
const commit=await tools.mcp__GitHub__create_commit({
  repository_full_name:repo,
  message:'asset: update exact original artwork',
  tree_sha:tree.result.sha,
  parent_sha:HEAD_SHA_ATUAL
});
await tools.mcp__GitHub__update_ref({
  repository_full_name:repo,branch_name:BRANCH,
  sha:commit.result.sha,expected_sha:HEAD_SHA_ATUAL
});
```

`expected_sha` protege contra sobrescrever trabalho concorrente. Se falhar, recarregar HEAD e TREE, reconstruir em cima do novo commit; **não forçar push**. Substituição pelo mesmo caminho preserva imports e não duplica o arquivo.

### 5. Conectar ao Phaser e PWA

- Para os sprites de conjuração 2048×682 com quatro quadros: `this.load.spritesheet('peren-casting-ice','./art/characters/peren/battler/casting/peren-casting-ice.png',{frameWidth:512,frameHeight:682,endFrame:3})` (ajustar o caminho ao contexto do loader). Para outros assets, ler suas dimensões/manifesto reais; nunca presumir 4 quadros.
- Spawn com quadro 0: `scene.add.sprite(x,y,texture,0)`; alternar `setFrame` segundo o ciclo real do Phaser em `phaser-demo-m1hf/battle-art-runtime-v90.mjs` e respeitar os tempos do spritesheet.
- Calcular escala com as dimensões de **um quadro** (não da spritesheet inteira); manter os efeitos da mão, os VFX do inimigo e as animações de conjuração separados.
- Não modificar movimentos, outras magias, IA, cooldowns, física, orientação, dano ou colisão sem autorização. Rotação/espelhamento solicitados devem ser feitos na apresentação Phaser, preservando o PNG.
- Atualizar `phaser-demo-m1hf/demo-sw.js`: incluir paths existentes em `FILES` e alterar `CACHE` para atualizar a PWA. **A instalação usa `cache.addAll(FILES)`**: um caminho binário inexistente pode impedir a atualização do Service Worker. Nunca incluir o arquivo no precache antes de conferir seu commit na branch.
- Criar teste de integridade: assinatura PNG/RGBA, dimensões, SHA-256 do arquivo final aprovado, presença na árvore Git, animação e retorno ao Idle; executar QA da batalha em mobile/desktop, PWA offline e regressão das magias já implementadas.
- Verificar o commit na árvore Git, SHA do blob, CI e PR. Em seguida, confirmar merge e deploy do GitHub Pages; Service Worker pode precisar de um novo ciclo de ativação. Não declarar sucesso apenas porque criou blob/branch/PR.

### 6. Limpeza

Após validar os arquivos no GitHub e integrar o PR, apagar **somente** os `.txt` temporários deste envio no Drive. Não remover arquivos de terceiros. Não anunciar sucesso completo se apenas o Git blob existe: é necessária árvore Git + commit + branch + testes + merge.

## Problemas já resolvidos — não repetir

- `create_file`/`update_file` do GitHub criam texto UTF-8, **não PNG** → usar `create_blob` com Base64.
- O GitHub não recebe `/mnt/data` diretamente → usar `files__manage_library` para o Drive e `files__read` dentro de `functions.exec`.
- `overwrite=true` falha nos uploads Google Drive → omitir.
- Blocos longos podem ser truncados → 160 mil caracteres, 4 mil por linha, leitura de até 5 arquivos e verificação de tamanho total.
- Blob criado sem `create_tree` é objeto solto, não arquivo no branch.
- Saves pré-alfa **não** são barreira para a qualidade final, mas regredir a funcionalidade do jogo ou invalidar o cache da PWA é erro.
- Testes de cache que exigem exatamente v69 precisam aceitar versões posteriores com `cacheVersion >= 69`.

## Checklist obrigatório

- [ ] Original preservado pixel a pixel, hash do Git Blob confere.
- [ ] Binário ligado à branch por tree/commit e verificado no caminho correto.
- [ ] Phaser carrega os 4 quadros e a escala e orientação estão corretas.
- [ ] Mecânicas anteriores continuam funcionando.
- [ ] Cache PWA e testes passaram.
- [ ] PR integrado à main e publicação conferida, sem declarar testagem física não realizada.

**Esta ponte já funcionou e deve ser tentada no Peren. Não peça ao usuário que repita upload de um PNG anexado e montado.** Ao finalizar, entregue o link GitHub do arquivo e do commit/PR, informando com precisão quais etapas realmente passaram.

## Particularidades de Peren, o Bruxo

- **Destino habitual de conjuração:** `phaser-demo-m1hf/art/characters/peren/battler/casting/` para `peren-casting.png`, `peren-casting-fire.png` e `peren-casting-ice.png`. Respeitar manifestos e hashes reais do destino; não inventar valores.
- **Efeitos de combate:** `phaser-demo-m1hf/art/battle/runtime-v84/`; as magias iniciais mantêm camadas discretas separadas e não reutilizam indiscriminadamente os efeitos infernais avançados.
- **Fontes de jogo e testes:** `phaser-demo-m1hf/battle-art-runtime-v90.mjs`, `tests/qa_peren_*.mjs` e `phaser-demo-m1hf/demo-sw.js`.
- **Origem do PNG aprovado:** arquivos gerados em `/mnt/data` e anexos do chat podem ser diferentes do original enviado; comparar o hash do **arquivo que será realmente publicado**, após qualquer processamento autorizado (como transparência).
- **Restrições de uso da ferramenta:** `mcp__GitHub__create_file`/`update_file` recebem apenas UTF-8; para PNG/WebP, usar `mcp__GitHub__create_blob` com `encoding:"base64"`, depois `create_tree` → `create_commit` → `update_ref`. Nenhum link de PR ou afirmação de upload deve ser inventado.
