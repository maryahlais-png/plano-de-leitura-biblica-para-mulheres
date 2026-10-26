# Segurança — controles e limites

> Um site estático sem backend possui superfície de ataque menor, **mas não é invulnerável**. Estas medidas são defesa em profundidade, não promessa de segurança absoluta.

## Controles aplicados

- Não há login, sessão, API, banco de dados, uploads ou coleta de texto digitado.
- A Content Security Policy em `index.html` restringe scripts, estilos, conexões, imagens e formulários aos recursos necessários; não utiliza scripts inline ou `eval`.
- `textContent` e criação de nós DOM no lugar de `innerHTML` para conteúdo vindo de estado local.
- Dados de `localStorage` são validados: identificadores de leitura são inteiros dentro da faixa; tradução, paleta e modo usam enumerações fechadas.
- Nenhuma senha, token, chave de API ou configuração sensível deve entrar no repositório ou no frontend.
- Links externos usam HTTPS, `rel="noopener noreferrer"` e `referrerpolicy="no-referrer"`.
- Zero dependências externas de runtime; Playwright/axe-core são ferramentas opcionais de teste, instaladas fora do projeto e não carregadas pela página; isso reduz riscos de cadeia de suprimentos.
- Não há scripts de analytics, pixels de marketing ou rastreamento próprio.
- O botão para reduzir movimento está nas preferências do sistema operacional; o CSS respeita `prefers-reduced-motion`.
- `.gitignore` impede envio acidental de `.env` e arquivos locais comuns, mas **não substitui a revisão do commit**.

## Revisão 1.3

- Chaves antigas mantidas; dados inválidos não criam HTML nem URLs arbitrárias.
- Traduções e identificadores de livros vêm de catálogos locais; URLs digitais são HTTPS em `www.bible.com`.
- CSP preservada sem `unsafe-inline` ou `unsafe-eval`. Nenhuma requisição de fonte, analytics ou biblioteca no runtime. O ícone é um SVG local.
- Foco contido e fundo inerte nos painéis reduzem ativação acidental de controles encobertos.
- Falhas do armazenamento são comunicadas sem pedir valores sensíveis nem interromper navegação.
- Nenhuma alteração nas configurações da conta GitHub, proteção de branch, licença ou hospedagem foi feita nesta atualização.

## Limitações e cuidados operacionais

- GitHub Pages oferece HTTPS e hospedagem estática, mas o site não consegue definir todos os headers HTTP (a CSP aqui é definida por meta tag; algumas diretivas dependem de header no servidor).
- `localStorage` não é criptografado. Nunca colocar dados pessoais, senhas, orações privadas ou informações médicas nesse espaço.
- Para serviços futuros (notificações, contas, sincronização), é necessária uma nova análise de ameaças antes de implementar.
- Ativar no repositório do GitHub: proteção da branch principal, análise de código quando disponível, secret scanning/push protection quando disponíveis e autenticação em dois fatores da conta.
- O Dependabot está configurado para verificar semanalmente atualizações das GitHub Actions; se forem adicionadas bibliotecas, habilitar também acompanhamento das novas dependências.
- Publicar código torna-o publicamente acessível: revisar histórico, arquivos e identidade antes do primeiro push.

## Checklist antes de publicar

- [ ] `npm test` passa
- [ ] Links externos continuam corretos e seguros
- [ ] Nenhuma chave, endereço privado, conta ou informação de visitantes no projeto
- [ ] Revisão editorial e bíblica do conteúdo
- [ ] Revisão manual no celular, teclado e contraste
- [ ] Teste de `prefers-reduced-motion`
- [ ] Revisão das configurações de segurança da conta/repositório GitHub

Referências técnicas: [OWASP CSP](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet), [OWASP HTML5](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/HTML5_Security_Cheat_Sheet.md), [GitHub — boas práticas](https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories).