# Viabilidade do leitor bíblico — NVI brasileira

Consulta: **27/10/2026**. Projeto: **Devotional Days**, de Lais Fernandes, publicado em <https://maryahlais-png.github.io/plano-de-leitura-biblica-para-mulheres/>. Base da atualização: `main` em `f9b89841a21bb35c5422cbad03f50bb2da3c86a3`, com os PRs #4 e #5 incorporados e a CI aprovada.

## Decisão desta entrega

**O leitor interno não foi implementado.** A proprietária confirmou nesta tarefa que ainda não possui aplicativo aprovado nem licença específica. Não foi comprovada autorização aplicável para reproduzir a NVI brasileira dentro do Devotional Days. Isso não equivale a afirmar que a integração seja definitivamente proibida ou impossível: há caminhos técnicos, condicionados à disponibilidade e às licenças da aplicação.

A entrega implementa **Ler na Bíblia digital**, com cápsula, ícone de livro e aviso **A leitura será aberta na YouVersion.** O link continua externo, na tradução escolhida; a descrição acessível informa a nova aba. As seis traduções permanecem disponíveis: NVI, NAA, ARA, ARC, NVT e NTLH. NVI continua padrão apenas quando não existe preferência válida anterior.

Não houve cadastro, aceite de licença, solicitação em nome da autora, contratação, criação de backend, obtenção de chave ou requisição de texto bíblico. Não foram incluídos textos protegidos em HTML, JavaScript, JSON, cache ou testes. Nenhuma tradução foi substituída por outra sob o nome NVI.

## Fontes e limite da pesquisa

A pesquisa leu páginas oficiais atuais da YouVersion e API.Bible e documentação nos repositórios oficiais das organizações **YouVersion** e **American Bible Society** no GitHub. As fontes técnicas abaixo fixam os snapshots consultados. Licença de software de um SDK não licencia os textos bíblicos.

As primeiras consultas às páginas web foram bloqueadas no túnel da rede. Os domínios necessários foram adicionados ao rascunho das configurações do ambiente, preservando os existentes. Após a propagação, YouVersion e API.Bible responderam HTTP 200 e seus documentos públicos foram consultados diretamente, com TLS validado. A página de permissões da Biblica, com e sem `www`, continuou respondendo **HTTP 403 do destino**. Esse acesso não foi contornado; não foram usados proxies alternativos, scraping de textos bíblicos ou desativação de TLS.

Assim, há preços e condições gerais confirmados abaixo, mas **a concessão, disponibilidade e condições específicas da NVI brasileira para esta aplicação continuam não comprovadas**. As ferramentas gratuitas e a referência genérica a NIV em materiais de divulgação não resolvem a licença da NVI pt-BR.

### Páginas oficiais atuais efetivamente consultadas

**YouVersion**:

