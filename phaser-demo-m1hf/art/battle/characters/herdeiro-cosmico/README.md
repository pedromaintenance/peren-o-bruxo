# Herdeiro Cósmico — reserva técnica de assets para batalha (v1)

> **Estado:** catálogo integrado ao repositório; **PNGs binários ainda não enviados ao GitHub**. O pacote ZIP completo, com o original e 32 PNGs individuais, foi entregue como artefato da conversa no projeto RPG Carcaça. Esta branch não altera o Phaser nem publica um personagem no jogo.

## Fonte registrada

- Nome recebido: `Folha de Assets do Herdeiro Cósmico(1).png`
- Resolução: **1448×1086**, RGBA com transparência
- SHA-256 do original: `09880e7b0b50a09490af5e056e744f1ce0b7921ba5d5f0c7566c9df7254e5402`
- Pacote gerado: **Herdeiro_Cosmico_Battle_Assets_v1.zip**
- Conteúdo: original intacto, 32 recortes PNG, `manifest.json` com hashes individuais, `viewer.html`, folha de contato, receitas de animação e verificador de integridade.
- O recorte utiliza componentes alfa para preservar as imagens sem escala nem interpolação; partículas destacadas dos efeitos são agrupadas pelo elemento cósmico mais próximo.

## Índice visual e funções

| Categoria | PNGs | Uso previsto |
|---|---:|---|
| `retratos` | 5 | estados de combate e cut-ins |
| `olhos` | 6 | piscar, concentração, olhos energizados |
| `bocas` | 6 | diálogo, encantamento, grito |
| `palpebras` | 4 | expressão e piscar |
| `maos` | 4 | conjuração, gesto, defesa |
| `cabelos` | 2 | física secundária, vento |
| `mantos` | 2 | física secundária, manto |
| `efeitos` | 3 | portal cósmico, rastro e explosão |
| **Total** | **32** | |

IDs e estados previstos em [`pack-index.json`](./pack-index.json). Receitas preliminares em [`ANIMACOES.md`](./ANIMACOES.md).

## O que **não** deve acontecer antes da próxima etapa

1. Não substituir o Peren: o rótulo da fonte é **Herdeiro Cósmico**, mas ainda não há associação narrativa ou mecânica confirmada com Peren, inimigo, NPC ou patrono.
2. Não tentar compor automaticamente olhos/bocas sobre os retratos: os bustos do topo já têm olhos e bocas. As peças separadas precisam de registration points, máscara de ocultação e verificação das poses.
3. Não inventar quadros intermediários: por enquanto são retratos e componentes estáticos que suportam animação de recortes/camadas.
4. Não alterar o código do combate, saves, assets atuais, gameplay ou o Modo Livre sem um pedido posterior.
5. Antes de distribuição pública, confirmar a autorização/licença da arte (não declarada no envio).

## Ingestão da próxima folha

Guardar o novo arquivo sem sobrescrever a versão atual, registrar a resolução e SHA-256, decompor apenas os elementos efetivamente presentes, manter as IDs anteriores, e documentar novos estados, pivôs, duração por frame e critérios de exibição. O repositório passará a ter os binários quando forem importados explicitamente; **este índice não substitui os PNGs**.
