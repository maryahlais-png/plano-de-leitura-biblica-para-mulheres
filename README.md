# Devotional Days

**35 dias de leitura e reflexão bíblica · feito para mulheres**

Um guia gratuito de estudo bíblico para mulheres adultas que já têm contato com a igreja e desejam aprofundar a leitura das Escrituras, inclusive quando estão começando a ler a Bíblia por conta própria.

**Proposta:** estimular leitura atenta, interpretação responsável e reflexão pessoal — não entregar conclusões prontas nem armazenar confidências.

**Autoria:** Lais Fernandes.  
**Assinatura no site:** *Com fé e carinho, Lais Fernandes.*

## Funcionalidades

- 35 encontros: 30 leituras bíblicas e cinco revisões, organizados em cinco semanas.
- Referências bíblicas para consulta na Bíblia física ou pelo botão **Ler na Bíblia digital**, que abre a passagem na YouVersion em uma nova aba (NVI, NAA, ARA, ARC, NVT, NTLH). A NVI é o padrão para novas leitoras; escolhas anteriores permanecem salvas.
- 105 perguntas de reflexão, três por encontro, com 105 ajudas individuais em **Entenda essa pergunta** e uma seção de contexto e interpretação.
- Marcação de leitura, sem cadastro, comentários, formulários ou anotações digitais.
- Cinco paletas: Lavanda, Sálvia, Areia, Azul Névoa e Rosé; modos claro, escuro ou automático, com bases neutras, superfícies em camadas e controles arredondados.
- Orientações no primeiro acesso, disponíveis novamente em **Como usar**. Os encontros não precisam ser feitos em dias consecutivos.
- Último encontro preservado e atalho opcional para a primeira atividade pendente.
- Roteiro lateral no computador e botão compacto **Abrir roteiro** no celular.
- Celebrações centralizadas ao concluir uma semana ou o plano completo, com microbrilhos brancos e apresentação estática quando há preferência por reduzir movimento.
- Compartilhamento pelo dispositivo ou alternativas de copiar o link e abrir o WhatsApp, sem rastreamento.
- Roteiro imprimível dos 35 encontros, com quadradinhos vazios para marcar no papel.
- Instalação opcional na tela inicial e acesso offline aos arquivos locais do guia, quando suportado. A Bíblia digital externa continua exigindo internet.
- Layout responsivo, navegação por teclado e código sem dependências externas. A leitura permanece opaca; a translucidez discreta de alguns controles e painéis possui alternativa opaca.

## Executar localmente

