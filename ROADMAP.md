# Peren, o Bruxo — Roadmap de desenvolvimento

> **Atualizado em 16/10/2026 (BRT).** Documento de acompanhamento das próximas entregas do jogo. Uma funcionalidade **implementada** não é necessariamente **publicada**, **validada** ou **aprovada artisticamente**.
>
> O plano detalhado original do Phaser permanece em [`docs/01-roadmap.md` na branch de desenvolvimento](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/01-roadmap.md). Este arquivo é o **índice executivo** mantido na `main`.

## Onde jogar e como o projeto está organizado

| Produto | Endereço | Estado |
| --- | --- | --- |
| **Peren clássico (HTML/JS)** | [Peren, o Bruxo](https://pedromaintenance.github.io/peren-o-bruxo/) | Publicado; referência estável, não substituir automaticamente |
| **Phaser M1h-F — protótipo** | [Jogar na Floresta de Mürin](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf) | Testável no Pages; **experimental**, save e cache próprios |
| **Ateliê M1h-F** | [Comparar animações](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/review.html?art=m1hf) | Teste visual dos três monstros |
| **Bancada de Teste M1h-F.6** | [Teste de Campo (Android / PWA / Xbox)](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/teste.html) | PR #32 mesclada na `main`; propagação e QA do Pages a verificar | 
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

## M1h-F.3 — Comparação direta de arte e PWA offline [PUBLICADO · REVISÃO ARTÍSTICA PENDENTE]

- **Comparador visual `compare.html`**: dois atlas reais (M1h-E à esquerda e M1h-F à direita), três criaturas de Mürin, sete ações sincronizadas, pausa, FPS, zoom e inspeção dos quatro quadros. **Estado: publicado no Pages**, pela [PR #28](https://github.com/pedromaintenance/peren-o-bruxo/pull/28); testes locais de Chromium e build passaram. A avaliação humana permanece pendente.
- **Parecer artístico voluntário**: checklist de silhueta a 1×, movimento, combate, identidade sombria, retrato e legibilidade, mais observações e escolha E/F. O usuário pode copiar ou baixar Markdown; sem gravar no `localStorage` e sem transmissão de dados.
- **Métricas técnicas**: comparação de quadros únicos e da proporção de pixels visíveis. Não substituem julgamento humano ou aprovação de estilo.
- **QA:** [comparador e PWA testados no Pages (success)](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38882157864), incluindo três criaturas × sete ações, dois tamanhos de tela (390×844 e 1280×800), navegação offline, saves preservados, seis vitórias e cenários de resiliência. O código dos testes permanece na [branch de fonte](https://github.com/pedromaintenance/peren-o-bruxo/tree/feature/phaser-m1h-f-free-assets/phaser-lab/scripts).
- **PWA offline: publicada e validada** — [PR #29](https://github.com/pedromaintenance/peren-o-bruxo/pull/29). Navegação usa a página HTML específica do cache antes do fallback do jogo; [testes de navegador offline no Pages passaram](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38882157864) para jogo, três criaturas, comparador, ateliê e bancada CC0, sem sobrescrever saves. **Ainda falta comprovação em Android físico**.
- **Gate final:** testar a página publicada, colher feedback humano e só então trabalhar no redesenho de cada criatura ou aprovar um atlas como padrão. **Nenhum sprite foi aprovado automaticamente.**

Documentação técnica: [docs/27-m1h-f-3-comparador.md](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/27-m1h-f-3-comparador.md).

## Próxima prioridade — Refinamento artístico por criatura (M1h-F.4 / M1i-A)

- [x] Três monstros de Mürin com **7 ações × 4 quadros** de atlas `256×448`, retratos `160×160` e assets gratuitos com origem rastreada; opção `?art=m1hf`.
- [x] Galho Infectado: base de vegetação CC0; raízes, galhos e seiva corrompida.
- [x] Fungo Violeta: base Kenney CC0; chapéu, micélio e esporos violetas.
- [x] Ettercap: poses Kenney CC0, múltiplos olhos, membros e carapaça retocados.
- [ ] Revisar a **legibilidade a 1× e 2×**, silhuetas, frames de ataque/sofrimento/morte, paleta escura e unidade estética de Mürin.
- [ ] Aprovar **em jogo**, não apenas por captura de atlas; corrigir quaisquer elementos que pareçam sprites de plataforma infantil.
- [ ] Revisar efeitos e retratos nas telas de encontro e combate, incluindo contraste em telas OLED e celulares pequenos.
- [ ] Auditar licenças/atribuição e transformação por arquivo; referências: [documentação dos assets M1h-F](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/26-m1h-f-audicao-kenney-cc0.md).
- [ ] Não fazer merge do novo padrão gráfico antes de aprovação explícita.

## M1h-F.4 — Resgate de save experimental [PUBLICADO · QA ONLINE APROVADO]

A versão M1h-F.4 está **publicada no Pages** via [PR #30](https://github.com/pedromaintenance/peren-o-bruxo/pull/30). A recuperação segura de saves danificados foi testada em Chromium **390×844** e **1280×800** [diretamente no site público](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38951388551). O jogo clássico e a demo estável permanecem separados.

| ID | Critério de aceite | Estado |
| --- | --- | --- |
| F4-01 | Se o save da prévia não abrir, mostrar tela de recuperação **sem excluir dados** nem iniciar Phaser com progresso inválido | **Publicado no Pages, QA aprovado** — PR #30 |
| F4-02 | Oferecer download do save bruto danificado antes de restaurar ou reiniciar; somente ação explícita e confirmação do jogador | **Publicado, teste de download e confirmação aprovado** — PR #30 |
| F4-03 | Validar backup Phaser v2 (até 2 MB), recusar arquivo inválido sem sobrescrever o anterior, evitar concorrência entre abas | **Publicado; validação de backup e conflitos passou no Pages** — PR #30 |
| F4-04 | Preservar `peren_carcaca_save_v1` e `peren_phaser_save_m1d_v1`; reset afeta somente `peren_phaser_save_m1hf_preview_v1` | **Publicado; isolamento das chaves comprovado no QA** — PR #30 |
| F4-05 | Testes Chromium em 390×844 e 1280×800: baixar original, restaurar, resetar, cancelar, simular conflito e retornar ao jogo | **Aprovado** — [build](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38951389055) e [QA online](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38951388551) |
| F4-06 | Playtest real Android: download TXT, importação JSON, PWA instalada, armazenamento indisponível/quota | **Pendente de teste físico** |

**Documentação de implementação:** [M1h-F.4 — resgate de save](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/28-m1h-f-4-resgate-save.md).

**Gate de publicação cumprido:** Node/Vite/Chromium verde, [PR #30](https://github.com/pedromaintenance/peren-o-bruxo/pull/30) modificou apenas 3 arquivos em `phaser-demo-m1hf/`, e o [QA online](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38951388551) repetiu combates, PWA offline, comparador e resgate. **A fonte da PR #24 permanece em draft**. Nenhum save real de jogador foi usado no QA.

## M1h-F.5 — Diário de Peren [PUBLICADO · QA ONLINE APROVADO]

Esta entrega dá significado aos acontecimentos de Portomonte e Mürin sem fabricar conteúdo narrativo, inventário, recompensas ou missões.

| ID | Entrega e critério verificável | Estado |
| --- | --- | --- |
| F5-01 | **Diário de Peren**, aberto a partir de Portomonte apenas na prévia M1h-F, com dia, nível, vitórias, ofícios e localização atuais | **Publicado** — [PR #31](https://github.com/pedromaintenance/peren-o-bruxo/pull/31) |
| F5-02 | Crônicas originais do save (até 90) e transações recentes (até 80), com nome real de item/monstro e revisão; não inventar horário nem contagem integral | **Publicado** — testes do modelo aprovados |
| F5-03 | Filtros Combates, Coletas, Ofícios, Comércio e Outros; busca insensível a acentos e caixa; acessível em celular e desktop | **Publicado**, [QA no Pages aprovado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38957598003) em 390×844 e 1280×800 |
| F5-04 | Exportar o diário como Markdown `.md` **somente por iniciativa do jogador**; abrir, filtrar, baixar e fechar **não altera o save** | **Publicado**, download Markdown e isolamento das chaves confirmados no QA |
| F5-05 | Teclado Escape, foco acessível e controle Xbox B/Start para fechar, esquerda/direita para alternar aba; retorno seguro a Portomonte | **Publicado**, Escape e foco aprovados em Chromium; controle físico pendente |
| F5-06 | Repetir os testes de batalha, inventário, PWA offline e recuperação de save antes de publicar bundle isolado | **Aprovado** — [CI de build](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38957869361) + [QA online](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38957598003) |
| F5-07 | Teste **Android físico**: rolagem, busca com teclado virtual, exportação Markdown, instalação PWA e uso do controle real | **Pendente de playtest** |

**Fonte/documentação:** [docs/29-m1h-f-5-diario.md](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/29-m1h-f-5-diario.md) · [PR #24](https://github.com/pedromaintenance/peren-o-bruxo/pull/24).

**Gate de publicação cumprido:** [PR #31](https://github.com/pedromaintenance/peren-o-bruxo/pull/31), com apenas **4 arquivos em `phaser-demo-m1hf/`**; [CI do bundle aprovado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38957869361); [QA online aprovado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38957598003) para Diário, seis vitórias, resiliência, recuperação de saves, comparador e PWA offline. O código-fonte continua na PR #24 em *draft*. A arte não foi promovida automaticamente. **Playtest Android físico e gamepad real pendentes.**

## M1h-F.6 — Bancada de Teste de Campo [PUBLICADA NO REPOSITÓRIO · PLAYTEST FÍSICO PENDENTE]

Em 16/10/2026 foi mesclada a [PR #32](https://github.com/pedromaintenance/peren-o-bruxo/pull/32). O diff foi conferido: **somente** `phaser-demo-m1hf/index.html`, `phaser-demo-m1hf/demo-sw.js` e o novo `phaser-demo-m1hf/teste.html` foram alterados. **Não** substitui o jogo clássico nem modifica o motor, saves ou catálogos.

| ID | Entrega e critério de aceite | Estado |
| --- | --- | --- |
| F6-01 | Checklist responsivo com nove cenários (cidade, toque, combate, backup, diário, recuperação, PWA offline, Xbox e arte), marcação **Passou / Falhou / Não testado** | **Código publicado em `main`** — PR #32 |
| F6-02 | Copiar/baixar relatório Markdown mediante clique; sem envio, armazenamento local, coleta de save ou telemetria | **Implementado**; sintaxe JS e fluxos de marcação, cópia e download verificados em teste de DOM simulado |
| F6-03 | Link visível no rodapé de Portomonte; abrir jogo, comparador e ateliê em outra aba para preservar respostas não exportadas | **Implementado** — somente prévia M1h-F |
| F6-04 | Precache de `teste.html` e nova versão do cache de SW **com prefixo exclusivo M1h-F**, sem excluir caches de outros aplicativos | **Implementado** — resta validar modo avião em aparelho físico |
| F6-05 | Fonte do guia mantida em `phaser-lab/teste.html`, build isolado via `prepare-demo.mjs`, teste Node e documento técnico | **Implementado na branch fonte** — [docs/30-m1h-f-6-playtest.md](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/30-m1h-f-6-playtest.md) |
| F6-06 | CI de Node/Vite/Chromium e verificação da página publicada (inclusive offline), em 390×844 e 1280×800 | **Pendente de confirmação**; não declarar QA público aprovado somente porque houve merge |
| F6-07 | Android físico: touch, teclado virtual, downloads/cópia, PWA instalada, backup e controle Xbox físico | **Pendente de teste humano** |

**Abrir para teste:** [Jogar M1h-F](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf) · [Bancada de Teste](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/teste.html).

**Regra para o usuário:** manter a bancada aberta em outra aba, preencher o formulário e exportar antes de recarregar/fechar (as respostas não persistem por decisão de privacidade). **Não limpar dados do site**; saves do jogo ficam no dispositivo. A bancada **não certifica** a instalação/PWA/arte: reúne evidência para avaliação.

## M1h-F.7 — Manual da Expedição e saneamento do QA de Portomonte [PUBLICADO · QA ONLINE APROVADO]

**Entregue em 16/10/2026** pela [PR #33](https://github.com/pedromaintenance/peren-o-bruxo/pull/33). Somente a prévia estática `phaser-demo-m1hf/` foi alterada (bundle JS/CSS, `index.html` e `demo-sw.js`); a [PR #24](https://github.com/pedromaintenance/peren-o-bruxo/pull/24) de fonte continua em *draft*. O Peren clássico e a demo M1d permanecem separados.

| ID | Entrega / critério de aceite | Estado |
| --- | --- | --- |
| F7-01 | Corrigir teste de Portomonte antes quebrado por contagem fixa dos botões (`7 !== 6`): conferir comandos visíveis/habilitados, Diário e Manual em 360×800, 390×844 e 1280×800 | **Aprovado** — [Portomonte CI](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38963244393), mais [alquimia](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38963244476) e [HUD](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38963244585) |
| F7-02 | Manual no menu de Portomonte: **Explorar**, **Combate**, **Portomonte** e **Saves e testes**, sem inventar missões ou alterar regras | **Publicado no Pages** — PR #33; [QA público passou](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38964866686) |
| F7-03 | Navegação por toque, teclado (Escape/foco), Xbox (B/Menu/direcional); modal acessível e foco devolvido ao fechar | **QA automatizado em Chromium aprovado** (390×844 e 1280×800); **controle físico pendente** |
| F7-04 | Manual exclusivamente leitura; não acessa nem altera o save e oferece link voluntário para Bancada M1h-F.6 | **Aprovado** — testes Node e teste público de preservação do save |
| F7-05 | CI Node/Vite/Chromium e bundle isolado publicados; QA no site real cobrindo seis vitórias, erro/derrota/fuga, inventário, comparador, Diário, recuperação e PWA offline | **Aprovado** — [build candidato](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38963137694), [QA público](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38964866686) |
| F7-06 | Playtest **Android físico**, gamepad Xbox real e aprovação artística dos três monstros de Mürin | **Pendente de teste humano**, não substituir por aprovação de CI |

**Jogar e avaliar:** [Peren Phaser M1h-F.7](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf) · [Bancada de Teste](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/teste.html) · [Comparador artístico](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/compare.html?art=m1hf).

**Documentação:** [docs/31-m1h-f-7-manual.md](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/31-m1h-f-7-manual.md). A prévia foi validada publicamente, mas **não é o lançamento definitivo do Phaser**.

## M1h-F.8 — Leitura tática da Floresta de Mürin [PUBLICADA · REVALIDADA NO QA M1h-F.9]

**Publicação:** [PR #34](https://github.com/pedromaintenance/peren-o-bruxo/pull/34) mesclada em 16/10/2026, contendo exclusivamente o bundle de `phaser-demo-m1hf/` (JS/CSS, `index.html`, `demo-sw.js`). O jogo clássico, o protótipo M1d e seus saves permanecem separados. A PR de fonte #24 permanece em *draft*.

| ID | Entrega / critério | Estado |
| --- | --- | --- |
| F8-01 | Exibir **Passos contidos**, **Sob cobertura**, **Passos ruidosos**, **Rastros recentes** e **Caçado** durante a exploração | **Publicado no Pages** — PR #34 |
| F8-02 | Informar folhagem, corrida, solo encharcado e neblina sem revelar monstros ocultos nem alterar `canDetect` | **Implementado e testado** — função pura e sinais do motor |
| F8-03 | HUD compacto para celular, sem telemetria, novas regras ou escrita de save | **Implementado**; comportamento testado em Chromium |
| F8-04 | Testes Node, Vite, seis vitórias, resiliência, três viewports (360×800, 390×844, 1280×800) e saves isolados | **Aprovado no bundle candidato** — [GitHub Actions: success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38966068315) |
| F8-05 | Repetir a bateria no endereço público, incluindo o indicador, Diário, recuperação e PWA offline | **Aprovado na revisão posterior** — [QA público completo M1h-F.9](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38967851147) cobriu leitura tática e os fluxos anteriores; a execução antiga foi iniciada antes da atualização da página e falhou na espera de publicação |
| F8-06 | Validar Android físico, Xbox real, contraste OLED e linguagem visual | **Pendente de playtest humano** |

**Jogar:** [Peren M1h-F.8](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf) · [Bancada de Teste](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/teste.html).

**Documentação:** [docs/32-m1h-f-8-percepcao.md](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/32-m1h-f-8-percepcao.md). Nenhuma criatura ou sprite foi aprovado artisticamente por esse incremento.

## M1h-F.9 — Coleta contextual [PUBLICADA · QA PÚBLICO APROVADO]

**Publicada em 16/10/2026**, via [PR #35](https://github.com/pedromaintenance/peren-o-bruxo/pull/35) (squash `a7781c4`). A ação `collect()` usa `nearestResource()` com alcance estrito de **57 px**; o feedback novo apenas mostra o alvo já disponível, sem ampliar o alcance, oferecer vantagens extras ou modificar inventário.

| ID | Entrega e critério | Estado |
| --- | --- | --- |
| F9-01 | Indicador **“Ao alcance: nome · quantidade”** sobre o botão Colher, somente para recursos próximos e ainda não coletados | **Publicado na prévia Phaser M1h-F** |
| F9-02 | Destaque visual e `aria-label` contextual, sem bloquear Colher, teclado ou Xbox fora do alcance | **Implementado e testado no candidato** |
| F9-03 | Sinal volátil `registry.harvestCue`, nenhum armazenamento novo ou alteração da transação de coleta | **Verificado** — invariantes de fontes e QA de isolamento |
| F9-04 | Testes Node da mesma borda de 57 px, seeds, recursos já coletados; Chromium em 360×800, 390×844 e 1280×800 com isolamento dos saves | **Aprovado** — [CI do pacote candidato](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38967845101) |
| F9-05 | Publicação exclusiva do bundle `phaser-demo-m1hf/`, diff JS/CSS/índice/SW auditado | **Concluída** — PR #35, sem alterar clássico ou M1d |
| F9-06 | QA no site público de coleta contextual, seis vitórias, Diário, recuperação e PWA offline | **Aprovado** — [QA público após release (success)](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38967851147), Chromium 360/390/1280 px para coleta e 390/1280 px para fluxos gerais |
| F9-07 | Android e Xbox físicos; legibilidade do HUD e aprovação artística | **Pendente de playtest humano** |

**Teste:** [Peren M1h-F.9](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf) · [Bancada de Teste](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/teste.html). **Documentação:** [docs/33-m1h-f-9-coleta.md](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/33-m1h-f-9-coleta.md). Fonte permanece na PR #24 *draft*.

## M1h-F.10 — Marcos da Trilha / orientação para Portomonte [PUBLICADA · QA PÚBLICO APROVADO]

**Publicação 16/10/2026:** [PR #36](https://github.com/pedromaintenance/peren-o-bruxo/pull/36), commit de release `198e54a`. A alteração afeta **somente a prévia Phaser M1h-F** em `phaser-demo-m1hf/`: JS/CSS compilados, índice e cache offline. O jogo clássico, a demo M1d e os respectivos saves permanecem separados.

| ID | Entrega / aceite | Estado |
| --- | --- | --- |
| F10-01 | Orientação real pela trilha existente (tiles 5/6), ponte e saída, sem GPS nem teleporte | **Publicada no Pages** na prévia Phaser, sem alterar mapa e IA |
| F10-02 | Indicar **Trilha de Mürin**, **Ponte de Mürin**, **Retorno a Portomonte**, **Fora da Trilha** e **Retorno à Vista** | **Concluído**, pistas qualitativas sem revelar inimigos |
| F10-03 | Atualizar HUD por célula percorrida sem escrever no save ou alterar `returnBtn` | **Concluído**; processamento e estados voláteis |
| F10-04 | Node/Vite/Chromium para três viewports (360×800, 390×844, 1280×800), ponte, saída e 3 saves separados | **Aprovado** — [CI de build M1h-F.10](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38984329094) |
| F10-05 | Revisar diff e publicar só `phaser-demo-m1hf/` via PR própria | **Aprovado** — [PR #36](https://github.com/pedromaintenance/peren-o-bruxo/pull/36), quatro mudanças lógicas, sem alterar clássico/M1d |
| F10-06 | QA no Pages após o merge: trilha, combate, Diário, backup, resgate e PWA offline | **Aprovado** — [QA público completo, success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38984333862); marcos e saves em Chromium 360×800, 390×844 e 1280×800 |
| F10-07 | Playtest Android físico, Xbox e revisão de legibilidade/atmosfera | **Pendente de avaliação humana** |

**Testar:** [Peren M1h-F.10 no Pages](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf) · [Bancada de Testes](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/teste.html).

**Especificação:** [docs/34-m1h-f-10-trilha.md](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/34-m1h-f-10-trilha.md). A PR #24 de fonte permanece em *draft*; não mesclar diretamente na `main`.

## M1h-F.11 — Instinto do Bruxo / leitura pré-combate [PUBLICADA · QA PÚBLICO APROVADO]

**Publicado em 16/10/2026** via [PR #37](https://github.com/pedromaintenance/peren-o-bruxo/pull/37), commit `d43ff5e`. O pacote altera **exclusivamente `phaser-demo-m1hf/`**: JS/CSS compilados com hash, `index.html` e `demo-sw.js`. A PR #24 de fonte permanece *draft*, e o jogo clássico e a demo M1d não foram alterados.

| ID | Entrega / aceite | Estado |
| --- | --- | --- |
| F11-01 | Leitura das três criaturas reais (sentinela, esporos, caçador), com percepção e velocidade derivadas de `MURIN_BEASTS` | **Publicada na prévia**, sem mudanças na IA |
| F11-02 | Exibir PV, PM e poções reais e gravidade informativa dos ferimentos antes da decisão | **Publicada**; leitura não prevê vitória |
| F11-03 | Preservar retrato, Enfrentar/Recuar, Escape/Tab, toque e Xbox, sem escrever no save | **Concluído**; mesmo fluxo de combate/recuo |
| F11-04 | Node/Chromium em 360×800, 390×844, 1280×800, três espécies, recuo e saves isolados | **Aprovado** — [build e testes do candidato, success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38988750958) |
| F11-05 | Isolar a release em `phaser-demo-m1hf/` e auditar o diff | **Concluído** — [PR #37](https://github.com/pedromaintenance/peren-o-bruxo/pull/37), quatro alterações lógicas |
| F11-06 | Repetir QA público após o merge: pré-combate, seis vitórias, resiliência, Diário e PWA offline | **Aprovado** — [QA público do Pages, success](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38988750962): três criaturas, recuo, combate, Diário, resgate, PWA e saves isolados |
| F11-07 | Testar legibilidade, atmosfera e comandos em Android/Xbox físicos | **Pendente de playtest humano** |

**Jogar:** [Peren Phaser M1h-F.11](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf). **Fonte/limites:** [docs/35-m1h-f-11-encontros.md](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/35-m1h-f-11-encontros.md).

## M1h-F.12 — Impacto e dano legível no HUD de combate [FONTE IMPLEMENTADA · CI/RELEASE PENDENTES]

O Phaser já exibe números de dano nos sprites e possui barras de PV, mas o HUD não destacava o **quanto de vida foi perdido ou recuperado**. A M1h-F.12 adiciona pequenos sinais **−X PV** e **+X PV** ao lado das barras reais do combate; a matemática da batalha, os efeitos e as recompensas **não mudam**.

| ID | Entrega / critério | Estado |
| --- | --- | --- |
| F12-01 | Ler diferenças entre snapshots públicos de PV, somente para a mesma chave de encontro, sem calcular dano | **Implementado na fonte** — `battle-impact.js` |
| F12-02 | Indicadores de dano/cura no HUD de Peren e do inimigo, com duração de 1 s, layout mobile e `prefers-reduced-motion` | **Implementado na prévia M1h-F**, sem alterações na cena ou IA |
| F12-03 | Limpar indicadores no fim do combate ou troca de encontro; nenhum write em save, alteração de progressão ou controles | **Implementado** |
| F12-04 | Testes Node para dano, cura, reinício de encontro, dados inválidos; Chromium 360×800, 390×844, 1280×800 com salva clássico/M1d/prévia separados | **Testes criados**, aguardando CI |
| F12-05 | Publicação seletiva exclusiva do bundle `phaser-demo-m1hf/` após build/Chromium verde e diff auditado | **Pendente**, sem alterar clássico, M1d ou PR #24 draft |
| F12-06 | QA público de impacto, seis vitórias, resiliência, Diário, save rescue e PWA offline | **Pendente** |
| F12-07 | Validação física Android/Xbox, legibilidade e aprovação artística | **Pendente de playtest humano** |

**Documento:** [docs/36-m1h-f-12-impacto.md](https://github.com/pedromaintenance/peren-o-bruxo/blob/feature/phaser-m1h-f-free-assets/docs/36-m1h-f-12-impacto.md). **Após release:** [prévia Phaser M1h-F](https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/?art=m1hf).

## Vertical slice — M1 (Portomonte ↔ Floresta de Mürin)

| Sistema | Implementação atual | Critério restante |
| --- | --- | --- |
| Movimentação, coleta, seed e colisão | Protótipo Phaser; vários testes automatizados | Teste em dispositivo, mapa sem softlock, frames por segundo reais |
| Encontros e IA | Galho, Fungo, Ettercap; névoa, recuo e perseguição | Tunar detecção, feedback de ameaça, prevenção de encontro imediato após fuga |
| Combate JRPG | Ataque, defesa, poção, fuga, três magias e FX | UX, balanceamento, status, travamentos em dispositivo |
| Persistência | Bridge transacional, IDs canônicos, ledger idempotente e backup | Recuperação amigável quando `localStorage` estiver cheio/corrompido, migração formal |
| Portomonte, bolsa e economia | Oficina, comércio, inventário e **Diário de Peren** com filtros e exportação de registros reais no Pages | Auditoria de acessibilidade mobile, controle físico e economia ponta a ponta |
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
- [PR #28](https://github.com/pedromaintenance/peren-o-bruxo/pull/28) — M1h-F.3: comparador visual sincronizado de monstros, checklist e parecer Markdown. Publicado na pasta experimental.
- [PR #29](https://github.com/pedromaintenance/peren-o-bruxo/pull/29) — roteamento offline corrigido para as páginas da PWA; [QA real online/offline](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38882157864) aprovado no Chromium.
- [PR #30](https://github.com/pedromaintenance/peren-o-bruxo/pull/30) — M1h-F.4: resgate seguro de save danificado no protótipo experimental. [Build](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38951389055) e [QA público](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38951388551) aprovados; Android físico pendente.
- [PR #31](https://github.com/pedromaintenance/peren-o-bruxo/pull/31) — M1h-F.5: Diário de Peren, filtros, registros reais e exportação Markdown. [CI](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38957869361) e [QA público](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38957598003) aprovados; Android físico pendente.
- [PR #32](https://github.com/pedromaintenance/peren-o-bruxo/pull/32) — M1h-F.6: Bancada de Teste de Campo e precache isolado; fonte em #24, QA Android ainda pendente.
- [PR #33](https://github.com/pedromaintenance/peren-o-bruxo/pull/33) — M1h-F.7: Manual da Expedição integrado à prévia e correção de QA; [build](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38963137694) e [QA ao vivo](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38964866686) aprovados.
- [PR #34](https://github.com/pedromaintenance/peren-o-bruxo/pull/34) — M1h-F.8: HUD de discrição e leitura do ambiente, [CI de build e Chromium aprovado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38966068315); [revalidada no QA público da M1h-F.10](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38984333862).
- [PR #35](https://github.com/pedromaintenance/peren-o-bruxo/pull/35) — M1h-F.9: coleta contextual por raio real de 57 px, [build/Chromium aprovado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38967845101) e [QA público completo aprovado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38967851147).
- [PR #36](https://github.com/pedromaintenance/peren-o-bruxo/pull/36) — M1h-F.10: Marcos da Trilha publicados no Pages, [CI de build/Chromium aprovada](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38984329094) e [QA público completo aprovado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38984333862).
- [PR #37](https://github.com/pedromaintenance/peren-o-bruxo/pull/37) — M1h-F.11: Instinto do Bruxo; [CI Node/Vite/Chromium aprovada](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38988750958) e [QA público completo aprovado](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38988750962).
- [Fluxos de teste M1h-F](https://github.com/pedromaintenance/peren-o-bruxo/actions) — CI; verificar a execução específica antes de declarar uma revisão como aprovada.

**Regra para atualizar este arquivo:** cada incremento deve registrar escopo, estado real, critérios de aceite, PR/commit, ambiente publicado e pendências de QA, com linguagem que distinga claramente `source`, `bundle Pages` e `release clássico`.
