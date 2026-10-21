# Adaptação de Peren Kerrhylon ao videogame — Auditoria narrativa e técnica

**Data da análise:** 20/10/2026 · **Dossiê:** [v1.0.0, 20/10/2026](Dossie_Peren_Kerrhylon_RPG_Carcaca.json) · **Estado:** proposta de direção; **nenhuma alteração jogável incluída nesta entrega**.

> **Regra central:** a campanha da mesa é fonte principal **da biografia, vínculos, acontecimentos, decisões e obrigações de Peren**. Ela **não** é uma ficha D&D totalmente validada nem substitui automaticamente o cânone geral do cenário Carcaça. Dúvidas e exceções precisam permanecer identificadas. O motor atual é um videogame derivado, não um simulador 5e completo.

## 1. Diagnóstico do jogo de hoje

| Eixo | Jogo atual verificável no repositório | Dossiê da campanha | Consequência de design |
| --- | --- | --- | --- |
| Premissa | `README.md`: «Mercador da Carcaça», sandbox de comércio, 9 cidades/10 expedições/32 missões | Investigação dos **dez lacres**, impedimento da libertação da **fome que aprende**, preço do poder | Comércio e ofícios devem servir à investigação, à custódia e à proteção; não substituir a motivação dramática |
| Começo do personagem | `game.js:fresh()` e `phaser-lab/src/progress.js:newClassicState()`: nível 1, Portomonte, 180 ouro, 114 PV, 68 PM | Peren changeling, bruxo do Gênio/Efreeti, **nível 7**; **51 PV** reportados, CA 11, saldo monetário total **não contado** | São dois **estados diferentes**. Não chamar o save sandbox de continuação literal e **não converter 51 PV diretamente** para a escala arcade |
| Magia | `phaser-lab/src/combat.js`: Raio de Fogo, Raio de Gelo, Mísseis Mágicos; MP por feitiço; ataque genérico de arma | **Rajada Mística com 2 feixes**, Pacto da Corrente, duas vagas de pacto do 4º círculo, Khan, telepatia e Presas | Exige um **perfil de regras de campanha versionado**, com custos, descanso, concentrações e decisões de balanceamento próprias |
| Exploração | Phaser joga na **Floresta de Mürin**, entra/sai por Portomonte; furtividade, passos sonoros, seis criaturas | Cena presente é um **acampamento em Eldroth**, após a cripta, **rumo ao Rio Ancestral**; Veyra ferida | Mürin **não é Eldroth**. Preservar Mürin como atividade do sandbox; criar regiões narrativas novas sem renomear o mapa existente |
| Companhia | `phaser-lab/src/exploration.js`: Peren controla-se sozinho; NPCs aliados da campanha não atuam | Veyra Sull, Dren, Orel, Tavin Rook e o familiar Presas; lealdade **não compulsória**, trabalho remunerado e responsabilidades | Companhia com **vontade própria**, confiança, condições, ferimentos e contratos; não quatro «slots de bônus de dano» |
| Identidade | Nome Peren e retratos alternativos; classe/persona não acionam ficção concreta | Changeling, olhos estrelados, formas como **Tim Buckham**, donzela ferida e Serrik | Disfarce, percepção social e documentos devem participar das escolhas; **«demônio» é epíteto/autodeclaração**, não espécie demonstrada |
| Relíquias | Catálogo de itens mágicos e bônus comerciais/combate genéricos | **Anel do Caminho**, **Cajado do Limiar** e **Lâmpada de Khan**, preços recíprocos e juramento | Modelar como **sistemas narrativos com contrapartidas**, nunca como simples itens de «+X atributos» |
| Missões | `data/missoes.json`: 32 contratos estruturados, normalmente matar/coletar por ouro/XP | Três moedas ao Rio; água em vaso; nome verdadeiro; testemunhas voluntárias; impedir saque dos lacres | Introduzir tarefas com **estado, evidência, consentimento, custo e consequências**, não converter tudo em matar inimigos |
| Diário | `phaser-lab/src/ui-journal.js`: só exibe histórico e crônicas já existentes no *save*, corretamente não inventa eventos | Dossiê registra **21 marcos de campanha** já ocorridos | Separar **«Crônica canônica anterior»** (leitura do dossiê) de **«Diário deste save»** (transações reais). Nunca falsificar histórico do jogador |
| Geopolítica | Nove cidades comerciais e catálogos regionais; mecânica de preços é útil | Rede de coletores; Karsthal, Casa do Peso Justo, Confraria do Fio Rubro, ocupação feérica; Custódia/posse/dívida/proteção | Missões devem oferecer soluções legais, mercantis, diplomáticas, furtivas e violentas com impactos persistentes |

