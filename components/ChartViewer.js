import React from 'react';
import {StyleSheet, View} from 'react-native';
import FruitData from './FruitData';
import {scaleLinear, scaleBand} from 'd3-scale';
import {max} from 'd3-array';
import {Svg, Rect} from 'react-native-svg';

const bodyHeight = 400;
const bodyWidth = 400;
const padding = 16;
const graphHeight = bodyHeight - padding;
const graphWidth = bodyWidth - padding;

const yScale = scaleLinear()
  .domain([0, max(FruitData, (d) => d.count)])
  .range([0, graphHeight]);

const xScale = scaleBand()
  .domain(FruitData.map((item) => item.name))
  .range([0, graphWidth])
  .paddingInner(0.2);

const ChartViewer = () => {
  return (
    <View style={styles.body}>
      <Svg width={graphWidth} height={graphHeight}>
        {FruitData.map((item, i) => {
          const xPos = xScale(item.name);
          const width = xScale.bandwidth();
          const height = yScale(item.count);

          return (
            <Rect
              key={i}
              x={xPos}
              width={width}
              height={height}
              y={graphHeight - height}
              fill="#4477aa"
              stroke="#0A0A0A"
              strokeWidth={0.5}
            />
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    width: bodyWidth,
    height: bodyHeight,
    backgroundColor: 'white',
    borderRadius: 4,
    padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChartViewer;
