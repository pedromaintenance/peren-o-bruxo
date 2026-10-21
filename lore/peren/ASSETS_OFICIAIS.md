# Peren Kerrhylon — identidade visual oficial (pacote recortado v1)

**Decisão do criador:** o ZIP `Peren_Kerrhylon_Assets_Recortados(1).zip`, fornecido em 21/10/2026, é a **referência visual canônica de Peren Kerrhylon** para futuras interfaces, retratos, cenas e sprites do jogo. Essa aprovação não representa, por si só, integração binária ao repositório nem animações prontas.

**Integridade da fonte (ZIP recebido):** SHA-256 `b8947630076d39f4b50a44d50d151088a00ba7e9cfbb84112310a780a9d01e20`. Origem declarada pelo `LEIA-ME.md` do pacote: concept sheet `1536 × 1024` px. A versão completa entregue contém **67 arquivos**: 62 PNG, 3 JPG, 1 JSON e 1 Markdown. A listagem e coordenadas exatas estão no `manifest.json` incluído no ZIP, que deve acompanhar os binários quando importados.

## Definição artística aprovada

- **Corpo e caracterização:** traje escuro em pixel art com manto ornamentado em dourado, cabelo escuro volumoso, olhos azuis de efeito sobrenatural, brincos, pendente e cintos/amuletos. O detalhe do olho estrelado está documentado em `detalhes/01_olho_estrelado.png`.
- **Ator inteiro:** `actor/peren_actor.png` (486 × 991, fundo transparente), idêntico em bytes a `actor/peren_corpo_inteiro_transparente.png`.
- **Retrato principal:** `retrato/peren_portrait.png` (357 × 420, fundo removido), idêntico em bytes a `retrato/peren_rosto_transparente.png`. O retrato com moldura permanece disponível no pacote.
- **Expressões:** seis recortes separados, com versões originais e atlas `expressoes/peren_expressoes_6_frames.png` (672 × 116). São referências para conversa, menus e ilustrações narrativas; não substituem arbitrariamente a atuação facial no motor.
- **Poses:** 18 sprites `charset/individual/`, com cópias de enquadramento uniforme em `charset/alinhados/` (160 × 190 cada), pés alinhados.
- **Catálogo 6 × 3:** `charset/atlas/peren_atlas_6x3_160x190.png` (960 × 570), **atlas de poses**, não sprite sheet funcional de animações em quatro direções.

## Contrato técnico para a integração

1. Preservar os PNGs oficiais como **masters** com pixels, proporções, cores, canal alfa e nomes originais. Evitar interpolação bilinear, contornos suavizados e repintura sem nova aprovação. Renderizar pixel art com nearest-neighbor quando houver escala.
2. O motor usa quadros 48 × 64 em 32 ciclos (128 frames) para quatro direções. **O atlas runtime foi agora adaptado** a partir das poses fornecidas, mantendo o contrato dos índices. **Não afirmar animação original completa:** a fonte contém cinco passos à esquerda; a direita é espelhada, as demais ações/direções reutilizam poses, ainda sem aprovação artística final da interpolação.
3. Arquivos originais continuam no ZIP e devem ser preservados. As **derivações runtime** versionadas em `phaser-demo-m1hf/art/characters/peren/official-v1/` não substituem masters. O script `ferramentas/gerar_peren_runtime.py` reproduz redução nearest-neighbor e quantização de 128 cores. Novas animações autorais ainda dependem de aprovação própria.
4. Usar as derivações oficiais no **Modo Livre**: personagem jogável do Phaser, retratos de HUD/cidade/inventário, apresentação e ficha/combatente do clássico. Não estender o rosto antigo grisalho ou chapéu à versão canônica.
5. A designação de arte oficial vale para Peren no **único sandbox**. Sua condição changeling informa o design do personagem, mas outras personas/disfarces requerem assets ou regras próprias.
6. **Preservação:** não modificar saves, economia, magia, combates nem o protótipo clássico como efeito colateral da troca de retratos; snapshots e testes em mobile/Desktop/PWA e cache offline são obrigatórios ao publicar.

## Situação do projeto