### Outros achados específicos

- A árvore de combate da prévia (`phaser-lab/src/combat.js`) foi deliberadamente simplificada para três feitiços de combate, recompensas idempotentes e recuperação segura. É uma boa **base tecnológica**, mas não demonstra ser a ficha do bruxo nível 7. Os testes de F.1–F.20 e o isolamento dos saves devem permanecer.
- A camada econômica existente (`data/itens.json`, `data/receitas.json`, `data/cidades.json` e `phaser-lab/src/progress.js`) é uma vantagem para **custódia de artefatos, pagamento dos trabalhadores, aprovisionamento da comitiva, contrabando e investigação de proveniência**; não precisamos descartá-la.
- Os catálogos de missões e expedições não incluem a progressão canônica da cripta dos Sem-Nome até o Rio Ancestral. Nenhuma cidade de Portomonte é apresentada no dossiê como ponto de partida da cena atual.
- O diário do protótipo **não deve receber retroativamente 21 vitórias/transações**. Essas cenas não são ações executadas na prévia.
- O dossiê contém **nenhum retrato binário**: cita nomes de imagens de referência. Sem a arte original correspondente, não se pode declarar o visual definitivamente aprovado.

## 2. Decisão recomendada: dois modos sem retcon ou perda de progresso

1. **Modo Livre — Mercador da Carcaça.** Manter início em Portomonte, nível 1, Mürin, progressão arcade, loja, inventário, save e controles. Ele é uma **releitura lúdica** do personagem, não a sequência cronológica da campanha D&D.
2. **Modo Campanha — Peren Kerrhylon.** Nova jornada, ancorada no **acampamento de Eldroth após a cripta dos Sem-Nome**. Peren já tem seu pacto, Presas, os quatro companheiros, anel, cajado e promessas. O objetivo inicial é chegar ao Rio Ancestral, levando as três moedas e preparando o retorno à cripta. A posição narrativa não deve ser antecipada sem uma ação do jogador.

O modo campanha precisa de **save independente e esquema explicitamente versionado**, sem importação automática do clássico e sem migrar silenciosamente os números de D&D para a engine. O modo livre e a prévia M1h-F permanecem funcionando, inclusive offline.

## 3. Plano por marcos e critérios de aceite

| Marco | Prioridade | Entrega pequena e verificável | Condição obrigatória |
| --- | --- | --- | --- |
| **L0 — Fonte** | P0 | Dossiê JSON v1.0.0 íntegro em `lore/peren/`, README de uso, auditoria e roadmap | Distinguir fatos, declaração do personagem, interpretação, *homebrew* e desconhecido; arquivo **não carregado como save** |
| **L1 — Crônica de campanha** | P0 | Painel **somente de leitura** com premissa, 21 marcos, pessoas, vínculos, objetos e promessas, retirados de projeção controlada do dossiê | Não misturar os eventos pré-existentes com transações do `ui-journal.js` e não expor spoilers sem escolha; JS/PWA offline e mobile testados |
| **L2 — Escolha de modo** | P0 | Seleção explícita Livre × Campanha, com avisos de cronologia, mecânica e **chaves de save separadas** | Testes de regressão do sandbox e preservação do save clássico/Phaser; sem fusão automática |
| **L3 — Acampamento e companhia** | P1 | Cena inicial em Eldroth; diálogo com Veyra, Dren, Orel e Tavin, Presas presente; condições de saúde e responsabilidades sem números inventados | NPCs recusam, negociam e podem discordar; não obrigar permanência; escolhas controladas pelo jogador |
| **L4 — Três caminhos ao Rio** | P1 | Escolher via oficial, clandestina ou autônoma. Consequências em taxas, exposição à rede, segurança de Veyra e suprimentos | Rotas propostas por Veyra são reais **como opções**, não fatos já escolhidos; nenhuma quilometragem canônica inventada |
| **L5 — Três moedas e rito** | P1 | Preservar oferta das três moedas, fala exata e água em vaso; preparar retorno à cripta e testemunhas | As três moedas **não** podem ser gastas casualmente em comércio; não apropriar a Máscara dos Sem-Nome |
| **L6 — Persona, pacto e familiar** | P1 | Transformações visuais/sociais de changeling, Presas batedor com alcance e risco, Khan como interlocutor de pacto | Não conceder habilidades grátis por clima narrativo; não ensinar Rayos Místicos a Presas indevidamente |
| **L7 — Magia nível 7** | P1 | Perfil de regras narrativo/mecânico separado para Rajada Mística, patrono Gênio, Pacto da Corrente, descanso/slots e conjurações conhecidas | Conferir ficha, PV/CA, lista de magias e *homebrew* antes de atrelar dano, concentração ou custos; não criar vantagens arbitrárias |
| **L8 — Artefatos e lacres** | P2 | Localização por Anel com **rastreabilidade recíproca**; portas do Cajado com **intrusão astral e tabu do passado**, rastreamento de até dez lacres | Só **Caminho** e **Limiar** estão identificados; oito lacres desconhecidos não ganham nomes inventados |
| **L9 — Rede, política e economia** | P2 | Provas, custódia, contratos e reputação com Casa do Peso Justo, Forja, guilda e coletores | Custos e consequências, sem presumir ligação política não demonstrada entre toda a rede e a Corte |
| **L10 — Arte e revisão** | P2 | Retrato de olhos estrelados e aparência escolhida, Presas, comitiva, Eldroth, cripta e Rio | Referências visuais devem ser fornecidas/verificadas; aprovação artística distinta do CI |

