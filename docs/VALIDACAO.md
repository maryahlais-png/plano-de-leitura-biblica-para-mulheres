# Validação da proposta Devotional Days 1.3

Rodada de 26/10/2026, no ambiente de desenvolvimento. Base: `origin/main` em `fb18d67`. Nenhum merge ou publicação do site faz parte desta entrega.

## Ferramentas e resultados

- Node.js 24.19.0, npm 11.9.0 e Python 3.12.14.
- Chromium 154.0.8037.57, Playwright 1.62.1 e axe-core 4.10.3; ferramentas de navegador fora das dependências do site.
- `npm test`: 14 testes aprovados, zero falhas ou testes pulados. Inclui os seis testes originais atualizados para os novos requisitos e oito testes de estado.
- `node --test tests/browser.cjs`: seis cenários aprovados, sem falhas ou testes pulados; navegação pelos 35 encontros, seis traduções, persistência, dados anteriores, painéis, foco, rolagem e conclusões.
- Matriz de dez temas × sete larguras CSS (320, 360, 375, 390, 430, 768, 1440 px): sem rolagem horizontal involuntária; painéis dentro da viewport.
- Texto nos pares de tokens avaliados: menor contraste de 4,55:1. Contornos de controles avaliados >=3:1. O relatório por tema está em `evidencias/temas-contraste.json`.
- Auditoria axe-core com regras WCAG 2 A/AA, 2.1 AA e 2.2 AA: 24 cenários, zero violações detectadas. Cenários: primeiro acesso, leitura e Aparência nas dez combinações, roteiro móvel, conclusão e desktop. Foram registradas 26 verificações inconclusivas (14 de contraste e 12 de valores ARIA), que não são aprovações. Os detalhes e elementos afetados estão preservados em `evidencias/acessibilidade.json` e exigem julgamento humano; zero violações não significa conformidade integral certificada.
- Nenhum erro de execução, console, CSP ou recurso HTTP detectado pela suíte de navegador.
- `git diff --check`: sem erros. `src/data.js`, `LICENSE` e `package.json` iguais à base.

Os registros da rodada ficam em `evidencias/`. As capturas selecionadas e comparações estão em [capturas/README.md](capturas/README.md).

As inconclusões de ARIA referem-se a `aria-controls` de diálogos fechados, que o auditor não localiza na árvore acessível. Os IDs existem no DOM e os painéis foram abertos/fechados nos testes. As inconclusões de contraste incluem gradientes, partículas sobrepostas e marcas decorativas; os pares de tokens e os extremos dos gradientes foram calculados separadamente. As linhas brutas permanecem no relatório, sem desativar regras para obter um resultado favorável.

## Inspeção visual

Foram abertas capturas reais de desktop, celular, roteiro e celebração para conferir hierarquia, alinhamento, legibilidade, tamanho dos controles e posicionamento. As dez combinações têm capturas geradas. As imagens usam dados sintéticos, sem informações de visitantes. São emulações de viewport em Chromium, não fotografias de aparelhos físicos.

A primeira rodada revelou foco inicial prejudicado pela transição de visibilidade e tentativa de foco em itens de semanas fechadas. Ambos foram corrigidos. Testes de alterações de preferência do sistema e breakpoint aguardam os eventos assíncronos do navegador, evitando conclusões antes de a atualização acontecer.

## Limitações e revisão complementar

- Safari/iOS, Firefox, leitor de tela e zoom nativo de navegador não foram validados nesta máquina. Reflow em 320 px foi testado. Conferir ampliação de texto e contraste percebido em aparelhos reais antes de divulgação ampla.
- Os testes validam a geração local de todas as referências digitais e as seis traduções do catálogo existente. A consulta aos destinos YouVersion, BibleProject e SBB recebeu `403` no túnel de rede do ambiente. Isso não demonstra erro nesses sites; disponibilidade e conteúdo no destino permanecem para conferência humana.
- Não houve alteração editorial no plano nem auditoria teológica nova. Preservada a recomendação de revisão com pessoa qualificada.
- A auditoria do código não verifica configurações privadas de proteção da conta ou de hospedagem GitHub. Nenhuma dessas configurações foi alterada.

## Entrega Git

Branch de trabalho: `feature/devotional-days`, criada a partir da `main` sincronizada. Commits, referência remota e estado do Pull Request devem ser confirmados na entrega e no próprio GitHub. O envio da branch não atualiza o site público; a autora revisa o PR e autoriza explicitamente qualquer merge/publicação.
