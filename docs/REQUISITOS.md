# Requisitos — versão 1.0

## Objetivo

Ajudar mulheres adultas a realizar um primeiro percurso de estudo bíblico aprofundado, priorizando a leitura na Bíblia física, a compreensão de contexto e a aplicação pessoal por meio de perguntas maduras.

## Requisitos funcionais

| ID | Requisito | Critério de aceite |
|---|---|---|
| RF01 | Exibir 35 encontros distribuídos em 5 semanas | 7 encontros por semana; 6 leituras e uma revisão |
| RF02 | Mostrar referência bíblica, objetivo e três perguntas | Conteúdo sem transcrição integral da tradução |
| RF03 | Oferecer leitura digital opcional | Links seguros para versão selecionada da YouVersion |
| RF04 | Permitir marcar/desmarcar estudo | Progresso permanece no navegador após recarregar |
| RF05 | Mostrar metodologia no primeiro acesso | Aviso pode ser dispensado e não aparece novamente no mesmo navegador |
| RF06 | Oferecer cinco paletas e dois modos | Suportar claro, escuro e modo automático do dispositivo |
| RF07 | Celebrar conclusão semanal | Feedback após 7 encontros da semana; sem confete nem emojis |
| RF08 | Mostrar contexto apenas sob solicitação | Seção fechada ao trocar de leitura |
| RF09 | Navegação por todas as leituras | Botões de anterior/próxima e índice semanal |
| RF10 | Identificar referências e autoria | Rodapé com links externos e assinatura solicitada |

## Requisitos não funcionais

- **RNF01 — Privacidade:** sem formulários de dados pessoais, anotações digitais, telemetria, cookies próprios ou backend.
- **RNF02 — Segurança:** nenhum script externo, nenhuma credencial, conteúdo dinâmico criado com `textContent`/DOM seguro, CSP restritiva.
- **RNF03 — Acessibilidade:** foco visível, estrutura semântica, uso por teclado, suporte a redução de movimento.
- **RNF04 — Responsividade:** funcionar em telas de computador e celular.
- **RNF05 — Manutenção:** dados, estilo e lógica em arquivos separados; sem ferramentas de build para iniciar.
- **RNF06 — Desempenho:** evitar imagens e bibliotecas pesadas.
- **RNF07 — Transparência:** informar armazenamento local e saída para links de terceiros.
- **RNF08 — Respeito editorial:** temas para adultas, sem infantilização ou estereótipos de gênero.

## Fora do escopo

Cadastro, autenticação, chat, áudio, formulários de oração ou aconselhamento, analytics, controle compartilhado de progresso, recursos comerciais e download dos textos das traduções bíblicas.

## Definição de pronto

Requisitos essenciais verificados, `npm test` verde, leitura manual em celular e desktop, links revisados, texto bíblico autorizado quando aplicável, nenhuma credencial ou dado pessoal incluído no Git.