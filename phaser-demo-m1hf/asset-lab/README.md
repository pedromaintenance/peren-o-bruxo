# Peren — Asset Forge v7 · laboratório integrado de assets

**Estado:** painel funcional entregue na conversa em `Peren_Asset_Forge_v7_Painel_Standalone.html` (uma página autônoma com as imagens de teste embutidas) e `Peren_Asset_Forge_v7_Painel_Completo.zip` (código, PNGs originais, previews, manifests e testes de hash).

## Escopo validado

- **79 entradas de visualização**, com 167 referências a frames ou imagens.
- **242 arquivos verificados por SHA-256** no ZIP completo.
- Idle Battler 4 frames, Rajada Infernal Battler 8 frames, Void Rift 8 frames originais e 8 versões de chroma experimentais, dois atlas de explosão infernal 8 frames, nove VFX separados, quatro retratos para cenas, 32 componentes do Herdeiro Cósmico, coleta/caminhada/ferimentos e masters para comparar.
- Ferramentas: pesquisa e categorias; reprodução por FPS; pausa, scrub quadro a quadro e looping; fundo chroma/preto/grid; zoom, deslocamento; sobreposição com o battler; export de captura; visualização em celular e desktop.
- A visualização passou em Chromium sem erros JavaScript nos tamanhos 1440×900 e 390×844, incluindo os frames de fogo reais embutidos numa amostra de teste. O teste local verificou também a seleção de oito quadros, busca e controles.

## Acesso e importação

O painel **já funciona no HTML standalone entregue na conversa** sem servidor. Para usar dentro deste repositório, o importador `ferramentas/instalar_asset_forge_v7.py` recebe o ZIP, verifica a integridade e instala o conteúdo em `phaser-demo-m1hf/asset-lab/`, preservando arquivos existentes; os binários não são adicionados por esta PR.

```bash
python ferramentas/instalar_asset_forge_v7.py "/caminho/Peren_Asset_Forge_v7_Painel_Completo.zip"
python phaser-demo-m1hf/asset-lab/verify_assets.py
```

Depois de commitar e publicar todos os binários, a rota prevista será:

```text
https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/asset-lab/
```

**Essa rota ainda não está publicada, não assumir disponibilidade até verificar o Pages.** O ZIP permanece um artefato da conversa: o conector GitHub dessa execução suporta escrita textual, mas não a transferência dos arquivos PNG locais. Nenhuma PR anterior foi falsamente declarada publicada.

## Política de segurança e integração

- O laboratório é **inspeção visual**, não altera `combat.js`, regras, custo de PM, saves nem recompensas. Integração dos battlers ao `BattleScene` continua como etapa distinta, após importação binária.
- Void Rift experimental pode conter números e franjas verdes; versões originais preservadas.
- As folhas de quatro retratos e idle têm cabelos/mantos que atravessam limites entre colunas. Os recortes técnicos não equivalem a máscaras revisadas por artista.
- VFX avulsos infernais não são necessariamente frames sucessivos; a sequência montada no laboratório é ilustrativa.
- Mestres originais preservados; o HTML standalone usa imagens WebP de prévia para ser compacto. Os PNGs completos são o material para integração em produção.
- Assets não são carregados pela tela principal ou pelo service worker até existirem na implantação.

## Próxima etapa

Importar o ZIP completo no clone GitHub, commitar os PNGs (com revisão de transparências), validar no Pages, e depois abrir a implementação dos eventos animados em `BattleScene`, respeitando `stepBattle` e o fallback dos sprites atuais.

## Atualização Asset Forge v8 — Summon Greater Demon

O painel da conversa ganhou três registros: **animação Summon Greater Demon (8 quadros, 2380 ms exatos)**, **atlas transparente 4×2** e **folha master verde**, chegando a **82 registros**. A entrega completa `Peren_Asset_Forge_v8_Summon_Greater_Demon_Pacote_Completo.zip` contém **263 arquivos conferidos por hash**; existe também um HTML standalone para testar sem servidor. O instalador atualizado é `ferramentas/instalar_asset_forge_v8.py`. Manter o v7 como histórico. **Os binários do novo material ainda não foram enviados ao GitHub Pages.**
