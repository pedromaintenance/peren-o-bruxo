# M1d — Economia real com save clássico protegido

**Empilhada sobre M1c, não substitui o PWA atual.** A branch de laboratório lê a chave clássica `peren_carcaca_save_v1` na **primeira execução** como referência, sem nunca gravar nessa chave. Guarda a cópia evoluída na chave `peren_phaser_save_m1d_v1` (schema 2), com exportação e restauração de backups JSON, revisão e diário transacional.

## Funcionalidades já implementadas

- Importação validada de `version:1` e preservação de nível, XP (`exp`), `bag`, ouro, atributos, proficiências, feitiços, equipamentos, missões, conquistas e histórico; descarta `battle` clássico pendente para não carregar um combate de renderer incompatível.
- Importação é uma cópia de desenvolvimento; **não há retorno/sincronização automática para o jogo clássico**, porque a migração ainda não está pronta para lançamento.
- Combate Phaser utiliza vida, mana, poções equipadas, armamento, defesa, nível e lista de magias da cópia real; as três magias animadas mantêm IDs do catálogo. Resultados debitam poções, vida, mana e registram XP, ouro e ingredientes no save M1d.
- Ledger persistente de recompensas por `battle:<seed>::<instancia>` e coletas por `collect:<seed>::<no>`; operações repetidas não concedem itens/XP uma segunda vez após recarregar.
- Portomonte inclui fabricação em suas oficinas, materiais reais, 2.316 receitas catalogadas, preços de compra e venda compatíveis com a formula do clássico, descanso, inventário e backup JSON; UI lista poucos itens para manter legibilidade.
- Falha de gravação não consome recursos no estado em memória; revisão impede atualização por abas desatualizadas. O save clássico nunca é escrito por esta branch.
- Coleta no mapa custa fadiga leve e não consome ação diária (mudança intencional da exploração contínua; crafting ainda consome uma ação por receita).

## Segurança e limitações

1. Esta etapa opera sobre **save Phaser próprio**, não é ainda migração bidirecional; jogadores do PWA 0.1.2 continuam jogando normalmente e **não recebem automaticamente** as conquistas do Phaser.
2. Somente o mapa Mürin e três monstros/magias têm combate visual. Outros 219 monstros e 351 magias seguem no planejamento.
3. O catálogo real é empacotado localmente pelo Vite, sem depender de rede em runtime.
4. Testes de navegador simulado e CI não substituem teste físico de Android e controle Xbox.
5. Receita, mercado e cidades respeitam a cidade importada do save. O protótipo visual só tem Portomonte/Mürin; o UI indica a cidade original, ainda sem sistema visual de viagem.
6. Equipamento permanece como IDs legados, sem sistema novo de equipar e criar 3D. A cópia pode ser exportada ou restaurada; **não deve ser aplicada automaticamente ao clássico**.

## Critérios de aceite M1d

- [x] Importador read-only da chave clássica e envelope versionado independente.
- [x] Ledger persistente de coleta e combate; transações atômicas e idempotentes.
- [x] XP, ouro, HP, MP, itens e ofícios vinculados à cópia de save real.
- [x] Oficina/mercado/bolsa no hub usando catálogo e preços existentes.
- [x] Exportação/importação e testes puros para migração de save.
- [x] Compilação e E2E no CI da PR concluídos; imagens inspecionadas: 312 testes Node, Phaser/Vite e Playwright Chromium em 390×844 e 360×800 passaram. [GitHub Actions M1d](https://github.com/pedromaintenance/peren-o-bruxo/actions/runs/38498776102).
- [ ] Teste de 30 minutos em Android real, XP em níveis altos e controle Xbox físico.
- [ ] Mapeamento completo de transações de missões, tutores, encantamento, lojas de todas as cidades.
- [ ] Estratégia aprovada para unificar chaves de save no lançamento futuro.
