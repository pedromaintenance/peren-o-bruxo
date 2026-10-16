# M1h-F.6 — Teste de Campo (celular, PWA e controle físico)

**Data:** 16/10/2026 · **Escopo:** prévia isolada de Peren M1h-F (não substituir jogo clássico).

## Necessidade

O protótipo já passou por testes automatizados com Chromium em viewport móvel e desktop, mas ainda falta validação **física** em Android, PWA instalada e controle Xbox. A ausência de roteiro dificulta reproduzir e registrar problemas reais sem confundir falha do build com arte ainda pendente de aprovação.

## Entrega

- `phaser-lab/teste.html`: página sem frameworks, responsiva e legível em telas pequenas, com **nove cenários** de playtest e estados `Passou / Falhou / Não testado`.
- Registro facultativo de aparelho, navegador e observações, sem leitura nem escrita em saves ou armazenamento local.
- **Copiar** e **baixar Markdown**, somente mediante clique do usuário; não há envio automático. Fechar/recarregar a página perde as respostas não exportadas.
- Acesso pelo rodapé de Portomonte **somente no build experimental**, por `m1hfPlaytestLink`.
- `prepare-demo.mjs` copia a página para `dist/teste.html` apenas quando `PEREN_M1HF_PAGES_PREVIEW=1`; o precache escopado inclui o arquivo.
- `tests/playtest.test.mjs`: invariantes de privacidade, presença de controles, link isolado e cópia no build.

## Aceite técnico e limites

- [x] Código-fonte e teste Node implementados na branch experimental.
- [x] Página preparada para publicação em `phaser-demo-m1hf/teste.html`, mantendo cache M1h-F com prefixo próprio.
- [ ] `npm test`, `npm run build` e Playwright no candidato: verificar resultados na execução do CI.
- [ ] Teste na rota pública após o merge: `teste.html` carrega, formulário e arquivos de saída funcionam, PWA tem página offline.
- [ ] **Android físico**: toque, teclado virtual e download/cópia Markdown.
- [ ] **Gamepad Xbox físico**: comandos no jogo; checklists não detectam controle, apenas registram o parecer humano.

## Segurança e limites funcionais

O guia **não** solicita manipular o save clássico e não executa intencionalmente leituras nem gravações de `localStorage`, `sessionStorage`, cookies, IndexedDB ou chamadas de rede. O botão de reset limpa **apenas o formulário**, nunca o jogo. A exportação voluntária pode incluir notas escritas pelo usuário; inspecione antes de compartilhar.

**Não** chamar M1h-F.6 de aprovação de plataforma ou arte: o registro do teste é um instrumento para essa aprovação, não o resultado dela.
