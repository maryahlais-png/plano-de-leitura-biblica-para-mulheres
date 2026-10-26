# Arquitetura e decisões de engenharia

## Visão geral

Site estático HTML + CSS + JavaScript puro, hospedável pelo GitHub Pages. Sem servidor próprio, banco de dados, dependências de runtime, SDKs, APIs, publicidade ou integrações.

```text
Visitante → index.html → src/styles.css
                       → src/data.js  (plano e perguntas)
                       → src/app.js   (interface e persistência local)
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
2. **Marcação:** adiciona/remove índice no conjunto local, recalcula progresso, apresenta cristais quando os 7 encontros da semana são concluídos.
3. **Personalização:** altera paleta e modo; persiste no navegador; não envia informações a terceiros.
4. **Leitura digital:** cria link para passagem usando enumeração fechada de versões e catálogo próprio de livros.

## Extensões futuras

Novos planos podem ser acrescentados aos dados, mantendo controle editorial, testes de integridade e separação dos módulos. Um backend exigiria um novo modelo de ameaças, política de privacidade revisada e uma decisão explícita da autora.