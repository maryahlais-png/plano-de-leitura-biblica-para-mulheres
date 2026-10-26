# Interface — Devotional Days

## Identidade e leitura

A identidade segue o site existente: tipografia de sistema para controles, Georgia para títulos, cinco paletas delicadas, cartões arredondados e assinatura de Lais Fernandes. O título é **Devotional Days**, seguido de **35 dias de leitura e reflexão bíblica** e **feito para mulheres**. Apenas o nome está em inglês. O conteúdo de `src/data.js` não foi alterado.

O cabeçalho usa iluminação suave, sem imagens ou fontes remotas. O artigo é a superfície principal; contexto, progresso e referências ficam próximos ao estudo. O roteiro permanece na coluna esquerda no desktop. No celular, o botão com nome acessível **Abrir roteiro** ocupa 44 × 44 px perto do início da leitura, sem barra fixa. A área de leitura mostra o progresso e o atalho opcional de retomada não força avanço.

## Temas

Lavanda continua padrão. Sálvia, Areia, Azul Névoa e Rosé mantêm identidade nos acentos, chips, referências e cabeçalho. No escuro, fundo e cartões usam grafite neutro em níveis distintos; cores não cobrem toda a página. Tokens `--surface`, `--surface-elevated`, `--surface-soft`, `--tint` e `--layer-shadow` organizam profundidade sem contornar cada seção.

Textos usam `--text`, `--muted`, `--accent` ou `--hero-ink` sobre superfícies avaliadas. Campos e botões contornados usam `--control-border`, distinto das divisórias decorativas. A escolha persiste nas mesmas propriedades de antes. Automático acompanha mudanças do sistema sem substituir a preferência salva.

## Orientações e linguagem

A orientação inicial não é modal: três passos descrevem passagem completa, reflexão no caderno e conclusão. Informa as cinco revisões, o ritmo livre e o limite do armazenamento. **Entendi** salva o aceite; **Como usar** permite consultar de novo sem reativar avisos recorrentes. Traduções exibem sigla e nome completo. A interface explica que Bíblia física ou digital são opções equivalentes.

## Painéis e comemorações

Um painel por vez, sempre acima do fundo. Roteiro e Aparência têm fechamento explícito, Escape e clique fora; o conteúdo encoberto fica inativo. O roteiro permite rolagem interna, fecha após escolha e entrega foco ao estudo. Ao fechar normalmente, o foco volta ao botão de origem.

As conclusões aparecem centralizadas sobre a leitura atual. São 16 partículas brancas de 2–4 px, com traços finos, duração limitada e sem loop. O modo de movimento reduzido usa cristais estáticos. O botão **Continuar** ou Escape fecha sem mudar encontro ou progresso. A conclusão integral substitui a semanal quando ambos os critérios são atingidos. Não há pontuação, reinício automático ou bloqueio permanente.

## Limites de validação

A matriz de navegador e contraste está em `VALIDACAO.md`. Verificações automatizadas não substituem avaliação com leitor de tela, zoom nativo, aparelhos reais, Safari/iOS ou revisão editorial humana.
