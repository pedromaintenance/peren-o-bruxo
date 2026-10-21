# Referência conceitual — Peren Kerrhylon e Mercador da Carcaça

> **Diretriz de produto validada pelo criador em 21/10/2026:** existe somente **Peren, o Bruxo — Mercador da Carcaça**, um sandbox em Modo Livre. **Não criar Modo Campanha, seleção de modos ou reprodução obrigatória da história de mesa.**

## Papel do material de RPG

O dossiê `Dossie_Peren_Kerrhylon_RPG_Carcaca.json` é uma fonte histórica e conceitual do personagem e do cenário. Suas 21 cenas de mesa, o pacto com Lorde Khan, a natureza changeling, o familiar Presas, os conhecidos, as relíquias e as facções ajudam a responder **quem é Peren e como é o mundo**; **não** compõem uma campanha linear que o jogador deve cumprir. A narrativa do videogame pode gerar eventos próprios, cidades, comerciantes, monstros e missões sem copiar o roteiro da mesa.

A ficha nível 7 de D&D foi jogada em outro contexto. A progressão arcade do sandbox começa em nível 1 e é legítima por si; não existe migração, segundo personagem nem nível 7 obrigatório.

## Critérios de adaptação ao jogo único

| Referência de criação | Possível aplicação ao Modo Livre | Limite |
| --- | --- | --- |
| Peren Kerrhylon, bruxo changeling | Identidade visual, descrições, opções sociais e personalização | Não importar poderes de mesa sem regras próprias e testes |
| Lorde Khan e Pacto da Corrente | Contexto de magia, ambientação e eventos opcionais do sandbox | Não exigir que se reproduza um pacto ou cena específica |
| Presas | Inspiração para familiar, companheirismo e exploração | Não transformar poderes narrativos em bônus gratuitos |
| Veyra, Dren, Orel, Tavin | Modelos de pessoas autônomas; inspiração para NPCs e relações | Não recriar a comitiva obrigatória ou seus contratos da mesa |
| Eldroth, Rio Ancestral, cripta dos Sem-Nome | Geografia, ruínas, mistérios e conteúdo explorável *se* fizer sentido ao mundo aberto | Não impor a rota Eldroth → Rio → cripta |
| Artefatos, moedas, rituais e lacres | Referências temáticas para itens e mistérios **opcionais** | Não assumir posse, valores, mecânicas ou soluções sem design aprovado |
| Arte oficial de Peren | Retrato, sprites e identidade do protagonista | Conservar masters, ajustar atlas sem quebrar animações |

## Regras práticas

1. **Uma só experiência:** comércio, ofícios, exploração, missões, batalhas, regiões e economia convivem no mesmo sandbox.
2. **O jogador cria sua história:** fatos da mesa não são objetivos automáticos, conquistas concedidas ou entradas do diário do videogame.
3. **Um produto, duas builds técnicas:** clássico HTML/JS e Phaser experimental são versões do mesmo jogo; saves técnicos separados previnem perda de progresso durante a transição.
4. **Fonte sem retcon:** preservar o dossiê original integralmente como referência, sem reescrever acontecimentos de RPG.
5. **O lore informa o design, não engessa a narrativa:** personagens, facções e lugares podem inspirar sistemas emergentes e encontros inéditos.
6. **Segurança de saves:** não apagar `localStorage` ou migrar conteúdo de experimentos antigos sem solicitação específica. O slot `peren_campanha_v1` criado por protótipos anteriores permanece nos navegadores que o possuam, mas não é mais utilizado pelo jogo.
7. **Qualidade de produto:** dar prioridade a integração dos assets oficiais, UI, mapa, comércio, combate, PWA e missões de mundo aberto — não ao reencenamento da campanha da mesa.

## Histórico de correção

PRs #47–#54 implementaram uma duplicação de experiência por interpretação incorreta. Seus códigos continuam recuperáveis no histórico Git, mas as páginas de campanha e a seleção de modos são retiradas da versão pública jogável. A pesquisa de roteiro não autoriza novas telas, cronologia fixa ou um segundo save.

**Fonte:** [Dossiê narrativo de Peren Kerrhylon](Dossie_Peren_Kerrhylon_RPG_Carcaca.json), documento de referência criativa preservado sem alterações.
