import React, {useMemo, useState, useRef, useEffect} from 'react';
import {StyleSheet, View, Button, Animated} from 'react-native';
import MovieData from './MovieData';
import {scaleLinear, scaleTime} from 'd3-scale';
import {zoomIdentity} from 'd3-zoom';
import {max, extent} from 'd3-array';
import {timeParse} from 'd3-time-format';
import {line as d3Line} from 'd3-shape';
import {Svg, G, Text as SvgText, Line, Path, Circle} from 'react-native-svg';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';

const bodyHeight = 600;
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
  const transformVal = useRef(new Animated.Value(val));
  const pinchScale = useRef(new Animated.Value(1));
  const state = useRef(State.UNDETERMINED);

  const xScale = useMemo(() => {
    const _scale = zoomIdentity.scale(val, val);
    return _scale.rescaleX(_xScale);
  }, [val]);

  const yScale = useMemo(() => {
    return _yScale;
  }, []);

  const line = useMemo(() => {
    return d3Line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value));
  }, [xScale, yScale]);

  const onPinchGestureEvent = Animated.event(
    [{nativeEvent: {scale: pinchScale.current}}],
    {useNativeDriver: true},
  );

  const onPinchHandlerStateChange = (event) => {
    state.current = event.nativeEvent.oldState;
  };

  useEffect(() => {
    pinchScale.current.addListener(({value}) => {
      if (value >= 1 && state.current === State.BEGAN) {
        requestAnimationFrame(() => {
          setVal(value);
        });
      }
    });
  }, []);

  return (
    <PinchGestureHandler
      onGestureEvent={onPinchGestureEvent}
      onHandlerStateChange={onPinchHandlerStateChange}>
      <Animated.View style={styles.body}>
        <Svg width={graphWidth} height={graphHeight}>
          <G x={leftAxisWidth}>
            <Path
              d={line(movieData)}
              stroke="black"
              fill="none"
              strokeWidth={2}
            />
            {movieData.map((item, i) => {
              const cx = xScale(item.year);
              const cy = yScale(item.value);
              const r = 5;
              const fill = 'black';

              return <Circle {...{cx, cy, r, fill}} key={i} />;
            })}
          </G>
          <G x={leftAxisWidth - 8} y={graphHeight - bottomAxisHeight}>
            <Line
              x1={0}
              y1={0}
              x2={graphWidth - leftAxisWidth + 16}
              y2={0}
              stroke="#BBBBBB"
              strokeWidth="2"
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
      </Animated.View>
    </PinchGestureHandler>
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
