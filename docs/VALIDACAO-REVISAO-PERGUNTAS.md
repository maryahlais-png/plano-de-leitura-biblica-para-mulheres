# Revisão das perguntas e ajuda para reflexão — validação

Data: 28/10/2026. Branch: `feature/perguntas-reflexao-acessiveis`. Base: `78e663756d4d4ca28fc41920bdcbe7b8e2a41d28`, merge do PR #7 na main. O trabalho desta branch não foi publicado nem integrado à main.

Commit de implementação validado: `2124800`. O comparativo editorial, os documentos de suporte e as evidências são registrados em commit separado na mesma branch.

## Entrega editorial

Foram reformuladas as 105 perguntas dos 35 encontros e escritas 105 explicações individuais. Todas as perguntas diferem das respectivas perguntas publicadas; nenhuma ajuda está vazia ou é uma duplicata exata de outra. As perguntas e explicações são revisadas como pares, com `{text, help}` no mesmo objeto, evitando listas independentes que possam perder a correspondência.

A terceira pergunta aprovada do Encontro 01 foi preservada exatamente: “Ao pensar no seu tempo, nas suas escolhas e nos seus compromissos, que prioridades o chamado de Jesus faz você repensar?” A primeira também segue a redação aprovada; a segunda distingue o ensino do relato dos detalhes da situação dos primeiros discípulos, sem induzir uma resposta negativa.

As 30 leituras seguem os objetivos Observe a passagem, Entenda o texto e Reflita sobre sua vida. Nas cinco revisões, os objetivos são Recorde as leituras, Compare e aprofunde e Continue o estudo. As revisões continuam sem referência a uma passagem nova.

O [comparativo editorial completo](REVISAO-EDITORIAL-PERGUNTAS.md) contém 35 encontros, 105 perguntas originais, 105 novas perguntas, 105 ajudas e 30 notas sobre decisões relevantes. Foi gerado a partir do conteúdo efetivamente entregue e da base imutável, com conferência independente dos 315 textos citados. O gerador e os comandos de reprodução estão no documento; os JSONs de notas em `evidencias/revisao-perguntas/` são registros editoriais, não arquivos carregados pelo aplicativo.

Exemplos de reformulação:

| Encontro | Antes | Depois |
| --- | --- | --- |
| 01, pergunta 3 | Que prioridades e expectativas precisam ser examinadas quando a fé deixa de ser apenas uma parte da rotina? | Ao pensar no seu tempo, nas suas escolhas e nos seus compromissos, que prioridades o chamado de Jesus faz você repensar? |
| 09, pergunta 1 | Que riscos sociais e pessoais podem estar envolvidos na decisão da mulher de se aproximar de Jesus? | Como a mulher se aproxima de Jesus depois de tantos anos de sofrimento? |
| 33, pergunta 2 | Como o gênero poético altera a maneira de aplicar esse retrato à realidade de cada pessoa? | Como os versículos finais ajudam a entender o elogio feito ao longo do poema? |

## Critérios de interpretação e clareza

Cada encontro foi lido em conjunto com suas perguntas anteriores, referência e contexto. Houve revisão integral e conferência cruzada dos três blocos editoriais. A revisão separa observação, interpretação e aplicação; evita exigir informações históricas ausentes, pressupor uma emoção ou transformar a aplicação numa obrigação de mudança. As ajudas apontam detalhes, comparações e termos necessários, sem fornecer um gabarito.

Os cuidados incluem não atribuir à mulher de Lucas 7 identidade ou profissão ausentes do relato; não caricaturar o judaísmo a partir de Lucas 13; não tratar a ordem particular narrada a Agar como exigência de retorno a abuso; não transformar a resposta à oração de Ana numa promessa universal; não medir fé pela ansiedade ou doença; distinguir confissão de culpa pelo mal sofrido; e não usar perdão/reconciliação para exigir exposição, contato com agressor ou silêncio de vítimas. O poema de Provérbios 31 não vira uma lista universal de desempenho. A redação de Gênesis 1:26–27 distingue a fala direta de Deus da voz do narrador.

Termos como arrependimento, graça, discipulado, temor de Deus e fruto do Espírito continuam no estudo, com explicações simples quando pertinentes. Onde o trecho não detalha uma questão — como confiança e convivência após uma ofensa — a ajuda distingue esse limite de uma aplicação contemporânea. Não foram acrescentados textos bíblicos protegidos, fontes históricas inventadas ou soluções denominacionais impostas. A revisão por IA e os testes de estrutura não substituem a avaliação editorial e bíblica da autora e de pessoa qualificada.

## Interface e preservação do estado

Cada pergunta mostra seu objetivo e um controle nativo `summary` com o texto Entenda essa pergunta, dentro de `details`. A explicação começa fechada, pode ser aberta independentemente e fica abaixo da pergunta. A seta indica a expansão; a animação breve respeita redução de movimento. Os controles usam os tokens existentes, foco visível e alvo de toque de pelo menos 44 px, com texto explicativo de 14 px.

O controle é associado à pergunta por `aria-describedby`, com IDs únicos. Enter, Espaço e Tab foram testados. Trocar de encontro ou renderizar novamente fecha as ajudas; a expansão permanece apenas no DOM, sem nova preferência, campo de resposta ou gravação em localStorage. O DOM usa criação segura de elementos e `textContent`.