**Próxima entrega jogável sugerida:** L1. Ela aproveita o Diário e a infraestrutura offline já existente, cria reconhecimento imediato do Peren da mesa, é reversível e **não precisa decidir primeiro todos os parâmetros D&D 5e**.

## 4. Regras de integridade canônica (aceite para todas as futuras PRs)

- **Nível 7 é da mesa; nível 1 é do sandbox existente.** Os números de PV, CA e espaços de pacto são dados de referência da ficha provisória e não devem substituir instantaneamente o arcade.
- **Não inventar valores**: ouro da cripta, saldos individuais, custos futuros dos artefatos, PV atual de Veyra, posições exatas dos oito lacres, nomes dos mortos e o passado apagado.
- **Não reconstruir memória sacrificada** no rito do anel, sobretudo voz, expressão e detalhes do encontro com o irmão.
- **Não impor pacto nem respeito** aos quatro companheiros; seus contratos são voluntários e podem ser renegociados.
- **Não confundir adjetivos com taxonomia**: autodenominar-se «demônio» não anula a condição canônica de changeling.
- **Sem inflação de poder por narrativa**: ritual de Compreender Idiomas/Servo Invisível, Rajada por Presas e dano a objetos foram adjudicações específicas. Não generalizá-las sem validação da mesa.
- **Não dar automaticamente a Máscara** a Peren: ela foi preservada na cripta e exige condições para qualquer rito.
- **Não confundir Eldroth, Mürin, Ironwood, Portomonte e Karsthal** nem inventar continuidade geográfica ou cronologia sem fonte.
- **Não fingir que lore em JSON significa feature jogável**. Marcar separadamente: arquivado, em design, implementado, testado, publicado e aprovado pelo jogador.

## 5. Perguntas de produto a confirmar antes de L2/L7

1. O Modo Campanha deve usar **combate adaptado arcade** (mais rápido) ou um **modo D&D 5e explícito** (mais próximo da mesa)? São escolhas distintas, ambas podem preservar a biografia.
2. A primeira cena jogável da campanha deve iniciar **exatamente no acampamento após a cripta** (recomendado) ou oferecer um prólogo retrospectivo claramente rotulado?
3. A ficha D&D 5e atual, os limites definitivos de Anel/Cajado e os retratos de referência serão disponibilizados para validação? O dossiê afirma expressamente que esses detalhes estão provisórios.

## 6. Proveniência técnica

Fonte primária arquivada **sem transformação**: [Dossie_Peren_Kerrhylon_RPG_Carcaca.json](Dossie_Peren_Kerrhylon_RPG_Carcaca.json), versão 1.0.0 compilada em 20/10/2026.

Fontes de implementação revisadas nas branches atuais: `README.md`, `game.js`, `data/missoes.json`, `data/expedicoes.json`, `data/cidades.json`, `phaser-lab/src/combat.js`, `phaser-lab/src/progress.js`, `phaser-lab/src/exploration.js`, `phaser-lab/src/ui-guide.js` e `phaser-lab/src/ui-journal.js`. O diretório `phaser-lab/` continua na branch `feature/phaser-m1h-f-free-assets` / PR #24, **não** na `main`.

Nenhuma nova função de jogo foi publicada nesta revisão **documental**; o GitHub Pages mantém a última versão Phaser aprovada antes dela.
