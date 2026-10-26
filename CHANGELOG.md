# Histórico de versões

## Segunda rodada — polimento visual incremental (proposta para revisão, 2026-10-26)

- Controles com formas de cápsula, realces discretos, sombras de contato e estados de interação refinados; trilho rebaixado, seleção elevada e contorno funcional no controle de exibição.
- Superfícies opacas de leitura com maior distinção entre fundo, estudo, controles e painéis, preservando as cinco paletas nos modos claro e escuro.
- Material translúcido de alta opacidade em pontos específicos, com alternativa opaca para navegadores sem suporte e preferência por reduzir transparência.
- Roteiro móvel compacto com o mesmo gerenciamento de foco, Escape, clique fora e rolagem; acabamento visual coerente com Aparência e conclusões.
- Orientações com hierarquia e numeração mais delicadas, linguagem gentil e os mesmos passos e limites de privacidade.
- Conteúdo, chaves de progresso, preferências, navegação e comportamento das comemorações preservados; sem dependências de runtime novas.
- Documentação e evidências desta rodada mantidas separadas das capturas e relatórios anteriores.
- CI existente ampliado para Pull Requests destinados também a `feature/devotional-days`, com os mesmos testes Node.js 22 e permissões de leitura.
- Desenvolvimento em `feature/devotional-days-apple-polish`, com Pull Request destinado a `feature/devotional-days`; sem merge nem publicação automática.

## 1.3.0 — proposta para revisão (2026-10-26)

- Identidade Devotional Days, subtítulo em português e assinatura preservada.
- Dez temas com superfícies neutras, acentos próprios, sombras sutis e tokens de contraste revisados.
- Botão móvel de 44 × 44 px; roteiro sem barra horizontal, com foco contido, fundo inerte, Escape, clique fora e rolagem interna.
- Gerenciamento compartilhado de sobreposições elimina a disputa de camadas com Aparência.
- Orientações em três passos, consulta em Como usar e retomada opcional da primeira pendência.
- Leitura escolhida preservada, mesmas chaves de progresso e aviso em falhas de armazenamento.
- Celebrações semanais e integral sobre a tela atual, com cristais brancos, apresentação estática para movimento reduzido e nenhuma repetição automática no recarregamento.
- Estado e sobreposições separados em módulos pequenos; testes unitários e de navegador, rastreabilidade e documentação da interface.
- Conteúdo bíblico, licença, repositório e URL preservados. Sem dependências de runtime, backend ou publicação automática.

## 1.2.0 — 2026-10-26

- Botão Roteiro horizontal e sempre identificável no celular, com progresso ao lado.
- Cinco paletas preservadas em claro e escuro, com bases neutras e acentos mais definidos.
- Interface com superfícies em camadas, navegação sobreposta, hierarquia e bordas sutis.
- Sem alterar os dados de leitura, a privacidade ou as preferências salvas.

## 1.1.0 — 2026-10-26

- Roteiro em painel lateral no celular, aberto por aba discreta; fecha ao tocar fora, pressionar Escape, fechar manualmente ou escolher um encontro.
- Manutenção da navegação lateral tradicional no computador.
- Acessibilidade: controle de foco, atributos ARIA e bloqueio de interação com o painel fechado.
- Teste automatizado de estrutura do painel móvel e roteiro de verificação manual.

## 1.0.0 — 2026-10-26

- Nome público definido como **Plano de Leitura Bíblica para Mulheres**.
- Percurso editorial com 30 leituras e 5 revisões, dividido em 5 semanas.
- Cinco paletas em claro/escuro e modo automático do dispositivo.
- Aviso inicial dispensável e comemoração com partículas cristalinas.
- Preferências e progresso exclusivamente no navegador.
- Documentação de requisitos, arquitetura, privacidade, segurança, testes e orientações para Codex.
- Testes automáticos e workflow de verificação contínua.