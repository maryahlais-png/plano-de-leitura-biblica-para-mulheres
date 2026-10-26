# Validação — segunda rodada de polimento visual

Esta rodada parte de `feature/devotional-days` em `05890c56fee82a970e06470640db6cf8ac30a345`, versão em revisão no PR #4. O desenvolvimento ocorre em `feature/devotional-days-apple-polish`, com o [PR #5](https://github.com/maryahlais-png/plano-de-leitura-biblica-para-mulheres/pull/5) destinado a `feature/devotional-days`. O relatório da [primeira rodada](VALIDACAO.md), suas capturas e suas evidências foram preservados.

## Escopo desta rodada

O refinamento concentra-se em controles, superfícies, sombras, realces, material translúcido pontual e apresentação das orientações. Não inclui migração do armazenamento, alteração editorial, backend ou dependências de runtime novas. A leitura mantém superfície opaca; o acabamento translúcido tem alternativa opaca e respeita a preferência por reduzir transparência quando suportada.

## Resultados da execução

- Ferramentas locais confirmadas: Node.js 24.19.0, npm 11.9.0, Python 3.12.14, Chromium 154.0.8037.57 e Playwright 1.62.1.
- `npm test`: 14 testes aprovados na rodada atual, zero falhas e zero testes pulados.
- Matriz de contraste sRGB desta rodada: mínimo de 4,55:1 nos pares de tokens opacos, 5,02:1 nos materiais translúcidos com composição alfa e 5,85:1 nos extremos do gradiente do botão principal.
- Auditoria axe-core 4.10.3 após a correção de transição: 24 cenários, zero violações detectadas. Permanecem 36 verificações inconclusivas — 12 de valores ARIA e 24 de contraste — preservadas no relatório; não são aprovações nem certificação WCAG.
- `node --test tests/browser.cjs`: oito cenários aprovados na execução final, zero falhas e zero testes pulados (69,9 s). A suíte cobre os 35 encontros, persistência e compatibilidade, painéis, conclusões, controles por teclado/ponteiro, movimento reduzido, transparência reduzida e alternativa opaca.
- Matriz de dez temas × sete larguras CSS (320, 360, 375, 390, 430, 768 e 1440 px): sem rolagem horizontal involuntária ou painéis fora da viewport nas verificações executadas.
- Indicador do segmento selecionado: contorno com contraste de 3,69:1 no claro e 3,11:1 no escuro em relação ao controle. A matriz também verifica o contorno sobre o trilho.
- Nenhum erro de execução, console, CSP ou recurso HTTP local detectado pela suíte de navegador.
- O workflow de CI preserva Node.js 22 e `contents: read`, incluindo agora Pull Requests destinados a `feature/devotional-days`, além de `main`. O check remoto do commit de implementação `cbd6097` foi aprovado no PR #5. A [evidência da CI](evidencias/polimento/ci-implementacao.json) registra o SHA e o endereço da execução. Commits posteriores de documentação não alteram a implementação; o resultado do último commit deve ser consultado no próprio PR.

## Diagnóstico e correção durante o polimento

Uma execução intermediária encontrou contraste insuficiente durante a troca de tema: a transição de `background-color` conservava temporariamente o fundo anterior, enquanto a cor do texto já havia mudado. A correção limita as transições dos controles a transformação e sombra, atualizando texto e fundo no mesmo instante. Os testes de contraste e a auditoria foram executados novamente após essa correção; o resultado final está registrado acima.

A revisão também acrescentou um contorno neutro funcional ao segmento selecionado, além de elevação e peso tipográfico, para indicar o estado sem depender só da diferença de luminosidade. O contraste do contorno é verificado em relação ao controle e ao trilho.

A regra existente de movimento reduzido também remove essas transformações e transições. A comparação com a base confirmou que dados bíblicos, código de estado e sobreposições, lógica de navegação, licença e declarações de dependências permanecem iguais nesta rodada.

As inconclusões de ARIA incluem referências a painéis fechados, fora da árvore acessível; os IDs continuam no DOM. As de contraste incluem gradientes, transparência e elementos sobrepostos, que o auditor não consegue resolver automaticamente. O cálculo sRGB separado considera os extremos dos gradientes e a composição dos materiais sobre fundos delimitados. A inspeção humana continua necessária; nenhuma regra do auditor foi desativada para ocultar um resultado.

## Evidências e comparação

As evidências desta rodada ficam em `evidencias/polimento/`:

- [Testes Node](evidencias/polimento/testes-node.txt)
- [Testes de navegador](evidencias/polimento/testes-browser.txt)
- [Matriz de contraste](evidencias/polimento/temas-contraste.json)
- [Relatório de acessibilidade](evidencias/polimento/acessibilidade.json)
- [Saída da auditoria](evidencias/polimento/testes-a11y.txt)

As [capturas selecionadas e comparações](capturas/polimento/README.md) foram salvas em diretório próprio. Foram geradas imagens nas dez combinações; a inspeção visual incluiu celular em claro e Rosé Escuro, desktop em Sálvia/Azul Escuro e Aparência em 390 e 320 px, sem recortes observados nesses casos. São capturas do Chromium com dados sintéticos e viewports emulados, não testes em aparelhos físicos. Os diretórios da primeira rodada permanecem intactos.

O teste de `prefers-reduced-transparency` usa emulação de mídia do Chromium por CDP. A ausência de suporte ao desfoque é simulada no CSSOM de um contexto isolado para exercitar a alternativa opaca; isso não comprova compatibilidade com navegador antigo real.

## Revisão complementar

- Conferir o acabamento e a resposta ao toque em aparelho real, especialmente Safari/iOS.
- Confirmar leitura com leitor de tela, zoom nativo e ampliação de texto.
- Avaliar translucidez percebida, contraste e fallback opaco em navegadores com capacidades diferentes.
- A conferência dos destinos bíblicos externos e a revisão editorial humana continuam separadas do polimento visual.
- Não fazer merge nem publicar o site sem autorização explícita da autora.
