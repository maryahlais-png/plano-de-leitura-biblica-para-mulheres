# Interface — Devotional Days

## Identidade e leitura

A identidade segue o site existente: tipografia de sistema para controles, Georgia para títulos, cinco paletas delicadas, cartões arredondados e assinatura de Lais Fernandes. O título é **Devotional Days**, seguido de **35 dias de leitura e reflexão bíblica** e **feito para mulheres**. Apenas o nome está em inglês. O conteúdo de `src/data.js` não foi alterado.

O cabeçalho usa iluminação suave, sem imagens ou fontes remotas. O artigo é a superfície principal; contexto, progresso e referências ficam próximos ao estudo. O roteiro permanece na coluna esquerda no desktop. No celular, o botão com nome acessível **Abrir roteiro** ocupa 44 × 44 px perto do início da leitura, sem barra fixa. A área de leitura mostra o progresso e o atalho opcional de retomada não força avanço.

## Temas

Lavanda continua padrão. Sálvia, Areia, Azul Névoa e Rosé mantêm identidade nos acentos, chips, referências e cabeçalho. No escuro, fundo e cartões usam grafite neutro em níveis distintos; cores não cobrem toda a página. As superfícies de fundo, estudo, controles e painéis usam níveis distintos de luminosidade. Sombras de contato, sombra ambiente e realces internos criam separação sem contornar cada seção. No modo claro, a luz aparece nos topos das superfícies; no escuro, as bases continuam neutras e os acentos se concentram em ações, referências e estados. Os tokens `--layer-shadow`, `--control-shadow` e `--panel-shadow` diferenciam estudo, controles e painéis; `--highlight` produz o realce interno. A iluminação do fundo se limita ao topo, sem saturar toda a tela.

Textos usam `--text`, `--muted`, `--accent` ou `--hero-ink` sobre superfícies avaliadas. Campos usam um contorno próprio, distinto das divisórias decorativas. Os botões usam formas mais arredondadas, superfícies e sombras suaves; o foco continua explícito e não depende da sombra decorativa. A escolha persiste nas mesmas propriedades de antes. Automático acompanha mudanças do sistema sem substituir a preferência salva.

## Controles e acabamento

A ação principal adota a forma de cápsula, com realce superior discreto e sombra de contato. Ações secundárias e controles de ícone recebem camadas mais suaves, com diferença visual entre repouso, hover, pressão, foco e indisponibilidade. Movimentos breves de transformação e sombra acompanham a interação sem deslocar o layout; a preferência por reduzir movimento os desativa. A troca de tema atualiza texto e fundo no mesmo instante, mantendo o contraste durante a mudança.

O seletor Claro/Escuro/Automático mantém botões nativos e estados `aria-pressed`. O trilho parece rebaixado; a seleção usa uma superfície elevada, maior peso tipográfico e um contorno neutro funcional. Esse contorno identifica o estado selecionado sem depender apenas de uma diferença suave de luminosidade. A seleção não altera as marcações nem avança a leitura. O roteiro móvel mantém a área de toque de 44 × 44 px e não se transforma em barra horizontal.

## Ações auxiliares em Mais opções

Um único botão **Mais opções** abre um painel discreto com Compartilhar, Imprimir roteiro e orientações de instalação. A ação **Instalar aplicativo** só aparece quando o navegador fornece uma oferta válida. O painel usa o mesmo acabamento dos demais controles e o gerenciamento compartilhado de foco, Escape, clique fora, fundo inativo e rolagem. Não há nova barra fixa.

**Compartilhar** usa as opções do dispositivo quando disponíveis. Na alternativa, a leitora pode copiar o endereço ou abrir o WhatsApp. A confirmação de cópia aparece apenas após o sucesso da operação; se o navegador a bloquear, um campo com o endereço pode ser selecionado para cópia manual. Cancelar o compartilhamento do dispositivo encerra a ação normalmente.

**Imprimir roteiro** fecha o painel e abre a impressão nativa do navegador. A composição em papel possui identidade, cinco semanas e 35 encontros com referências, revisões e caixas vazias para marcação manual. O conteúdo vem de `src/data.js`; perguntas, contextos extensos e controles não entram na impressão. O papel A4 e a separação das semanas são definidos em CSS, com leitura também em preto e branco. A composição de referência usa duas páginas, semanas 1–3 e 4–5, corpo de 10,5 pt e referências de 10 pt. Prévia e impressora podem aplicar configurações próprias; o PDF de teste não equivale a impressão física validada.

