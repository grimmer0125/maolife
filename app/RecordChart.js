import React from 'react';

import {
  VictoryLegend, VictoryVoronoiContainer, VictoryTooltip,
  VictoryLine, VictoryChart,
  // VictoryGroup,
} from 'victory-native';

function RecordChart(props) {
  const {
    rest, sleep,
  } = props.stats;

  // const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');
  // VictoryZoomContainer zoomDomain={{x: [5, 35], y: [0, 100]}}/>}
  return (
    // example:
    // http://formidable.com/open-source/victory/docs/victory-line/
    // https://formidable.com/open-source/victory/gallery/brush-zoom/
    // https://codesandbox.io/embed/vyykx3jp77

    <VictoryChart
      scale={{ x: 'time' }}
      containerComponent={
        <VictoryVoronoiContainer
          labels={d => `x:${d.x}\ny:${d.y}`}
        />
      }
    >
      <VictoryLegend
        title="AVG"
        x={200}
        y={50}
        centerTitle
        orientation="horizontal"
        gutter={20}
        style={{ title: { fontSize: 10 } }}
        data={[
          { name: rest.avg.toFixed(1), symbol: { fill: 'tomato', type: 'star' } },
          { name: sleep.avg.toFixed(1), symbol: { fill: 'blue' } },
        ]}
      />
      {(sleep.data && sleep.data.length >= 2) ? (
        <VictoryLine
          labelComponent={<VictoryTooltip />}
          style={{
          data: { stroke: 'blue' },
        }}
          data={sleep.data}
        />) : null}
      {(rest.data && rest.data.length >= 2) ? (
        <VictoryLine
          labelComponent={<VictoryTooltip />}
          style={{
          data: { stroke: 'tomato' },
          parent: { border: '20px solid #ccc' },
        }}
          data={rest.data}
        />) : null}
    </VictoryChart>
  );
}

export default RecordChart;
