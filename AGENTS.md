# Orientações para Codex e colaboradores

Projeto: **Plano de leitura bíblica para mulheres**. Autoria: **Lais Fernandes**.

## Objetivo e público

Guia visual e responsivo para mulheres adultas já introduzidas à vida de igreja, inclusive iniciantes na leitura sistemática da Bíblia. As perguntas devem ser profundas, centradas no texto bíblico, com contexto e rigor interpretativo; sem infantilização, clichês ou estereótipos.

## Regras inegociáveis

1. Não adicionar login, cadastro, banco de dados, analytics, notificações invasivas, comentários, chat ou campos de anotações.
2. As reflexões pertencem ao caderno da pessoa. Persistir **somente** progresso e preferências não sensíveis no navegador.
3. Manter as cinco paletas (Lavanda, Sálvia, Areia, Azul Névoa e Rosé) em claro/escuro; respeitar modo do sistema e redução de movimento.
4. Não usar emojis na interface; priorizar tipografia elegante, espaçamento compacto, componentes alinhados e navegação estilo app iOS sem excesso visual.
5. Conclusão semanal: brilhos cristalinos **finos e discretos**, sem confete ou animação agressiva.
6. Não transcrever livros ou passagens extensas de traduções bíblicas sob copyright; usar referências e links oficiais conforme permissões.
7. Usar criação segura de elementos DOM e `textContent`; não usar `innerHTML`, `eval`, bibliotecas externas sem justificativa nem credenciais no frontend.
8. Não apagar autoria nem referências: rodapé **“Com fé e carinho, Lais Fernandes.”**
9. Ao alterar conteúdo, revisar contexto bíblico, distinção entre interpretação e aplicação, e evitar apresentar inferências como citações.
10. Ao alterar código, rodar `npm test`, verificar documentação e inspecionar manualmente em celular/desktop antes de abrir PR.

## Fluxo Git sugerido

- Issue descritiva → branch `feature/nome-curto` → mudanças pequenas → testes → Pull Request com checklist → revisão → merge.
- Mensagens de commit sugeridas: `feat: ...`, `fix: ...`, `docs: ...`, `test: ...`, `refactor: ...`.
- Não introduzir ferramentas pesadas sem avaliar custo e real necessidade.

Documentos de referência: `docs/REQUISITOS.md`, `docs/ARQUITETURA.md`, `docs/SEGURANCA.md`, `docs/PRIVACIDADE.md`, `docs/TESTES.md`.