import Pikaday from 'pikaday';

const pad = n => (n >= 10 ? n : '0' + n);

const getDateObj = dateStr => {
  const dateParts = dateStr.split('-');
  let [year, month, day] = dateParts;

  year = parseInt(year, 10);
  month = parseInt(month, 10) - 1;
  day = parseInt(day, 10);

  return { day, month, year };
};

const dateToStr = date => {
  let day = date.getDate();
  let month = date.getMonth() + 1;

  day = pad(day);
  month = pad(month);

  const year = date.getFullYear();

  const dateStr = `${year}-${month}-${day}`;

  return dateStr;
};

let eventsBase = '/';
let eventsPath = '/';

if (typeof drupalSettings !== 'undefined') {
  eventsBase = drupalSettings.path.baseUrl;
  eventsPath = drupalSettings.path.currentPath;
}

const urlParts = eventsPath.split('/');
const dateStr = urlParts[2];

let defaultDate = null;

if (dateStr) {
  const { year, month, day } = getDateObj(dateStr);

  // have to pass date object instead of string
  // https://github.com/dbushell/Pikaday/issues/764#issuecomment-360286792
  defaultDate = new Date(year, month, day);
}

const datePicker = document.querySelector('.js-events-datepicker');

if (datePicker) {
  const picker = new Pikaday({
    field: datePicker,
    bound: false,
    minDate: new Date(),
    defaultDate,
    setDefaultDate: !!defaultDate,
    onSelect(date) {
      const dateStr = dateToStr(date);

      location.href = eventsBase + 'events/all/' + dateStr;
    }
  });
}

const selects = ['month', 'year'];

for (let i in selects) {
  if (selects.hasOwnProperty(i)) {
    const select = 'pika-select-' + selects[i];
    const selectElem = document.querySelector('.' + select);

    if (selectElem) {
      selectElem.setAttribute('id', select);

      const labelElem = document.createElement('label');
      labelElem.setAttribute('class', 'sr-only');
      labelElem.setAttribute('for', select);
      labelElem.innerText = selects[i].charAt(0).toUpperCase() + selects[i].slice(1);

      const parentElem = selectElem.parentNode;
      parentElem.insertBefore(labelElem, selectElem);
    }
  }
}

const pikaTitle = document.querySelector('.pika-title');

if (pikaTitle) {
  pikaTitle.setAttribute('aria-atomic', 'true');
}

const pikaTable = document.querySelector('.pika-table');

if (pikaTable) {
  pikaTable.removeAttribute('cellpadding');
  pikaTable.removeAttribute('cellspacing');
}
