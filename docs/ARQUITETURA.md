# Arquitetura e decisões de engenharia

## Visão geral

Site estático HTML + CSS + JavaScript puro, hospedável pelo GitHub Pages. Sem servidor próprio, banco de dados, dependências de runtime, SDKs, APIs, publicidade ou integrações.

```text
Visitante → index.html → src/styles.css
                       → src/data.js  (plano e perguntas)
                       → src/state.js (estado validado e persistência)
                       → src/overlays.js (sobreposições acessíveis)
                       → src/app.js   (composição da interface)
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
4. **Leitura digital:** cria link para passagem usando enumeração fechada de versões e catálogo próprio de livros.

## Estado e compatibilidade

`state.js` expõe um pequeno objeto imutável de funções, reutilizado pelo navegador e pelos testes Node via CommonJS, sem build. `sanitize` valida índices, enumerações e tipos, deduplica marcações e descarta propriedades desconhecidas. `toggleRead` retorna um novo estado e o tipo de conclusão; não executa efeitos de interface.

A chave principal continua `leitura-biblica-mulheres-v1`; `plano-biblia-estudo-reflexao-v2` permanece como fallback, sem exclusão. Se a chave atual é JSON malformado, a anterior ainda pode ser lida. Campos preservados: `read`, `current`, `palette`, `mode`, `version`, `acknowledged`. Nenhuma migração destrutiva ou campo pessoal foi adicionado. A primeira gravação após ler a chave antiga usa a principal e mantém a antiga intacta.

O encontro atual não muda no carregamento. `nextPending` apenas calcula o destino do botão opcional de retomada. Falhas no getter, leitura, JSON ou cota de armazenamento exibem aviso e permitem uso em memória, sem prometer recuperação.

## Sobreposições e foco

`overlays.js` mantém no máximo um painel ativo. Roteiro móvel, Aparência e conclusão compartilham backdrop, Escape, contenção de Tab/Shift+Tab e restauração de foco. Irmãos ao longo da árvore DOM ficam `inert`, preservando os que já estavam inativos; a página usa posicionamento fixo para bloquear rolagem e recuperar a posição ao fechar. Os focáveis excluem conteúdo de `<details>` fechado, mesmo quando o navegador mantém retângulos de layout.

O roteiro é um `aside` no desktop e recebe papel de diálogo somente até 690 px. Ao cruzar esse limite, o modal fecha e o estado acessível é recalculado. Escolher um encontro leva o foco e a rolagem ao artigo. Não há barra móvel com contexto de empilhamento; um único backdrop fica abaixo do painel ativo.

## Extensões futuras

Novos planos podem ser acrescentados aos dados, mantendo controle editorial, testes de integridade e separação dos módulos. Um backend exigiria um novo modelo de ameaças, política de privacidade revisada e uma decisão explícita da autora.