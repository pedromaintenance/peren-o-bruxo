# Plano de animação — Herdeiro Cósmico

**Material atual:** uma folha RGBA de componentes (5 retratos, expressões, mãos, roupas, VFX). O material **não** traz rig, timings, atlas com pivôs universais nem identificação canônica do personagem. Abaixo estão apenas sugestões para quando houver solicitação de implementação.

| Estado futuro | Base visual | Sobreposições candidatas | Observação |
|---|---|---|---|
| `hc_idle` | `retrato_01_frontal` | cabelo 01, manto 01 | oscilação sutil em looping |
| `hc_cast` | `retrato_03_queixo_erguido` | mão 03 → portal → vórtice | sequência de conjuração, one-shot |
| `hc_impact` | efeito 03 | tremor e clarão de câmera | sincronizar com resolução do ataque |
| `hc_hurt` | `retrato_04_cabeca_baixa` | mão 04 | usar camada de ocultação se sobreposta |
| `hc_victory` | `retrato_05_cabeca_elevada` | portal 01 | animação de encerramento |
| `hc_blink` | retrato base | olhos 03 / pálpebras | requer registro e máscara facial |
| `hc_chant` | retrato base | bocas 03/05/06 | requer registro e máscara facial |

## Contrato técnico para animação

- **Reprodução:** definir `loop` ou `oneShot` explicitamente.
- **Registration points:** documentar x/y de cabeça, olhos, boca, pulso e centro dos VFX por pose.
- **Composição:** as faces completas já possuem olhos e boca; não adicionar novas partes sem ocultar os pixels originais.
- **Camadas:** base → cabelo/roupa → rosto registrado → mãos → VFX → pós-processamento.
- **Compatibilidade:** as imagens são arte de retrato para batalha; não misturar com o atlas 48×64 de exploração do Peren.
- **Persistência:** nenhuma mudança nas recompensas, inventário ou saves.
- **Recortes:** usar as versões alfa individuais do pacote e comparar com a fonte em caso de halos ou partículas soltas.
- **Novos arquivos:** criar v2 com IDs novos e documentar o que substitui v1.

**Implementação:** aguardando material adicional e decisão de quem é o Herdeiro Cósmico dentro do jogo.
