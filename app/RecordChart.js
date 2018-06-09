import React from 'react';

import {
  VictoryLegend, VictoryVoronoiContainer, VictoryTooltip,
  VictoryLine, VictoryChart,
  // VictoryGroup,
} from 'victory-native';

function RecordChart(props) {
  const {
    dataSleep, dataRest, restAvg, sleepAvg,
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
          { name: restAvg.toFixed(1), symbol: { fill: 'tomato', type: 'star' } },
          { name: sleepAvg.toFixed(1), symbol: { fill: 'blue' } },
        ]}
      />
      {(dataSleep && dataSleep.length >= 2) ? (
        <VictoryLine
          labelComponent={<VictoryTooltip />}
          style={{
          data: { stroke: 'blue' },
        }}
          data={dataSleep}
        />) : null}
      {(dataRest && dataRest.length >= 2) ? (
        <VictoryLine
          labelComponent={<VictoryTooltip />}
          style={{
          data: { stroke: 'tomato' },
          parent: { border: '20px solid #ccc' },
        }}
          data={dataRest}
        />) : null}
    </VictoryChart>
  );
}

export default RecordChart;
