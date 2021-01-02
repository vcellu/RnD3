import React, {useMemo, useState, useRef, useEffect} from 'react';
import {StyleSheet, View, Button, Animated} from 'react-native';
import MovieData from './MovieData';
import {scaleLinear, scaleTime} from 'd3-scale';
import {zoomIdentity} from 'd3-zoom';
import {max, extent} from 'd3-array';
import {timeParse} from 'd3-time-format';
import {line as d3Line} from 'd3-shape';
import {Svg, G, Text as SvgText, Line, Path} from 'react-native-svg';

const bodyHeight = 300;
const bodyWidth = 400;
const padding = 32;
const graphHeight = bodyHeight - padding;
const graphWidth = bodyWidth - padding;
const bottomAxisHeight = 70;
const leftAxisWidth = 30;

const movieData = MovieData.map((item) => {
  const parseDate = timeParse('%Y');
  return {...item, year: parseDate(item.year), label: `${item.year}`};
});

const _yScale = scaleLinear()
  .domain([0, max(movieData, (d) => d.value)])
  .range([0, graphHeight - bottomAxisHeight]);

const _xScale = scaleTime()
  .domain(extent(movieData, (d) => d.year))
  .range([0, graphWidth - leftAxisWidth]);

const LineChart = () => {
  const [val, setVal] = useState(1);
  const [disabled, setDisabled] = useState(false);
  const transformVal = useRef(new Animated.Value(val));

  const xScale = useMemo(() => {
    const _scale = zoomIdentity.scale(val, 1);
    return _scale.rescaleX(_xScale);
  }, [val]);

  const yScale = useMemo(() => {
    const _ty = zoomIdentity.translate(0, -val);
    return _ty.rescaleY(_yScale);
  }, [val]);

  const line = useMemo(() => {
    return d3Line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value));
  }, [xScale, yScale]);

  useEffect(() => {
    transformVal.current.addListener(({value}) => {
      requestAnimationFrame(() => {
        setVal(value);
      });
    });
  }, []);

  const startAnimation = () => {
    setDisabled(true);
    Animated.timing(transformVal.current, {
      toValue: val === 1 ? 4 : 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setDisabled(false);
    });
  };
  return (
    <>
      <View style={styles.body}>
        <Svg width={graphWidth} height={graphHeight}>
          <G x={leftAxisWidth}>
            <Path d={line(movieData)} stroke="black" fill="none" />
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

          <G x={leftAxisWidth} y={graphHeight}>
            {movieData.map((item, i) => {
              const xPos = xScale(item.year);
              return (
                <SvgText
                  key={i}
                  fill="#4D4D4D"
                  x={xPos}
                  textAnchor="end"
                  fontSize={10}>
                  {item.label}
                </SvgText>
              );
            })}
          </G>
        </Svg>
      </View>
      <Button title="Animate" disabled={disabled} onPress={startAnimation} />
    </>
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
    marginTop: 10,
  },
});

export default LineChart;
