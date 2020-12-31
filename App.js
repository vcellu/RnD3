/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import ChartViewer from './components/ChartViewer';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.body}>
        <ChartViewer />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#F0F0F0',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
