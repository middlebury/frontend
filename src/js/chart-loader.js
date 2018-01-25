const chartColors = [
  '#0D395F',
  '#97BBD5',
  '#3D617F',
  '#ACC9DD',
  '#6E889F',
  '#C1D6E6',
  '#9EB0BF',
  '#D5E4EE',
  '#CFD7DF',
  '#EAF1F7'
];

function makeChart(elem, {type = 'pie', data, label, labels}) {
  new window.Chart(elem, {
    type,
    options: {
      maintainAspectRatio: false,
      legend: {
        position: 'bottom'
      }
    },
    data: {
      datasets: [
        {
          data,
          label,
          // colors need to be set based on length of data then repeat if data exceeds the amount of colors
          backgroundColor: chartColors
        }
      ],
      labels
    }
  });
}

function loadChart(selector, chartConfig) {
  const elem = document.querySelector(selector);

  var io = new IntersectionObserver(handleIntersection);

  io.observe(elem);

  function handleIntersection(entries) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio > 0) {
        makeChart(elem, chartConfig);
        io.unobserve(entry.target);
      }
    });
  }
}

window.loadChart = loadChart;
