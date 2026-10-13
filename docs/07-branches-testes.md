# Organização GitHub, testes e lançamento

## Branches

- `main` = **Peren 0.1.2 estável, publicado no Pages**. Nunca usar para experimentos Phaser.
- `phaser/develop` = integração da migração; pode ficar instável e não é publicada no endereço normal.
- `feature/phaser-fundacao` = documentação, manifestos e laboratório inicial (esta entrega).
- Próximas: `feature/phaser-movimento`, `feature/phaser-ambientes`, `feature/phaser-batalha`, `assets/peren`, `assets/monstros-001`, `assets/cidades-001` etc.
- `fix/phaser-*` para problemas isolados. Abrir PR para `phaser/develop`, revisar e integrar. Ao atingir milestone, abrir PR `phaser/develop` → `main`, com aprovação explícita.

## Regras de merge

1. PR sempre explicita arquivos alterados, IDs de catálogo afetados, testes executados e imagens/vídeo do resultado visual.
2. **Não misturar** revisão de milhares de assets com refatoração do motor num só PR.
3. Testes de regressão do Peren clássico devem continuar aprovados antes da migração final.
4. Antes da release: backup de saves, plano de rollback e validação de cache offline.
5. `phaser/develop` não é sinônimo de release; teste e aprovação vêm primeiro.

## Testes automatizados

- **Integridade do catálogo:** IDs únicos, referências a dados existentes e manifesto determinístico; `--check` exige que o arquivo gerado corresponda.
- **Cobertura visual:** cada ID possui entrada planejada ou asset aprovado; auditar caminhos e clips para aqueles marcados `integrado`/`aprovado`.
- **Regressão:** `tests/qa_smoke.py`, `tests/qa_tutores.py` do Peren original; ampliar para treino/forja/comércio após exploração.
- **Jogabilidade:** seed determinística, saída alcançável, coleta válida, animação não concede XP, múltiplos cliques e refresh não duplicam loot.
- **Compatibilidade:** telas 360, 375, 390, 430 pixels, desktop, toque, teclado, modo offline; `prefers-reduced-motion`.

## Padrão para próximos lotes de trabalho

Abrir Issue → definir quantidades e IDs → produzir assets e animações → integrar cena → executar testes → revisão de screenshot e conformidade visual → PR para `phaser/develop` → merge após aprovação. Manter um changelog no PR. A release do PWA principal acontece apenas quando a experiência integrada for realmente superior à 0.1.2.