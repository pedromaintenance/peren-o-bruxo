# Constituição de Design v1.0 — Peren, o Bruxo
**Aprovação do criador:** 03/11/2026. **Estado:** diretrizes autorizadas para curadoria autônoma e desenvolvimento experimental. Esta aprovação NÃO promove builds experimentais para o jogo publicado e NÃO autoriza alterações destrutivas de dados.

## 1. Natureza do produto
1. Peren, o Bruxo — Mercador da Carcaça é **um único sandbox** de exploração, comércio, ofícios, coleta, magia, encontros e progressão. O RPG de mesa inspira personagem e universo; não há uma segunda campanha obrigatória.
2. Coleta, alquimia e crafting constituem um eixo central da experiência. Combate não é a medida única de valor de um ingrediente.
3. Efeitos extraordinários ou transformativos são desejáveis. **Não reduzir potência simplesmente por balanceamento de combate.**
4. A coerência com os materiais, ecologias, povos e cosmologia da Carcaça governa a expansão. Referências a outros jogos são pontos de partida, nunca autoridade sobre o cânone.

## 2. Leis alquímicas aprovadas
5. Uma preparação é formada por **efeitos compartilhados por pelo menos dois TIPOS distintos de ingredientes**. Quantidades repetidas do mesmo tipo não constituem fontes distintas.
6. As combinações são emergentes, não exigem uma receita fixa por efeito. Misturas com nenhum efeito comum falham; ingredientes com dois ou mais efeitos comuns produzem preparações de efeitos múltiplos.
7. Efeitos positivos e negativos coexistem; não remover efeitos inconvenientes automaticamente. Em uma mistura com três ou mais tipos, cada efeito precisa de no mínimo duas fontes distintas, independentemente dos demais efeitos.
8. Cada ingrediente tem pelo menos três atributos curados; atributos extras são permitidos se fundamentados. Intensidades de ingredientes são inteiros de I a III. Essa escala **não é um teto geral de poder para o gameplay**.
9. Não reintroduzir Stamina ou derivados. Quando relevante, representar diferenças de esforço e aptidão por Força, Destreza, Constituição ou outras mecânicas realmente existentes.
10. Transformações sobrenaturais podem ser progressivas e persistentes: Vampirismo não é mero buff e pode culminar na transformação do personagem. Sua implementação requer estados e consequências verificáveis.

## 3. Gameplay e direção de desenvolvimento aprovados
11. Peren aprende por experimentação, estudo, exploração, textos, mestres e observação. Identificação e descoberta de propriedades devem integrar o jogo.
12. Ingredientes têm ecossistemas e localizações coerentes. Biomas e trajetos devem afetar coleta; não embaralhar localização apenas para alimentar probabilidades.
13. Perícia de alquimia, equipamento, preparação e qualidade devem gerar progressão materialmente perceptível, sem destruir os atributos canônicos.
14. Doenças, intoxicações, maldições e transformações precisam de regras de persistência e tratamento; não são necessariamente estados de um turno.
15. A economia deve valorizar conhecimento, trabalho e deslocamento: preços e demanda regionais, custos dos insumos e possibilidade de negociar preparados.

## 4. Integridade e identidade artística
16. Preservar IDs e referências persistidas, incluindo as receitas antigas, até migração explícita, versionada e reversível.
17. Usar sprites por família de recipientes, preparados e estados visuais; não fabricar uma arte específica para cada combinação. Respeitar arte oficial, paleta e escola visual Escuridão/Vazio.
18. Clássico HTML/JS e prévia Phaser são **implementações técnicas do mesmo jogo**, não dois jogos. Verificar o runtime realmente ativo antes de alterar bundle ou código.
19. Preservar inventário, economia, progressão, combate, PWA/offline e saves existentes. Nunca limpar armazenamento como método de deploy. O laboratório de itens continua somente leitura.
20. Decisões, hipóteses, alterações e evidências de testes são persistidas no repositório. Diferenciar **documentado**, **implementado**, **testado**, **publicado** e **aprovado artisticamente**.

## 5. Competência delegada à assistência
**Autorizado sem voto ingrediente por ingrediente:** prosseguir com a auditoria dos 111 ingredientes; reparar inconsistências comprovadas e documentadas; criar descrições fundamentadas, testes, relatórios e propostas; realizar alterações curatoriais justificadas com histórico verificável, sem desfazer decisões expressas do criador; desenvolver protótipos e recursos experimentais em branch isolada.

**Reservado ao criador:** mudança na identidade de Peren, na cosmologia fundamental, descarte de conteúdo já aprovado, substituição de arte oficial, migração destrutiva de save, alteração irreversível na economia/progressão e promoção de grande substituição de gameplay ao jogo publicado.

**Regra para incerteza:** primeiro gerar evidências e comparar hipóteses; se a escolha mudar o cânone ou tornar dados irreversíveis, documentar alternativas e solicitar decisão específica. Não confundir autonomia editorial com liberdade de retcon.

## 6. Mecanismos ainda não fixados pelo cânone
A aprovação delega **prototipagem e avaliação**, e não fixa fórmulas numéricas de potência ou duração. Permanecem para decisão por testes: potência e contribuição das fontes, número de ingredientes por bancada (interface inicial sugerida: 2–4), custos de mistura fracassada, recipiente versus veneno, duração, acumulação, métodos de identificação, instrumentos e qualidade, receitas especiais legadas, mercado e migração de saves. Registrar a hipótese adotada antes de integrá-la ao runtime.

## 7. Proteções e critérios de aceite
- Trabalhar com branches de experimento, commits pequenos e arquivos explicitados; não usar merge automático na branch publicada.
- **Integridade combinatória:** A+B = B+A; repetição da mesma espécie não duplica fontes; 3+ espécies ativam somente efeitos com duas fontes; vários efeitos compartilhados aparecem todos; ausência de interseção falha sem criar produto.
- **Integridade canônica:** 111 ingredientes atuais, 53 efeitos e 0 efeitos isolados são a linha de base de 03/11/2026, não metas artificiais imutáveis. Conferir quaisquer alterações contra os dados reais.
- **Integridade de save:** testes de carga, exportação, importação, inventário, progressão, combate, economia, coleta e PWA. Jamais manipular saves reais do usuário.
- **Aceite da entrega:** hash e URL de commit, diff, testes executados e pendentes, riscos, versão de runtime e status de publicação. Um teste local não é prova de Pages; CI não substitui validação no dispositivo físico.

## 8. Fontes canônicas e precedência
1. Decisões expressas do criador e este documento.
2. `docs/auditoria-alquimia-peren.md` — histórico de alterações e justificativas aprovadas.
3. `data/curadoria_ingredientes.json` — estado vigente dos efeitos/IDs e política quantitativa.
4. `AGENTS.md` e `ROADMAP.md` — regras operacionais, limites dos runtimes e processo de publicação.
5. Código, dados, testes e materiais de lore do repositório.

Conflitos entre documentação desatualizada e curadoria não devem ser corrigidos silenciosamente: registrar e verificar o histórico. Esta constituição não edita arquivos de gameplay por si só.
