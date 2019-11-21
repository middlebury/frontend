import { h } from 'preact';

const Legend = ({ items, colors }) => {
  return (
    <div className="chart-legend chart-legend--inline justify-content-start">
      <ul className="chart-legend__list">
        {items.map((item, i) => (
          <li className="chart-legend__item">
            <span
              className="chart-legend__icon"
              style={{
                background: colors[i]
              }}
            ></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const toPercent = (value, total) => (value / total) * 100;

const PercentBarChart = ({ labels, datasets, colors }) => {
  const data = datasets[0].data.map((value, i) => ({
    label: labels[i],
    value
  }));

  const total = data.reduce((num, { value }) => (num += value), 0);

  const preparedData = data
    // sort the data from lowest to greatest
    .sort((a, b) => a.value - b.value)
    // add the percentage for the value to the data object
    .map(d => {
      const percent = toPercent(d.value, total);
      return {
        ...d,
        percent,
        // change the label to include the value as a percent
        label: `${Math.ceil(percent)}% ${d.label}`
      };
    });

  // create the custom legend from the sorted data
  const sortedLabels = preparedData.map(data => data.label);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          width: '100%'
        }}
      >
        {preparedData.map((data, i) => {
          const width = data.percent.toFixed(2);
          return (
            <div
              key={i}
              style={{
                width: width + '%',
                height: 32
              }}
            >
              <div
                style={{
                  background: colors[i],
                  height: '100%'
                }}
              ></div>
            </div>
          );
        })}
      </div>
      <Legend items={sortedLabels} colors={colors} />
    </div>
  );
};

export default PercentBarChart;
