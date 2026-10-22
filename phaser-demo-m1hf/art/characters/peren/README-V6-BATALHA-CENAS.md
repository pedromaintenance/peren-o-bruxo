# Peren v6 — Integração dos novos assets de batalha e dos quatro retratos

## Auditoria: o que havia e o que chegou

Na `main`, a entrada `art/characters/peren/battler/idle/manifest.json` já previa uma folha **4 × 1** de **1916 × 821 px** (quatro quadros de 479 × 821), mas sinalizava o PNG como **ausente**. Agora o criador forneceu o original `Mago Astral Sombrio em Quatro Quadros(1).png`, coincidente em dimensões, com SHA-256 `87f63f78130ffeb171f766dcdad44ac220167f7f027e61be3828e2536288d24b`.

Também foi enviada `Ficha de Personagem_ Mago Celestial Gótico.png`, uma folha RGBA de **1448 × 1086 px**, quatro poses de **362 × 1086** cada. Elas são **retratos de corpo inteiro para cenas**, não sprites de caminhada. SHA-256 `21edb1c9320fcd052f0aa89f5816ad463ad122c0c06f40ee781231268413abfe`.

O ZIP `Peren_Kerrhylon_Assets_v6_Batalha_Integrada.zip` (SHA-256 `8165928775b3dd8ac7b1cc0bc1c9e5f5e6321c080dc3ae7770827dc75759695d`) inclui:

- **Void Rift**, oito quadros originais de **543 × 362 px**;
- **Coleta Geral**, quatro direções × quatro quadros, **640 × 760 px**: seu SHA `42cb2f2827a9eb1a71c52fef858f23a53fb28445071aeb3406c972f923b72ba1` é idêntico ao já contemplado na PR #62. Não duplicar essa arte.

### Estado atual da PR

Esta PR adiciona **contratos e scripts de integração**. As duas imagens grandes e os oito PNGs Void Rift estão **preservados no pacote binário entregue na conversa**, mas **ainda não foram enviados ao GitHub**. O conector GitHub disponível aceita gravação de texto; o importador fornecido gera e confere exatamente as saídas binárias quando os três originais estiverem disponíveis no clone local. Até esse passo, as entradas ficam com `importStatus: binary-pending` e não devem ser exibidas como conteúdo publicado.

## Endereçamento planejado

```
phaser-demo-m1hf/
  art/
    characters/peren/
      battler/v6/
        manifest.json
        peren_idle_battler_4frames.png      # pendente do importador
        idle_01.png ... idle_04.png       # pendentes
      scenes/portraits/
        manifest.json
        peren_scene_portraits_4poses.png   # pendente
        portrait_01.png ... portrait_04.png # pendentes
    battle/peren-void-rift/
      manifest.json
      01_charge_spark.png ... 08_dissipation.png # pendentes
  scene-portraits.mjs      # catálogo ES module, sem carregamentos automáticos
```

Os IDs `peren.scene.frontal`, `peren.scene.manto`, `peren.scene.orbe` e `peren.scene.invocacao` são estáveis e podem ser usados futuramente em diálogos, cenas roteirizadas e cut-ins. Não é necessário vincular as poses a textos ou mudanças de personagem agora.

## Reprodução e uso

- **Idle Battler:** quatro quadros em loop, **4 FPS**, ancoragem pelo chão e ajuste proporcional; quando o PNG for importado e a fonte Phaser reconstruída, usar somente no `BattleScene`. Sem alterar a exploração 48 × 64.
- **Quatro portraits:** selecionar por ID e dimensionar mantendo razão **362:1086**, sem transformar retratos completos em sprites de 48 × 64. Usar `queuePerenScenePortraits(scene,{assetsInstalled:true})` somente quando os arquivos estiverem instalados.
- **Void Rift:** o ZIP contém **quadros com fundo esverdeado, numeração impressa e fragmentos de composição vizinha**. Não estão prontos para composição transparente em combate. Guardar originais, preparar limpeza supervisionada e validar a transparência antes de habilitar.
- **Void Rift não é uma magia ativa separada no `combat.js`.** Não introduzir custo de PM, dano ou regras novas nesta PR. A sequência poderá servir como cut-in de magia arcana já existente após aprovação.
- **Fallback:** no runtime existente, manter os sprites e VFX atuais até os PNGs chegarem e os testes passarem. Não afetar `finishBattle`, saves e inventários.
- **Offline:** não adicionar caminhos pendentes ao precache do service worker; `cache.addAll` falharia e poderia quebrar a instalação PWA.

