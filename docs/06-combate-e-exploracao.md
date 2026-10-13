# Exploração + combate sem perder a economia

## Exploração fluida

Mapa procedimental de colisões e regiões (seed determinística) com movimento analógico/teclado e animação direcional de Peren. A lógica ambiental inspirada em Ironwood é **interna**, não um tabuleiro que obriga o personagem a andar por quadrados. Árvores, água, fogo, neblina, lama, gelo e altura possuem propriedades; magias podem modificar o ambiente em tempo real com durações explícitas.

Expedição é instância com `expeditionId`, `seed`, `worldState`, `resources`, `enemies`, `entrance`, `exit` e `playerPosition`. Spawn próximo ao objetivo, mapa alcançável, escape sempre possível. Nada de travar o jogador dentro de uma missão.

## Transição a turnos

Detectar encontro por colisão/visão, congelar o mundo e transitar à `BattleScene` **sem perder a seed ou posição original**. Carregar fundo do bioma e os sprites únicos de cada inimigo. O núcleo atual conserva custo de mana, consumo de poções, atributos e loot; Phaser só representa visualmente os resultados. Enquanto toca a animação, bloquear ações duplicadas; permitir pular a animação, mas nunca duplicar o resultado.

## Batalha Phaser

1. Mostrar iniciativa/vez, informação dos alvos e estado de Peren.
2. Menu por toque: atacar, defender, magias, itens, relíquias, recuar.
3. Resolver comando no núcleo; gerar lista de eventos (`attack_started`, `projectile_hit`, `damage`, `status`, `enemy_turn`, `death`).
4. Reproduzir eventos na `BattleScene`: movimento de ataque, animações por monstro, VFX por magia, dano, saúde e efeitos.
5. Gravar checkpoint e ID de recompensa antes de confirmar encerramento, retornar ao mesmo cenário de expedição.

## Comportamentos ambientais

- Fogo acende vegetação seca; terreno úmido aumenta dificuldade de propagação.
- Gelo altera circulação da água e escorregamento; eletricidade percorre água com restrições.
- Névoa reduz detecção; detritos geram bloqueios; vento muda propagação.
- Ações mágicas especiais mantêm **regras de jogo consistentes**, documentadas e testáveis.

## Qualidade de experiência

Precisamos de validação Android real para FPS, textura, duração de carregamento, PWA offline, consumo de bateria e gestos touch. Desempenho: carregar pacotes somente do bioma/missão atual; não manter todas as 222 criaturas em memória de textura simultaneamente.