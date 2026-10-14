# M1g-F — Auditoria de qualidade e aceite da vertical slice

**Branch:** `feature/phaser-m1g-f-vertical-slice-audit` — PR empilhada sobre M1g-E, sem alterações na `main` ou no jogo clássico.

## Avaliação por sistema: conceito × implementação

| Tela | Funcionalidade atual | Qualidade gráfica / lacunas |
| --- | --- | --- |
| Portomonte | Retrato de Peren, status reais, cenário, navegação, save | Composição em painéis premium; cenário artístico da versão clássica, não arte de produção definitiva |
| Inventário | Mochila real, filtros, detalhes, três equipamentos canônicos, indicadores | Grade ainda usa **glifos simbólicos** no lugar de sprites únicos por item; slots não equipáveis sem regra |
| Alquimia | Receitas e ofícios reais, reagentes, criação, sucesso/erro | Oficina SVG autoral provisória; caldeirão, itens e personagens precisam de pixel art definitiva |
| Comércio | Mercadores oficiais, preço, quantidade, compra/venda atômica, bolsa | Retratos e feira SVGs provisórios; o catálogo **não define estoques particulares dos mercadores** |
| Exploração Mürin | Mapa real e sprites Phaser, HUD PV/PM/nível/ouro, toque/gamepad | HUD mais compacto; sprites e ambiente M1e continuam em avaliação artística |
| Encontro / Batalha | Três inimigos reais, retratos/atlas, sete comandos e feedback, batalha/liquidação real | Painel JRPG premium; artes de monstros e efeitos ainda em revisão, sem novos golpes fictícios |

**Importante:** O design aprovado é o **alvo**, não uma confirmação de que o jogo já o alcançou. Não reutilizar imagens conceituais achatadas como interfaces. Não inventar opções de gameplay para preencher o layout.

## Polimentos realizados

- Corrigir gradiente inválido da barra EXP no design system.
- Respeitar alvo mínimo de 44px nos botões de batalha mesmo em largura 360/390px.
- PWA da demonstração permite mudança de orientação portrait/landscape, em vez de bloquear portrait.
- Foco movido para o comando de encontro quando uma criatura é detectada; Tab/Shift+Tab ficam entre Enfrentar/Recuar; Escape recua; controles de exploração ficam `inert` enquanto o modal está aberto.
- Ao vencer/fugir e voltar à floresta, foco retorna para o botão Colher; atalhos Xbox e mouse continuam delegando ao Phaser.

## Testes automatizados

- `node scripts/vertical-slice-audit.mjs`: Portomonte, Inventário, Alquimia, Comércio, Exploração, Encontro e Combate em **360×800, 390×844, 768×1024, 1280×800, 844×390**. São **7 telas × 5 resoluções = 35 capturas**, sem contar resultados históricos. Audita overflow horizontal, hitboxes de ações principais, foco modal, dados exibidos, fuga sem recompensas, e save clássico preservado.
- `node scripts/audit-package.mjs`: executado **depois** de `npm run build` e `node scripts/prepare-demo.mjs`. Confere manifesto, orientação, escopo isolado, precache dos catálogos/assets, orçamento conservador de JS/CSS e tamanho global. Grava métricas JSON no artefato.
- CI próprio `.github/workflows/phaser-m1g-f.yml`: executa ambas auditorias e todas as regressões anteriores de Portomonte, Inventário, Alquimia, Comércio, Encontros e Combate, inclusive o teste Xbox simulado.
- Capturas e métricas são publicadas no artifact **`peren-m1g-f-auditoria`** da PR.

## Gates para publicação

- [ ] GitHub Actions verde no último commit e relatórios anexados.
- [ ] Comparação visual manual das capturas com os quatro conceitos.
- [ ] Verificação final de contraste/foco por leitor de tela; automação não substitui testes assistivos.
- [ ] Playtest Android físico e Xbox físico.
- [ ] Revisão e aprovação explícita da arte de Peren, monstros, cenários e itens.
- [ ] Revisão por usuário da pilha de PRs e autorização de merge/publicação.

Apenas o **código e os testes funcionais** desta fase podem ser considerados concluídos pelo CI. **Aceite artístico e release seguem bloqueados.**

## Próximo esforço artístico M1h

Priorizar, nesta ordem: Peren e animações, retratos dos monstros e cenários de Mürin; ícones de inventário com sprites reais; oficina de Alquimia; mercadores de Portomonte; refinamento de VFX e tipografia. Cada asset com autoria e aprovação; não substituir dados do catálogo.
