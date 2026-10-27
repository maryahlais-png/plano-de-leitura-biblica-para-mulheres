# Validação — leitura bíblica digital

Rodada de **27/10/2026**. Base `main`: `f9b89841a21bb35c5422cbad03f50bb2da3c86a3`, com PRs #4 e #5 incorporados. GitHub Actions e publicação dessa base estavam aprovados antes da alteração. Trabalho em `feature/leitura-biblica-digital`; novo PR para `main`, sem merge ou publicação nesta tarefa.

## Escopo implementado

Ação externa **Ler na Bíblia digital**, em cápsula com livro/seta decorativos, descrição do destino e nova aba. As seis traduções, preferências, 35 encontros e experiência publicada foram preservados. Não existe leitor interno implementado nesta entrega; motivos, condições, preços e ações da proprietária estão em [VIABILIDADE-LEITOR-BIBLICO.md](VIABILIDADE-LEITOR-BIBLICO.md).

## Resultados locais

A instância local usou a porta 8001, com `BASE_URL=http://127.0.0.1:8001` e `ARTIFACT_DIR` em diretório separado. O código do site e os scripts continuam permitindo o servidor padrão da documentação.

- Node.js 24.19.0, npm 11.9.0, Python 3.12.14, Chromium 154.0.8037.57, Playwright 1.62.1 e axe-core 4.10.3. Ferramentas de navegador instaladas fora das dependências do site.
- **15/15 testes Node aprovados**, sem falhas ou testes pulados.
- **9/9 cenários de navegador aprovados**, sem falhas ou testes pulados (75,8 s). Os cenários existentes foram preservados e ampliados.
- O mock de popup foi endurecido após a suíte completa para interceptar também eventuais recursos auxiliares do destino externo e conferir ausência de Referer. O cenário afetado foi revalidado: **1/1 aprovado**. A resposta sintética é neutra, sem texto bíblico, e não é apresentada como validação do conteúdo do provedor.
- **180 URLs locais** verificadas: 30 passagens × seis traduções; cinco revisões sem ação digital artificial. As 35 referências também foram comparadas diretamente com a sequência fornecida pela autora.
- **Dez temas × oito larguras**: 320, 360, 375, 390, 430, 768, 1024 e 1440 px. Sem overflow horizontal ou painéis fora da viewport nos checks executados.
- NVI padrão em contexto novo; preferências existentes mantidas após recarregar. A abertura por ponteiro/Enter preserva encontro, contexto, posição e estado salvo; não marca conclusão automaticamente.
- Foco visível, área de toque em repouso >=44 px, nova aba sem acesso ao opener, HTTPS e atributos de proteção dos links verificados.
- Navegação, temas/modo automático, painéis/Escape/fundo inerte, conclusões, falhas de armazenamento, movimento reduzido, transparência reduzida e alternativa opaca cobertos pela suíte.
- **Axe: 24 cenários, zero violações detectadas**. Permanecem 36 verificações inconclusivas (12 de ARIA, 24 de contraste), preservadas sem desativar regras. Isso não é certificação WCAG integral.
- Contraste sRGB mínimo avaliado: **4,55:1** nos pares de texto, **5,02:1** nos materiais compostos e **5,85:1** no primário. Contornos de controles/estado >=3:1.
- Sem erros de execução, console, CSP ou recursos locais na suíte. `git diff --check` passou.

A posição da página na preparação do teste de popup foi estabilizada antes de comparar o clique: a automação pode rolar para o alvo e aguardar a microinteração. O assert de posição continua estrito; não foi alterado o código do guia para fazer o teste passar.

## Verificação externa limitada

Foram feitas requisições **HEAD**, sem baixar corpo ou texto bíblico, às URLs da primeira passagem nas seis traduções. Todas responderam **HTTP 200** na rodada. Isso confirma a resposta HTTP dessas seis URLs naquele momento; não valida visualmente todas as 180 páginas, a disponibilidade futura, a íntegra da tradução ou uma licença de reprodução.

As páginas públicas atuais de YouVersion/API.Bible foram consultadas para a pesquisa, após a propagação da configuração de rede. A página de permissões da Biblica continuou retornando HTTP 403 do destino. Nenhum endpoint de catálogo licenciado ou texto bíblico foi chamado com chave; nenhum contrato foi aceito.

## Integridade e limites

`src/data.js`, `src/state.js`, `src/app.js`, `src/overlays.js`, `package.json` e `LICENSE` permanecem iguais à base. A CSP mantém exatamente suas diretivas, incluindo `connect-src 'none'` e `frame-src 'none'`. Não foram adicionados SDK, backend, credenciais, cache de textos, analytics, coleta de respostas ou alterações das chaves de armazenamento.

As capturas de 320 px, celular e desktop foram inspecionadas para conferir o encaixe da ação e da nota. Safari/iOS, Firefox, leitor de tela, zoom nativo e aparelhos físicos não foram validados. Cenários de carregar/falhar/ajustar fonte de um leitor interno não se aplicam a esta implementação e não foram declarados como executados.

## Evidências

- [Testes Node](evidencias/leitura-digital/testes-node.txt)
- [Suíte de navegador](evidencias/leitura-digital/testes-browser.txt)
- [Revalidação do popup](evidencias/leitura-digital/testes-popup.txt)
- [Auditoria](evidencias/leitura-digital/acessibilidade.json) e [saída](evidencias/leitura-digital/testes-a11y.txt)
- [Contraste](evidencias/leitura-digital/temas-contraste.json)
- [URLs geradas](evidencias/leitura-digital/links-gerados.json) e [sequência do plano](evidencias/leitura-digital/referencias-plano.json)
- [HEAD dos seis destinos](evidencias/leitura-digital/destinos-remotos.json)
- [Resposta de rede das fontes oficiais](evidencias/leitura-digital/fontes-rede.json)
- [Capturas selecionadas](capturas/leitura-digital/README.md)

Os registros históricos das rodadas anteriores permanecem intactos. O resultado da CI do novo PR é confirmado na entrega e no GitHub, separadamente dos testes locais acima.
