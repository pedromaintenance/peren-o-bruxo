# M1h-F.3 — Comparador de monstros e revisão artística

> **Implementação candidata, não aprovação de arte.** Este documento separa métricas técnicas de julgamento artístico humano.

## Entrega implementada

- Nova página estática `phaser-lab/compare.html`, publicada somente quando o bundle isolado do Pages é autorizado.
- Carrega **dois PNGs originais do build atual** em paralelo para cada um dos três monstros: `art-m1he/monsters/{id}/atlas.png` e `art-m1hf/monsters/{id}/atlas.png`.
- Reproduz **a mesma ação de 7**, os **mesmos quatro quadros** e o mesmo FPS em ambos os painéis. Permite pausar, avançar e retroceder quadro e alterar a ampliação.
- Mostra o número de quadros diferentes e a cobertura de pixels opacos. **Essas métricas não inferem qualidade, originalidade ou adequação à Carcaça.**
- Apresenta checklist de seis requisitos, preferência e campo livre de anotações. Permite copiar ou baixar um parecer `.md` **somente por ação do usuário**, sem salvá-lo no navegador ou enviá-lo para serviços.
- Preserva a galeria existente `review.html` e o jogo `?art=m1hf`; adiciona links entre as telas.

## Como testar

Em `phaser-lab/`, executar `npm test`, `npm run build` e iniciar `npm run preview`. Abrir `compare.html` no mesmo servidor Vite. A versão publicada, quando aprovada, ficará em
https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/compare.html

**Playtest visual:** verificar cada criatura em `idle`, `walk`, `alert`, `attack`, `hurt`, `retreat` e `death` com zoom 1× e 2×, em 390×844 e 1280×800. Notar cores, legibilidade, coerência do corpo e diferença real entre movimento e translação. Exportar parecer e anexá-lo à revisão artística.

## Gates automáticos

1. `tests/compare.test.mjs`: fonte das duas variantes, sete ações, ausência de API de storage/envio de dados e exportação manual.
2. `scripts/m1hf-compare-browser.mjs`: Chromium em mobile/desktop; 21 combinações monstro-ação, quadros não vazios, controle quadro a quadro, download de parecer e save experimental inalterado.
3. `vite.config.js`, CI e Pages: `dist/compare.html` deve existir e ser servido com ambos os atlas.
4. A aprovação estética continua **pendente** e exige avaliação humana; os próximos geradores de sprites só entram depois de feedback específico.

## Restrições

**Não substituir nem mesclar sprites automaticamente.** Sem editar mapas, combate, inventário, progressão, save do Peren clássico ou save da prévia. Não carregar dependências gráficas ou dados externos; usar apenas os PNGs já incluídos e auditados na M1h-F.
