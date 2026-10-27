# Requisitos — Devotional Days

## Objetivo

Ajudar mulheres adultas a realizar um primeiro percurso de estudo bíblico aprofundado, priorizando a leitura na Bíblia física, a compreensão de contexto e a aplicação pessoal por meio de perguntas maduras.

## Requisitos funcionais

| ID | Requisito | Critério de aceite |
|---|---|---|
| RF01 | Exibir 35 encontros distribuídos em 5 semanas | 7 encontros por semana; 6 leituras e uma revisão |
| RF02 | Mostrar referência bíblica, objetivo e três perguntas | Conteúdo sem transcrição integral da tradução |
| RF03 | Oferecer leitura digital opcional | Ação Ler na Bíblia digital com destino YouVersion explícito; seis traduções, NVI padrão sem substituir preferência anterior |
| RF04 | Permitir marcar/desmarcar estudo | Progresso permanece no navegador após recarregar |
| RF05 | Mostrar metodologia no primeiro acesso | Aviso pode ser dispensado, não reaparece automaticamente e pode ser consultado em Como usar |
| RF06 | Oferecer cinco paletas e dois modos | Suportar claro, escuro e modo automático do dispositivo |
| RF07 | Celebrar conclusão semanal | Sobreposição após 7 encontros, incluindo revisão; microcristais brancos, sem confete, Escape e foco restaurado |
| RF08 | Mostrar contexto apenas sob solicitação | Seção fechada ao trocar de leitura |
| RF09 | Navegação por todas as leituras | Botões de anterior/próxima e índice semanal |
| RF10 | Identificar referências e autoria | Rodapé com links externos e assinatura solicitada |
| RF11 | Preservar encontro e sugerir retomada | Carregamento não muda `current`; botão opcional leva à primeira pendência |
| RF12 | Oferecer roteiro móvel compacto | Botão de 44 × 44 px, painel esquerdo rolável, seleção fecha e foca estudo |
| RF13 | Evitar conflito de painéis | Um modal ativo; fundo inerte, foco contido, Escape e clique fora |
| RF14 | Reconhecer conclusão integral | Mensagem própria ao completar 35, sem reset e sem repetir no reload |
| RF15 | Informar falhas de armazenamento | Aplicação segue em memória; não promete persistência ou recuperação |

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

## Rastreabilidade desta atualização

| Pedido | Implementação | Evidência |
|---|---|---|
| Nome, português e assinatura | `index.html`, metadados e rodapé | `site.test.cjs`; captura inicial |
| Dez temas e profundidade | Tokens únicos em `styles.css` | Matriz de 80 combinações de tema/largura e cálculo de contraste em `browser.cjs` |
| Roteiro compacto e conflito de camadas | `app.js`, `overlays.js` e breakpoint 690 px | Cenário de foco, backdrop, Escape, seleção, rolagem e resize |
| Orientações e retomada gentil | `guide-notice`, Como usar e `nextPending` | Primeiro acesso, dispensa/reabertura e manutenção de `current` |
| Progresso retrocompatível | `state.js`, mesmas duas chaves | Testes unitários e browser com dados antigos, quota e acesso negado |
| Celebração semanal e integral | `toggleRead`, sobreposição e CSS de cristais | Sete encontros por semana, 35 no total, movimento reduzido e reload |
| Conteúdo editorial preservado | `src/data.js` sem alterações | Integridade das 35 leituras e navegação por todos os encontros |
| Segurança e privacidade | CSP, enumerações, DOM seguro e zero runtime externo | Testes estáticos, console e auditoria automatizada descrita em `VALIDACAO.md` |
| Qualidade e rastreabilidade | Testes, documentação e branch específica | Relatório de validação, commits, referência remota e PR quando permitido pela rede |

## Definição de pronto

Requisitos essenciais verificados, `npm test` verde, leitura manual em celular e desktop, links revisados, texto bíblico autorizado quando aplicável, nenhuma credencial ou dado pessoal incluído no Git.