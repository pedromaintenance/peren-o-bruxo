# Roadmap e critérios de aceite — Peren Phaser

O objetivo é entregar **qualidade e cobertura total, progressivamente**. O que não for concluído fica explícito no manifesto; placeholders não contam como asset aprovado.

## M0 — Fundação e auditoria [EM EXECUÇÃO]

- [x] Manter o mesmo repositório e proteger a `main` existente com branches.
- [x] Criar `phaser/develop` e `feature/phaser-fundacao`.
- [x] Documentar gameplay, arte, arquitetura, pipeline, cobertura, exploração, combate e segurança de save.
- [x] Gerar manifesto inicial dos IDs reais do catálogo com status `planejado`.
- [ ] Revisar e aprovar estilo artístico e escala de sprites no celular.
- [ ] Validar a execução do Phaser empacotado localmente sem rede em navegador de destino.
- [ ] Abrir PR da fundação contra `phaser/develop` após revisão.

## M1a — Movimento e coleta (fatia em feature/phaser-movimento) [EM EXECUÇÃO]

- [x] Criar sprite **autoral provisório** de Peren: 4 direções × 8 estados × 4 frames; validar atlas e clips por dados.
- [x] Criar o primeiro tileset original de Mürin e seus props; geração por seed, rio, ponte, saída alcançável, nós de coleta.
- [x] Integrar movimento direcional/Arcade Physics, joystick, corrida, câmera e coleta no laboratório Phaser isolado.
- [x] Testar geração determinística e alcance: 86 cenários/validações Node passaram localmente.
- [x] Criar workflow de build e teste visual Playwright para navegador remoto no GitHub Actions.
- [ ] Confirmar compilação Vite e Phaser empacotado no CI (dependências npm inacessíveis no container de desenvolvimento).
- [ ] Revisar arte, proporções e UX com screenshot de navegador + aprovação do usuário.
- [ ] Validar fps, toque e responsividade em dispositivo Android físico.

**Atenção:** M1a não encerra M1. Não inclui ainda inimigos, combate Phaser, magias animadas, crafting/economia integrada ou saves migrados. Detalhes: `docs/08-m1a-movimento.md`.

## M1b — Criaturas e encontros (feature/phaser-m1b-criaturas) [EM EXECUÇÃO]

- [x] Criar sprites e retratos únicos para Galho Infectado, Fungo Violeta e Ettercap (7 clips / 28 frames por criatura).
- [x] Distribuir seis patrulhas por seed, em locais acessíveis e longe da chegada/saída.
- [x] IA de patrulha, percepção com linha de visão, investigação, perseguição e recuo.
- [x] Névoa e vegetação alteram a detecção; terreno úmido altera deslocamento.
- [x] Encontro de observação e recuo seguro, sem economia, recompensas ou combate inventado.
- [x] Testes determinísticos e atlas verificados localmente.
- [ ] Compilação e teste real no Chromium pelo CI da branch M1b.
- [ ] Aprovação visual das criaturas e Playtest em dispositivo Android.

**Próxima PR M1c:** combate JRPG integrado às regras, três magias com FX e resolução idempotente de encontros. Detalhes: `docs/10-m1b-criaturas.md`.

## M1 — Portomonte + Floresta de Mürin (vertical slice)

- [ ] Importar lógica econômica atual e manter seus testes.
- [ ] Caminhada fluida com aceleração, colisões, joystick, teclado e câmera.
- [ ] Sprite definitivo de Peren (idle, andar 4 direções, correr, interagir, colher, sofrer dano, conjurar, atacar).
- [ ] Cenário de Portomonte (menu), retratos/ambientes dos 3 vendedores existentes e oficinas locais.
- [ ] Tileset/props definitivos de Mürin; coleta de ingredientes visíveis, feedback de inventário.
- [ ] Três monstros de Mürin com retrato, sprite e **animações próprias completas**.
- [ ] Batalha Phaser com ações, transição, animação de combate e 3 feitiços visuais distintos.
- [ ] Retorno seguro da batalha ao mesmo mapa; loot e XP idempotentes.
- [ ] Teste de 30 minutos no celular, reload em viagem e combate, alternar online/offline.

## M2 — Combate definitivo

- [ ] Apresentação JRPG com câmera, posição, turnos, alvo, VFX, SFX, dano, escudos, status, derrota, vitória.
- [ ] Interface paginada para grimório de centenas de magias.
- [ ] Assinaturas únicas das magias, com primeiro lote de 30 pronto e validado.
- [ ] Priorização dos bosses e dos inimigos associados às missões iniciais.
- [ ] Teste dos 354 feitiços, mesmo quando visuais ainda marcados como provisórios.

## M3 — Biomas e exploração procedural

