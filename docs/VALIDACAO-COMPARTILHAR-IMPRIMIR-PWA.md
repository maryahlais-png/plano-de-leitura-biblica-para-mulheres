# Compartilhamento, roteiro imprimível e instalação — validação

Data: 27/10/2026. Branch: `feature/compartilhar-imprimir-pwa`, destinada à `main`. Esta entrega é proposta para revisão; não houve merge ou publicação.

Commit de implementação validado: `4ee65ab` — compartilhamento, roteiro A4 e instalação PWA. Documentação e evidências são registradas em commit separado na mesma branch.

## Recuperação e base

Na retomada, a branch já existia sobre `38cf29ce298ed702afe9268a4ed5a3ba91c7e705`, com `src/print.js` e `src/print.css` ainda não commitados. Não havia commit novo nem Pull Request destes três recursos. Esses arquivos foram preservados e completados; nenhum reset, descarte ou reconstrução do projeto foi realizado.

Antes da implementação, foram lidos `AGENTS.md`, README, arquitetura, interface, privacidade, segurança, testes, CI e os arquivos da aplicação. O PR #6 estava incorporado à main, com merge em 27/10/2026. A API do GitHub informava Pages `built` e os workflows de qualidade/publicação do commit base concluídos com sucesso. O acesso HTTP direto ao domínio publicado foi bloqueado pelo túnel deste ambiente; o diagnóstico remoto usa esses registros do GitHub, sem alegar inspeção visual do site público.

O desenvolvimento completou o painel Mais opções, o compartilhamento, a composição de impressão, manifesto, ícones, instalação, cache/atualização, documentação e testes. `src/data.js`, `src/state.js`, `src/app.js`, `package.json` e `LICENSE` permanecem idênticos à base. As chaves de armazenamento e o conteúdo editorial não mudaram.

## Recursos entregues

**Compartilhamento.** Um único botão Mais opções reúne as ações auxiliares, próximo a Como usar. Compartilhar chama `navigator.share` após a ação da leitora, com mensagem fixa e URL canônica, sem identificadores ou parâmetros de rastreamento. Cancelamento é silencioso. Quando necessário, aparecem Copiar link e Compartilhar no WhatsApp. A cópia só confirma sucesso após resolver a API; falha ou ausência oferece campo readonly selecionável. WhatsApp abre a opção de compartilhamento em nova aba, sem enviar mensagem automaticamente. Não há coleta de contatos ou métricas.

**Impressão.** HTML gerado exclusivamente de `READING_PLAN`: cinco semanas, sete encontros por semana, 30 leituras, cinco revisões e referências atuais. As 35 caixas de 4 mm permanecem vazias, mesmo com todo o plano concluído digitalmente. A4 branco, corpo de 10,5 pt, referências de 10 pt, hierarquia editorial e divisões leves. O PDF inspecionado possui duas páginas: semanas 1–3 e 4–5, sem cortes de semanas. Não inclui questões, contextos extensos, texto bíblico protegido ou controles. Imprimir roteiro fecha o painel e chama o diálogo nativo; Ctrl+P também seleciona esse roteiro. Não usa pop-up ou biblioteca de PDF, nem consulta/salva progresso para imprimir.

**Aplicativo.** Manifesto com nome, descrição, pt-BR, `standalone`, identidade Lavanda, `id`, início e escopo `./`. Ícones próprios locais de 192/512 px, maskable 512 px e Apple Touch 180 px: livro aberto marfim e luz sobre Lavanda, com margem para máscaras; favicon vetorial simplificado do mesmo conceito. A branch prepara instalação em navegadores compatíveis; o site público só receberá esses recursos após revisão e publicação autorizadas.

No Android, Instalar aplicativo só aparece quando há uma oferta `beforeinstallprompt`; aceitar/dispensar depende da ação da leitora. Estado instalado identificável oculta a oferta. As instruções também indicam o menu do navegador. No iPhone, orientam abrir no Safari se necessário, usar Compartilhar → Adicionar à Tela de Início e confirmar; não existe instalador automático simulado.

**Offline e atualização.** Um Service Worker pequeno prepara uma lista fechada de arquivos públicos locais, justificando o uso do guia sem rede após o primeiro carregamento bem-sucedido. Só intercepta GETs de URLs exatas do diretório do projeto, sem queries, terceiros ou outros projetos. A Bíblia digital externa precisa de internet. Cache-first usa conjunto completo e versão explícita; instalação incompleta preserva o cache ativo, e candidato que reutiliza sua versão é rejeitado antes de sobrescrevê-lo. Novas versões aguardam o ciclo natural de encerramento das páginas antigas ou Atualizar agora. Somente essa ação permite recarregar a leitura; o aviso discreto também aparece fora do painel. A ativação limpa somente caches anteriores deste escopo, sem apagar localStorage.

Manutenção obrigatória: incrementar `VERSION` de `sw.js` sempre que qualquer arquivo do conjunto local mudar, no mesmo PR. O registro ignora cache HTTP na consulta do worker e verifica atualização ao voltar à rede/página visível, com intervalo mínimo de um minuto. Não há atualização periódica em segundo plano ou notificações. O navegador pode bloquear/remover cache e armazenamento; acesso offline não é garantido em toda situação.