Todos os demais dados do plano — semanas, títulos, introduções, contextos, referências, ordem e identificação das revisões — permanecem idênticos à base. Uma fixture somente de hashes permite conferir isso em CI sem depender de histórico Git ou duplicar o plano inteiro. `src/state.js`, as chaves existentes e a lógica de conclusão não mudaram. Os testes cobrem marcações parciais/completas nas duas chaves, preferência de tradução, aparência e encontro atual. Compartilhamento, impressão, manifesto, ícones, código de instalação e sobreposições foram preservados.

## Atualização da versão instalada

O cache passa de `v1` para `v2`, preservando a lista local fechada e o mecanismo de confirmação. O Service Worker novo prepara o conjunto completo; enquanto aguarda, a página continua usando perguntas e renderer publicados. Uma recarga offline antes do aceite continua em v1. Após Atualizar agora, a página recarrega com os pares e renderer de v2, sem apagar marcações ou preferências.

O teste de migração usa bytes reais do commit publicado `78e6637` obtidos com `git show`, não uma aproximação do renderer anterior. O servidor local alterna esse conjunto para os arquivos atuais exatamente como entregues. A migração foi exercitada com ambas as chaves existentes e com somente a chave antiga: os valores brutos permanecem idênticos no aceite/recarregamento, antes de qualquer navegação. As 105 perguntas e ajudas foram percorridas offline em cada caso. Encontros concluídos antes da revisão continuam concluídos e o recarregamento não apresenta celebração automática.

A ativação limpa somente o cache antigo deste escopo, preservando caches de outros projetos e localStorage. Falha no precache e reutilização da versão ativa continuam sendo rejeitadas sem apagar o conjunto anterior. O guia não guarda páginas ou passagens da YouVersion; o link externo continua precisando de internet. [Evidência da migração](evidencias/revisao-perguntas/pwa-migracao-publicada.json).

## Execuções e resultados

| Suíte | Resultado | Evidência |
| --- | --- | --- |
| `npm test` | 29/29 aprovados | [Node](evidencias/revisao-perguntas/testes-node.txt) |
| `tests/questions-browser.cjs` | 6/6 aprovados | [Perguntas e ajuda](evidencias/revisao-perguntas/testes-questions-browser.txt) |
| `tests/browser.cjs` | 9/9 aprovados | [Regressão existente](evidencias/revisao-perguntas/testes-browser.txt) |
| `tests/features-browser.cjs` | 10/10 aprovados | [Compartilhamento e impressão](evidencias/revisao-perguntas/testes-features.txt) |
| `tests/pwa-browser.cjs` | 7/7 aprovados | [PWA e migração publicada](evidencias/revisao-perguntas/testes-pwa-browser.txt) |
| Axe-core | 65 cenários, zero violações detectadas e 88 verificações inconclusivas preservadas | [Auditoria completa](evidencias/revisao-perguntas/acessibilidade.json) |
| Comparativo editorial | 105 blocos correspondem exatamente ao original, à nova pergunta e à ajuda | [Conferência](evidencias/revisao-perguntas/comparativo-verificado.json) |

Não houve falhas ou testes pulados nas suítes finais. Ferramentas: Node 24.19, Playwright 1.62.1, Chromium 154 e axe-core 4.10.3, sem novas dependências do aplicativo. Servidor de interface: `http://127.0.0.1:8002`; a suíte PWA usa servidor isolado com o subcaminho real do projeto. O snapshot Git antigo precisa estar no checkout para executar a migração opcional, conforme `TESTES.md`; os testes Node não dependem dele.

Foram cobertos todos os 105 pares, os objetivos por tipo de encontro, ausência de duplicatas/vazios, a pergunta aprovada exata, preservação dos metadados, DOM seguro, teclado, abertura/fechamento independente, ausência de persistência das ajudas, falhas de armazenamento, movimento reduzido, dez temas e oito larguras: 320, 360, 375, 390, 430, 768, 1024 e 1440 px. A regressão mantém seis traduções e 180 URLs locais, celebrações, roteiro, foco e preferências de transparência.

Os mínimos calculados foram 4,55:1 para texto opaco, 5,02:1 para materiais compostos e 5,85:1 para a ação principal. As 88 verificações inconclusivas do axe são 23 de valores ARIA e 65 de contraste, incluindo referências a painéis fechados e fundos com gradientes; não foram escondidas ou convertidas em aprovações. Zero violações detectadas não é certificação WCAG. [Resumo numérico](evidencias/revisao-perguntas/resumo.json).

## Evidências, limites e GitHub

[Capturas de celular, computador, revisões e migração offline](capturas/revisao-perguntas/README.md). As evidências das rodadas anteriores foram mantidas intactas.

Não foram realizados testes com leitoras reais, incluindo pessoas com dificuldade de leitura, nem validação bíblica externa por pessoa qualificada. Também não foram testados aparelhos físicos, Safari/Firefox, leitor de tela, menus nativos de compartilhamento, instalação real, impressora física ou zoom nativo. APIs de compartilhamento/clipboard e eventos de instalação seguem simulados nos testes pertinentes; a migração, cache e offline usam Service Worker real no Chromium.

O Git sincronizou a main e a branch foi preparada para revisão. A API do GitHub recebeu bloqueio `CONNECT 403` do proxy deste ambiente, mesmo com `api.github.com` listado no rascunho de rede. A abertura do PR e a consulta de sua CI dependem de acesso efetivo à API; os resultados acima são execuções locais, não uma confirmação de CI remota. Esse bloqueio de ambiente é separado dos testes da aplicação. Não houve merge nem publicação desta proposta.
