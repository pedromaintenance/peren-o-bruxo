# Laboratório M1a — Mürin e movimento de Peren (Phaser 3)

**Isolado do Peren publicado:** este laboratório não lê nem grava `peren_carcaca_save_v1`. Ele testa apenas movimentação/colheita/colisão/retorno ao menu Portomonte com inventário **temporário**. Não é o M1 inteiro; combate, missões, monstros e economia compartilhada ficam para fases seguintes.

## Executar

```bash
cd phaser-lab
npm install          # conexão necessária só durante instalação
npm test             # seeds/rotas/colheita: sem navegador
npm run dev          # copia os sprites autorais e inicia Vite
npm run build        # empacota a dependência Phaser no bundle, sem CDN
npm run preview
```

Os assets do build são copiados pelo script Node `scripts/sync-assets.mjs`, da pasta canônica `phaser/assets` para `phaser-lab/public/art` (temporário e ignorado pelo Git). Basta Node instalado; não exige Python para jogar. Na versão distribuída, o bundle do Phaser precisa ser disponibilizado **localmente**, pois não é CDN.

## Controles

- PC: `WASD`/setas, `Shift` para correr, `E` ou `Espaço` para colher.
- Celular: arrastar no círculo inferior esquerdo, botões **Correr** e **Colher** à direita.
- **Gamepad Xbox (USB ou Bluetooth, mapeamento padrão do navegador):** analógico esquerdo ou direcional para andar; **RT**, **RB** ou **L3** para correr; **A/X** para colher/interagir; **Y** ou **View** abre a bolsa; **B** ou **Menu (☰)** pausa/retorna a Portomonte. Na cidade, direcional para escolher opções, **A** para confirmar, **B/Menu** para retomar a última expedição. Não necessita teclado depois da primeira ativação do controle.
- O navegador pode exigir apertar qualquer botão físico após conectar; alguns navegadores/dispositivos não expõem o controle pela Gamepad API. Desconectar zera o comando imediatamente, e uma zona morta de 20% evita deriva.
- Exibir a **Portomonte** pelo marco da saída, ou gerar outra floresta pelo menu.
- Cada mapa tem seed determinística (`?seed=murin-001`) e rota entre entrada e saída. Recursos são IDs de ingredientes oficiais do catálogo adaptado de Peren.

## Qualidade e limitações

- Peren: 4 direções × 8 ações × 4 frames = **128 frames**, atlas PNG com animações separadas. Visuais são **arte autoral de prova de conceito**, não aprovação artística final.
- Floresta: 8 pisos, 3 árvores, 6 props, rio, ponte, colisões estáticas, 33 nós de coleta e marcador de saída.
- Sistema atual da `main`: intocado. O inventário provisório não modifica o save existente.
- Sem monstros nem combate neste recorte M1a; incluir na próxima fatia quando a experiência de movimento estiver aprovada.
- Aprovado no script de QA de geração e rotas; execução em navegador/celular só marcada após Playwright e teste físico.

Documentação de contrato de controles, incluindo combate planejado: [`docs/09-gamepad-xbox.md`](../docs/09-gamepad-xbox.md).

## M1b — Criaturas animadas de Mürin

A branch `feature/phaser-m1b-criaturas` adiciona três espécies do catálogo existente,
seis patrulhas por mapa e encontros com **observação e recuo seguro**. Esses encontros
**não** oferecem XP nem loot ainda, pois a integração ao motor de combate clássico
está planejada para M1c. Ambiente: vegetação como cobertura, névoa limitando visão
e solo encharcado reduzindo deslocamento. Sem alteração do save da `main`.

Detalhes e testes em [`docs/10-m1b-criaturas.md`](../docs/10-m1b-criaturas.md).

## M1c — Batalha animada no Phaser

A PR M1c acrescenta cena JRPG com 3 monstros, animações, combate por turnos, 3 VFX e carteira de XP/loot **apenas de teste**. O Peren clássico e seu save ficam intactos. Em um encontro, toque **ENFRENTAR**; ataque, conjure, defenda, beba poção ou fuja; ao terminar, toque **RETORNAR**. Controles Xbox: A confirmar, B fuga, X poção, Y fogo, direcional/analógico para escolha.

Os catálogos de monstros e magias são as fontes das estatísticas, IDs e custos. A futura M1d extrairá o motor econômico compartilhado antes de permitir persistência real de loot e XP. Consulte `docs/11-m1c-combate.md`.


## M1d — Economia e progresso persistentes (PR #5)

O laboratório **importa uma cópia read-only** do save clássico `peren_carcaca_save_v1` na primeira execução. As vitórias, materiais, ouro, HP, MP, experiência, ações e receitas passam a ser gravados em **`peren_phaser_save_m1d_v1`**. O save clássico original nunca é sobrescrito nesta etapa. Existe um botão para exportar e importar **backup Phaser**.

No hub de Portomonte, **Oficinas** oferece receitas vinculadas ao catálogo real, **Comércio** compra suprimentos e **Vender** negocia itens já existentes na mochila; os preços e os requisitos de proficiência usam as fórmulas do jogo original. Coleta e saque possuem ledger persistente por mapa/instância para evitar duplicação após reload. **Descanse** para renovar ações antes de fabricar novamente.

Os catálogos de dados são copiados de `data/` para `phaser-lab/public/data/` na branch de integração e ficam empacotados com o build, sem dependência de API em runtime. `npm test` cobre 312 cenários, e a execução Playwright da M1d confirmou importação, coleta, vitória, fuga, crafting, compra, reload e preservação do save clássico em 390 e 360 px.

**Limites:** três monstros, três magias e uma zona ilustrada; não existe sincronização bidirecional com o PWA antigo. O Playwright não substitui Android e Xbox reais. As PRs são empilhadas; não mesclar esta branch diretamente em `main`. Veja [docs/12-m1d-progresso.md](../docs/12-m1d-progresso.md).
