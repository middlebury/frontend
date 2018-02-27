import Pikaday from 'pikaday';

let eventsBase = '/';
let eventsPath = '/';

if (typeof drupalSettings !== 'undefined') {
  eventsBase = drupalSettings.path.baseUrl;
  eventsPath = drupalSettings.path.currentPath;
}

const urlParts = eventsPath.split('/');

const defaultDate = urlParts[2] ? urlParts[2] : new Date();

const pad = n => (n >= 10 ? n : '0' + n);

const picker = new Pikaday({
  field: document.querySelector('.js-events-datepicker'),
  bound: false,
  minDate: new Date(),
  showDaysInNextAndPreviousMonths: true,
  defaultDate,
  setDefaultDate: !!defaultDate,
  // format: 'YYYY/MM/DD',
  onSelect(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;

    day = pad(day);
    month = pad(month);

    const year = date.getFullYear();

    const dateStr = `${year}-${month}-${day}`;

    location.href = eventsBase + 'events/all/' + dateStr;
  }
});
