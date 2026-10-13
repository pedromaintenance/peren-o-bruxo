# Direção de arte — proposta para validação

**Proposta não final:** pixel art sombreada, sombria e legível em 390×844; panorama 2D escuro, ouro envelhecido, verde de musgo, vermelho do Mar de Sangue, azul de runas. Não misturar assets com resoluções ou perspectivas incompatíveis. Confirmar com exemplos desenhados antes de fazer lotes extensos.

## Vistas e resolução alvo

| Contexto | Solução proposta | Tamanho inicial de trabalho |
|---|---|---|
| Exploração | top-down 3/4, câmera contínua | tile lógico 32×32 px; sprites de herói de 48×64 px |
| Combate | side-view tipo JRPG com perspectiva suave | figuras em atlas 96×96 ou 128×128 px |
| NPCs | retrato 3/4 + sprite se entrar em mapas | busto 256×256 px |
| Cidade/oficina | pintura de ambiente para fundo de menu | 960×540 px base, recortes mobile |
| Objetos | ícone único + silhueta para drop/coleta | 64×64 px (ou 96×96 para relíquias) |
| Magia | sequências de carga, voo, impacto e dissipação | atlas/canvas de 64–256 px por efeito |

São **padrões provisórios de produção**, sujeitos ao primeiro protótipo validado. Priorizar proporções constantes, contraste e leitura dos botões.

## Cada entidade merece identidade

- Peren: silhueta original, vários equipamentos/armas visíveis e animações para cada estado de jogo relevante.
- Monstros: manter características anatômicas e silhueta próprias; no mínimo `idle`, `walk`, `attack`, `hurt`, `death`, `special` e `cast`/`windup` conforme criatura; não substituir uma espécie por ícone genérico.
- NPCs: nome, retrato exclusivo e ambientação de seu local de trabalho; animações faciais/de interação quando estiverem em cena.
- Magias: nome no catálogo e efeito visual distintivo; variantes podem aproveitar recursos técnicos de uma mesma escola, mas composição final e timing devem distinguir cada feitiço.
- Itens: identidade de ícone individual para todos; animação contextual para coleta, fabricação, equipar, usar e vender; armas e armaduras importantes aparecem no personagem.
- Lugares: skyline/ambientação exclusivos para cada cidade e tilesets próprios de cada expedição; animações ambientais (chamas, água, vento, cristais etc.).

## Qualidade e acessibilidade

Atlas otimizado em WebP/PNG com margens, alpha transparente e tratamento de brilho opcional; atlas+JSON para frames. Criar variantes 1x/2x apenas se justificadas. Suportar limitação de partículas e opção **reduzir animações**. A animação comunica ação, mas jamais é condição para uma ação acontecer ou uma informação essencial aparecer.

## Fontes de arte

Preferir **assets autorais**. Materiais CC0 ou permissivos somente com atribuição e licença conferidas; registrar no manifesto o nome do autor, link da licença e quaisquer exigências. Nunca importar diretamente arte de Skyrim, sprites de Final Fantasy ou ilustrações protegidas de D&D sem licença.