As orientações de tela inicial descrevem Android e iPhone sem simular um instalador. O aviso de progresso explica que navegador e versão instalada podem manter marcações separadas. Quando há atualização disponível, uma indicação discreta leva a **Atualizar agora**, ação que recarrega a página somente após a escolha da leitora.

## Leitura bíblica digital

A ação **Ler na Bíblia digital** é um link com aparência de cápsula, no mesmo material e sistema de sombras das ações secundárias. Os ícones de livro e saída são decorativos; o nome acessível permanece o texto da ação. Abaixo, **A leitura será aberta na YouVersion.** informa o destino, e a descrição acessível acrescenta que será aberta uma nova aba.

O seletor preserva NVI, NAA, ARA, ARC, NVT e NTLH, com siglas e nomes completos. NVI continua o padrão para novas leitoras; uma preferência já salva prevalece. O link usa a referência do encontro atual e a tradução escolhida. Revisões semanais continuam sem passagem nova e sem ação digital artificial.

A leitura ocorre na YouVersion. O Devotional Days não exibe versículos integrais nem oferece controles de fonte de um leitor interno nesta etapa. Abrir o destino externo mantém o encontro, a aparência e o progresso do guia. A [pesquisa de viabilidade](VIABILIDADE-LEITOR-BIBLICO.md) registra as condições que precisariam ser atendidas antes de uma integração autorizada.

## Material translúcido e alternativa opaca

A área principal do estudo permanece opaca para que o texto não dependa do conteúdo ao fundo. A translucidez é limitada aos controles de Roteiro/Aparência e aos painéis flutuantes de Aparência, Mais opções e conclusão. A alta opacidade, o desfoque discreto e o realce de borda sugerem material sem tornar a página inteira transparente. Os painéis usam aproximadamente 93% de opacidade no claro e 96% no escuro, com desfoque de 12 px; os pequenos controles usam desfoque de 8 px. A sobreposição de fundo conserva desfoque de 3 px.

O estilo base fornece uma superfície opaca. A translucidez só é aplicada quando o navegador suporta o recurso; `prefers-reduced-transparency: reduce` restaura superfícies opacas e remove o desfoque. Essa alternativa também mantém o texto, os estados e os controles compreensíveis. Compatibilidade visual real em Safari/iOS permanece uma revisão complementar.

## Orientações e linguagem

A orientação inicial não é modal: três passos com numeração discreta e espaçamento próprio descrevem passagem completa, reflexão no caderno, consulta posterior ao contexto e conclusão. A redação convida à leitura com calma, sem impor um ritmo. A numeração visual usa contadores CSS; `role="list"` conserva a semântica da lista quando o marcador nativo é removido. Informa as cinco revisões, o ritmo livre e o limite do armazenamento. **Entendi** salva o aceite; **Como usar** permite consultar de novo sem reativar avisos recorrentes. Traduções exibem sigla e nome completo. A interface explica que Bíblia física ou digital são opções equivalentes.

## Painéis e comemorações

Um painel por vez, sempre acima do fundo. Roteiro, Aparência e Mais opções têm fechamento explícito, Escape e clique fora; o conteúdo encoberto fica inativo. O roteiro permite rolagem interna, fecha após escolha e entrega foco ao estudo. Ao fechar normalmente, o foco volta ao botão de origem.

As conclusões aparecem centralizadas sobre a leitura atual. São 16 partículas brancas de 2–4 px, com traços finos, duração limitada e sem loop. O modo de movimento reduzido usa cristais estáticos. O botão **Continuar** ou Escape fecha sem mudar encontro ou progresso. A conclusão integral substitui a semanal quando ambos os critérios são atingidos. Não há pontuação, reinício automático ou bloqueio permanente.

## Limites de validação

O relatório da primeira rodada está em `VALIDACAO.md`; a matriz de navegador, contraste e estados da segunda rodada está em `VALIDACAO-POLIMENTO.md`. Verificações automatizadas não substituem avaliação com leitor de tela, zoom nativo, aparelhos reais, Safari/iOS ou revisão editorial humana.
