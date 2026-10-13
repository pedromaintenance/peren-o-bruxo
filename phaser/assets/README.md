# Asset catalog — ferramenta de produção

`manifest.generated.json` e `catalog/*.json` são gerados por `tools/generate_visual_manifest.py` a partir do catálogo do Peren. Todos os registros começam como `planejado`; isso **não** implica que imagens/animações existam. Atualizações de produção devem ser inseridas em `review.json` e o manifesto gerado novamente; o script preserva esse registro externo.

Exemplo futuro:

```json
{
  "mob-aarakocra": {
    "status": "aprovado",
    "artist": "Equipe",
    "license": "arte original",
    "portrait": "phaser/assets/monsters/mob-aarakocra/portrait.webp",
    "atlas": "phaser/assets/monsters/mob-aarakocra/atlas.webp",
    "animation_data": "phaser/assets/monsters/mob-aarakocra/atlas.json",
    "qa": "Android/desktop/offline OK"
  }
}
```

Não alterar manualmente os arquivos em `catalog/` ou o `manifest.generated.json`. Em produção, o auditor verificará que `aprovado` tem arte, clips e metadados de licença completos.