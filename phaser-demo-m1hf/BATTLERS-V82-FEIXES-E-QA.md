# Ciclo Peren v8.2 — art review dos disparos e QA responsivo

**Data:** 22/10/2026 · **Status:** revisão concluída para inspeção; os efeitos continuam fora do runtime público.

## O que mudou em v8.2

Partindo das versões tratadas de v8.1 (não dos masters com cromakey), foi aplicada uma curva **smootherstep** apenas ao canal alpha próximo das bordas direitas dos quadros **4–7** das sequências de fogo e Void Rift. Nos quadros 6 e 7 a atenuação ocupa os últimos 19% da célula; nos quadros 4 e 5, os últimos 6%. Os canais RGB, silhueta, proporções e contagem de quadros não foram redesenhados nem reamostrados.

A consequência pretendida é **terminação suave do feixe**, sem a aresta vertical dura que traía o corte da folha original. **Não alegamos restaurar a ponta inexistente do disparo.** Os quadros 1–3 e 8 não receberam tratamento novo. Os quatro quadros de Idle (560×821) e os oito do Summon (512×512) foram preservados byte a byte.

## Resultado quantitativo

| Atlas | Contatos alfa antes | Depois | Liberação |
|---|---|---|---|
| Infernal (8 × 512×341) | [0,6,0,4,132,5] | **[0,6,0,0,0,0]** | Revisão visual; não habilitar |
| Void Rift (8 × 543×362) | [0,9,0,4,146,0] | **[0,9,0,0,0,0]** | Revisão visual; não habilitar |
| Idle (4 × 560×821) | [0,0,0] | [0,0,0] | Aprovado tecnicamente; imagens ainda não publicadas |
| Summon (8 × 512×512) | [0,0,0,0,0,0] | Inalterado | Aprovado tecnicamente; imagens ainda não publicadas |

O número é a quantidade de linhas que contêm alpha > 24 em ambos os lados da junção. Valores baixos (6 e 9) permanecem e exigem olhar humano, não autorizam classificação de arte perfeita.

## Reprodutibilidade

O script `ferramentas/tratar_battlers_v82.py` aceita o **ZIP de restauração v8.1** já entregue na conversa, verifica SHA-256 das fontes de Infernal e Void Rift e cria apenas `infernal.png`, `void.png` e relatório QA **fora dos caminhos de produção**:

```bash
python -m pip install Pillow
python ferramentas/tratar_battlers_v82.py Peren_Ciclo_v81_Battlers_Corrigidos.zip --out ./peren-v82-review
```

A entrega da conversa `Peren_Ciclo_v82_Battlers_QA.zip` contém ambas as imagens tratadas, o Idle e Summon preservados, os quatro portraits, comparativos por frame, métricas e scripts. `Peren_Battle_v82_Arena_Standalone.html` é uma **arena de simulação** offline em que se pode testar animações, zoom, velocidade, quadros e quatro retratos. Não é a cena Phaser distribuída.

## Testes concluídos

- Tratamento visual comparado em fundo cinza; infernal e void sem interrupção brusca no limite final do quadro 7.
- Teste Chromium desktop **1280×800** e celular **390×844** com PNGs reais convertidos em previews WebP embutidas, interação em Idle/Infernal/Void/Summon, nenhum erro JS.
- `tests/qa_peren_battler_v82_review.mjs` garante que o script de limpeza nunca habilite automaticamente os efeitos e que o jogo continue usando apenas as artes aprovadas v8.1.
- Testes da branch v8.1 continuam exigidos. **O teste no BattleScene REAL com textura carregada não é possível no Pages até que os PNGs sejam transferidos para o GitHub.**

## Pendências e decisão

1. **Não publicar Infernal ou Void Rift ainda**: a terminação suavizada necessita aceite artístico do usuário; o master original não possui a ponta completa.
2. Importar os **seis PNGs de v8.1** e manifesto no repositório; verificar que Idle 560×821 substitui de fato o sprite 48×64 na tela de combate do navegador e que Summon reproduz uma vez, sem gameplay.
3. Após teste ativo, autorizar os dois especiais para `preload` e associá-los às magias existentes. Não criar magia nova por causa do nome do VFX.
4. Manter fluxo de saves, inventário e PV/PM sem alteração.

Este documento e o script de correção são versionados. O conector desta conversa **não comitou os PNGs**, e esta PR não é uma publicação de nova arte no GitHub Pages.
