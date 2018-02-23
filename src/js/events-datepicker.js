import flatpickr from 'flatpickr';

if (typeof flatpickr !== 'undefined') {
  var eventsBase = '/';
  var eventsPath = '/';

  if (typeof drupalSettings !== 'undefined') {
    eventsBase = drupalSettings.path.baseUrl;
    eventsPath = drupalSettings.path.currentPath;
  }
  var urlParts = eventsPath.split('/');

  flatpickr('#midd-event-date-widget', {
    inline: true,
    defaultDate: urlParts[2] ? urlParts[2] : 'today',
    minDate: 'today',
    onChange: function (selectedDates, dateStr, instance) {
      location.href = eventsBase + 'events/all/' + dateStr;
    }
  });
}
