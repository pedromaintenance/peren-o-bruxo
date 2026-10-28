# Biblioteca de efeitos reservados — Peren
Este diretório guarda imagens originais para possíveis integrações futuras ao jogo.

**Nenhum asset desta pasta está habilitado automaticamente no motor Phaser, no combate ou no cache offline.** Os arquivos de imagem e seus JSONs registram origem e identificação, não contratos executáveis de animação.

## Gelo 2 — Anel
- Original imutável: [ice-ring-02-source.png](ice-ring-02-source.png)
- Metadados: [ice-ring-02.json](ice-ring-02.json)
- Cinco poses em faixa horizontal; PNG 2048 × 682, RGBA
- Recortes aproximados no JSON — **não são quadros de runtime aprovados**
- **Estado:** reservado para uso futuro, sem magia ou temporização atribuídas

## Gelo 3 — Estalagmite
- Original imutável: [ice-stalagmite-03-source.png](ice-stalagmite-03-source.png)
- Metadados: [ice-stalagmite-03.json](ice-stalagmite-03.json)
- Cinco poses de erupção cristalina em faixa horizontal; PNG 2048 × 682, RGBA
- Divisões estimadas no JSON — **nenhum spritesheet de runtime foi produzido**
- **Estado:** reservado para uso futuro, sem magia, alvo ou temporização atribuídos

## Gelo 4 — Nuvem Gelada
- Original imutável: [ice-cloud-04-source.png](ice-cloud-04-source.png)
- Metadados: [ice-cloud-04.json](ice-cloud-04.json)
- Cinco poses de nuvem/nevasca mágica em faixa horizontal; PNG 2048 × 682, RGBA
- Recortes apenas aproximados no JSON — **não são quadros prontos para o Phaser**
- **Estado:** reservado para uso futuro, sem duração, magia ou alvo atribuídos

A magia básica Raio de Gelo permanece usando somente **casting-ice + Estilhaços (ice-shards-v26)**.

## Escuridão 1 — Rajada do Vazio
- PNG espaçado e preservado: [dark-blast-01-source.png](dark-blast-01-source.png)
- Mapeamento de cinco poses: [dark-blast-01.json](dark-blast-01.json)
- PNG 2528 × 475 RGBA com quatro intervalos transparentes de 120 px; quadros de larguras variáveis
- **Estado:** reservado; sem atribuição de magia, duração, pré-cache ou ativação no Phaser

## Escuridão 2 — Cortes do Vazio
- PNG original preservado: [dark-slashes-02-source.png](dark-slashes-02-source.png)
- Mapeamento dos cinco quadros: [dark-slashes-02.json](dark-slashes-02.json)
- PNG 2048 × 475 RGBA; lacunas transparentes já existentes de 164, 127, 119 e 160 px; quadros com largura variável
- **Estado:** reservado; sem atribuição de feitiço, temporização, pré-cache ou ativação no Phaser

## Vazio 3 — Vórtice do Vazio
- PNG espaçado e preservado: [dark-vortex-03-source.png](dark-vortex-03-source.png)
- Mapeamento dos cinco quadros: [dark-vortex-03.json](dark-vortex-03.json)
- PNG 2528 × 672 RGBA; cinco quadros com larguras individuais e quatro lacunas transparentes de 120 px
- Pixels da arte original preservados integralmente; sem duração nem magia atribuídas
- **Estado:** reservado; não carregado no Phaser, não pré-cacheado e não ativado em combate

## Vazio 4 — Rasgo do Vazio
- PNG espaçado e preservado: [dark-tear-04-source.png](dark-tear-04-source.png)
- Mapeamento dos cinco quadros: [dark-tear-04.json](dark-tear-04.json)
- PNG 2528 × 682 RGBA derivado do original 2048 × 682, com quatro lacunas transparentes de 120 px e cinco quadros de larguras individuais
- Os pixels e os níveis de transparência da arte original foram preservados integralmente; sem duração, alvo ou magia atribuídos
- **Estado:** reservado; não carregado no Phaser, não pré-cacheado e não ativado em combate

## Escuridão 5 — Portal do Vazio (CORREÇÃO PENDENTE DE UPLOAD BINÁRIO)
- **O arquivo atualmente armazenado nesta pasta está incorreto**: é um PNG estático 437 × 468 e seu manifesto antigo documenta apenas um quadro.
- O criador forneceu um **novo original correto: 2048 × 682 RGBA, cinco poses horizontais**, nome recebido `Sequência de Portal Neon Violeta(1).png`, SHA-256 `12934d1519fac100cb7d69b365b0c6c432a111ec7e7344a7ea2892432e0cd54b`.
- Substituir `dark-portal-05-source.png` e `dark-portal-05.json` **juntos** pelo pacote de correção. Não usar o manifesto de cinco poses enquanto o PNG antigo permanecer no GitHub.
- Os recortes preparados para prévia são provisórios; cinco poses ≠ animação aprovada para runtime.
- **Estado:** aguardando troca do PNG pelo original fornecido. Não ativar no Phaser, pré-cache ou combate.

## Escuridão 6 — Explosão do Vazio
- PNG original sem modificações: [dark-explosion-06-source.png](dark-explosion-06-source.png)
- Mapeamento dos cinco quadros: [dark-explosion-06.json](dark-explosion-06.json)
- PNG 2048 × 475 RGBA; cinco quadros com larguras variáveis e lacunas transparentes originais de 184, 134, 130 e 170 px entre as áreas visíveis
- Arte original preservada byte a byte; nenhum espaçamento adicional, redimensionamento ou alteração de transparência
- **Estado:** reservado; sem duração, alvo ou magia atribuídos; não carregado no Phaser, não pré-cacheado e não ativado em combate

## Escuridão 7 — Smite do Vazio
- PNG original preservado: [dark-smite-07-source.png](dark-smite-07-source.png)
- Mapeamento dos cinco quadros: [dark-smite-07.json](dark-smite-07.json)
- PNG 2048 × 475 RGBA; cinco quadros com larguras individuais e separações totalmente transparentes de 180, 149, 140 e 163 px entre as áreas visíveis
- Arquivo e canal alfa preservados byte a byte; sem necessidade de recomposição, recorte ou espaçamento adicional
- **Estado:** reservado; sem duração, alvo ou magia atribuídos; não carregado no Phaser, não pré-cacheado e não ativado em combate

## Escuridão 8 — Espectro do Vazio
- PNG original preservado: [dark-specter-08-source.png](dark-specter-08-source.png)
- Mapeamento dos cinco quadros: [dark-specter-08.json](dark-specter-08.json)
- PNG 2048 × 682 RGBA; cinco quadros de larguras individuais (396, 406, 432, 406 e 408 px)
- Cortes em x = 396, 802, 1234 e 1640; há somente resíduos quase invisíveis de alfa 1 nessas colunas, portanto não são lacunas perfeitamente transparentes
- Arquivo original preservado byte a byte; não houve recorte, redimensionamento nem processamento da transparência
- **Estado:** reservado; sem duração, alvo ou magia atribuídos; não carregado no Phaser, não pré-cacheado e não ativado em combate