- [Overview](https://developers.youversion.com/overview), [API Usage](https://developers.youversion.com/api-usage) e [Authentication](https://developers.youversion.com/authentication): websites, REST/SDK opcional, cadastro da aplicação, chave e acordos de licença. A documentação informa alteração em 23/10/2026.
- [Termos da Platform](https://platform.youversion.com/?tos=1), versão **17/08/2026**: o acordo das ferramentas não concede direitos de obras bíblicas; exige aceite eletrônico e cumprimento dos acordos específicos. O texto público do modal foi lido no [recurso público referenciado pelo próprio portal](https://platform.youversion.com/assets/TermsOfServiceModal-DlQ58DME.js), sem login ou aceite. O URL do recurso pode mudar; a entrada durável é o portal com `?tos=1`.
- [Error Codes](https://developers.youversion.com/error-codes): chave inválida, conteúdo não licenciado, catálogo e ressalvas sobre CORS/preflight. Metadados ou catálogo ampliado não comprovam licença de conteúdo.
- [Display Bible HTML](https://developers.youversion.com/guides/display-bible-html) e [Copyright & Attribution](https://developers.youversion.com/sdks/javascript/guides/copyright-and-attribution): exibição web própria, atribuição e recursos de apresentação.

**API.Bible**:

- [Cadastro e planos](https://docs.api.bible/quick-start/create-your-account), [licenciamento](https://docs.api.bible/quick-start/licensing-and-access) e [quotas](https://docs.api.bible/quick-start/rate-limiting).
- [Autenticação](https://docs.api.bible/quick-start/authentication), [passagens](https://docs.api.bible/guides/passages) e [Fair Use / View Tracking](https://docs.api.bible/resources/fair-use).
- [Termos](https://api.bible/terms-and-conditions): termos de serviço atualizados em **03/09/2026**, com obrigações de atribuição e FUMS, além dos acordos comercial/não comercial e condições editoriais.

### Documentação YouVersion efetivamente consultada

- [API REST e uso no navegador](https://github.com/youversion/platform-skills/blob/afa623654165b6d53df56a250af655c76cbddd94/skills/youversion-platform-api/SKILL.md): autenticação de aplicação, catálogo por licença, passagens e formatos. O guia técnico declara que `X-YVP-App-Key` não é um segredo e oferece exemplos de navegador. Há uma divergência aparente com a redação geral de confidencialidade nos termos; ver as pendências abaixo antes de publicar qualquer chave.
- [SDK oficial e separação entre software e conteúdo](https://github.com/youversion/platform-sdk-react/blob/e2598e3aad27c799c42f4e83f0446236f1ebe944/README.md): o código tem licença Apache 2.0; as versões bíblicas dependem dos acordos próprios no portal.
- [Modelo de licença](https://github.com/youversion/platform-sdk-react/blob/e2598e3aad27c799c42f4e83f0446236f1ebe944/packages/core/src/schemas/license.ts): identifica versões, URI da licença e usuário/data de aceite. O agente não realizou esse aceite.
- [Componente oficial de leitor](https://github.com/youversion/platform-skills/blob/afa623654165b6d53df56a250af655c76cbddd94/skills/youversion-platform-react/component_documentation/bible-reader.md): demonstra leitor React. A API REST também permite uma implementação em JavaScript puro; não é necessário converter o projeto para React.

### Documentação API.Bible efetivamente consultada

- [SDKs oficiais — licença e termos](https://github.com/americanbible/api-bible-sdks/blob/32e4b6e6b71da24cf8727201f6ae3bfe03898f34/README.md#license-and-terms): distingue a licença Apache do código dos contratos da API e dos textos das editoras.
- [SDK React — proteção da chave](https://github.com/americanbible/api-bible-sdks/blob/32e4b6e6b71da24cf8727201f6ae3bfe03898f34/packages/react/README.md#server-side-proxy): orienta que a chave não seja enviada no código do navegador e descreve proxy controlado no servidor.
- [SDK TypeScript — autenticação, passagens, créditos e FUMS](https://github.com/americanbible/api-bible-sdks/blob/32e4b6e6b71da24cf8727201f6ae3bfe03898f34/packages/typescript/README.md): documenta chave própria, intervalos, campos `Bible.copyright`/`Bible.info` e reporte de uso para aplicações web.
- [Demonstração oficial — chamadas no servidor](https://github.com/americanbible/api-bible-demo/blob/0168b95f658269dac07faefb2913d3ad2ffc330a/README.md#making-calls-to-apibible): protege a chave no servidor e aponta a documentação atual. Um demo JavaScript antigo arquivado não foi usado como fundamento da política atual de segurança.

### Custos e limites anunciados em 27/10/2026

- **YouVersion:** apresentação e termos anunciam ferramentas sem custo. Isso não confirma o custo/condições da licença NVI brasileira nem infraestrutura eventualmente necessária. Há rate limiting por chave, com `429`/`Retry-After`; uma cota numérica universal não foi identificada nas páginas consultadas. Paginação de até 100 itens não é uma franquia de requisições.
- **API.Bible Starter:** US$0/mês, 5.000 chamadas/mês, até três Bíblias licenciadas sob copyright. Esses limites não comprovam disponibilidade ou autorização da NVI brasileira nesse plano.
- **API.Bible Pro:** a partir de US$29/mês e 150.000 chamadas/mês; Enterprise sob consulta. Licenças comerciais de Bíblias podem ter valores adicionais.
- **Excedentes:** Pro/Enterprise permitem habilitar US$1 por 1.000 chamadas adicionais; no padrão, a franquia excedida interrompe o acesso. Nada foi habilitado ou contratado.
- **Passagens API.Bible:** até 200 versículos por resposta, com possível truncamento. É preciso conferir o `id` retornado; aceitar apenas uma resposta HTTP bem-sucedida não verifica integridade. O plano atual usa trechos menores e dentro de um capítulo.
- Custos de uma função server-side, manutenção e eventual concessão editorial não foram orçados. Os preços acima são informações publicadas na data, não uma contratação ou garantia de elegibilidade do projeto.

### Pendências materiais de segurança e privacidade

**YouVersion:** o guia técnico oficial classifica App Keys como públicas; os termos gerais exigem confidencialidade de credenciais/access keys. Não se presumiu qual regra abrange a chave web específica nem qual prevalece. É necessário obter esclarecimento da plataforma antes de publicar uma chave. Tokens pessoais ou privados nunca devem ser expostos.

A documentação apresenta exemplos de navegador, mas a página de erros também declara limitações de `OPTIONS`/preflight e cabeçalhos CORS em certos erros. Isso é uma pendência documental a esclarecer e testar com origem/chave autorizadas, não prova de inviabilidade universal nem um teste de CORS já aprovado para Pages.

Os termos YouVersion exigem manter mecanismos de relatórios de uso incorporados às ferramentas e preveem compartilhamento de dados da desenvolvedora com editoras. Antes de adotar uma ferramenta, é necessário entender quais dados seriam enviados e se há uma rota compatível com a ausência de monitoramento do Devotional Days. Não se deve omitir obrigação contratual nem habilitar coleta silenciosamente.

**API.Bible:** o reporte FUMS é obrigatório para aplicações web segundo o guia e os termos (§14). Inclui token da requisição, identificador persistente de dispositivo e identificador de sessão, com identificação de usuário opcional quando há login. A plataforma descreve perfil de uso por versão, livro, capítulo e versículo. Isso **conflita concretamente com o requisito atual de não monitorar comportamento**. Proteger a chave em um backend não elimina essa obrigação. Seria necessária uma alternativa/exceção expressamente concedida e compatível, ou uma mudança de escopo autorizada pela proprietária; nenhuma foi obtida nesta tarefa.

A página [Biblica — permissões](https://www.biblica.com/permissions/) permanece como destino oficial de consulta, mas seu conteúdo atual recebeu HTTP 403 e não foi lido. Não se presume que uma regra geral de citações autorize este leitor, nem se inventam formulário, preço ou prazo.

## Respostas às questões de viabilidade

| Questão | YouVersion Platform | API.Bible / Biblica |
|---|---|---|
| NVI brasileira disponível para esta aplicação? | **Não confirmado.** A disponibilidade depende da chave e das licenças aceitas. | **Não confirmado.** Nenhum catálogo licenciado da proprietária foi consultado. |
| Autorização para passagens completas na interface própria? | Não comprovada; exige examinar e aceitar o acordo aplicável à edição e à aplicação. | Não comprovada; exige termos da API e concessão da tradução/editora. |
| Gratuito/não comercial basta para autorizar? | Não se pode presumir. O site é gratuito, mas o enquadramento contratual precisa ser confirmado. | Mesma limitação; há acordos separados para uso comercial e não comercial. |
| É necessário cadastro/chave? | Sim, a API documenta chave de aplicação e licenças associadas. A proprietária ainda não tem aplicativo aprovado. | Sim, as fontes orientam cadastrar chave própria. Nada foi cadastrado nesta tarefa. |
| Aprovação ou aceite manual? | Existe registro de aceite por usuário no portal. O processo e a concessão exatos da NVI precisam ser confirmados pela proprietária. | O processo aplicável à edição brasileira, à conta e ao domínio precisa ser confirmado oficialmente. |
| Custos? | Ferramentas anunciadas sem custo. Concessão NVI e eventual infraestrutura não confirmadas; não há contratação. | Starter US$0/mês; Pro a partir de US$29/mês; licenças comerciais podem acrescentar custo. Não comprovam concessão NVI; infraestrutura não foi orçada. |
| Limites de acesso/volume? | Quotas, duração, cache e limites contratuais precisam ser conferidos no plano e licença. | Starter 5.000/mês e até três Bíblias; Pro 150.000/mês. Passagens até 200 versículos, sem aceitar truncamento silencioso. Condições editoriais continuam específicas. |
| Créditos/identificação? | Metadados de nome, abreviação e copyright devem acompanhar a leitura, sujeitos ao acordo da versão. | Exige identificação/abreviação e créditos do titular com página de copyright. Starter exige citação/link API.Bible; Pro encoraja esse crédito da plataforma. Atribuição exata da NVI não confirmada. |
| Branding/links obrigatórios? | Termos gerais restringem uso de marcas e alegação de parceria; exigências específicas da versão/ferramenta precisam ser confirmadas. | Termos restringem uso de logos e exigem atribuições conforme plano e tradução. Branding específico da NVI continua pendente. |
| Interface própria? | Tecnicamente possível por REST; o direito de uso depende da licença. | Tecnicamente possível via dados de passagem, condicionado ao contrato e à licença. |
| Passagem e intervalo específicos? | Sim. Documenta USFM e intervalos dentro de um capítulo por chamada. Múltiplos capítulos exigem chamadas separadas e ordenadas. | Sim, há `passages.get` com intervalos. O guia aceita intervalos entre capítulos/livros, limitados a 200 versículos; validar a referência devolvida e a licença. |
| GitHub Pages? | **Viabilidade ainda não comprovada.** Esclarecer chave pública/confidencial, preflight/CORS, licença, reporting e CSP. Não houve teste com chave válida. | Chamada direta com chave privada é inadequada. GitHub Pages não protege segredo; seria necessário serviço controlado no servidor, sujeito a aprovação. |
| Credencial privada no frontend? | O guia técnico chama App Key de pública, mas os termos gerais tratam access keys como confidenciais. Esclarecer a chave específica antes de qualquer exposição; nunca publicar tokens privados. | A documentação atual orienta manter a chave da API no servidor. Variável de build não torna secreto o valor incluído no JavaScript público. |
| Incorporação oficial sem segredo? | Existe componente de leitor, mas não foi comprovado um iframe NVI pt-BR que dispense cadastro/licença. | Nenhum embed NVI pt-BR que resolva licença e segurança foi comprovado nas fontes consultadas. |
| Conta da visitante? | API com chave de aplicação é tecnicamente candidata a leitura sem conta; as condições contratuais precisam ser confirmadas. | Um backend com chave de aplicação pode dispensar contas das visitantes; não é uma autorização contratual confirmada. |
| Privacidade? | Termos exigem mecanismos de relatórios de uso e contemplam dados da desenvolvedora com editoras. Esclarecer compatibilidade com ausência de analytics antes de integrar. | FUMS obrigatório reporta requisições e IDs de dispositivo/sessão. Conflito com o escopo sem monitoramento; backend sozinho não resolve. |

O ID `129` dos links atuais em `bible.com` não deve ser reutilizado como se comprovasse o ID, a edição ou a licença na Platform ou na API.Bible. Também não se pode confundir NIV em inglês, outra NVI ou português de outra edição/região com a NVI brasileira solicitada.

## Próximas ações da proprietária

### Caminho preferencial a investigar: YouVersion Platform

1. Acessar a [YouVersion Platform](https://platform.youversion.com/), o [início do cadastro](https://platform.youversion.com/platform/get-started) e os [termos](https://platform.youversion.com/?tos=1). Se decidir prosseguir, registrar como responsável a aplicação web **Devotional Days**, com o domínio/caminho do GitHub Pages, finalidade gratuita e ausência de contas/analytics. O cadastro e qualquer aceite pertencem à proprietária, não ao agente.
2. Consultar no portal as licenças **da própria aplicação**, procurando a NVI em português brasileiro e a edição correta. Confirmar passagens completas dos 30 encontros, interface própria, territórios, leitura sem conta, créditos/branding e cache. Catálogo ampliado ou referência genérica a NIV não comprova concessão.
3. Antes de publicar qualquer chave ou iniciar integração, pedir ao [suporte oficial](https://platform.youversion.com/support) (`platform-support@youversion.com`, contato nos termos) esclarecimento escrito sobre: chave web pública versus confidencialidade; CORS/preflight da origem GitHub Pages; quais dados os mecanismos obrigatórios de uso enviam e como atender ao escopo sem monitoramento; aprovação específica da NVI, custos e cotas. Nenhuma mensagem foi enviada nesta tarefa.
4. Ler e aceitar pessoalmente apenas os acordos com que concordar. Guardar licença/URI, versão e data, tradução/ID, domínio autorizado e eventuais condições/aprovações escritas. Se o serviço exigir monitoramento incompatível ou segredo/backend, não presumir aprovação para mudar o escopo.
5. Depois de comprovados os direitos e a compatibilidade, disponibilizar a identificação da aplicação e a documentação da autorização. Uma chave pública só poderá ser tratada como tal depois de esclarecida sua classificação; tokens privados permanecem fora de chat e código. Nenhuma credencial é necessária para o botão externo atual.
6. Só então validar catálogo, NVI pt-BR, metadados/licença e CORS para a origem publicada. Antes de implementar, resolver atribuição, formato de resposta, CSP e privacidade. A rota HTML oficial usa estilos/Fonts API e exige revisão adicional; não se remove CSP nem se injeta HTML remoto por seguir um exemplo. Uma implementação pequena em JavaScript puro continua uma proposta, condicionada a esses resultados.

### Se a NVI brasileira não estiver concedida no portal

Consultar a [página oficial de permissões da Biblica](https://www.biblica.com/permissions/), indicando:

- nome, autoria e URL exata do Devotional Days;
- finalidade gratuita, público e ausência de monetização;
- as 30 referências do plano, sem transcrever textos protegidos;
- intenção de exibir passagens completas em interface própria, com numeração e ajuste de fonte;
- arquitetura estática, ausência de contas/analytics e proposta de não guardar o texto persistentemente;
- necessidade de confirmar edição brasileira, meio de distribuição autorizado, créditos/branding, limites, prazo e eventual custo.

Solicitar uma resposta aplicável a este uso, em vez de presumir que acesso gratuito no aplicativo ou uma regra geral de citações já autorize o leitor. O conteúdo do formulário atual não foi consultado; por isso não se inventam campos, taxa ou prazo de resposta.

### Alternativa API.Bible, se desejar avaliar esse canal

1. Acessar o [cadastro oficial API.Bible](https://api.bible/sign-up), o [guia de cadastro](https://docs.api.bible/quick-start/create-your-account) e os [termos](https://api.bible/terms-and-conditions), verificar a licença exata da NVI pt-BR para o projeto/domínio e as condições de uso não comercial.
2. Se a edição brasileira não estiver claramente concedida, pedir confirmação pelo contato oficial `support@api.bible`, indicado nos termos. Confirmar créditos `copyright`/`info`, custos, quotas, cache e edição. FUMS continua obrigatório e conflitante com o escopo sem monitoramento; não integrar sem alternativa/exceção concedida ou decisão explícita de mudar esse escopo. Não omitir uma obrigação contratual nem instalar rastreamento silenciosamente.
3. Se houver licença, privacidade compatível e interesse em prosseguir, aprovar **separadamente** uma função server-side/serverless sob seu controle para proteger a chave. Não é necessário adotar React, banco de dados ou cadastro das leitoras.
4. Definir provedor, custo e manutenção antes de implementar: armazenamento de segredo no cofre do servidor, rotas restritas às passagens autorizadas, controle de cota/abuso, atualizações e fallback externo. Não há orçamento confirmado nesta tarefa e nenhum serviço foi criado.
5. Somente nessa infraestrutura aprovada, fornecer a chave privada por um cofre de segredos. Nunca no chat, Git ou bundle público de Pages.

## Proposta de leitor futuro — não implementada

Se os requisitos forem comprovados, reutilizar o gerenciamento de sobreposições já existente: painel amplo no desktop, quase tela inteira no celular, com fundo inerte, foco contido, Escape e restauração de foco. A leitura usaria superfície opaca e os dez temas existentes. Cabeçalho com referência, tradução e fechar; versículos numerados; controles simples de fonte; créditos obrigatórios sempre disponíveis.

O carregamento deve validar referência/idioma/edição e a estrutura da resposta, ordenar os versículos e dividir intervalos entre capítulos conforme o contrato da API. O plano atual contém apenas passagens dentro de um capítulo; as cinco revisões não devem gerar referências artificiais.

Ao abrir, ajustar fonte, fechar ou trocar aparência, manter encontro, contexto, posição e progresso. A conclusão continua voluntária. Usar DOM seguro e formato estruturado/texto; não injetar HTML retornado sem uma estratégia de segurança aprovada. Aplicar timeout/cancelamento e descartar respostas antigas quando a referência mudar. Falhas de rede, respostas inválidas ou ausência de uma passagem devem oferecer a URL externa da **mesma tradução**, sem substituição silenciosa.

Não guardar textos protegidos em `localStorage`, service worker, arquivos do repositório ou cache persistente sem concessão expressa. Novos destinos de CSP e eventuais efeitos de privacidade só serão configurados depois da decisão/licença, nunca para uma integração ainda indisponível.

## Critérios para retomar implementação

- Tradução/edição NVI brasileira e disponibilidade para a aplicação comprovadas.
- Autorização aplicável à reprodução dessas passagens e à interface própria registrada pela proprietária.
- Créditos, branding, quotas, cache, custos e condições para visitantes sem conta confirmados.
- Rota técnica e autenticação documentadas, com a divergência sobre a chave, CORS/preflight, segredos, CSP e obrigações de uso/privacidade resolvidos.
- Aprovação explícita antes de qualquer infraestrutura adicional ou compromisso financeiro.

Até lá, as seis traduções continuam como links externos. Esta proposta não adiciona botão de leitor indisponível, modal vazio, SDK, credencial, rastreamento ou transcrição protegida à aplicação.
