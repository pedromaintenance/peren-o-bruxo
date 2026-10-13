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
- Exibir a **Portomonte** pelo marco da saída, ou gerar outra floresta pelo menu.
- Cada mapa tem seed determinística (`?seed=murin-001`) e rota entre entrada e saída. Recursos são IDs de ingredientes oficiais do catálogo adaptado de Peren.

## Qualidade e limitações

- Peren: 4 direções × 8 ações × 4 frames = **128 frames**, atlas PNG com animações separadas. Visuais são **arte autoral de prova de conceito**, não aprovação artística final.
- Floresta: 8 pisos, 3 árvores, 6 props, rio, ponte, colisões estáticas, 33 nós de coleta e marcador de saída.
- Sistema atual da `main`: intocado. O inventário provisório não modifica o save existente.
- Sem monstros nem combate neste recorte M1a; incluir na próxima fatia quando a experiência de movimento estiver aprovada.
- Aprovado no script de QA de geração e rotas; execução em navegador/celular só marcada após Playwright e teste físico.