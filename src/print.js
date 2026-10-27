/* Roteiro em papel: a mesma fonte editorial, sem consultar o progresso digital. */
(() => {
  'use strict';
  const root = document.getElementById('print-plan-content');
  const {weeks, encounters} = window.READING_PLAN;
  const element = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  };
  const header = element('header', 'print-heading');
  const title = element('h1', '', 'Devotional Days');
  title.lang = 'en';
  header.append(title,
    element('p', 'print-subtitle', '35 dias de leitura e reflexão bíblica'),
    element('p', 'print-audience', 'feito para mulheres'),
    element('p', 'print-instruction', 'Leia no seu ritmo. Marque cada encontro ao concluir; as revisões encerram cada semana.'));
  root.append(header);

  weeks.forEach(([name], weekIndex) => {
    const section = element('section', 'print-week');
    section.dataset.week = String(weekIndex + 1);
    const heading = element('h2', 'print-week-title');
    heading.append(element('span', 'print-week-number', `Semana ${String(weekIndex + 1).padStart(2, '0')}`),
      element('span', '', name));
    const list = element('ol', 'print-encounters');
    list.start = weekIndex * 7 + 1;
    encounters.forEach((entry, index) => {
      if (entry.week !== weekIndex) return;
      const row = element('li', 'print-encounter');
      row.dataset.encounter = String(index + 1);
      row.dataset.kind = entry.review ? 'review' : 'reading';
      const box = element('span', 'print-checkbox');
      box.setAttribute('aria-hidden', 'true');
      const number = element('span', 'print-encounter-number', String(index + 1).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');
      const name = element('span', 'print-encounter-title', entry.title);
      const reference = element('span', 'print-reference', entry.review
        ? 'Revisão · sem passagem nova'
        : `${entry.book} ${entry.ch}:${entry.a}–${entry.b}`);
      row.append(box, number, name, reference);
      list.append(row);
    });
    section.append(heading, list);
    root.append(section);
  });
  const footer = element('footer', 'print-footer');
  footer.append(element('p', '', 'Um convite para estudar a Palavra com calma, no seu ritmo.'),
    element('p', 'print-signature', 'Com fé e carinho, Lais Fernandes.'));
  root.append(footer);
  window.READING_PRINT = Object.freeze({print: () => window.print()});
})();
