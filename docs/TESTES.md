# Testes e critérios de revisão

## Testes sem dependências

Node.js >=18, na raiz do projeto:

```bash
npm test
```

`site.test.cjs` verifica conteúdo, identidade, estrutura e segurança. `print.test.cjs` verifica a geração do roteiro a partir dos dados existentes e sua independência do progresso; `pwa.test.cjs` verifica manifesto, recursos e regras de escopo/cache do Service Worker. `state.test.cjs` executa funções reais de validação, leitura/gravação com ambas as chaves, fallback de JSON malformado, falhas de acesso/cota, retomada, marcação e transições de conclusão semanal e integral. O workflow existente executa essa suíte no Node.js 22. O evento de Pull Request aceita os destinos `main` e `feature/devotional-days`; pushes continuam limitados à `main`. O PR da revisão de perguntas tem a `main` como destino. O workflow usa apenas `contents: read` e não publica o site.

## Integração com navegador real

Ferramentas opcionais, sem dependências no site e sem alterar `package.json`. Nesta máquina, Playwright 1.62.1 e Chromium já estavam disponíveis. Em outra máquina, com Chromium instalado, é possível instalar o driver fora do checkout:

```bash
npm install --cache /tmp/devotional-npm-cache --prefix /tmp/devotional-browser --no-package-lock --no-save playwright@1.62.1
```

Inicie `npm start` em uma sessão e, em outra, execute na raiz:

```bash
NODE_PATH=/tmp/devotional-browser/node_modules CHROMIUM_PATH=/usr/bin/chromium node --test tests/browser.cjs
```

Se Playwright já estiver no caminho de módulos, basta `node --test tests/browser.cjs`. Ajuste `CHROMIUM_PATH` ao executável confiável da máquina. `BASE_URL` muda o servidor de teste (padrão `http://127.0.0.1:8000`); `ARTIFACT_DIR` muda o destino de capturas e relatório de contraste (padrão `/tmp/devotional-days-results`). Use uma origem sem dados pessoais: o teste cria contextos isolados com estado sintético.

Os cenários de integração cobrem:

- primeiro acesso, dispensa e nova consulta das orientações;
- navegação pelos 35 encontros, referências, questões, revisões e seis traduções;
- roteiro/Aparência, foco inicial e circular, Escape, clique fora, fundo inerte, scroll e mudança desktop/mobile;
- progresso, leitura atual e preferências após reload, ambas as chaves antigas, falhas no getter e na gravação;
- conclusão semanal e integral, cristais brancos, movimento reduzido, fechamento e ausência de repetição no reload;
- dez temas em 320, 360, 375, 390, 430, 768, 1024 e 1440 px, sem overflow horizontal, painéis dentro da tela, contraste de tokens e modo automático.

A segunda rodada acrescenta a verificação dos controles refinados: tamanho de toque, estados de foco/pressão/indisponibilidade, operação por teclado do controle segmentado e respeito à preferência de movimento reduzido. A suíte cobre também a preferência de transparência reduzida, emulada por CDP, e a alternativa opaca. A ausência de suporte a desfoque é simulada no contexto de teste para exercitar o CSS de fallback; isso não equivale a testar um navegador antigo real.

A suíte falha se houver erro de JavaScript, console, CSP ou recursos HTTP. O cálculo sRGB verifica pares de tokens usados por texto (>=4,5:1), contornos de controles e do segmento selecionado (>=3:1), extremos do gradiente da ação principal e cores compostas por transparência. Para o vidro, avalia Aparência sobre os extremos do cabeçalho, Roteiro sobre o fundo e a superfície suave, e painéis sobre os limites preto/branco compostos com o backdrop. Esse cálculo não equivale a certificação WCAG completa. Capturas são geradas em claro/escuro para todas as paletas.

## Cobertura da ação de leitura digital

`site.test.cjs` verifica o texto **Ler na Bíblia digital**, a descrição do destino e da nova aba e os atributos de segurança do link. A suíte de navegador mantém NVI como padrão, percorre os 35 encontros e verifica as 180 URLs locais das 30 leituras nas seis traduções; as cinco revisões continuam sem ação de passagem nova.

O cenário da ação externa testa nome e descrição acessíveis, área de toque, foco por teclado e ativação por Enter e ponteiro, preservando o estado salvo. A nova aba é interceptada pelo teste e recebe uma resposta sintética sem texto bíblico. Assim, valida-se a navegação solicitada pelo guia sem consultar o provedor, copiar passagens ou afirmar disponibilidade e conteúdo no destino real. Isso não é teste de um leitor interno, que não foi implementado.

## Perguntas revisadas e Entenda essa pergunta

`questions.test.cjs` verifica a quantidade de encontros, perguntas e ajudas, três pares por encontro e correspondência de `text`/`help`. Compara a revisão com a identidade e os textos originais da base publicada para conferir metadados preservados e reformulação integral. Esses testes de estrutura não provam clareza, rigor interpretativo ou ausência de indução; a [revisão editorial comparativa](REVISAO-EDITORIAL-PERGUNTAS.md) apoia a avaliação da autora e de pessoa qualificada.

Com o checkout servido, execute a suíte específica de interface, além das regressões existentes:

```bash
BASE_URL=http://127.0.0.1:8000 ARTIFACT_DIR=/tmp/devotional-days-revisao-perguntas node --test tests/questions-browser.cjs
```

Os cenários exercitam perguntas e ajudas associadas, abertura inicial fechada, expansão independente, fechamento por teclado, objetivos próprios das revisões, temas, larguras e preservação do progresso. Nenhuma resposta da leitora é coletada ou gravada pelo recurso. Registrar separadamente os resultados automáticos e qualquer revisão com pessoas reais.

Para regenerar o comparativo documental após concluir a redação:

```bash
node docs/scripts/gerar-revisao-editorial.cjs --notes docs/evidencias/revisao-perguntas/semanas-1-2.json --notes docs/evidencias/revisao-perguntas/semanas-3-4.json --notes docs/evidencias/revisao-perguntas/semana-5.json
```

O gerador lê a base editorial imutável e o conteúdo final. Notas opcionais de revisão podem ser passadas com `--notes arquivo.json`, repetindo a opção para mais de um arquivo; a pergunta e a ajuda dessas notas precisam coincidir com o runtime final. A geração valida integridade e correspondência, sem substituir revisão editorial.

## Compartilhamento, impressão e instalação

Com o mesmo Chromium/Playwright, sirva o checkout e execute os cenários de ações auxiliares:

```bash
BASE_URL=http://127.0.0.1:8000 ARTIFACT_DIR=/tmp/devotional-days-compartilhar-imprimir-pwa node --test tests/features-browser.cjs
```

A suíte verifica compartilhamento nativo disponível/ausente, cancelamento e falha, cópia confirmada somente após sucesso, alternativa manual, WhatsApp sem envio automático, foco e retorno ao guia. APIs de dispositivo são simuladas e o destino do WhatsApp é interceptado; isso não equivale a compartilhar mensagens reais ou conferir a interface de aplicativos de terceiros. A impressão verifica a ação explícita, a mídia de impressão, o conteúdo gerado e a preservação do progresso.

Os testes reais de Service Worker usam um servidor local isolado no mesmo subcaminho do GitHub Pages, criado pela própria suíte:

```bash
ARTIFACT_DIR=/tmp/devotional-days-compartilhar-imprimir-pwa node --test tests/pwa-browser.cjs
```

Eles verificam manifesto/ícones/escopo, recursos offline, preservação das preferências, versão nova em espera, atualização consentida, falhas de instalação/registro e rejeição de uma versão reutilizada sem destruir o cache ativo. A revisão de perguntas inclui a migração real do conjunto publicado `v1` para `v2`, mantendo ambas as chaves de armazenamento e verificando perguntas/ajudas novas sem mistura de arquivos. Essa migração requer que o objeto Git `78e663756d4d4ca28fc41920bdcbe7b8e2a41d28` esteja disponível no checkout; a suíte lê os arquivos antigos com `git show`, sem buscar a rede. Em clone raso que não o contenha, execute `git fetch origin 78e663756d4d4ca28fc41920bdcbe7b8e2a41d28`. Os testes Node de `npm test` não dependem desse histórico.

A instalação pelo sistema operacional continua sendo uma validação separada; a suíte emula eventos quando precisa exercitar a oferta ou o estado instalado.

Para a impressão, gerar PDF A4 no Chromium e inspecionar páginas, referências, caixas vazias, legibilidade em preto e branco e ausência de cortes. A composição de referência é de duas páginas (semanas 1–3 e 4–5). Conferir também a prévia no navegador e uma impressora real, pois margens, fontes disponíveis e opções de cabeçalho/rodapé podem alterar o resultado.

## Auditoria automatizada de acessibilidade

Instale `axe-core@4.10.3` também fora do checkout, no mesmo prefixo usado para Playwright:

```bash
npm install --cache /tmp/devotional-npm-cache --prefix /tmp/devotional-browser --no-package-lock --no-save playwright@1.62.1 axe-core@4.10.3
NODE_PATH=/tmp/devotional-browser/node_modules node tests/a11y.cjs
```

