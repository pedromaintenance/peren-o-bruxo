# M1h-F.17 — Recibo legível no celular

Melhoria de UX sobre o recibo da F.16, **sem alterações no motor, no pagamento, no catálogo, nos controles ou nos formatos de save**.

- O resumo fechado do painel mostra agora o desfecho real (vitória, fuga ou derrota), em vez de ocultar a informação sob “consultar resultado”.
- Área de acionamento de pelo menos 48 px CSS, fontes mínimas de 14 px no título e nos itens, quebra de linhas para nomes longos e foco de teclado visível, mantendo o elemento nativo `details/summary`.
- Um smoke Playwright com perfil móvel/touch roda uma vitória real e testa layout e interação em 320×700, 360×800, 390×844 e 844×390, além de abrir via Enter, confirmar nomes dos itens, pagamento único e isolamento dos saves.
- Os testes simulados **não equivalem a testar num Android físico**. Esse aceite permanece manual.

## Critérios
- [x] Estilos e resumo com resultado implementados na fonte experimental; cobertura Node e smoke de navegador incluídos.
- [ ] CI Node/Vite/Chromium aprovado.
- [ ] Bundle isolado publicado após auditoria de diff, sem mesclar fonte experimental na `main`.
- [ ] QA público do GitHub Pages aprovado.
- [ ] Teste no Android físico (tamanho dos controles, leitor de tela, paisagem, teclado e PWA offline) ainda pendente.