| Entrega | Estado |
| --- | --- |
| Aprovação do estilo, rosto, roupa e poses fornecidos | **Oficial — aprovação expressa do criador** |
| Inventário das 67 entradas e documentação do atlas | **Conferidos a partir do ZIP** |
| Binários PNG/JPG originais inseridos no GitHub | **Não**: os masters continuam no ZIP original entregue pelo criador |
| Retrato oficial nas interfaces | **Integrado no código do jogo único**, em todos os retratos Phaser e clássico; 128×151 e 256×256 derivados do PNG oficial. QA de navegador e aprovação visual final pendentes. |
| Compatibilização para animações Phaser | **Implementado tecnicamente**: 128 quadros a 48×64 (16 colunas × 8 linhas) derivados das poses aprovadas, substituindo a arte anterior. Os ciclos de ações sem quadros específicos são reutilizações; movimento artístico ainda precisa de QA/aprovação. |
| Testes de regressão e aprovação visual no jogo | **CI Node/Chromium aprovado** — [PR #56](https://github.com/pedromaintenance/peren-o-bruxo/pull/56), [execução](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/39596963545). Aprovação visual em celular e novos frames de animação ainda pendentes. |

**Referências de integridade para futuras importações:**

- `actor/peren_actor.png` SHA-256: `90616e14fd078b34394562464a9624fc12d143d88a41b3ae5271f90b8ceec631`.
- `retrato/peren_portrait.png` SHA-256: `03169c033a3a7d3113d58d54001f9a0033a3612ace509ff71d1c352bd73aa79c`.
- `charset/atlas/peren_atlas_6x3_160x190.png` SHA-256: `f071439a066d0c2de13f4ec1e1bcff645a8b2e20a7779fd20ec86d7a2842ef09`.

> A documentação aqui não incorpora, hospeda, comprime novamente, publica nem certifica os binários do arquivo original. A fonte aprovada continua sendo o ZIP entregue; cada recurso integrado deverá ter proveniência e hash verificáveis.

## Adaptação de interface — retrato usado no jogo único

O recurso `phaser-demo-m1hf/art/characters/peren/official-v1/portrait-runtime.svg` embute uma miniatura PNG derivada do `retrato/peren_portrait.png` do ZIP oficial por **redução nearest-neighbor** para `64 × 75` e quantização a 64 cores (sem inventar desenho). O PNG interno tem 2.614 bytes, SHA-256 `9590186585eb9f145b1a1dbf6bdd14f36fdaecd2aefa1dfff05d0121a4baafa3`, e fica autocontido para PWA offline. É uma **derivação para interface**, não substituto da arte mestre. Não recolorir ou reinterpretar manualmente esse arquivo. Mantenha o sprite atlas de 48×64 em uso até existir atlas canônico de 4 direções com QA artístico próprio.
\n## Derivações de runtime introduzidas em 21/10/2026\n\nOs PNGs do ZIP permanecem intactos fora do Git; os seguintes PNGs **derivados e integrados ao repositório principal** vêm exclusivamente do arquivo aprovado, sem mistura com o retrato antigo de cabelo grisalho:\n\n- `peren-portrait-official-128.png` — 128×151, SHA-256 `bee005e98fef9a28efaec797f1abbf4a7cea26495a81f26ab899918d7c0a7d10`.\n- `peren-portrait-official-256.png` — 256×256, SHA-256 `f379e9b1aa485bc6286749f6f77b71c9a7d8534256ef68c13aa6f815ca7a430b`.\n- `peren-actor-official-128.png` — 128×261, SHA-256 `f8ae3653621c3386de2d50d67d932fb2e166f276d378e418aa6020a4bb7930a5`.\n- `peren-atlas-official-48x64.png` — 768×512, 128 frames 48×64, SHA-256 `6044391acf753e110decbce22fa4777e8842013c0f7ac0a68e910c9a96ecc02d`.\n\nO jogo compartilha o mesmo rosto e atlas nas versões clássica/Phaser e variantes experimentais. A folha de sprites **não substitui a exigência artística de animação de quatro direções completamente nova**; esse trabalho permanece aberto. Uma bancada visual oferece inspeção no navegador, sem criar segundo modo de jogo.\n
## Auditoria de bugs visuais — 21/10/2026 (v2)

A verificação de todos os 128 frames da versão anterior encontrou **35 renderizações distintas** apesar dos 128 índices declarados. Isso era esperado parcialmente pelo número limitado de poses da fonte, mas havia dois defeitos de implementação: cada pose era dimensionada pelo próprio contorno opaco (fazendo o personagem inflar/encolher) e poses de caminhada eram alternadas para simular coleta, magia, interação e ataques, gerando gestos falsos e *flicker*.

O runtime **v2** aplica registro comum dos 18 sprites alinhados (fonte 160×190; recorte constante x=20–140, y=18–185), usa redução nearest-neighbor com área fixa 42×59 dentro de frames 48×64 e mantém os pés no mesmo y=61. O atlas RGBA mantém cores e alfa, sem paleta indexada de 128 tons. Resultado: 128 índices de quadros, **19 imagens visualmente distintas**, sem oscilações artificiais; esse número menor é um compromisso explícito para não fingir animações inexistentes.

**Disponíveis no pacote original:** cinco poses de caminhada à esquerda, vistas frontais estáticas, vistas posteriores com movimentos de capa e posturas laterais. A caminhada à direita continua espelhamento técnico.

**Ainda precisam ser fornecidos se quisermos animações completas e fiéis:**
- Caminhar frente e costas: idealmente quatro quadros por direção, com posições de pés alinhadas e ciclo coerente. Corrida também precisa de desenhos dedicados.
- Interagir e coletar: quatro quadros por direção para as mãos e o corpo realmente executarem as ações.
- Ferido: dois a quatro quadros por direção (impacto/reação e recuperação), sem trocar o rosto ou o manto.
- Conjurar e atacar: quatro quadros por direção, respeitando a mão de magia e os acessórios aprovados.
- Retratos de expressão *ferido* e *conjurando* são temporariamente cópias do retrato base; enviar expressões oficiais específicas se desejado.

**Contrato recomendado para novos sprites:** PNG RGBA transparente, 160×190 px por quadro, pés alinhados à linha y=184 do pacote original, uma imagem por pose. Os filenames podem indicar `acao_direcao_frame_01.png`. Nunca precisamos que o criador monte o atlas 48×64; a conversão técnica fará isso de modo reproduzível. Aceitam-se outros tamanhos desde que informados e alinhados.

**QA:** `tests/qa_peren_frames.py` verifica hashes e dimensões, alinhamento de todos os pés, recortes, ausência de movimentos falsos e espelhamento. `tests/qa_peren_phaser_browser.mjs` entra de fato na floresta com Phaser e guarda screenshots para inspeção. **Status:** a implementação técnica v2 foi integrada à `main` pela [PR #57](https://github.com/pedromaintenance/peren-o-bruxo/pull/57), com CI de atlas, PNGs, cenas reais e funcionamento offline aprovado. Não foi recebida nova arte de animação para os gestos faltantes; aprovação artística em dispositivo físico continua pendente.

## Atualização v3 — caminhada oficial em quatro direções (21/10/2026)

**Fonte enviada pelo criador:** `Peren_Kerrhylon_Assets_Atualizados_Caminhada(1).zip` — SHA-256 `0ff0981e3b1fa26f8d8cfe10131fd33fb85f6957d7700e979b09b54f32e9dcd4`. O corpo, retratos, expressões e as 18 poses anteriores permaneceram idênticos aos do ZIP aprovado.

**Novo master de caminhada**, adicionado ao repositório sem edição em `phaser-demo-m1hf/art/characters/peren/official-v3/peren-caminhada-3x4-original-160x190.png` (480×760 pixels): SHA-256 `4281a7f1e946037f479f94331a509d380d5582cc87b8e1e707f8da1f4ffb359c`.

| Linha na fonte | Direção no Phaser | Índices runtime | Poses do ciclo |
| --- | --- | --- | --- |
| 1 | down / frente | 4–7 | 01, 02, 03, 02 |
| 2 | left / esquerda | 36–39 | 01, 02, 03, 02 |
| 3 | right / direita | 68–71 | 01, 02, 03, 02 |
| 4 | up / costas | 100–103 | 01, 02, 03, 02 |

O atlas ativo continua **768×512 px**, 128 quadros em 48×64. Apenas os 16 quadros de caminhada (quatro por direção) foram substituídos. Os demais 112 quadros conservam seus pixels da v2, assim como os retratos e as outras ações; **correr não recebe automaticamente sprites de caminhada nem arte inventada**.

O mapeamento sugerido pelo criador é **180 ms por quadro (~5,56 FPS)**. O runtime repete a segunda pose ao fechar o ciclo `1→2→3→2`. Quadros oficiais recortados com registro fixo para evitar saltos de escala e pés desalinhados. **Advertência do ZIP:** a pose 03 para a esquerda foi espelhada da direita pelo próprio autor do novo pacote. O runtime não a espelha novamente.

A conversão reproduzível está em `ferramentas/gerar_peren_caminhada_v3.py`; sua entrada é o ZIP completo, verificado pelo SHA-256. A origem dos frames consta de `official-v3/runtime-provenance.json`. A verificação pixel a pixel em `tests/qa_peren_walk_v3.py` compara todos os novos frames com o master e comprova que os outros 112 não foram alterados. O jogo continua tendo **um único Modo Livre**.

## Atualização v4 — caminhada ferida (21/10/2026)

**Pacote enviado pelo criador:** `Peren_Kerrhylon_Assets_v3_Andar_Ferido(1).zip`, SHA-256 `c7bc4b761b41760b0e93004b4edeb8a92074f32b220f712b3186ab0844f2f904`.

- **Fonte compatível:** `charset/caminhada_ferido/atlas/peren_ferido_3col_4lin_160x190.png` (480×760, 12 poses = três por direção), guardada sem alterações na pasta `official-v4` do repositório. Ordem: frente, esquerda, direita, costas.
- **Fonte estendida:** `peren_ferido_5col_4lin_240x285.png` (1200×1140) também está no ZIP original, com até 5 quadros por direção; não foi adaptada neste ciclo para preservar o contrato atual da engine e o peso do PWA.
- **Runtime:** `peren-wounded-atlas.png`, 768×512 RGBA, 128 células 48×64. Apenas 16 células de caminhada ferida diferem do atlas saudável v3. As outras 112 foram mantidas byte a byte.
- **Quadros:** frente 4–7, esquerda 36–39, direita 68–71, costas 100–103. Sequência 1 → 2 → 3 → 2, duração 230 ms por quadro. Recorte comum (5,5,155,185) para não cortar o manto inclinado; sem variar o zoom por pose.
- **Gatilho visual no Modo Livre:** Peren com mais de 0 e até **50% dos PV máximos reais**, incluindo equipamentos/bônus, usa o atlas ferido ao caminhar; recuperação acima de 50% restaura a caminhada normal. Sprint usa a pose de andar ferido, **sem alterar velocidade de deslocamento, colisão, defesa ou dano**. O momento do golpe `hurt` continua uma animação separada, sem novos quadros.
- **Integração:** os atlas foram incluídos no caminho padrão e nas quatro variantes do Phaser, e o bundle de execução foi adaptado para carregar as texturas e alternar as animações. Galeria de inspeção permite seleção independente, sem modificar PV ou saves.
- **Geração:** `ferramentas/gerar_peren_ferido_v4.py` e relatório de origem `official-v4/runtime-provenance.json` documentam integralmente o processo. A versão anterior v3 permanece preservada.

Ainda são necessários assets adicionais se desejarmos animações próprias de **ferimento/impacto, coleta, interação, conjuração e ataque**. A caminhada ferida não substitui esses gestos.

## Atualização v5 — Coleta de ervas (21/10/2026)

**Fonte oficial recebida:** `Peren_Kerrhylon_Assets_v4_Coleta(1).zip`, SHA-256 `e19d409448575872b61294f7e48775dfa6de60d1f47161362fa29f016e5d4a0f`.

- Fonte principal preservada **sem alterações** em `official-v5/peren-coleta-4x4-original-160x190.png`: 640×760 px, 16 poses originais, quatro quadros por direção, PNG RGBA, SHA-256 `f8f8d772a5268d0c465ec9ad0b6b2e02fc6660932090b8926ddb96ac4fef4147`.
- Runtime **independente**, `official-v5/peren-coleta-runtime-4x4-48x64.png`: 192×256 px, 16 quadros de 48×64, SHA-256 `ed55e98fba4aff8aff46adea3d63d3d97e540f0e808f7cb9241403beada40ed6`.
- Linhas do atlas: frente/down (quadros 0–3), esquerda/left (4–7), direita/right (8–11), costas/up (12–15). Cada linha percorre **em pé → abaixando → recolhendo → erguendo a erva**.
- **Temporização do criador:** 350, 250, 450 e 850 ms (total de **1.900 ms**), uma execução. Após completar a animação, o sistema de coleta já existente efetua a única transação de item e reverte ao idle. Evita conceder prêmio antes do gesto terminar e preserva a verificação anti-duplicação.
- **Seleção contextual:** somente recursos do tipo `herb`, como Raiz Velada e Musgo Suspenso, usam `peren-herb-{direção}-gather`. Cogumelos continuam com a animação genérica, pois o quadro final do novo sprite segura um ramo verde. Nenhum item ou quantia foi inventado.
- **Independência:** o atlas de caminhada v3 e o de caminhada ferida v4 **não sofreram alterações**; ataque, magia e interação continuam sem novos quadros aprovados. O Modo Livre segue único.
- **Reprodutibilidade:** executar `python ferramentas/gerar_peren_coleta_v5.py <zip_original> <pasta_destino>`. O script verifica o SHA-256 do ZIP e do master, usa recorte fixo (5,0,155,185) e escala nearest-neighbor 44×59 com deslocamento (2,3), sem redesenhar poses. QA pixel a pixel em `tests/qa_peren_herb_v5.py`, testes de mecânica em `tests/qa_peren_herb_v5.mjs` e de navegador em `tests/qa_peren_herb_v5_browser.mjs`.

A alternativa 3×4 e os sprites 240×285 continuam acessíveis no ZIP original. A v5 usa a sequência principal 4×4, **sem descartar a segunda pose**.
