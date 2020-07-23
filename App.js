import React, {Component} from 'react';
import {StyleSheet, View, Button, Text} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import TrackerActivity from './Activities/TrackerActivity';
import HistoryActivity from './Activities/HistorieActivity';
import Header from './Activities/Header';
import MapView from 'react-native-maps';

/* eslint-disable prettier/prettier */
export class App extends Component {

  gotoHistorie = () => {
    this.props.navigation.navigate('Historie');
  }

  gotoTracker = () => {
    this.props.navigation.navigate('Tracker');
  }

  render() {
    return (
      <View>
        <MapView style={styles.map}
                  initialRegion={{
                      latitude: 50.199759,
                      longitude: 8.665006,
                      latitudeDelta: 10,
                      longitudeDelta: 10,
                  }}
          />

        <View style={styles.container}>
          <Button title="HistorieActivity" onPress={this.gotoHistorie} />
          <Button title="TrackerActivity" onPress={this.gotoTracker} />
        </View>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator({
  //Navigator between Activitys
  Mainmenu: { screen: App },
  Historie: { screen: HistoryActivity },
  Tracker: { screen: TrackerActivity, navigationOptions:{headerTitle: () => <Header />}},
});

const styles = StyleSheet.create({
  map: {
      width: 500,
      height: 500
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: -50
  }
});

export default createAppContainer(AppNavigator);
