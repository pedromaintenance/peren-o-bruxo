# Inventário geral de artes e animações

Gerado a partir de `data/` do **Peren 0.1.2**, não de uma lista imaginada. Comando: `python tools/generate_visual_manifest.py --root .`.

| Fonte | Registros | Entregável individual |
|---|---:|---|
| `monstros.json` | 222 | Sprite, portrait, idle, andar, ataque, dano, morte e especial/conjuração |
| `magias.json` | 354 | Efeito distinguível por magia, animações de conjuração, aplicação e dissipação |
| `itens.json` | 2.785 | Ícone individual, sprite/efeito de drop e uso; equipamento visível quando pertinente |
| `receitas.json` | 2.316 | Sequência de crafting mostrando ingredientes, bancada, etapas e resultado por receita |
| `cidades.json` | 9 | Background único, identificação visual, animações de ambientação e estabelecimento |
| `cidades[*].mercadores` | 27 | Retrato, pose, expressão/interação, oficina/banca própria |
| `expedicoes.json` | 10 | Tileset, props, coleta, clima e parallax/ambiente próprio |
| `missoes.json` | 32 | Briefing, cena narrativa e ilustrações necessárias por missão; pode reutilizar cenário coerente |

O manifesto inclui ainda **Peren** e os menus principais como registros específicos. Os **valores são metas de cobertura, não contagem de imagens prontas**.

## Áreas do jogo obrigatórias

`mundo`, `mercado`, `oficinas`, `grimorio`, `peren`, `missoes`, `viagem`, `exploracao`, `combate`, `recompensas`, `tutores`, `alquimia`, `forja`, `encantamento`, `curtume`, `joalheria`, `cozinha`, `escrita`. Produzir molduras, fundos, feedback de clique, destaques, transições e áudio adequado para os estados interativos.

## Prioridades

1. **P0 / Vertical slice**: Peren, Portomonte, Mürin, Sofia, Jonathan, Alina, três monstros com animações completas, três magias com assinaturas visuais completas, menus e itens básicos para coletar/fabricar/vender.
2. **P1 / Campanha**: demais regiões e NPCs, missões, batalhas importantes, magias iniciais.
3. **P2 / Catálogo longo**: todo o bestiário, 354 magias, 2.785 ícones e apresentação específica das 2.316 receitas.

Um programa de produção pode ultrapassar muitos meses; o manifesto permite medir exatamente o que falta, sem declarar cobertura falsa.