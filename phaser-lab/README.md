# Laboratório M1a — Mürin e movimento de Peren (Phaser 3)

**Isolado do Peren publicado:** o laboratório M1d pode ler uma cópia inicial de `peren_carcaca_save_v1`, mas nunca grava nessa chave. Combate, coleta, crafting e comércio já persistem em `peren_phaser_save_m1d_v1`, sem sincronização de volta ao jogo clássico. A evolução M1e substitui somente a arte do protagonista; M1f acrescenta uma galeria independente de revisão visual.

## Executar

```bash
cd phaser-lab
npm install          # conexão necessária só durante instalação
npm test             # seeds/rotas/colheita: sem navegador
npm run dev          # copia os sprites autorais e inicia Vite
npm run build        # empacota a dependência Phaser no bundle, sem CDN
npm run preview
```

Os assets do build são copiados pelo script Node `scripts/sync-assets.mjs`, da pasta canônica `phaser/assets` para `phaser-lab/public/art` (temporário e ignorado pelo Git). Basta Node instalado; não exige Python para jogar. Na versão distribuída, o bundle do Phaser precisa ser disponibilizado **localmente**, pois não é CDN.

## Controles

- PC: `WASD`/setas, `Shift` para correr, `E` ou `Espaço` para colher.
- Celular: arrastar no círculo inferior esquerdo, botões **Correr** e **Colher** à direita.
- **Gamepad Xbox (USB ou Bluetooth, mapeamento padrão do navegador):** analógico esquerdo ou direcional para andar; **RT**, **RB** ou **L3** para correr; **A/X** para colher/interagir; **Y** ou **View** abre a bolsa; **B** ou **Menu (☰)** pausa/retorna a Portomonte. Na cidade, direcional para escolher opções, **A** para confirmar, **B/Menu** para retomar a última expedição. Não necessita teclado depois da primeira ativação do controle.
- O navegador pode exigir apertar qualquer botão físico após conectar; alguns navegadores/dispositivos não expõem o controle pela Gamepad API. Desconectar zera o comando imediatamente, e uma zona morta de 20% evita deriva.
- Exibir a **Portomonte** pelo marco da saída, ou gerar outra floresta pelo menu.
- Cada mapa tem seed determinística (`?seed=murin-001`) e rota entre entrada e saída. Recursos são IDs de ingredientes oficiais do catálogo adaptado de Peren.

## Qualidade e limitações

- Peren: 4 direções × 8 ações × 4 frames = **128 frames**, atlas PNG com animações separadas. Visuais são **arte autoral de prova de conceito**, não aprovação artística final.
- Floresta: 8 pisos, 3 árvores, 6 props, rio, ponte, colisões estáticas, 33 nós de coleta e marcador de saída.
- Sistema atual da `main`: intocado. O inventário provisório não modifica o save existente.
- Sem monstros nem combate neste recorte M1a; incluir na próxima fatia quando a experiência de movimento estiver aprovada.
- Aprovado no script de QA de geração e rotas; execução em navegador/celular só marcada após Playwright e teste físico.

Documentação de contrato de controles, incluindo combate planejado: [`docs/09-gamepad-xbox.md`](../docs/09-gamepad-xbox.md).

## M1b — Criaturas animadas de Mürin

A branch `feature/phaser-m1b-criaturas` adiciona três espécies do catálogo existente,
seis patrulhas por mapa e encontros com **observação e recuo seguro**. Esses encontros
**não** oferecem XP nem loot ainda, pois a integração ao motor de combate clássico
está planejada para M1c. Ambiente: vegetação como cobertura, névoa limitando visão
e solo encharcado reduzindo deslocamento. Sem alteração do save da `main`.

Detalhes e testes em [`docs/10-m1b-criaturas.md`](../docs/10-m1b-criaturas.md).

## M1c — Batalha animada no Phaser

A PR M1c acrescenta cena JRPG com 3 monstros, animações, combate por turnos, 3 VFX e carteira de XP/loot **apenas de teste**. O Peren clássico e seu save ficam intactos. Em um encontro, toque **ENFRENTAR**; ataque, conjure, defenda, beba poção ou fuja; ao terminar, toque **RETORNAR**. Controles Xbox: A confirmar, B fuga, X poção, Y fogo, direcional/analógico para escolha.

Os catálogos de monstros e magias são as fontes das estatísticas, IDs e custos. A futura M1d extrairá o motor econômico compartilhado antes de permitir persistência real de loot e XP. Consulte `docs/11-m1c-combate.md`.


## M1d — Economia e progresso persistentes (PR #5)

O laboratório **importa uma cópia read-only** do save clássico `peren_carcaca_save_v1` na primeira execução. As vitórias, materiais, ouro, HP, MP, experiência, ações e receitas passam a ser gravados em **`peren_phaser_save_m1d_v1`**. O save clássico original nunca é sobrescrito nesta etapa. Existe um botão para exportar e importar **backup Phaser**.

