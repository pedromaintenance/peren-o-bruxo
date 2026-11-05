# QA — Taxonomia Semântica dos 53 Efeitos (v1.0)

**05/11/2026 · PROPOSTA — não é código de gameplay.**
Arquivos desta branch: [catálogo JSON](../data/taxonomia-efeitos-alquimicos-proposta.json), [teste de integridade](validar-taxonomia-efeitos.test.mjs) e [painel HTML de revisão](revisao-taxonomia-53-efeitos.html).
Documento de interpretação na main: [relatório de semântica](https://github.com/pedromaintenance/peren-o-bruxo/blob/main/docs/taxonomia-53-efeitos-alquimicos-v1.md).

## Evidência concluída

**17/17 verificações do catálogo passaram em execução JavaScript V8 isolada**, cruzando o JSON da proposta e `curadoria_ingredientes.json`. Cobertura 53/53, 111 ingredientes, 11 grupos, todas as contagens de fontes, todas as intensidades, variantes de nomes, Vampirismo como exceção canônica, Dano/Diminuir Magia distintos, Restaurar/Regenerar distintos, ausência de Stamina e nenhum valor de potência ou duração inventado.

**13/13 checagens de interface passaram num DOM simulado**. Incluem renderizar 53 fichas, 11 grupos, busca, seleção do Vampirismo, exibição da exceção aprovada, anotação persistida localmente, filtro de parecer, exportação e reinicialização. **Não** houve renderização real em Chromium/Firefox, teste mobile/Xbox, teste de acessibilidade com leitor de tela, nem integração ao Phaser.

## Roteiro de revisão humana

1. Abrir o HTML localmente, selecionar `vampirismo` e conferir que a transformação com o tempo está indicada como decisão expressa, mas progressão/duração/reversão permanecem indefinidas.
2. Procurar `dano_magia`, `diminuir_magia`, `regenerar_magia` e `restaurar_magia`: distinguir recurso corrente, capacidade e taxa; examinar propostas de alvo/tempo sem declará-las definitivas.
3. Procurar `voar`, `velocidade`, `aumentar_destreza`, `invisibilidade` e `aumentar_furtividade` para confirmar que nenhum poder extra é inferido automaticamente.
4. Examinar `aumentar_ferraria` e `aumentar_encantamento`: a ficha não deve escolher automaticamente a família de recipiente nem transformar efeito de habilidade em encantamento de objeto.
5. Anotar pareceres “Coerente”, “Precisa ser revisto” ou “Discutir em conjunto”, adicionar comentários, exportar JSON, limpar notas, reimportar o arquivo e confirmar que os pareceres são recuperados.
6. Testar 360 × 800, 390 × 844 e 1280 × 800, navegação por teclado e contraste; reportar problemas antes de considerar publicação.
7. Ao decidir alguma semântica, registrar aprovação **em documento/decisão autoral separado**, nunca promover uma classificação automaticamente a regra.

## Guardrails

- O painel exporta **pareceres**, não alterações do JSON canônico; não cria efeitos nem altera saves.
- Dois ingredientes de **tipos diferentes** são necessários para ativar um efeito. Extra não recebe bônus automático de tempo ou potência.
- **Poção da Fada** permanece única sinergia aprovada; **Impuro** depende somente de incompatibilidades aprovadas.
- As cinco **famílias de recipientes** não são equivalentes aos 11 **grupos semânticos**.
- Nenhum valor numérico de potência, duração, resistência, custo, stacking, transformação ou alvo está implementado.
- **CI real `node --test` pendente**: o arquivo inclui testes executáveis em checkout, mas os 17 testes acima foram rodados via V8 isolado no conector.

**Reprodução após checkout:** `node --test prototipos/validar-taxonomia-efeitos.test.mjs`.

**Gate para integração:** revisar as semânticas com o criador, construir modelo de eventos/estados por efeito, validar persistência de estado, recipientes e consequências em gameplay e só depois discutir merge ou Pages.