- [ ] Dez zonas com estilos próprios (mar, bosque, mina, ruínas etc.) e mapas gerados por seed.
- [ ] Lógica de Ironwood adaptada: fogo, água, gelo, fumaça, vegetação, terreno frágil e efeitos de estado.
- [ ] IA de patrulha, perseguição, visão, fuga, detecção e zonas de perigo.
- [ ] Geração sempre com entrada/saída acessíveis, recursos coletáveis e sem softlocks.

## M4 — Nove cidades e pessoas

- [ ] Ilustração para cada cidade, cada oficina ativa e cada vendedor, com retratos e animações de interação.
- [ ] Treinamento com tutores mantido, sem regressão de custos ou progressão.
- [ ] Transições de viagem e ambientação regional; menus acessíveis no celular.

## M5 — Cobertura visual integral do catálogo

- [ ] 222 monstros: retrato, sprite e sete ou mais animações específicas, com especiais quando previstos.
- [ ] 354 magias: efeito distinguível por ID, sequências de conjuração e impacto.
- [ ] 2.785 itens: ícone individual; apresentação contextual (saque, uso, equipamento).
- [ ] 27 vendedores: retratos e visuais de interação; 9 cidades e 10 zonas: arte própria.
- [ ] 2.316 receitas: ingredientes e resultado visíveis, animação procedural de elaboração por receita.
- [ ] Revisão de legibilidade, desempenho e tamanho do download/cache.

## M6 — Lançamento / substituição progressiva

- [ ] Auditoria de licenças, arquivos órfãos, compressão, loading, uso de memória.
- [ ] Export/import e migração de saves 0.1.x.
- [ ] Playtest completo em dispositivo físico, incluindo PWA offline.
- [ ] Merge aprovado: `feature/*` → `phaser/develop` → PR de release → `main`.

**Regra:** não registrar trabalho como concluído apenas porque existe a referência de um asset no JSON; o arquivo, a animação, a integração e os testes precisam existir.


## M1c — Combate JRPG Phaser [CÓDIGO DA FATIA IMPLEMENTADO, TESTES EM ANDAMENTO]

- [x] Cena de batalha com sprites de Peren e dos 3 monstros de Mürin.
- [x] Ataque, defesa, poção, fuga e três magias com VFX PNG animados.
- [x] Recompensas XP/ouro/material com chave de idempotência por criatura e seed.
- [x] Carteira de QA em memória separada do save clássico.
- [x] Testes unitários contra duplicação de saque e 90 simulações de combate.
- [ ] QA Chromium e screenshots no GitHub Actions (avaliar antes do merge).
- [ ] Testes com controle Xbox real e aparelho Android.
- [ ] Adapter do save/economia real — a ser feito em M1d, sem alterar o Peren estável até ser aprovado.

Detalhes: `docs/11-m1c-combate.md`.

## M1d — Economia e progresso persistente no Phaser [EM VALIDAÇÃO]

- [x] Núcleo compartilhado puro `src/progress.js`: importa o save clássico (cópia), mantém os atributos/equipamento e salva numa chave versionada independente.
- [x] Coleta, combate, crafting, bolsa, mercados e descanso atuam sobre a mesma cópia persistente.
- [x] Registro de vitórias e coletas sem duplicação, restauração de backup e testes contra erro de disco/duas abas.
- [x] Testes de regressão e E2E de importação, jogo, craft, comércio e recarregamento preparados.
- [ ] Aprovar visualmente, concluir CI e playtest Android/Xbox físico.
- [ ] Não fazer merge na `main` ou sincronização bidirecional até a etapa de release.

Detalhes: `docs/12-m1d-progresso.md`.


## M1g — UI Premium + Portomonte (revisão visual incremental)

Direção artística: interfaces de JRPG pixel art, molduras douradas, painéis em azul-petróleo, retratos, HUD e cenas que reutilizam materiais do Peren clássico. As imagens conceituais aprovadas são metas, não assets prontos para usar como páginas estáticas.

- **M1g-A:** design system, hub funcional de Portomonte e QA visual mobile/desktop.
- **M1g-B:** inventário por categoria, equipamento com slots reais, seleção de itens.
- **M1g-C:** alquimia e oficinas com receitas/requisitos reais e feedback.
- **M1g-D:** comércio com retrato, comprar/vender, preços reais e controle por quantidade.
- **M1g-E:** HUD, modais de encontro e menu JRPG de batalha.
- **M1g-F:** integração, screenshot review, Android e Xbox reais, desempenho/PWA.

**Não juntar toda a milestone em uma PR:** fatias empilhadas, cada uma revisável.
O escopo operacional e critérios de aceite estão em [docs/14-m1g-ui-premium.md](14-m1g-ui-premium.md).