No hub de Portomonte, **Oficinas** oferece receitas vinculadas ao catálogo real, **Comércio** compra suprimentos e **Vender** negocia itens já existentes na mochila; os preços e os requisitos de proficiência usam as fórmulas do jogo original. Coleta e saque possuem ledger persistente por mapa/instância para evitar duplicação após reload. **Descanse** para renovar ações antes de fabricar novamente.

Os catálogos de dados são copiados de `data/` para `phaser-lab/public/data/` na branch de integração e ficam empacotados com o build, sem dependência de API em runtime. `npm test` cobre 312 cenários, e a execução Playwright da M1d confirmou importação, coleta, vitória, fuga, crafting, compra, reload e preservação do save clássico em 390 e 360 px.

**Limites:** três monstros, três magias e uma zona ilustrada; não existe sincronização bidirecional com o PWA antigo. O Playwright não substitui Android e Xbox reais. As PRs são empilhadas; não mesclar esta branch diretamente em `main`. Veja [docs/12-m1d-progresso.md](../docs/12-m1d-progresso.md).

## M1f — Ateliê de sprites (PR empilhada sobre M1e)

Ao executar `npm run dev`, abra **http://localhost:5173/review.html** para comparar as animações reais do Peren e das três criaturas: direção, ação, quatro frames, escala e velocidade. `npm run build` também inclui `dist/review.html` no bundle, sem tocar no save. O site público somente receberá a galeria após revisão e publicação deliberada. Detalhes: `docs/13-m1f-galeria-sprites.md`.


## M1g — UI Premium / Portomonte (em desenvolvimento)

O planejamento de redesign visual está em [docs/14-m1g-ui-premium.md](../docs/14-m1g-ui-premium.md).
A fatia **M1g-A** acrescenta ui-theme.css, ui-portomonte.css e src/ui-hub.js, mantendo os IDs e eventos da tela atual: Floresta, Oficinas, Comércio, Inventário de leitura, Vender, Descansar, Gerar Floresta e backup. Tutores são mostrados como indisponíveis porque ainda não possuem integração Phaser, evitando menu com ação falsa.

O fundo cenográfico nesta fatia usa uma pintura de ambientação já existente no Peren clássico, **provisórias e não equivalentes ao padrão final das referências conceituais**. Roda em Vite e mantém peren_carcaca_save_v1 inalterado.

Para QA: npm test, npm run build, node scripts/prepare-demo.mjs, node scripts/portomonte-browser.mjs (requer Chromium instalado pelo Playwright).

## M1g-B — Inventário e equipamentos (branch de revisão)

A nova tela `#inventoryUI` abre pelo botão **Inventário** em Portomonte (tecla Y no Xbox conectado), separado de **Vender**. Lista itens reais do save Phaser por categoria, mostra descrições/quantidades, retrato, PV/PM/EXP e os únicos slots suportados — arma, armadura e relíquia. Nada é equipado, criado, vendido ou gravado por essa tela. X alterna categorias no Xbox, B fecha; Tab/setas/Esc no teclado e toque no celular. QA: `npm test`, `npm run build` e `node scripts/inventory-browser.mjs` com Chromium. Mais detalhes em [docs/15-m1g-b-inventario.md](../docs/15-m1g-b-inventario.md).

## M1g-C — Oficina de Alquimia e Criação

Em Portomonte, **Alquimia e Criação** abre uma tela própria que mostra receitas reais por estação, requisitos de proficiência, materiais possuídos e necessários, saída e contagem por lote. Criar executa exatamente uma transação do motor existente; ações e inventário persistem apenas no save Phaser. Arte vetorial provisória sem interface embutida: `public/scenes/portomonte-workshop.svg`.

Teclado (setas/Esc), Xbox (D-pad / A / B / X) e touchscreen. Veja [docs/16-m1g-c-alquimia.md](../docs/16-m1g-c-alquimia.md). Testes: `npm test`, `npm run build`, `node scripts/workshop-browser.mjs`.

## M1g-D — Comércio de Portomonte

**Comércio** abre a nova tela de mercado na aba **Comprar**; **Vender itens da bolsa** abre a aba **Vender**. O usuário pode consultar os mercadores oficiais Sofia, Jonathan e Alina, mas os produtos da tela correspondem aos suprimentos **comuns de Portomonte** já disponibilizados no M1d — o catálogo ainda não informa estoque individual. Preço, habilidades e transações usam `src/progress.js`. Quantidade de 1–99 (respeitando ouro e bolsa) é registrada como um batch atômico, conservando os mesmos preços progressivos por unidade.

Retratos e cenário vetoriais provisórios, sem textos/controles embutidos. Xbox D-pad navega, X alterna compra/venda, A confirma, B volta; toque e teclado também funcionam. Detalhes em [docs/17-m1g-d-comercio.md](../docs/17-m1g-d-comercio.md). QA adicional: `node scripts/marketplace-browser.mjs` após build com Chromium.

## M1g-E — HUD, encontros e batalha JRPG

