import flatpickr from 'flatpickr';

let eventsBase = '/';
let eventsPath = '/';

if (typeof drupalSettings !== 'undefined') {
  eventsBase = drupalSettings.path.baseUrl;
  eventsPath = drupalSettings.path.currentPath;
}
const urlParts = eventsPath.split('/');

flatpickr('#midd-event-date-widget', {
  inline: true,
  defaultDate: urlParts[2] ? urlParts[2] : 'today',
  minDate: 'today',
  onChange: function (selectedDates, dateStr, instance) {
    location.href = eventsBase + 'events/all/' + dateStr;
  }
});
