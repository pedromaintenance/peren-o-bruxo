# Peren Kerrhylon — Idle Battler (4 quadros)

Animação de espera para batalha, com Peren **na pose de conjuração da Rajada Mística / Void Rift**, mão estendida, sem disparar a magia. Quatro variações suaves do cabelo, manto e postura, concebidas para loop.

## Arquivos previstos
- `peren_idle_battler_4frames.png`: master transparente, **1916 × 821 px**, 4 quadros horizontais de **479 × 821 px**.
- `manifest.json`: contrato técnico de reprodução e nomes de quadros.

## Situação de importação
A configuração foi versionada, mas **a imagem PNG master ainda não foi enviada ao GitHub**: a integração disponível permite gravar arquivos de texto e blobs enviados como string, mas não lê diretamente os bytes do arquivo local de imagem. Não habilitar o asset no runtime antes de confirmar a presença do PNG.

## Reprodução
- Ordem: `idle_01 -> idle_02 -> idle_03 -> idle_04 -> idle_01`.
- Velocidade inicial: 4 quadros por segundo (ajustável ao testar).
- Loop contínuo, sem alteração da pose de conjuração.
- Não substituir os sprites 48×64 usados no mapa.

## Identidade visual
Peren usa túnica e capa negras, bordados dourados, fragmentos azuis como céu estrelado, olhos estelares e o braço estendido para a direita. Derivado da pose-base aprovada para o ataque Void Rift.
