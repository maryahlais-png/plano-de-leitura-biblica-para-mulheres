# Arquitetura e decisões de engenharia

## Visão geral

Site estático HTML + CSS + JavaScript puro, hospedável pelo GitHub Pages. Sem servidor próprio, banco de dados, dependências de runtime, SDKs de terceiros, API remota de conteúdo ou publicidade. APIs nativas do navegador oferecem compartilhamento, impressão e instalação opcional.

```text
Visitante → index.html → src/styles.css
                       → src/data.js  (plano e perguntas)
                       → src/state.js (estado validado e persistência)
                       → src/overlays.js (sobreposições acessíveis)
                       → src/app.js   (composição da interface)
                       → src/actions.js (compartilhamento e ações auxiliares)
                       → src/print.js + print.css (roteiro em papel)
                       → src/pwa.js + manifest.webmanifest + sw.js
                                     ↕
                                localStorage (apenas dados não sensíveis)

Clique explícito no link externo → YouVersion
```

## Decisões (ADRs simplificados)

**ADR-001: arquitetura estática.** Reduz manutenção, custo e superfície de ataque. Não permite sincronização de progresso entre dispositivos.

**ADR-002: sem conteúdo pessoal.** O site não recebe nem salva anotações: reflexões devem ficar no caderno. Progresso, tradução, tema e aceite do aviso são valores locais não sensíveis. Mesmo esses valores podem ser vistos por alguém com acesso ao aparelho/navegador.

**ADR-003: fonte bíblica externa.** Referência e link são exibidos, não textos integrais protegidos. A pessoa pode ler na Bíblia física. Ao abrir a YouVersion, suas políticas passam a se aplicar.

**ADR-004: temas por tokens CSS.** Uma única estrutura visual recebe dez combinações; conteúdo e semântica não mudam. `prefers-color-scheme` é respeitado no modo automático.

**ADR-005: acessibilidade e redução de movimento.** Brilhos cristalinos são decorativos, breves e desativados conforme `prefers-reduced-motion`.

**ADR-006: segurança compatível com a complexidade.** Sem autenticação significa que não devemos introduzir funcionalidades que exijam autorização. Preferências locais não são fonte confiável; dados são validados no carregamento.

## Fluxos principais

1. **Primeiro acesso:** carrega estado local (ou valores padrão), mostra instrução, renderiza encontro e roteiro.
2. **Marcação:** adiciona/remove índice no conjunto local, recalcula progresso, apresenta a sobreposição quando os sete encontros da semana são concluídos. Ao completar os 35, a mensagem integral tem precedência sobre a semanal. Desmarcar não celebra; recarregar não celebra; marcar novamente após desmarcar constitui uma nova conclusão explícita.
3. **Personalização:** altera paleta e modo; persiste no navegador; não envia informações a terceiros.
4. **Leitura digital:** cria link para a passagem usando enumeração fechada de versões e catálogo próprio de livros. A ação **Ler na Bíblia digital** abre a YouVersion em nova aba e não altera a marcação de conclusão ou o encontro atual. As revisões permanecem sem passagem nova.
5. **Compartilhamento:** `actions.js` envia o endereço canônico e uma mensagem fixa à API nativa somente após toque; oferece cópia/WhatsApp/manual quando necessário, sem métricas ou acesso a contatos.
6. **Impressão:** `print.js` lê o mesmo catálogo de semanas/encontros e constrói um roteiro separado do artigo. `print.css` seleciona apenas essa composição no modo de impressão. Não consulta nem modifica o progresso.

## Estado e compatibilidade

`state.js` expõe um pequeno objeto imutável de funções, reutilizado pelo navegador e pelos testes Node via CommonJS, sem build. `sanitize` valida índices, enumerações e tipos, deduplica marcações e descarta propriedades desconhecidas. `toggleRead` retorna um novo estado e o tipo de conclusão; não executa efeitos de interface.

A chave principal continua `leitura-biblica-mulheres-v1`; `plano-biblia-estudo-reflexao-v2` permanece como fallback, sem exclusão. Se a chave atual é JSON malformado, a anterior ainda pode ser lida. Campos preservados: `read`, `current`, `palette`, `mode`, `version`, `acknowledged`. Nenhuma migração destrutiva ou campo pessoal foi adicionado. A primeira gravação após ler a chave antiga usa a principal e mantém a antiga intacta.

