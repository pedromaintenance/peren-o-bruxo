# Peren, o Bruxo — transformação Phaser

**Status:** proposta de implementação, em branch de desenvolvimento. **A versão 0.1.2 em `main` permanece o jogo publicado.**

## Visão

Peren continua sendo um bruxo, artesão e mercador em viagem pela Carcaça. O ciclo econômico já jogável — coletar materiais → aprender ofícios → fabricar → negociar → aceitar contratos → ganhar experiência — não será descartado. Ele ganhará uma camada de RPG 2D vivo, com exploração em tempo real e combate dramático por turnos em Phaser.

- **Cidades:** hubs de menus ricamente ilustrados, com retratos de todos os vendedores, professores, oficinas, estoques e contratos. Não é necessário criar cidade navegável em tempo real neste escopo.
- **Expedições:** mapas gerados proceduralmente por região, com Peren animado e movimentação contínua, árvores, pedras, ruínas, recursos, inimigos, clima e magias ambientais.
- **Combate:** cena Phaser com apresentação de RPG clássico, modelos/sprites visuais únicos para cada espécie, ataques animados, esquivas, dano, incapacitação, feitiços, itens e saque. As decisões e danos permanecem em turnos.
- **Retorno:** resultados e inventário persistentes na economia original; sem duplicar XP, saque ou contrato após recarregar.
- **Alvo:** celular Android em retrato, com teclado/gamepad no desktop; PWA instalável e offline após o cache completo.

## Compromisso de produção visual

**Cada monstro tem um registro de asset próprio** e deverá chegar à versão final com sprite, retrato e conjunto de animações próprios. **Cada NPC tem retrato e identificação visual próprios; cada lugar tem cenário próprio; cada magia tem uma assinatura visual distinguível; cada item tem ícone individual**. Reaproveitar shaders, esqueletos, atlas técnicos, partículas ou bases de tiles é permitido como ferramenta de produção, **não como substituto para a identidade visual final**. Tudo aparecerá marcado como `planejado`, `em_producao`, `integrado` ou `aprovado` no inventário.

## Limites da fundação

Esta branch **não** substitui telas do jogo original nem entrega 3 mil ilustrações prontas. Entrega documentação, estrutura de código isolada, script para gerar um manifesto rastreável a partir dos JSONs e um laboratório mínimo de Phaser com formas temporárias declaradas como placeholders. A produção final dos assets ocorre por lotes aprovados.

## Critérios de qualidade

1. Nenhum save existente é apagado para migrar; exportação e compatibilidade são verificadas.
2. Nenhum encontro pode conceder XP ou loot duas vezes, inclusive em reload no meio da animação.
3. Exploração fluida sem grid de movimentação; sistema ambiental pode usar regiões/células internas não visíveis.
4. Animações podem ser puladas/aceleradas sem alterar resultados mecânicos; respeitar `prefers-reduced-motion`.
5. Inventário, tutores, receitas, preços e missões continuam consistentes com a base 0.1.2.
6. A `main` só recebe código Phaser depois de validação em mobile, desktop e offline.

## Fontes e proveniência

Registros extraídos de `data/*.json` do próprio projeto. A identidade visual será autoral, encomendada ou proveniente de bibliotecas com licença permissiva **documentada por arquivo**; não usar sprites extraídos de Skyrim ou ilustrações protegidas dos livros D&D. A lore da Carcaça continua como guia para adaptação.