Usa o mesmo `BASE_URL`, `CHROMIUM_PATH` e `ARTIFACT_DIR` e grava `acessibilidade.json`. A rodada de compartilhamento amplia a cobertura para Mais opções, cópia manual e instruções de instalação nos dez temas, além dos cenários existentes. Sai com erro se detectar violações; resultados incompletos permanecem no relatório para revisão humana. A injeção do auditor é feita pelo processo de automação, sem mudar CSP ou carregar bibliotecas no site entregue.

## Evidências por rodada

Para não sobrescrever as capturas e os relatórios da primeira revisão, use um destino novo ao validar o polimento:

```bash
ARTIFACT_DIR=/tmp/devotional-days-polimento node --test tests/browser.cjs
ARTIFACT_DIR=/tmp/devotional-days-polimento node tests/a11y.cjs
```

Mantenha `NODE_PATH`, `CHROMIUM_PATH` e `BASE_URL` conforme a instalação local. As evidências selecionadas da segunda rodada são versionadas em `docs/evidencias/polimento/` e `docs/capturas/polimento/`. A matriz também deve conferir a alternativa opaca quando o recurso de desfoque ou a preferência de transparência não estiverem disponíveis.

As evidências da rodada de leitura digital usam `docs/evidencias/leitura-digital/` e `docs/capturas/leitura-digital/`, preservando os registros anteriores. Para uma nova execução, escolha outro `ARTIFACT_DIR`, por exemplo `/tmp/devotional-days-leitura-digital`.

## Resultados da rodada de leitura digital

- `npm test`: 15 testes aprovados, zero falhas ou testes pulados.
- Suíte de navegador: nove cenários aprovados, zero falhas ou testes pulados. Após endurecer a interceptação da nova aba para incluir eventuais recursos do provedor e verificar a ausência de `Referer`, o cenário afetado foi reexecutado e passou (1/1), sem alteração na interface ou na lógica do site.
- Cobertura local: 180 URLs de passagem e 80 combinações de tema/largura (dez temas × oito larguras), sem rolagem horizontal involuntária nas verificações executadas.
- Contraste mínimo calculado: 4,55:1 nos pares de tokens opacos, 5,02:1 nos materiais com composição alfa e 5,85:1 nos extremos do gradiente da ação principal.
- Axe-core: 24 cenários, zero violações detectadas e 36 verificações inconclusivas (12 de valores ARIA e 24 de contraste), preservadas para revisão humana. Não equivale a certificação WCAG.

Os registros locais ficam em [evidencias/leitura-digital](evidencias/leitura-digital/), incluindo `testes-node.txt`, `testes-browser.txt`, `testes-popup.txt`, `acessibilidade.json` e `temas-contraste.json`. O estado da CI deve ser confirmado no novo Pull Request destinado à `main`; ele é distinto dos resultados locais acima.

As evidências de compartilhamento, impressão e instalação usam diretórios próprios, preservando todos os registros anteriores. O [relatório desta entrega](VALIDACAO-COMPARTILHAR-IMPRIMIR-PWA.md) registra 24 testes Node, nove cenários de regressão, dez de ações auxiliares, seis de PWA e a auditoria de 54 cenários. As contagens da rodada de leitura digital acima são históricas.

## Aceitação complementar

1. Inspecionar capturas e uso real em computador e celular: alinhamento, legibilidade, foco e recortes.
2. Conferir zoom nativo de 200%/400%, ampliação de texto e preferências de contraste; largura CSS de 320 px já é coberta automaticamente.
3. Usar leitor de tela e Safari/iOS: anúncio dos diálogos, retorno de foco, rolagem e opções de seleção.
4. Confirmar manualmente no destino externo as seis traduções, capítulos e versículos; os testes locais validam construção dos links, não a disponibilidade do serviço.
5. Revisar com pessoa qualificada a interpretação bíblica, a distinção entre texto/interpretação/aplicação e os direitos autorais antes de ampliar a divulgação. Nesta rodada, o conteúdo das perguntas e ajudas muda; os demais metadados e contextos são preservados. Conferir também a compreensão com leitoras reais, inclusive quem tem dificuldade de leitura, sem tratar testes de estrutura como avaliação de compreensão.
6. Conferir instalação em iPhone/Android físicos, opções reais de compartilhamento e impressão física. Não tratar eventos simulados ou PDF do Chromium como esses testes.
7. Verificar o aviso de progresso separado; não prometer transferência entre Safari, Chrome e aplicativo instalado. Apagar dados do dispositivo pode remover progresso/cache.

A [validação da revisão de perguntas](VALIDACAO-REVISAO-PERGUNTAS.md) reúne as execuções e limitações desta rodada; as contagens históricas acima não substituem os testes das novas perguntas e ajudas.

Resultados da primeira rodada permanecem em `VALIDACAO.md`. Versões, resultados e limitações da segunda rodada estão em `VALIDACAO-POLIMENTO.md`. Não publicar nem fazer merge sem aprovação da autora.