O encontro atual não muda no carregamento. `nextPending` apenas calcula o destino do botão opcional de retomada. Falhas no getter, leitura, JSON ou cota de armazenamento exibem aviso e permitem uso em memória, sem prometer recuperação.

## Sobreposições e foco

`overlays.js` mantém no máximo um painel ativo. Roteiro móvel, Aparência, Mais opções e conclusão compartilham backdrop, Escape, contenção de Tab/Shift+Tab e restauração de foco. Irmãos ao longo da árvore DOM ficam `inert`, preservando os que já estavam inativos; a página usa posicionamento fixo para bloquear rolagem e recuperar a posição ao fechar. Os focáveis excluem conteúdo de `<details>` fechado, mesmo quando o navegador mantém retângulos de layout.

O roteiro é um `aside` no desktop e recebe papel de diálogo somente até 690 px. Ao cruzar esse limite, o modal fecha e o estado acessível é recalculado. Escolher um encontro leva o foco e a rolagem ao artigo. Não há barra móvel com contexto de empilhamento; um único backdrop fica abaixo do painel ativo.

## Instalação e ciclo de atualização

`manifest.webmanifest` usa `id`, `start_url` e `scope` relativos (`./`), adequados ao subcaminho `/plano-de-leitura-biblica-para-mulheres/`. O modo solicitado é `standalone`, com ícones locais de 192/512 px, variante maskable e Apple Touch Icon. A presença do manifesto não garante que todo navegador ofereça instalação.

`pwa.js` captura `beforeinstallprompt` quando disponível e só apresenta **Instalar aplicativo** a partir dessa oferta, por ação explícita. Cancelamento encerra a oferta. Quando o estado instalado é identificável, a ação fica oculta. As instruções manuais continuam disponíveis para Android/iPhone.

O Service Worker tem escopo no diretório do projeto e uma lista fechada de URLs locais: HTML, CSS, JavaScript original do guia, manifesto e ícones. O precache é atômico; se um recurso falha, a instalação nova não substitui o conjunto ativo. Um candidato que reutiliza `VERSION` enquanto o cache dessa versão já está ativo é recusado antes de sobrescrevê-lo ou removê-lo, preservando o conjunto em uso. Leituras usam cache-first apenas para esses endereços exatos. URLs com query, caminhos fora da lista e terceiros seguem sem interceptação; páginas e passagens da YouVersion não entram no cache.

O registro usa `updateViaCache: 'none'`. Verificações de atualização ocorrem ao voltar à página visível ou à rede, limitadas a uma por minuto. Um worker novo aguarda o encerramento natural dos contextos antigos ou a escolha **Atualizar agora**. Apenas essa escolha envia a mensagem de ativação e permite recarregar a página; não há `clients.claim()` nem recarregamento automático durante a leitura. A ativação remove somente caches antigos do prefixo deste projeto/escopo, sem apagar `localStorage`.

Ao alterar qualquer arquivo precacheado, o mantenedor deve incrementar `VERSION` em `sw.js` no mesmo conjunto de mudanças. Testar a instalação completa, a atualização com a versão anterior ativa e o modo offline; um cache-first com versão constante poderia reter arquivos antigos. Falhas de registro ou atualização mantêm o uso online ou a versão local que ainda estiver disponível, com mensagem proporcional.

O progresso continua no armazenamento do contexto usado pela leitora. Instalação não é sincronização: diferenças de isolamento entre navegador, perfil e aplicativo podem produzir marcações separadas. As fontes e os limites dessa afirmação estão em [PRIVACIDADE.md](PRIVACIDADE.md).

## Situação do leitor interno

O fluxo de leitura digital permanece externo, sem consulta de texto bíblico pelo código do guia. As ações auxiliares e a PWA preservam o acesso apresentado no PR #6; não incluem leitor integrado, SDK, iframe, API remota, backend, chave de autenticação ou armazenamento de versículos.

A NVI brasileira só poderá ser reproduzida internamente após confirmação de autorização aplicável ao Devotional Days e de um caminho técnico seguro. Cadastro, aprovação, aceite de termos, eventual custo ou infraestrutura dependem de ação e autorização da proprietária. A análise dessas possibilidades está em [VIABILIDADE-LEITOR-BIBLICO.md](VIABILIDADE-LEITOR-BIBLICO.md), separada do que já está implementado.

## Extensões futuras

Novos planos podem ser acrescentados aos dados, mantendo controle editorial, testes de integridade e separação dos módulos. Um backend exigiria um novo modelo de ameaças, política de privacidade revisada e uma decisão explícita da autora.
