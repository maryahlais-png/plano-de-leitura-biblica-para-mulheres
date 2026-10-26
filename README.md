# Plano de Leitura Bíblica para Mulheres

Um guia gratuito de estudo bíblico para mulheres adultas que já têm contato com a igreja e desejam aprofundar a leitura das Escrituras, inclusive quando estão começando a ler a Bíblia por conta própria.

**Proposta:** estimular leitura atenta, interpretação responsável e reflexão pessoal — não entregar conclusões prontas nem armazenar confidências.

**Autoria:** Lais Fernandes.  
**Assinatura no site:** *Com fé e carinho, Lais Fernandes.*

## Funcionalidades

- 35 encontros: 30 leituras bíblicas e cinco revisões, organizados em cinco semanas.
- Referências bíblicas para consulta na Bíblia física ou, opcionalmente, na YouVersion (NVI, NAA, ARA, ARC, NVT, NTLH).
- Perguntas para reflexão individual e seção opcional de contexto e interpretação.
- Marcação de leitura, sem cadastro, comentários, formulários ou anotações digitais.
- Cinco paletas: Lavanda, Sálvia, Areia, Azul Névoa e Rosé; modos claro, escuro ou automático.
- Orientações de uso que aparecem apenas no primeiro acesso daquele navegador.
- Celebração discreta com pequenos brilhos cristalinos ao terminar cada semana, respeitando a preferência de redução de movimento.
- Layout responsivo, navegação por teclado e código sem dependências externas.

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

Testes automatizados cobrem estrutura e integridade das 35 leituras, decisões de privacidade e integridade de componentes estáticos. O workflow do GitHub Actions executa os testes em pushes e pull requests. Testes visuais e de navegação humana ainda são recomendados antes da divulgação ampla: confira o roteiro em `docs/TESTES.md`.

## Organização

```text
.
├── index.html           # Estrutura semântica da aplicação
├── src/
│   ├── data.js          # Leituras, semanas, contexto e perguntas
│   ├── app.js           # Navegação, estado local, aparência, celebração
│   └── styles.css       # Interface responsiva e 10 temas
├── docs/
│   ├── REQUISITOS.md
│   ├── ARQUITETURA.md
│   ├── SEGURANCA.md
│   ├── PRIVACIDADE.md
│   └── TESTES.md
├── tests/               # Verificações automatizadas sem dependências
├── .github/             # CI para testes e Dependabot para Actions
├── AGENTS.md            # Restrições para contribuições assistidas por IA/Codex
├── SECURITY.md          # Como reportar riscos de segurança
└── .nojekyll            # Publicação estática no GitHub Pages
```

## Publicar pelo GitHub Pages

1. Crie um repositório **público** chamado `plano-de-leitura-biblica-para-mulheres` em https://github.com/new.
2. Envie **o conteúdo desta pasta**, com `index.html` na raiz do repositório (não uma pasta extra ao redor).
3. No repositório, abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**, branch **main**, pasta **/(root)** e salve.
5. O GitHub mostrará um endereço semelhante a `https://SEU-USUARIO.github.io/plano-de-leitura-biblica-para-mulheres/` após a publicação.

Não publique credenciais, documentos pessoais nem informações de usuários. O código é público; os dados guardados pelo navegador de cada pessoa não são incluídos no repositório.

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