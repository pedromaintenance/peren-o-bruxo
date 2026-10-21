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
2. **Não substituir cegamente** `phaser-demo-m1hf/art/characters/peren/peren-atlas.png` ou `atlas.json`. O motor atual usa 48 × 64 e ciclos down/left/right/up com ações. O pacote novo só contém cinco quadros de caminhada à esquerda; há poses frontais e traseiras majoritariamente estáticas ou repetidas. Não afirmar que o novo atlas cumpre essas animações.
3. Implementação segura: importar os masters em diretório versionado próprio (proposta: `assets/characters/peren/official-v1/`); produzir **adaptação de runtime separada** — dimensão, quadros ausentes, origem dos pés, direção, hitbox e ação — com testes e revisão visual. As animações inexistentes devem ser criadas e validadas em outro marco, sem inventar poses e tratá-las como originais do pacote.
4. Priorizar o **retrato e a arte estática** em LORE-04 (acampamento em Eldroth e conversas), mantendo o ator jogável anterior até a compatibilização dos movimentos.
5. A designação de arte oficial vale para a identidade visual de Peren nos dois modos, sem reescrever a biografia de sua natureza changeling: outras personas/disfarces requerem assets ou regras próprias.
6. **Preservação:** não modificar saves, economia, magia, combates nem o protótipo clássico como efeito colateral da troca de retratos; snapshots e testes em mobile/Desktop/PWA e cache offline são obrigatórios ao publicar.

## Situação do projeto

| Entrega | Estado |
| --- | --- |
| Aprovação do estilo, rosto, roupa e poses fornecidos | **Oficial — aprovação expressa do criador** |
| Inventário das 67 entradas e documentação do atlas | **Conferidos a partir do ZIP** |
| Binários PNG/JPG inseridos no GitHub | **Ainda não integrado** |
| Retrato oficial exibido no jogo publicado | **Ainda não implementado** |
| Conversão/expansão para as animações exigidas no Phaser | **Pendente de adaptação e validação** |
| Testes de regressão e aprovação visual no jogo | **Pendentes** |

**Referências de integridade para futuras importações:**

- `actor/peren_actor.png` SHA-256: `90616e14fd078b34394562464a9624fc12d143d88a41b3ae5271f90b8ceec631`.
- `retrato/peren_portrait.png` SHA-256: `03169c033a3a7d3113d58d54001f9a0033a3612ace509ff71d1c352bd73aa79c`.
- `charset/atlas/peren_atlas_6x3_160x190.png` SHA-256: `f071439a066d0c2de13f4ec1e1bcff645a8b2e20a7779fd20ec86d7a2842ef09`.

> A documentação aqui não incorpora, hospeda, comprime novamente, publica nem certifica os binários do arquivo original. A fonte aprovada continua sendo o ZIP entregue; cada recurso integrado deverá ter proveniência e hash verificáveis.
