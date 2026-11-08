# Peren, o Bruxo — pré-alfa procedural (07/11/2026)

A implementação Phaser desta branch reúne as bases da transição #94, da alquimia aplicada em combate #101, da exploração #102 e de **dez regiões procedurais** da PR #103. Mantém o clássico isolado.

## Laço jogável
No hub, selecione uma região da Carcaça e clique em Viajar. Explore com WASD/setas, joystick ou gamepad. Corra com Shift, alterne furtividade com C, colha com E/Espaço e abra a bolsa com I ou Y. Em campo, a bolsa pausa a exploração. A batalha permite ataque, defesa, magias, poções e preparados restauradores; ao vencer, o saque é liquidado uma vez. Use Escape/B para retornar ao assentamento e fabricar, estudar ingredientes ou negociar.

**Regiões**: Mürin, Costa Sul, Caatinga, Thargrid, Ironwood, Garganta, Drakport, Eldroth, Vandar e Boca do Abismo.

A seed determina terreno, água, passagens, obstáculos, recursos e encontros. As saídas e os nós de coleta são alcançáveis. A viagem atualiza a cidade-base e muda quais oficinas/mercados estão disponíveis. Gerar novo mapa mantém a região e a personagem.

## Restrições conscientes
- As criaturas regionais reutilizam temporariamente os três sprites e blocos de combate de Mürin. Não são o bestiário final.
- Os terrenos/obstáculos gerados em código são pixel art provisória. O atlas oficial de Peren permanece intacto.
- Preparados da bancada só executam restauração de PV/PM nesta etapa: 24 PV e 12 PM são **valores provisórios**. Venenos, Tônicos, Elixires, Bálsamos, transformações e o conjunto das 53 propriedades não estão todos implementados.
- A Pena de Gaivota só aparece na Costa Sul; os demais pools regionais são provisórios, sujeitos à revisão de ecologia.
- Viagem não desconta ouro nem ação diária na pré-alfa; nenhum custo permanente foi aprovado.
- Salvamento de teste usa chave Phaser separada com sufixo worlds_prealpha_v2. Saves anteriores não são migrados, sobrescritos ou apagados; exportar backup antes de testes externos.

## Executar e testar
Na pasta phaser-lab, use: npm install; npm run dev; npm test; npm run build; npm run preview. Para testar por navegador, o CI executa os testes Node e scripts de Chromium e entrega o dist como artefato ZIP. Abrir diretamente o HTML via file:// não funciona porque os catálogos dependem de carregamento HTTP.

**Próximos gates**: CI do último commit, revisão visual mobile/Xbox, publicação isolada sem substituir a raiz do Pages, aprovação dos novos assets e revisão do balanceamento.
