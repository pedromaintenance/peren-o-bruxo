# Peren, o Bruxo — Roadmap de desenvolvimento

> **Atualizado em 15/10/2026 (BRT).** Documento de acompanhamento das próximas entregas do jogo. Uma funcionalidade **implementada** não é necessariamente **publicada**, **validada** ou **aprovada artisticamente**.
>
> O plano detalhado original do Phaser permanece em [`docs/01-roadmap.md` na branch de desenvolvimento](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/01-roadmap.md). Este arquivo é o **índice executivo** mantido na `main`.

## Onde jogar e como o projeto está organizado

| Produto | Endereço | Estado |
| --- | --- | --- |
| **Peren clássico (HTML/JS)** | [Peren, o Bruxo](https://pedromaintenance.github.io/peren-o-bruxo/) | Publicado; referência estável, não substituir automaticamente |
| **Phaser M1h-F — protótipo** | [Jogar na Floresta de Mürin](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf) | Testável no Pages; **experimental**, save e cache próprios |
| **Ateliê M1h-F** | [Comparar animações](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/review.html?art=m1hf) | Teste visual dos três monstros |
| **Código-fonte M1h-F** | [PR #24](https://github.com/pedromaintenance/peren-o-bruxo/pull/24) | Aberta em *draft*, sobre a [PR #23 M1h-E](https://github.com/pedromaintenance/peren-o-bruxo/pull/23) |
| **Publicação Pages** | [PR #25](https://github.com/pedromaintenance/peren-o-bruxo/pull/25) · [Hotfix #26](https://github.com/pedromaintenance/peren-o-bruxo/pull/26) | Publicações estáticas isoladas dentro de `phaser-demo-m1hf/` |

**Nunca confundir merges:** a pasta `phaser-demo-m1hf/` na `main` é um **bundle compilado**; as modificações de motor, assets e testes permanecem na PR de fonte #24. O jogo clássico, `phaser-demo/` e o protótipo M1h-F têm responsabilidades distintas.

## Status e regra de aceite

- **Concluído — publicado:** código e assets estão acessíveis no Pages, com testes automatizados verdes.
- **Implementado — em validação:** código existe e tem testes, mas pode não estar ainda no Pages ou depende de revisão.
- **Pendente:** sem entrega verificável; não marcar como concluído porque uma imagem, mockup ou documento menciona a funcionalidade.
- **Aprovação final:** exige revisão artística e teste em dispositivo físico, além do CI. O CI em Chromium não equivale a playtest manual Android.

## Prioridade imediata — M1h-F.2 (robustez e UX)

| ID | Prioridade | Item e critério de aceite | Estado |
| --- | --- | --- | --- |
| F2-01 | P0 | Encerrar vitória, derrota e fuga sem travar; XP/loot registrados só uma vez; voltar à floresta e continuar após reload | **Publicado** — [PR #26](https://github.com/pedromaintenance/peren-o-bruxo/pull/26). [11 cenários de navegador passaram](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38835950801) |
| F2-02 | P0 | Relatórios de erros no próprio protótipo, exportados pelo jogador **voluntariamente**; somente metadados técnicos, **sem exportar inventário, save completo, jornal ou seed** | **Publicado no Pages (M1h-F.2)** — [PR #27](https://github.com/pedromaintenance/peren-o-bruxo/pull/27), [QA online](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38838431413) |
| F2-03 | P1 | Retrato de encontro coerente com `?art=m1hf`, e resumo antes de confirmar XP, ouro e item reais da criatura | **Publicado no Pages (M1h-F.2)** — [PR #27](https://github.com/pedromaintenance/peren-o-bruxo/pull/27), [QA online](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38838431413) |
| F2-04 | P1 | Feedback de vitória visível depois de voltar ao mapa, sem ser sobrescrito pelo próximo frame do HUD | **Publicado no Pages (M1h-F.2)** — [PR #27](https://github.com/pedromaintenance/peren-o-bruxo/pull/27), [QA online](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38838431413) |
| F2-05 | P0 | Reproduzir vitória, derrota, fuga, clique duplicado e erros de interface; confirmar isolamento de saves em **390×844** e **1280×800** | **11 cenários passaram no Pages** (6 vitórias + 5 cenários de resiliência), em 390×844 e 1280×800. CI contínuo permanece obrigatório — [execução online](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38838431413) |
| F2-06 | P0 | Confirmar PWA/Pages em **Android físico**: navegação, controle touch, reload, modo avião, atualização de SW, desempenho e preservação do save | **Pendente de playtest real** |

### Entrega F2 — definition of done

- Testes Node, Vite e Playwright passando **no build candidato**, inclusive conclusão de combate e importação/exportação do save de teste.
- Revisão na rota pública com os arquivos corretos (não apenas em `localhost`).
- Nenhuma modificação de `peren_carcaca_save_v1` ou `peren_phaser_save_m1d_v1`. A prévia usa `peren_phaser_save_m1hf_preview_v1`.
- Service worker e manifesto permanecem dentro do diretório `phaser-demo-m1hf/`; atualização não apaga caches de outros jogos.
- Registrar o resultado do playtest manual ou a pendência correspondente. **Não limpar dados de navegador como etapa padrão de atualização.**
- Código-fonte na PR #24; publicar **somente** o bundle isolado por PR de release (ex.: `release/phaser-m1hf2-pages`) → `main`, após comparar o diff e confirmar que apenas `phaser-demo-m1hf/` mudou.

## Release M1h-F.2 — entregue no Pages

- **Pacote publicado:** [PR #27](https://github.com/pedromaintenance/peren-o-bruxo/pull/27), contendo apenas alterações em `phaser-demo-m1hf/`; o jogo clássico segue separado.
- **QA no endereço público:** [GitHub Actions (success)](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38838431413). Incluiu as três criaturas, seis vitórias completas (dois tamanhos), cinco cenários de resistência, save/reload e botões de diagnóstico.
- **Melhorias visíveis:** retratos M1h-F nos encontros; saque/XP/moedas da tabela real de monstros na tela de desfecho; mensagem de recompensa preservada ao voltar à floresta; aviso de versão correta na cidade.
- **Suporte a bugs:** copiar/baixar relatório JSON com metadados técnicos limitados; sem envio automático nem exportação do save completo. O jogador decide se compartilha o relatório.
- **Pendente:** verificação em Android físico, offline/PWA instalada, desempenho e aprovação artística. Portanto, **a prévia está publicada, mas não é uma release definitiva do Phaser**.
- **Acesso:** [jogar M1h-F.2](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf) · [revisar arte](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/review.html?art=m1hf).

## M1h-F.3 — Comparação direta de arte [FONTE IMPLEMENTADA, PUBLICAÇÃO EM VALIDAÇÃO]

- **Comparador visual `compare.html`**: dois atlas reais (M1h-E à esquerda e M1h-F à direita), três criaturas de Mürin, sete ações sincronizadas, pausa, FPS, zoom e inspeção dos quatro quadros. **Status:** implementado na [PR #24](https://github.com/pedromaintenance/peren-o-bruxo/pull/24); ainda aguardando publicação validada no Pages.
- **Parecer artístico voluntário**: checklist de silhueta a 1×, movimento, combate, identidade sombria, retrato e legibilidade, mais observações e escolha E/F. O usuário pode copiar ou baixar Markdown; sem gravar no `localStorage` e sem transmissão de dados.
- **Métricas técnicas**: comparação de quadros únicos e da proporção de pixels visíveis. Não substituem julgamento humano ou aprovação de estilo.
- **QA**: [código do teste mobile/desktop](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/phaser-lab/scripts/m1hf-compare-browser.mjs), três espécies × sete ações × duas resoluções, screenshots e invariância do save.
- **PWA offline**: [regressão automatizada preparada](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/phaser-lab/scripts/m1hf-offline-browser.mjs), para executar no endereço público após a publicação. **Não equivale a teste Android físico.**
- **Gate final:** testar a página publicada, colher feedback humano e só então trabalhar no redesenho de cada criatura ou aprovar um atlas como padrão. **Nenhum sprite foi aprovado automaticamente.**

Documentação técnica: [docs/27-m1h-f-3-comparador.md](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/27-m1h-f-3-comparador.md).

## Próxima prioridade — M1h-F.3 (identidade artística da Carcaça)

- [x] Três monstros de Mürin com **7 ações × 4 quadros** de atlas `256×448`, retratos `160×160` e assets gratuitos com origem rastreada; opção `?art=m1hf`.
- [x] Galho Infectado: base de vegetação CC0; raízes, galhos e seiva corrompida.
- [x] Fungo Violeta: base Kenney CC0; chapéu, micélio e esporos violetas.
- [x] Ettercap: poses Kenney CC0, múltiplos olhos, membros e carapaça retocados.
- [ ] Revisar a **legibilidade a 1× e 2×**, silhuetas, frames de ataque/sofrimento/morte, paleta escura e unidade estética de Mürin.
- [ ] Aprovar **em jogo**, não apenas por captura de atlas; corrigir quaisquer elementos que pareçam sprites de plataforma infantil.
- [ ] Revisar efeitos e retratos nas telas de encontro e combate, incluindo contraste em telas OLED e celulares pequenos.
- [ ] Auditar licenças/atribuição e transformação por arquivo; referências: [documentação dos assets M1h-F](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/26-m1h-f-audicao-kenney-cc0.md).
- [ ] Não fazer merge do novo padrão gráfico antes de aprovação explícita.

## Vertical slice — M1 (Portomonte ↔ Floresta de Mürin)

| Sistema | Implementação atual | Critério restante |
| --- | --- | --- |
| Movimentação, coleta, seed e colisão | Protótipo Phaser; vários testes automatizados | Teste em dispositivo, mapa sem softlock, frames por segundo reais |
| Encontros e IA | Galho, Fungo, Ettercap; névoa, recuo e perseguição | Tunar detecção, feedback de ameaça, prevenção de encontro imediato após fuga |
| Combate JRPG | Ataque, defesa, poção, fuga, três magias e FX | UX, balanceamento, status, travamentos em dispositivo |
| Persistência | Bridge transacional, IDs canônicos, ledger idempotente e backup | Recuperação amigável quando `localStorage` estiver cheio/corrompido, migração formal |
| Portomonte, bolsa e economia | Interfaces Phaser em teste: oficina, comércio e inventário | Auditoria do fluxo completo, acessibilidade mobile/teclado/controle |
| Arte | Três inimigos alternativos e variantes de Peren | Aprovação de retratos/animações, otimização e direção única |
| PWA | Protótipo Pages isolado, manifesto e cache próprio | Testar instalação e offline em dispositivos reais e atualização sem perda de progresso |

## Horizonte posterior — M2 a M6

| Etapa | Escopo principal | Critério para avançar |
| --- | --- | --- |
| **M2 — Combate** | Combate, magias por ID, animações diferenciadas, status e bosses | Regras cobertas por testes, sem duplicar saque ou aceitar feitiços sem custo |
| **M3 — Biomas** | Regiões, perigos, terrenos, mapas por seed | Entrada/saída alcançáveis e coleta consistente em cada seed |
| **M4 — Cidades** | Nove cidades, vendedores, tutores, viagem | Economia/regiões consistentes e acessíveis no celular |
| **M5 — Cobertura visual** | Catálogo de monstros, magias, itens, receitas e NPCs | Distinguir `provisório`, `implementado` e `aprovado` por recurso |
| **M6 — Lançamento** | Saves, licenças, UX, desempenho, offline, regressões | QA de dispositivo e revisão humana antes de substituir o clássico |

Estes marcos são uma **sequência de trabalho**, não uma promessa de datas. O catálogo atual do Peren clássico é extenso; a cobertura gráfica integral não está pronta.

## Relatar falhas de maneira reproduzível

No **protótipo M1h-F**, após disponível no build atualizado: usar **Copiar diagnóstico** ou **Baixar diagnóstico**. O arquivo não é enviado automaticamente; o jogador decide se quer compartilhar. O relatório tem versão do build, viewport, status do combate, revisão/nível/dia do save de teste e eventos recentes; **não exporta** todo o inventário, jornal, seed, dados do jogo clássico ou saves anteriores.

Ao relatar crash, informar **a ação que o precedeu**, inimigo, navegador/dispositivo, se era o primeiro combate, se o jogo ficou preto ou congelado, e se o problema persiste após atualizar a página. **Não limpar cache/dados locais nem reinstalar sem backup**.

### Histórico verificável

- [PR #23](https://github.com/pedromaintenance/peren-o-bruxo/pull/23) — M1h-E, sprites procedurais alternativos; fonte ainda em revisão.
- [PR #24](https://github.com/pedromaintenance/peren-o-bruxo/pull/24) — M1h-F, sprites CC0, QA e desenvolvimento dos próximos incrementos.
- [PR #25](https://github.com/pedromaintenance/peren-o-bruxo/pull/25) — primeiro pacote isolado do Phaser para Pages.
- [PR #26](https://github.com/pedromaintenance/peren-o-bruxo/pull/26) — correção do encerramento de combate, já publicada.
- [PR #27](https://github.com/pedromaintenance/peren-o-bruxo/pull/27) — M1h-F.2: recompensas, retratos e diagnóstico no Pages; [QA online](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38838431413).
- [Fluxos de teste M1h-F](https://github.com/pedromaintenance/peren-o-bruxo/actions) — CI; verificar a execução específica antes de declarar uma revisão como aprovada.

**Regra para atualizar este arquivo:** cada incremento deve registrar escopo, estado real, critérios de aceite, PR/commit, ambiente publicado e pendências de QA, com linguagem que distinga claramente `source`, `bundle Pages` e `release clássico`.