## Como efetivar a importação dos PNGs

Depois de colocar os três arquivos originais no computador que possui o clone Git:

```bash
python -m pip install Pillow
python ferramentas/importar_peren_batalha_v6.py \
  --idle "Mago Astral Sombrio em Quatro Quadros(1).png" \
  --portraits "Ficha de Personagem_ Mago Celestial Gótico.png" \
  --v6zip "Peren_Kerrhylon_Assets_v6_Batalha_Integrada.zip"
node --test tests/qa_peren_v6_assets.mjs
```

O importador recusa alterações que não correspondam aos hashes aprovados e não sobrescreve binários diferentes. **Depois da importação**, adicionar/commitar os PNGs, conferir via GitHub e só então liberar a galeria/jogo e a atualização do cache PWA.

## Entregas locais para inspeção

O artefato de conversa `Peren_V6_Batalha_e_4_Retratos_Pacote.zip` contém os dois masters intactos, oito imagens individuais dos personagens, oito imagens do Void Rift, uma cópia de referência da coleta geral, metadados com hashes individuais, `verify.py`, `viewer.html` e folha de contato. Não confundir o ZIP entregue na conversa com upload bem-sucedido no repositório.

## Critérios de aceite de cena

1. Quatro portraits resolvem seus IDs no navegador **sem fallback nem 404** após a importação.
2. Nenhum retrato ultrapassa os limites da área de diálogo nos tamanhos 360×800, 390×844 e 1280×800.
3. Idle não pisca nem desloca verticalmente durante o loop de quatro quadros.
4. Void Rift exibe transparência real antes de sua integração cinematográfica; números e fundo verde não aparecem.
5. Comandados por teclado, controle e toque, os combates continuam funcionando sem regressão.
6. A publicação do pacote e cache PWA só ocorre após QA e revisão visual.

## Revisão de recortes de quatro colunas

As fontes têm elementos com alfa atravessando os limites de coluna. A folha de idle apresenta aproximadamente **3,5–12,1%** de alfa significativo nos divisores; a folha de portraits, **37–45,1%**. O corte retangular preserva pixels, mas pode capturar fios/mantos de poses vizinhas e cortar pontas da roupa. As quatro imagens individuais geradas são **pré-recortes de montagem**, não sprites perfeitamente isolados. Antes de publicar, mascarar/isolá-las com revisão artística e comparar com os masters.

## Prévia local de combate e entrega completa (22/10/2026)

O pacote binário entregue na conversa `Peren_V6_Integracao_Previa_Completa.zip` contém `arena.html`, uma prévia **funcional** que usa os 4 frames de idle a 4 FPS, oferece botões para conjuração Void Rift, dano simulado, vitória e seleção dos **4 portraits**. Os 19 recursos binários foram conferidos por hash com `verify.py`.

Execute `python -m http.server 8765` na pasta extraída e visite `http://localhost:8765/arena.html` (ou o subdiretório conforme a extração). **Isso é uma demonstração visual independente**, não integração das regras do `BattleScene` do Phaser publicado, nem deploy do GitHub Pages.

**Bloqueio explícito de publicação:** a conexão GitHub acessível nesta conversa não permitiu transferir os PNGs locais, e o ambiente de arquivos não possui acesso direto de rede ao GitHub. Portanto os manifestos da PR permanecem `binary-pending` e o site público não deve ser anunciado como atualizado. Quando existir um fluxo autorizado de envio dos binários, aplicar o importador, versionar os PNGs, revisar transparências/cortes e incluir os assets no build e no cache offline antes de publicar.
