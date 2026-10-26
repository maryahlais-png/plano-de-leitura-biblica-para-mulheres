# Devotional Days

**35 dias de leitura e reflexão bíblica · feito para mulheres**

Um guia gratuito de estudo bíblico para mulheres adultas que já têm contato com a igreja e desejam aprofundar a leitura das Escrituras, inclusive quando estão começando a ler a Bíblia por conta própria.

**Proposta:** estimular leitura atenta, interpretação responsável e reflexão pessoal — não entregar conclusões prontas nem armazenar confidências.

**Autoria:** Lais Fernandes.  
**Assinatura no site:** *Com fé e carinho, Lais Fernandes.*

## Funcionalidades

- 35 encontros: 30 leituras bíblicas e cinco revisões, organizados em cinco semanas.
- Referências bíblicas para consulta na Bíblia física ou, opcionalmente, na YouVersion (NVI, NAA, ARA, ARC, NVT, NTLH).
- Perguntas para reflexão individual e seção opcional de contexto e interpretação.
- Marcação de leitura, sem cadastro, comentários, formulários ou anotações digitais.
- Cinco paletas: Lavanda, Sálvia, Areia, Azul Névoa e Rosé; modos claro, escuro ou automático, com bases neutras, superfícies em camadas e controles arredondados.
- Orientações no primeiro acesso, disponíveis novamente em **Como usar**. Os encontros não precisam ser feitos em dias consecutivos.
- Último encontro preservado e atalho opcional para a primeira atividade pendente.
- Roteiro lateral no computador e botão compacto **Abrir roteiro** no celular.
- Celebrações centralizadas ao concluir uma semana ou o plano completo, com microbrilhos brancos e apresentação estática quando há preferência por reduzir movimento.
- Layout responsivo, navegação por teclado e código sem dependências externas. A leitura permanece opaca; a translucidez discreta de alguns controles e painéis possui alternativa opaca.

## Executar localmente

**Opção rápida:** abra `index.html` no navegador. Para servir como um site local, execute na pasta do projeto:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`. Nenhum `npm install` é necessário para executar o site.

## Testes

É necessário Node.js recente (18 ou superior) **somente para os testes**:

```bash
npm test
```

Os 14 testes sem dependências cobrem as 35 leituras, estrutura, segurança, compatibilidade das chaves de armazenamento, validação de estado, persistência e transições de conclusão. A suíte opcional `tests/browser.cjs` exercita o site no Chromium com Playwright, instalado fora do projeto; instruções e limites em `docs/TESTES.md`. O workflow do GitHub Actions executa os testes em pushes e pull requests. Testes visuais e de navegação humana ainda são recomendados antes da divulgação ampla: confira o roteiro em `docs/TESTES.md`.

## Organização

```text
.
├── index.html           # Estrutura semântica da aplicação
├── src/
│   ├── data.js          # Leituras, semanas, contexto e perguntas
│   ├── state.js         # Validação, persistência e transições de progresso
│   ├── overlays.js      # Foco, fundo inerte e rolagem dos painéis
│   ├── app.js           # Navegação, aparência e composição da interface
│   ├── favicon.svg      # Ícone local, sem requisição a terceiros
│   └── styles.css       # Interface responsiva e 10 temas
├── docs/
│   ├── REQUISITOS.md
│   ├── ARQUITETURA.md
│   ├── SEGURANCA.md
│   ├── PRIVACIDADE.md
│   ├── INTERFACE.md
│   ├── VALIDACAO.md
│   ├── VALIDACAO-POLIMENTO.md
│   └── TESTES.md
├── tests/               # Verificações automatizadas sem dependências
├── .github/             # CI para testes e Dependabot para Actions
├── AGENTS.md            # Restrições para contribuições assistidas por IA/Codex
├── SECURITY.md          # Como reportar riscos de segurança
└── .nojekyll            # Publicação estática no GitHub Pages
```

## Site e revisão de mudanças

O repositório e a URL permanecem os mesmos:
https://maryahlais-png.github.io/plano-de-leitura-biblica-para-mulheres/

Desenvolva em uma branch a partir da `main` atualizada, execute os testes, envie commits ao remoto e abra um Pull Request para revisão. Não faça merge nem publique uma atualização sem autorização explícita da autora. Consulte `CONTRIBUTING.md`.

Nesta segunda rodada, `feature/devotional-days-apple-polish` parte de `feature/devotional-days` e tem essa branch como destino do [PR #5](https://github.com/maryahlais-png/plano-de-leitura-biblica-para-mulheres/pull/5). O PR #4 e a versão anterior permanecem disponíveis para revisão. A [validação do polimento](docs/VALIDACAO-POLIMENTO.md) reúne os resultados desta rodada sem substituir o [relatório anterior](docs/VALIDACAO.md).

A hospedagem continua estática no GitHub Pages, com `index.html` na raiz e `.nojekyll`. Não publique credenciais ou dados pessoais. Os dados do navegador de cada pessoa não fazem parte do repositório.

Documentação oficial: https://docs.github.com/pt/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Referências e direitos autorais

Este é um guia independente. As referências a traduções levam a um site externo; **não hospedamos capítulos da Bíblia**. As traduções bíblicas possuem direitos próprios, que devem ser respeitados caso o conteúdo seja incorporado no futuro.

Links para aprofundar:
- [BibleProject — Como ler a Bíblia](https://bibleproject.com/pt-br/videos/collections/como-ler-a-biblia/)
- [Sociedade Bíblica do Brasil — Planos de leitura](https://www.sbb.org.br/planos-de-leitura)

Essas instituições não patrocinam nem endossam este guia.

## Próximos cuidados

Antes da publicação para um público maior, revise cada estudo com uma pessoa competente em interpretação bíblica, considerando diferenças entre tradições cristãs. Nenhuma leitura isolada deve ser usada para impor aconselhamento individual ou substituir apoio pastoral/profissional quando necessário.

## Licença

O **código original** do site é disponibilizado sob a licença MIT em [LICENSE](LICENSE). Essa licença não abrange marcas, traduções bíblicas ou material pertencente a terceiros.