# M1h-C — Refinamento da aparência de Peren

**Status:** candidato artístico independente. **Base:** M1h-B; **branch:** `feature/phaser-m1h-c-peren-refino`.

## Objetivo

Reduzir o aspecto de **cabelo branco blocado** da M1h-B, reforçar o rosto envelhecido e a expressão austera e dar à barba prateada uma leitura mais orgânica, sem acrescentar chapéu, mexer no corpo/cajado ou quebrar as animações. Peren continua um bruxo veterano em manto grafite, não um jovem feiticeiro.

## Implementação

- `scripts/peren-m1hc-generator.mjs`: refinamento direcionado da paleta/linhas com PNGJS, usando **M1h-B como origem**, sem sobrescrever M1e, M1h-A nem M1h-B.
- Variantes: M1e = `public/art/` (padrão), M1h-A = `art-m1h/`, M1h-B = `art-m1hb/`, **M1h-C = `art-m1hc/`**.
- Atlas de **1.536 × 256 pixels**, com 128 frames de 48 × 64 (4 direções × 8 ações × 4 quadros). Só modifica RGB nos pixels já opacos da cabeça, até a linha 42 de cada frame; canal alfa, corpo, cajado e animações permanecem intactos.
- Dentro da cabeça, acrescenta mechas prateadas orientadas ao movimento, sombra na raiz, divisões do cabelo, textura na barba e marcas discretas de idade, com boca mais séria. A mesma direção é aplicada aos três retratos **256 × 256** (normal, conjurando, ferido).
- Opt-in `?art=m1hc` no Phaser e `review.html?art=m1hc` no ateliê. O seletor do ateliê compara as **quatro** variantes. Sem parâmetro, permanece o M1e.
- O gerador é determinístico (sem números aleatórios) e produz `report.json` com status `em_producao` e aprovação `pendente`.

## QA e revisão

- `npm test`: verifica 128 frames efetivamente refinados; dimensões e transparência preservadas; nenhuma alteração no corpo/ações; retratos realmente diferentes; nenhum acesso ao save clássico.
- `node scripts/peren-m1hc-preview.mjs`: gera prancha PNG antes/depois dos retratos e das quatro direções; a base comparativa não é usada como sprite operacional.
- `node scripts/peren-m1hc-browser.mjs`: compara quatro versões na cidade, na floresta, em combate e no ateliê em 360×800, 390×844 e 1280×800, inclusive foco/seleção de todas as 32 animações.
- Workflow dedicado executa QA anterior: 35 telas da vertical slice, auditoria da PWA, fuga sem recompensas e Xbox simulado.

## Resultado do QA

- ✅ [GitHub Actions #38652044683](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38652044683) aprovado após o polimento da geração: PNGJS, 128 frames, 3 retratos, 4 variantes no navegador em três resoluções, regressão das 35 telas e simulação Xbox.
- ✅ [Execução independente #38652039305](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38652039305) aprovada.
- 🎨 Prancha real inspecionada: primeira tentativa de sombreamento apresentava hachuras repetitivas; substituída por agrupamentos de mechas maiores e barba em volumes. A direção final de expressão e boca ainda merece avaliação do usuário. O teste funcional não aprova a arte.
- 📸 Arquivo `peren-m1h-c-refino` nos **Artifacts** do workflow #38652044683: prancha PNG, capturas das quatro variantes e relatório.

### Critérios ainda abertos

- [x] Inspeção preliminar da prancha feita; hachuras repetitivas corrigidas.
- [ ] Revisão artística final da face/boca e leitura do sprite no hardware real.
- [ ] Avaliação estética do usuário, incluindo visual 2×/3× em tela física.
- [ ] Testar Android e controle Xbox reais.
- [ ] Canonizar o sprite apenas depois de aprovação explícita; até lá **o parâmetro experimental é obrigatório**.

**Não foi proposta nenhuma mudança no combate, progressão, catálogos, saves ou mecânica do jogo.**
