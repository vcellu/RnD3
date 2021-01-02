import React from 'react';
import {StyleSheet, View} from 'react-native';
import FruitData from './FruitData';
import {scaleLinear, scaleBand} from 'd3-scale';
import {zoomIdentity} from 'd3-zoom';
import {max} from 'd3-array';
import {timeParse} from 'd3-time-format';
import {Svg, Rect, G, Text as SvgText, Line} from 'react-native-svg';

const bodyHeight = 400;
const bodyWidth = 400;
const padding = 32;
const graphHeight = bodyHeight - padding;
const graphWidth = bodyWidth - padding;
const bottomAxisHeight = 70;
const bottomAxisPadding = 8;
const leftAxisWidth = 30;

const yScale = scaleLinear()
  .domain([0, max(FruitData, (d) => d.count)])
  .range([0, graphHeight - bottomAxisHeight]);

const xScale = scaleBand()
  .domain(FruitData.map((item) => item.name))
  .range([0, graphWidth - leftAxisWidth])
  .paddingInner(0.2);

function radians_to_degrees(radians) {
  var pi = Math.PI;
  return radians * (180 / pi);
}

// const foo = zoomIdentity.translate(0, 10);
// const yScale = foo.rescaleY(_yScale);

const ChartViewer = () => {
  return (
    <View style={styles.body}>
      <Svg width={graphWidth} height={graphHeight}>
        <G x={leftAxisWidth}>
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
                y={graphHeight - height - bottomAxisHeight}
                fill="#4477aa"
                stroke="#0A0A0A"
                strokeWidth={0.5}
              />
            );
          })}
        </G>
        <G x={leftAxisWidth - 8} y={graphHeight - bottomAxisHeight}>
          <Line
            x1={0}
            y1={0}
            x2={graphWidth - leftAxisWidth + 16}
            y2={0}
            stroke="#BBBBBB"
            strokeWidth="1"
          />
        </G>

        <G x={leftAxisWidth} y={graphHeight + bottomAxisPadding}>
          {FruitData.map((item, i) => {
            const xPos = xScale(item.name);
            const width = xScale.bandwidth();
            const hWidth = width * 0.5;
            const hyp = hWidth * hWidth + bottomAxisHeight * bottomAxisHeight;
            const hypot = Math.sqrt(hyp);
            const rad = Math.sin(bottomAxisHeight / hypot);
            const deg = radians_to_degrees(rad);

            return (
              <SvgText
                transform={`translate(${
                  xPos + hWidth
                } ${-bottomAxisHeight}) rotate(${-deg})`}
                key={i}
                fill="#4D4D4D"
                textAnchor="end"
                fontSize={12}>
                {item.name}
              </SvgText>
            );
          })}
        </G>
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
