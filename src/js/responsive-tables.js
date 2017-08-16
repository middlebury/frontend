import forEach from './utils/forEach';

const tables = document.querySelectorAll('table');

// loops through tables and adds the data-th to tds so the headings show up on small viewports via css
if (tables) {
  forEach(tables, table => {
    const heads = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tr');

    if (!heads) {
      return;
    }

    forEach(rows, row => {
      const cells = row.querySelectorAll('td');

      forEach(cells, (cell, index) => {
        const label = heads[index] ? heads[index].innerText : '';
        if (label) {
          cell.setAttribute('data-th', label);
        }
      });
    });
  });
}
