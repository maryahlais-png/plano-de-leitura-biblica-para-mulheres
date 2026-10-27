# Privacidade e dados locais

O site **não solicita cadastro, nome, e-mail ou anotações** e não possui backend, formulário de envio, serviço de análise de acesso ou publicidade.

O navegador pode guardar, no próprio dispositivo:
- números das leituras concluídas;
- tradução bíblica selecionada;
- tema de cores e preferência por claro/escuro;
- se o aviso inicial já foi lido;
- último encontro acessado.

Esses valores não são enviados pelo código deste projeto a um servidor. Podem ser vistos por quem tenha acesso ao aparelho ou ao perfil do navegador. Apagar os dados do site ou trocar de navegador/dispositivo pode apagar seu progresso.

Ao clicar em links externos, como YouVersion, BibleProject ou Sociedade Bíblica do Brasil, a pessoa sai deste guia e passa a estar sujeita às políticas desses serviços. A hospedagem GitHub Pages e a infraestrutura de navegação ainda podem processar registros técnicos de acesso conforme suas próprias políticas; não fazemos promessas sobre coleta por terceiros.

A ação **Ler na Bíblia digital** abre a passagem escolhida na YouVersion em uma nova aba, com aviso do destino externo. As chaves de progresso e preferências existentes permanecem sem migração; textos bíblicos protegidos não são armazenados pelo guia.

## Compartilhar e imprimir

O compartilhamento usa uma mensagem fixa e o endereço público do projeto. Não inclui marcações, tradução escolhida, contatos ou identificação da leitora. O dispositivo ou o WhatsApp pode aplicar suas próprias políticas quando a leitora escolhe utilizá-los. O guia não mede compartilhamentos, não acessa a agenda e não envia mensagens automaticamente.

O roteiro impresso é construído com os dados públicos dos encontros e caixas vazias, independentemente das marcações digitais. Não consulta nem altera o progresso; a impressão ou o arquivo PDF permanece sob controle da leitora e dos recursos do dispositivo.

## Aplicativo instalado e dados locais

O progresso fica apenas no navegador ou aplicativo em que a pessoa estuda. Ao instalar ou trocar de navegador, as marcações podem começar separadas. Não há transferência automática, sincronização, exportação, importação ou recuperação de progresso.

O armazenamento depende da origem, do navegador, do perfil e do contexto do aplicativo. Em plataformas Apple, instalações do mesmo site podem usar armazenamento isolado, e um aplicativo de tela inicial pode ter dados diferentes dos do Safari. Uma regra de cota semelhante entre navegador e aplicativo não implica que eles compartilhem as mesmas marcações. Por isso, o guia recomenda continuar no mesmo contexto para acompanhar o plano; não promete que Safari, Chrome e instalação terão o mesmo progresso.

O cache offline guarda somente arquivos públicos locais do guia e ícones; não guarda páginas ou passagens da YouVersion, respostas pessoais ou novos campos de preferência. A preparação do cache e suas atualizações fazem requisições normais à hospedagem estática, sem telemetria própria. Remover o aplicativo, limpar dados do site ou políticas do navegador podem remover armazenamento local e/ou o cache; instalação não é um backup.

## Fontes sobre instalação e armazenamento

- [MDN — localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), consultado pelo [repositório oficial](https://github.com/mdn/content/blob/main/files/en-us/web/api/window/localstorage/index.md): associa dados à origem e descreve persistência e bloqueios do navegador.
- [MDN — cotas e critérios de remoção](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria), consultado pelo [repositório oficial](https://github.com/mdn/content/blob/main/files/en-us/web/api/storage_api/storage_quotas_and_eviction_criteria/index.md): documenta particionamento, limites e remoção de dados; a cota de aplicativos na tela inicial pode corresponder à do navegador sem estabelecer compartilhamento de dados.
- [Google Chrome — Installation](https://web.dev/learn/pwa/installation), consultado no [código-fonte oficial do curso](https://github.com/GoogleChrome/web.dev/blob/main/src/site/content/en/learn/pwa/installation/index.md): descreve armazenamento isolado por instalação Apple e possíveis diferenças entre Safari e Web.app. O material contém instruções antigas de instalação; elas não foram usadas para afirmar que apenas o Safari atual pode instalar.
- [MDN — tornar PWAs instaláveis](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable), consultado pelo [repositório oficial](https://github.com/mdn/content/blob/main/files/en-us/web/progressive_web_apps/guides/making_pwas_installable/index.md): registra diferenças entre versões do iOS e suporte dos navegadores. As instruções do guia indicam Safari quando necessário, sem prometer uma instalação automática universal.

O acesso direto às páginas WebKit/Apple/MDN foi bloqueado pelo túnel de rede deste ambiente; as fontes acima foram lidas em repositórios oficiais acessíveis pelo GitHub. Não foram realizados testes físicos de transferência de dados entre Safari, Chrome e aplicativo instalado.

## Para futuras versões

Antes de adicionar qualquer coleta de dados, atualizar este documento, reavaliar a conformidade com a LGPD e considerar necessidade, finalidade, retenção, segurança e direitos das pessoas usuárias. A preferência atual da autora é manter o guia **sem coleta de informações pessoais**.