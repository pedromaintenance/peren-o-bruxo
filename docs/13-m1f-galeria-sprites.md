# M1f — Ateliê de sprites e QA visual

**Branch empilhada na M1e. Não altera main, o Peren clássico nem o deploy público.**

A nova rota `phaser-lab/review.html` permite conferir os atlas reais (não mockups), com:
- Peren: 4 direções × 8 ações × 4 quadros; alterar FPS, escala, direção e pose.
- Galho Infectado, Fungo Violeta, Ettercap: 7 ações × 4 quadros.
- Retratos originais, incluindo as duas expressões extras de Peren criadas na M1e.
- Linha de tempo de quatro quadros e reprodução com respeito a `prefers-reduced-motion`.
- Ausência deliberada de acesso a qualquer chave de save.

A configuração multi-page do Vite mantém `index.html` como página jogável e acrescenta `review.html` à pasta `dist`, incluída pelo pipeline da demo. O preparo do service worker usa a lista de arquivos do `dist` e inclui automaticamente a galeria no cache isolado.

## Executar e conferir

```bash
cd phaser-lab
npm install
npm test
npm run dev
# abrir http://localhost:5173/review.html
npm run build
node scripts/prepare-demo.mjs
# confirmar dist/review.html
```

## Critérios de aprovação artística

1. **Identidade:** contrastar as características do Peren com o retrato e os sprites do conceito aprovado, não apenas com um estilo genérico de bruxo.
2. **Legibilidade mobile:** conferir as animações em 2× e 3×; reconhecer movimento de mãos, pés, capa, cajado e efeitos.
3. **Continuidade:** evitar mudanças súbitas de cor, posição da arma, idade aparente ou proporção entre vistas.
4. **Gameplay:** o sprite nunca deve sugerir colisão onde só há copa ou efeito decorativo.
5. **Performance:** testar em telefone real e gamepad físico antes de considerar a arte final.

**A galeria de QA não implica aprovação visual automática**: o gerador M1e é procedural e a referência de direção de arte é significativamente mais sofisticada. A decisão de substituir os assets permanece humana.
