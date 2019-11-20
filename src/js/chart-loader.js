const chartColors = [
  '#0d395f',
  '#1f9f8b',
  '#c26533',
  '#8f9a17',
  '#f4b824',
  '#763649',
  '#D3B885',
  '#907036'
];

function addLegend(el, chart) {
  // add html legend
  const legend = chart.generateLegend();
  const legendtag = document.createElement('div');
  legendtag.classList.add('chart-legend');
  legendtag.innerHTML = legend;

  // Append to the 'chart' class.
  // Ideally we should use Element.closest() here but it's not polyfilled.
  // we don't append to `chart__container` since it's for maintaining the aspect ratio.
  el.parentElement.parentElement.appendChild(legendtag);
}

function makeChart(elem, { type = 'pie', data, label, labels }) {
  const ChartJS = window.Chart;
  const isCircleChart = type === 'pie' || type === 'doughnut';

  const getItemColor = i => (isCircleChart ? chartColors : chartColors[i]);

  const datasets = [{ data, labels }];

  ChartJS.defaults.global.defaultFontColor = '#222';
  ChartJS.defaults.global.defaultFontFamily =
    'whitney ssm a, whitney ssm b, arial, verdana, sans-serif';
  ChartJS.defaults.global.defaultFontSize = 14;
  ChartJS.defaults.doughnut.cutoutPercentage = 80;

  const defaultOptions = {
    maintainAspectRatio: false,
    legend: {
      display: false // remove legend so we can have finer control over its styles
    },
    tooltips: {
      displayColors: false,
      backgroundColor: '#fff',
      titleFontColor: '#222',
      titleFontSize: 16,
      bodyFontColor: '#222',
      bodyFontSize: 14,
      yPadding: 8,
      xPadding: 8,
      caretSize: 0,
      cornerRadius: 0,
      borderWidth: 1,
      borderColor: '#ccc'
    }
  };

  if (type === 'bar' || type === 'horizontalBar') {
    defaultOptions.scales = {
      xAxes: [
        {
          scaleLabel: {
            display: !!label,
            labelString: label
          },
          maxBarThickness: 32,
          ticks: {
            beginAtZero: true
          }
        }
      ],
      yAxes: [
        {
          maxBarThickness: 32,
          ticks: {
            beginAtZero: true
          }
        }
      ]
    };
  }

  const chart = new ChartJS(elem, {
    type,
    options: defaultOptions,
    data: {
      datasets: datasets.map((d, i) => {
        const color = getItemColor(i);
        return Object.assign({}, d, {
          borderColor: 'white',
          backgroundColor: color
        });
      }),
      labels
    }
  });

  if (isCircleChart) {
    addLegend(elem, chart);
  }
}

function loadChart(selector, chartConfig) {
  const elem = document.querySelector(selector);

  var io = new IntersectionObserver(handleIntersection);

  io.observe(elem);

  function handleIntersection(entries) {
    entries.forEach(function(entry) {
      if (entry.intersectionRatio > 0) {
        makeChart(elem, chartConfig);
        io.unobserve(entry.target);
      }
    });
  }
}

window.loadChart = loadChart;
