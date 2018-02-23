if (typeof flatpickr !== 'undefined') {
  var urlParts = drupalSettings.path.currentPath.split('/');

  flatpickr('#midd-event-date-widget', {
    inline: true,
    defaultDate: urlParts[2] ? urlParts[2] : 'today',
    minDate: 'today',
    onChange: function (selectedDates, dateStr, instance) {
      location.href = drupalSettings.path.baseUrl + 'events/all/' + dateStr;
    }
  });
}
