# Orientações para Codex e colaboradores

Projeto: **Devotional Days — 35 dias de leitura e reflexão bíblica**, feito para mulheres. Repositório e URL permanecem inalterados. Autoria: **Lais Fernandes**.

## Objetivo e público

Guia visual e responsivo para mulheres adultas já introduzidas à vida de igreja, inclusive iniciantes na leitura sistemática da Bíblia. As perguntas devem ser profundas, centradas no texto bíblico, com contexto e rigor interpretativo; sem infantilização, clichês ou estereótipos.

## Regras inegociáveis

1. Não adicionar login, cadastro, banco de dados, analytics, notificações invasivas, comentários, chat ou campos de anotações.
2. As reflexões pertencem ao caderno da pessoa. Persistir **somente** progresso e preferências não sensíveis no navegador.
3. Manter as cinco paletas (Lavanda, Sálvia, Areia, Azul Névoa e Rosé) em claro/escuro; respeitar modo do sistema e redução de movimento.
4. Não usar emojis na interface; priorizar tipografia elegante, espaçamento compacto, componentes alinhados e navegação estilo app iOS sem excesso visual.
5. Conclusão semanal e integral: sobreposição centralizada com microbrilhos **brancos, finos e discretos**, sem confete. Respeitar redução de movimento, Escape e restauração de foco.
6. Não transcrever livros ou passagens extensas de traduções bíblicas sob copyright; usar referências e links oficiais conforme permissões.
7. Usar criação segura de elementos DOM e `textContent`; não usar `innerHTML`, `eval`, bibliotecas externas sem justificativa nem credenciais no frontend.
8. Não apagar autoria nem referências: rodapé **“Com fé e carinho, Lais Fernandes.”**
9. Ao alterar conteúdo, revisar contexto bíblico, distinção entre interpretação e aplicação, e evitar apresentar inferências como citações.
10. Ao alterar código, rodar `npm test`, a suíte de navegador quando disponível, verificar documentação e inspecionar capturas em celular/desktop antes de abrir PR. Registrar limitações.
11. Preservar as chaves de armazenamento e a leitura escolhida. Nunca reiniciar progresso automaticamente.
12. Trabalhar em branch própria, fazer commits e push, confirmar a referência remota e abrir PR para `main`. Não fazer merge, force push nem publicar sem autorização explícita. Se houver bloqueio externo, preservar commits e fornecer patch verificável.

## Fluxo Git sugerido

- Issue descritiva → branch `feature/nome-curto` → mudanças pequenas → testes → Pull Request com checklist → revisão → merge.
- Mensagens de commit sugeridas: `feat: ...`, `fix: ...`, `docs: ...`, `test: ...`, `refactor: ...`.
- Não introduzir ferramentas pesadas sem avaliar custo e real necessidade.

Documentos de referência: `docs/REQUISITOS.md`, `docs/ARQUITETURA.md`, `docs/SEGURANCA.md`, `docs/PRIVACIDADE.md`, `docs/TESTES.md`, `docs/INTERFACE.md` e `docs/VALIDACAO.md`.