Para desenvolver e testar o guia, execute na pasta do projeto:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`. Nenhum `npm install` é necessário para executar o site. Os recursos de instalação e Service Worker precisam de HTTPS ou de um contexto local confiável, como localhost; abrir `index.html` diretamente pelo sistema de arquivos não valida esses recursos.

## Entenda essa pergunta

As perguntas acompanham três momentos do estudo: **Observe a passagem**, **Entenda o texto** e **Reflita sobre sua vida**. Nas revisões semanais, os objetivos são **Recorde as leituras**, **Compare e aprofunde** e **Continue o estudo**.

Se precisar de uma orientação, abra **Entenda essa pergunta** logo abaixo da questão. A ajuda explica o que observar ou comparar, esclarece termos quando necessário e convida à sua própria reflexão. Cada explicação pode ser aberta separadamente e começa fechada. As escolhas de abrir ajuda não são salvas; suas reflexões continuam no caderno.

A revisão editorial mantém os encontros nas mesmas posições, com as referências e os títulos existentes. As marcações, a tradução e a aparência continuam preservadas no mesmo armazenamento. Para comparar as redações, consulte [Revisão editorial das perguntas](docs/REVISAO-EDITORIAL-PERGUNTAS.md). Os resultados e limites de validação ficam no [relatório desta revisão](docs/VALIDACAO-REVISAO-PERGUNTAS.md).

## Compartilhar e levar o roteiro para o papel

Abra **Mais opções** próximo às ações auxiliares do guia:

- **Compartilhar** abre as opções do dispositivo quando disponíveis. Caso contrário, escolha **Copiar link** ou **Compartilhar no WhatsApp**. Se a cópia automática for bloqueada, selecione o endereço mostrado e copie manualmente. O WhatsApp abre uma opção de compartilhamento; nenhuma mensagem é enviada automaticamente.
- **Imprimir roteiro** abre a impressão do navegador. Escolha papel A4 ou **Salvar como PDF**, quando essa opção estiver disponível. O roteiro usa os mesmos 35 encontros, em cinco semanas, com referências e caixas sempre vazias para marcar à mão. A composição de referência tem duas páginas A4: semanas 1–3 na primeira e 4–5 na segunda. Confira a prévia, pois opções do navegador e da impressora podem alterar a paginação. Imprimir não muda seu progresso digital.

## Adicionar à tela inicial

A instalação é opcional e depende do navegador e do aparelho:

- **Android:** quando aparecer em Mais opções, toque em **Instalar aplicativo**. Você também pode procurar **Instalar app** ou **Adicionar à tela inicial** no menu do navegador.
- **iPhone:** abra o site no Safari, se necessário; use o menu de compartilhamento, escolha **Adicionar à Tela de Início** (pode estar em **Mais**, conforme a versão do iOS) e confirme.

O progresso fica apenas no navegador ou aplicativo em que você estuda. Ao instalar ou trocar de navegador, as marcações podem começar separadas; não há transferência automática nem sincronização. Continue usando o mesmo contexto para acompanhar suas leituras. Saiba mais em [Privacidade e dados locais](docs/PRIVACIDADE.md).

Após um primeiro carregamento com internet e a preparação dos arquivos locais, o guia pode ficar disponível offline neste dispositivo. A leitura na YouVersion continua precisando de internet. Se o navegador bloquear ou remover o armazenamento, o acesso offline pode deixar de estar disponível. Uma atualização do guia é oferecida de forma discreta: use **Atualizar agora** quando terminar sua leitura. Essa ação recarrega a página e preserva as marcações que ainda estiverem disponíveis neste armazenamento.

O [relatório de compartilhamento, impressão e PWA](docs/VALIDACAO-COMPARTILHAR-IMPRIMIR-PWA.md) preserva os resultados e o PDF A4 daquela entrega.

## Leitura digital e NVI

O botão **Ler na Bíblia digital** segue o acabamento em cápsula dos demais controles. A nota **A leitura será aberta na YouVersion.** identifica o destino externo; a descrição acessível também informa a abertura de uma nova aba. Abrir a passagem não marca o encontro como concluído nem muda seu progresso.

O texto bíblico continua sendo lido fora do Devotional Days. Um leitor interno da NVI brasileira não foi implementado nesta etapa: não há licença específica ou aplicação aprovada para essa reprodução no projeto. A pesquisa de plataformas oficiais, condições, credenciais e ações da proprietária está em [Viabilidade do leitor bíblico](docs/VIABILIDADE-LEITOR-BIBLICO.md). A disponibilidade de uma tradução em outro serviço não estabelece autorização para copiá-la para o site. Os resultados e limites dos testes desta entrega estão em [Validação da leitura digital](docs/VALIDACAO-LEITURA-DIGITAL.md).

## Testes

É necessário Node.js recente (18 ou superior) **somente para os testes**:

```bash
npm test
```

Os testes sem dependências cobrem as 35 leituras, estrutura, segurança, compatibilidade das chaves de armazenamento, validação de estado, persistência e transições de conclusão. A suíte opcional `tests/browser.cjs` exercita o site no Chromium com Playwright, instalado fora do projeto; instruções e limites em `docs/TESTES.md`. O workflow do GitHub Actions executa os testes em pushes e pull requests. Testes visuais e de navegação humana ainda são recomendados antes da divulgação ampla: confira o roteiro em `docs/TESTES.md`.

## Organização

```text
.
├── index.html           # Estrutura semântica da aplicação
├── src/
│   ├── data.js          # Leituras, semanas, contexto e pares pergunta/ajuda
│   ├── state.js         # Validação, persistência e transições de progresso
│   ├── overlays.js      # Foco, fundo inerte e rolagem dos painéis
│   ├── app.js           # Navegação, aparência e composição da interface
│   ├── actions.js       # Compartilhar e ações de Mais opções
│   ├── print.js         # Roteiro gerado a partir dos mesmos dados
│   ├── print.css        # Composição A4 para impressão
│   ├── pwa.js           # Instalação opcional e atualização consentida
│   ├── icons/           # Ícones locais de instalação e Apple Touch
│   ├── favicon.svg      # Ícone local, sem requisição a terceiros
│   └── styles.css       # Interface responsiva e 10 temas
├── docs/
│   ├── REQUISITOS.md
│   ├── ARQUITETURA.md
│   ├── SEGURANCA.md
│   ├── PRIVACIDADE.md
│   ├── INTERFACE.md
│   ├── VALIDACAO.md
│   ├── VALIDACAO-POLIMENTO.md
│   ├── VIABILIDADE-LEITOR-BIBLICO.md
│   ├── VALIDACAO-LEITURA-DIGITAL.md
│   ├── REVISAO-EDITORIAL-PERGUNTAS.md
│   ├── VALIDACAO-REVISAO-PERGUNTAS.md
│   ├── scripts/         # Comparação documental com a base editorial
│   └── TESTES.md
├── manifest.webmanifest # Nome, escopo e ícones do aplicativo
├── sw.js                # Cache versionado dos recursos locais do guia
├── tests/               # Verificações automatizadas e de navegador
├── .github/             # CI para testes e Dependabot para Actions
├── AGENTS.md            # Restrições para contribuições assistidas por IA/Codex
├── SECURITY.md          # Como reportar riscos de segurança
└── .nojekyll            # Publicação estática no GitHub Pages
```

## Site e revisão de mudanças

O repositório e a URL permanecem os mesmos:
https://maryahlais-png.github.io/plano-de-leitura-biblica-para-mulheres/

Desenvolva em uma branch a partir da `main` atualizada, execute os testes, envie commits ao remoto e abra um Pull Request para revisão. Não faça merge nem publique uma atualização sem autorização explícita da autora. Consulte `CONTRIBUTING.md`.

As entregas dos [PRs #4](https://github.com/maryahlais-png/plano-de-leitura-biblica-para-mulheres/pull/4), [#5](https://github.com/maryahlais-png/plano-de-leitura-biblica-para-mulheres/pull/5), [#6](https://github.com/maryahlais-png/plano-de-leitura-biblica-para-mulheres/pull/6) e [#7](https://github.com/maryahlais-png/plano-de-leitura-biblica-para-mulheres/pull/7) já foram integradas à `main`. A revisão editorial parte dessa versão na branch `feature/perguntas-reflexao-acessiveis`, com novo Pull Request destinado à `main`. Os relatórios e as capturas das entregas anteriores permanecem preservados.

A hospedagem continua estática no GitHub Pages, com `index.html` na raiz e `.nojekyll`. Não publique credenciais ou dados pessoais. Os dados do navegador de cada pessoa não fazem parte do repositório.

Documentação oficial: https://docs.github.com/pt/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Referências e direitos autorais

Este é um guia independente. As referências a traduções levam a um site externo; **não hospedamos capítulos da Bíblia**. As traduções bíblicas possuem direitos próprios, que devem ser respeitados caso o conteúdo seja incorporado no futuro.

Links para aprofundar:
- [BibleProject — Como ler a Bíblia](https://bibleproject.com/pt-br/videos/collections/como-ler-a-biblia/)
- [Sociedade Bíblica do Brasil — Planos de leitura](https://www.sbb.org.br/planos-de-leitura)

Essas instituições não patrocinam nem endossam este guia.

## Próximos cuidados

Antes da publicação para um público maior, revise cada estudo com uma pessoa competente em interpretação bíblica, considerando diferenças entre tradições cristãs. Nenhuma leitura isolada deve ser usada para impor aconselhamento individual ou substituir apoio pastoral/profissional quando necessário.

## Licença

O **código original** do site é disponibilizado sob a licença MIT em [LICENSE](LICENSE). Essa licença não abrange marcas, traduções bíblicas ou material pertencente a terceiros.
