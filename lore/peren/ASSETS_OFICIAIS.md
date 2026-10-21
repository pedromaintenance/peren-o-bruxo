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