# Peren Kerrhylon — Caminhada ferida (v4)

- Pacote recebido: `Peren_Kerrhylon_Assets_v3_Andar_Ferido(1).zip`.
- SHA-256 do ZIP: `c7bc4b761b41760b0e93004b4edeb8a92074f32b220f712b3186ab0844f2f904`.
- Fonte compatível **inalterada**: `peren-ferido-3x4-original-160x190.png`, 480×760, 12 poses (frente, esquerda, direita, costas; três poses por linha).
- SHA-256 da fonte: `e65916fab240e41bd4c7c0deb183547cd459c29ad84338d04ee3543bc3f48dcc`.
- Alternativa estendida do ZIP: 5 colunas × 4 linhas, 240×285 por frame — **não usada** pelo motor atual. Os 4 frames originais frontais e 5 em cada outro sentido continuam no ZIP do criador.
- Atlas de execução **separado**: `peren-wounded-atlas.png`, 768×512 RGBA, 128 quadros 48×64; 16 células de caminhada ferida alteradas, **112 células preservadas** do atlas de caminhada normal v3.
- SHA-256 do atlas ferido: `4520292c92ae79e922a7cffebce5c51863639924cd1bcb9af7bfbe3a20474c78`.
- Ciclo: **1 → 2 → 3 → 2**, 230 ms por quadro. Índices: frente 4–7, esquerda 36–39, direita 68–71, costas 100–103.
- Recorte comum **(5,5,155,185)**, escala nearest-neighbor 44×59, deslocamento (2,3). A capa ferida é mais larga, por isso não deve usar o recorte estreito da caminhada normal.
- **Alternância automática no Modo Livre:** animação ferida de caminhada quando `0 < hp <= playerMaxHp * 0.5`, incluindo bônus de PV máximos, e caminhada normal quando recuperar mais de 50%. Sprint sob ferimento exibe a caminhada ferida, mas velocidade, dano, colisão e IA **não mudam**.
- Gestos `interact`, `gather`, `hurt`, `cast`, `attack` e pose parada continuam os mesmos. Caminhar ferido não representa uma animação de levar um golpe.
- Rastreabilidade: `runtime-provenance.json`. Geração reproduzível a partir do ZIP em `ferramentas/gerar_peren_ferido_v4.py`.
- Jogo único: Modo Livre — Mercador da Carcaça. Nenhuma campanha de RPG adicional.
