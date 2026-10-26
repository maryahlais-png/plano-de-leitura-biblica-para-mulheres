# Testes e critérios de revisão

## Testes sem dependências

Node.js >=18, na raiz do projeto:

```bash
npm test
```

`site.test.cjs` verifica conteúdo, identidade, estrutura e segurança. `state.test.cjs` executa funções reais de validação, leitura/gravação com ambas as chaves, fallback de JSON malformado, falhas de acesso/cota, retomada, marcação e transições de conclusão semanal e integral. O workflow existente executa essa suíte no Node.js 22.

## Integração com navegador real

Ferramentas opcionais, sem dependências no site e sem alterar `package.json`. Nesta máquina, Playwright 1.62.1 e Chromium já estavam disponíveis. Em outra máquina, com Chromium instalado, é possível instalar o driver fora do checkout:

```bash
npm install --cache /tmp/devotional-npm-cache --prefix /tmp/devotional-browser --no-package-lock --no-save playwright@1.62.1
```

Inicie `npm start` em uma sessão e, em outra, execute na raiz:

```bash
NODE_PATH=/tmp/devotional-browser/node_modules CHROMIUM_PATH=/usr/bin/chromium node --test tests/browser.cjs
```

Se Playwright já estiver no caminho de módulos, basta `node --test tests/browser.cjs`. Ajuste `CHROMIUM_PATH` ao executável confiável da máquina. `BASE_URL` muda o servidor de teste (padrão `http://127.0.0.1:8000`); `ARTIFACT_DIR` muda o destino de capturas e relatório de contraste (padrão `/tmp/devotional-days-results`). Use uma origem sem dados pessoais: o teste cria contextos isolados com estado sintético.

Os seis cenários cobrem:

- primeiro acesso, dispensa e nova consulta das orientações;
- navegação pelos 35 encontros, referências, questões, revisões e seis traduções;
- roteiro/Aparência, foco inicial e circular, Escape, clique fora, fundo inerte, scroll e mudança desktop/mobile;
- progresso, leitura atual e preferências após reload, ambas as chaves antigas, falhas no getter e na gravação;
- conclusão semanal e integral, cristais brancos, movimento reduzido, fechamento e ausência de repetição no reload;
- dez temas em 320, 360, 375, 390, 430, 768 e 1440 px, sem overflow horizontal, painéis dentro da tela, contraste de tokens e modo automático.

A suíte falha se houver erro de JavaScript, console, CSP ou recursos HTTP. O cálculo sRGB verifica pares de tokens usados por texto (>=4,5:1) e contornos de controles (>=3:1); não equivale a certificação WCAG completa. Capturas são geradas em claro/escuro para todas as paletas.

## Auditoria automatizada de acessibilidade

Instale `axe-core@4.10.3` também fora do checkout, no mesmo prefixo usado para Playwright:

```bash
npm install --cache /tmp/devotional-npm-cache --prefix /tmp/devotional-browser --no-package-lock --no-save playwright@1.62.1 axe-core@4.10.3
NODE_PATH=/tmp/devotional-browser/node_modules node tests/a11y.cjs
```

Usa o mesmo `BASE_URL`, `CHROMIUM_PATH` e `ARTIFACT_DIR`, roda 24 cenários e grava `acessibilidade.json`. Sai com erro se detectar violações; resultados incompletos permanecem no relatório para revisão humana. A injeção do auditor é feita pelo processo de automação, sem mudar CSP ou carregar bibliotecas no site entregue.

## Aceitação complementar

1. Inspecionar capturas e uso real em computador e celular: alinhamento, legibilidade, foco e recortes.
2. Conferir zoom nativo de 200%/400%, ampliação de texto e preferências de contraste; largura CSS de 320 px já é coberta automaticamente.
3. Usar leitor de tela e Safari/iOS: anúncio dos diálogos, retorno de foco, rolagem e opções de seleção.
4. Confirmar manualmente no destino externo as seis traduções, capítulos e versículos; os testes locais validam construção dos links, não a disponibilidade do serviço.
5. Revisar com pessoa qualificada a interpretação bíblica e os direitos autorais antes de ampliar a divulgação. O conteúdo editorial não foi alterado.

Resultados reais, versões e limitações da rodada atual estão em `VALIDACAO.md`. Não publicar nem fazer merge sem aprovação da autora.
