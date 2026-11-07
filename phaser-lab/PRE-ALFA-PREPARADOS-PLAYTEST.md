# Pré-alfa — playtest de preparados no combate

**Estado:** funcionalidade desenvolvida na [PR #101](https://github.com/pedromaintenance/peren-o-bruxo/pull/101) (draft), ainda sem promoção ao jogo publicado. Uma mudança incompatível de save é permitida por [Emenda S1](https://github.com/pedromaintenance/peren-o-bruxo/blob/main/docs/constituicao-design-v1.md). Nenhum dado antigo é apagado automaticamente.

## Para executar localmente

Faça checkout da branch `feature/prealfa-consumo-preparados-combate-20261107`, abra um terminal em `phaser-lab/`, execute `npm install` e depois `npm run dev`. Abra a URL local informada pelo Vite. A branch usa uma **chave nova de save pré-alfa**, portanto começa uma partida limpa, sem migrar os saves anteriores. O jogo clássico continua separado.

## Percurso A — Poção de Restaurar Saúde

1. Inicie em **Portomonte** e abra **Alquimia e Criação**.
2. Entre em **Alquimia** e selecione **Experimentação livre**.
3. Misture **Flor Azul da Montanha** + **Asa de Borboleta** (duas espécies canônicas com `restaurar_saude`). Há duas unidades de cada no inventário inicial desta pré-alfa.
4. Confirme a produção de um frasco e observe seu registro entre os preparados.
5. Vá para a **Floresta de Mürin**, entre em combate e faça Peren perder PV antes do uso.
6. No painel **PREPARADOS DA BANCADA**, escolha a instância e aperte **USAR PREPARO ESCOLHIDO**.
7. O frasco deve sumir da seleção após o uso; a restauração experimental é de **+24 PV até o máximo**, seguida pela reação normal do inimigo. O resultado final pode ser inferior ao PV imediatamente após a cura, porque a ação custa um turno.
8. Ao vencer, fugir ou perder, o frasco usado não deve voltar à mochila. Os frascos não usados devem permanecer.

## Percurso B — Restaurar Magia

Prepare **Flor Vermelha** + **Chapéu Branco**, que compartilham `restaurar_magia`. Lance magias antes de usar o frasco no combate; a restauração experimental é de **+12 PM até o máximo**, sem gasto adicional de ação diária. Ambos são ingredientes reais do catálogo; o Chapéu Branco foi acrescentado ao inventário inicial da experiência.

## Cenários de regressão

- Usar a mesma instância duas vezes: a segunda tentativa deve ser recusada, sem perda de turno.
- Preparado com qualquer efeito ainda não executável: **não consumir parcialmente** nem desprezar propriedades.
- Poção comum de combate, via comando **POÇÃO**: permanece usando o fluxo anterior, sem dupla cobrança de inventário.
- Fuga ou derrota após usar um frasco: o saldo restante de instâncias deve ser conciliado uma única vez, sem prêmios indevidos.
- Selecionar uma poção quando nenhum frasco dinâmico existe: botão deve ficar desabilitado.
- Recomeçar partida: usar a nova chave de save da pré-alfa; **não há obrigação de importar versões anteriores**.
- O seletor de instâncias mostra apenas rótulos públicos (**Preparo 1**, etc.), sem propriedades ocultas.
- Validação visual recomendada: telas 360×800, 390×844 e 1280×800, teclado, mouse, toque e controle Xbox.

## Escopo e limites

**Implementado no ramo:** combate usa a lista temporária de instâncias e concilia o saldo em `progress.js`; testes Node de motor + integração e build automatizado. **Ainda não implementados:** uso deliberado fora de combate, aplicação de Veneno em inimigo, Bálsamo em equipamento, efeitos temporários/permanentes, potência calculada pelas intensidades I–III, consentimento/resistência e relógios de duração. Os valores +24/+12 são **apenas pontos de partida de playtest**, não cânone.

## Comandos de QA

```sh
cd phaser-lab
npm install
npm test
npm run build
```

A rotina GitHub Actions `phaser-migration-contract.yml` inclui os dois arquivos de teste novos e executa build e smoke automatizado em Chromium. **CI passando não substitui conferir o fluxo no dispositivo físico.**