O HUD da exploração agora exibe valores canônicos de Peren (PV/PM, nível, ouro), informações ambientais e coleta, sem bloquear o mapa. Os encontros usam retratos reais das criaturas de Mürin com opções Enfrentar e Recuar. A batalha usa painéis azul-petróleo/dourado, barras do jogador e inimigo, log e nomes/custos das três magias de `SPELLS`; a lógica continua em `combat.js` e `BattleScene`.

Os sete botões de combate conservam IDs e atalhos. Testes e capturas: `node scripts/adventure-browser.mjs` após build; `npm test` cobre os dados puros. Documentação: [docs/18-m1g-e-hud-combate.md](../docs/18-m1g-e-hud-combate.md). Arte M1e ainda provisória e sujeita à revisão visual.

## M1g-F — Auditoria da vertical slice (não é aprovação da arte)

A revisão de interface inclui correções no design system (barra EXP), nos alvos touch do combate (44px), no foco dos encontros e na orientação livre da PWA. A lógica de combate, o save clássico e os catálogos continuam inalterados.

Após `npm run build` e `node scripts/prepare-demo.mjs`, executar `node scripts/audit-package.mjs` para conferir manifesto, assets/offline, escopo do service worker e peso do pacote. Executar `node scripts/vertical-slice-audit.mjs` com Chromium instalado para obter 35 capturas (sete cenas, cinco resoluções incluindo paisagem) e métricas JSON de overflow, foco e alvos touch. `npm test` também verifica a razão de contraste dos tokens CSS pelo critério 4,5:1 para texto sobre os fundos definidos. O workflow `.github/workflows/phaser-m1g-f.yml` executa tudo e todas as regressões anteriores.

O relatório de lacunas entre conceito e jogo está em [docs/19-m1g-f-auditoria.md](../docs/19-m1g-f-auditoria.md). A direção artística e o hardware real precisam de aceite separado antes de qualquer merge/publicação.

## M1h-A — Peren grisalho, candidato artístico isolado

Depois de `npm install`, rode `npm run build`. Isso mantém o M1e intacto em `public/art/` e produz uma segunda versão do atlas completo (128 frames, 48×64) e dos três retratos em `public/art-m1h/`. Compare ambos em `/review.html?art=m1h`; para jogar com a nova paleta use `/?art=m1h`. Sem o parâmetro, mantém-se a versão anterior. Os saves e as regras não são modificados.

QA: `npm test` para preservação de PNG/canal alfa; `node scripts/peren-art-browser.mjs` após build; CI com regressões M1g-F. Veja [docs/20-m1h-a-peren-palette.md](../docs/20-m1h-a-peren-palette.md) para o que ainda impede essa arte de ser aprovada como definitiva (silhueta/chapéu, retratos e inspeção física).

## M1h-B — Peren sem chapéu (variante candidata)

A prévia de silhueta atualizada é ativada com `?art=m1hb`. O modo padrão mantém M1e, e `?art=m1h` mantém M1h-A. Use `review.html?art=m1hb` para inspecionar os 128 quadros, o cabelo prateado, a barba e os três retratos; o seletor do ateliê alterna as três versões.

O gerador `scripts/peren-m1hb-generator.mjs` produz os PNGs em `public/art-m1hb/` depois de gerar os assets M1e e M1h-A, mantendo todas as versões anteriores intactas. O teste `npm test` valida o alinhamento dos quadros e a preservação do corpo abaixo da linha 43; após `npm run build`, `node scripts/peren-m1hb-browser.mjs` testa as três variantes no navegador e `node scripts/peren-m1hb-preview.mjs` gera uma prancha com retratos e quatro direções.

A arte é um **candidato**, não um aceite final; consulte [docs/21-m1h-b-peren-silhueta.md](../docs/21-m1h-b-peren-silhueta.md) para a revisão manual pendente.

## M1h-C — acabamento de cabelo e barba de Peren

A nova variante **em revisão** pode ser testada sem afetar a arte padrão com `?art=m1hc` (jogo) ou `review.html?art=m1hc` (ateliê). O seletor oferece quatro estados: M1e original, M1h-A prateado, M1h-B sem chapéu e M1h-C refinado. Peren mantém manto escuro, cabelo/barba grisalhos, expressão austera e todas as 32 animações.

`scripts/peren-m1hc-generator.mjs` gera a pasta `public/art-m1hc/` a partir da candidata M1h-B, preservando os outros atlases e PNGs. O script altera apenas cor dos pixels já opacos na cabeça, e mantém cada pixel do corpo abaixo da linha 43, bem como o alfa do sprite inteiro.

Validação: `npm test`, `node scripts/peren-m1hc-preview.mjs` para uma prancha do antes/depois, `node scripts/peren-m1hc-browser.mjs` após build e CI da branch M1h-C. Documentação de aceite: [docs/22-m1h-c-peren-refino.md](../docs/22-m1h-c-peren-refino.md). Esta arte **não** está aprovada como padrão.