**Progresso e privacidade.** As mesmas marcações e preferências permanecem no contexto em que foram salvas. Instalação, outro navegador ou perfil podem manter armazenamento separado, especialmente em plataformas Apple; não se promete transferência entre Safari, Chrome e PWA. Não foram implementados sincronização, exportação ou importação. As fontes oficiais e seus limites estão em [PRIVACIDADE.md](PRIVACIDADE.md). Nenhum login, backend, banco, credencial, SDK social, serviço pago, rastreamento ou passagem protegida foi acrescentado. A CSP passou de `connect-src 'none'` para `'self'` e ganhou `worker-src 'self'`/`manifest-src 'self'` para recursos do próprio site; as demais restrições permanecem.

## Testes executados

| Verificação | Resultado | Evidência |
| --- | --- | --- |
| `npm test` | 24/24 aprovados, sem falhas ou pulados | [Node](evidencias/compartilhar-imprimir-pwa/testes-node.txt) |
| `tests/browser.cjs` | 9/9 aprovados, regressões existentes | [Navegador](evidencias/compartilhar-imprimir-pwa/testes-browser.txt) |
| `tests/features-browser.cjs` | 10/10 aprovados, compartilhamento/impressão/foco/responsividade | [Ações](evidencias/compartilhar-imprimir-pwa/testes-features.txt) |
| `tests/pwa-browser.cjs` | 6/6 aprovados, ciclo real de worker em subcaminho local | [PWA](evidencias/compartilhar-imprimir-pwa/testes-pwa-browser.txt) |
| Axe-core | 54 cenários, zero violações detectadas; 66 verificações inconclusivas | [Relatório completo](evidencias/compartilhar-imprimir-pwa/acessibilidade.json) |
| PDF A4 | Duas páginas, 35 caixas vazias, cor e monocromático inspecionados | [PDF](evidencias/compartilhar-imprimir-pwa/roteiro-a4.pdf), [metadados](evidencias/compartilhar-imprimir-pwa/pdf-info.txt) |
| Arquivos estáticos | Manifesto/ícones válidos, 62 IDs únicos, 12 recursos locais referenciados existentes; sintaxe dos novos scripts válida | Testes Node e revisão local |

Ferramentas: Node 24.19, Playwright 1.62.1, Chromium 154 e axe-core 4.10.3, sem dependências adicionadas ao site. Navegador e auditoria usaram `http://127.0.0.1:8002`; a suíte PWA cria um servidor isolado com `/plano-de-leitura-biblica-para-mulheres/`. Ferramentas foram instaladas fora do projeto e não fazem parte do runtime.

Cobertura inclui as seis traduções e 180 URLs locais das leituras, os 35 encontros online/offline, dez temas em 320, 360, 375, 390, 430, 768, 1024 e 1440 px, ações com/sem retomada, painel com alternativa manual e ajuda expandidas, teclado, Escape, foco, fundo inerte, áreas de toque e preferências de movimento/transparência. O tamanho dos controles é medido após terminar a transição de pressão, mantendo o limite de 44 px. Não há supressão de erros de console para forçar resultados.

As APIs de compartilhamento/clipboard e eventos de instalação foram simulados para testar sucesso, rejeição, cancelamento e falta de suporte. O destino WhatsApp recebeu resposta sintética da automação: nenhuma mensagem real foi enviada. Já registro, cache, requisições, modo offline e atualização de worker foram exercitados no Chromium real. A suíte verifica troca coerente de HTML/CSS v1→v2, ausência de recarga antes da escolha, preservação das marcações/caches alheios e manutenção da versão anterior após falha HTTP 503 ou reutilização da versão.

Os mínimos calculados permanecem 4,55:1 em tokens de texto opacos, 5,02:1 em materiais compostos e 5,85:1 na ação principal. As 66 verificações inconclusivas do axe são 12 de valores ARIA e 54 de contraste; estão preservadas integralmente. Zero violações detectadas não equivale a certificação WCAG. [Resumo numérico](evidencias/compartilhar-imprimir-pwa/resumo.json).

## Evidências e limites

[Capturas de celular, computador, painel, ícones e papel](capturas/compartilhar-imprimir-pwa/README.md). Os registros anteriores foram preservados em seus diretórios. O PDF é uma amostra desta revisão; o roteiro de uso continua gerado dos dados atuais pelo navegador.

Não foram testados aparelhos físicos Android/iPhone, instalação real pelo sistema, menus nativos de compartilhamento, Safari/Firefox, impressora física, leitor de tela ou zoom nativo de 200%/400%. A paginação pode mudar com fontes, margens, cabeçalhos/rodapés e drivers; conferir a prévia A4 antes de imprimir. Cabeçalhos e rodapés nativos estavam desativados no PDF de teste. Recorte final dos ícones, retomada em standalone e isolamento de armazenamento entre aplicativos dependem de validação humana nos aparelhos pretendidos.

O novo PR deve ser revisado antes de qualquer merge ou publicação. A verificação de qualidade do GitHub executa os testes Node; os resultados Chromium/axe deste relatório são locais. A publicação permanece responsabilidade e decisão da proprietária.
