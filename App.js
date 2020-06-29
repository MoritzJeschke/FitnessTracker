import React, { Component } from 'react';
import { View, Button, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import TrackerActivity from './Activities/TrackerActivity';
import HistoryActivity from './Activities/HistorieActivity';

export class App extends Component {

  gotoHistorie = () => {
    this.props.navigation.navigate('historie');
  }

  gotoTracker = () => {
    this.props.navigation.navigate('tracker');
  }

  render() {
    return (
      <View>
        <Text>
          This is the Mainmenu!
        </Text>
        <Button title='HistorieActivity' onPress={this.gotoHistorie}></Button>
        <Button title='TrackerActivity' onPress={this.gotoTracker}></Button>
      </View>
    );
  }

}
  
const AppNavigator = createStackNavigator ({
  main: { screen: App },
  historie: { screen: HistoryActivity },
  tracker: { screen: TrackerActivity }
});

export default createAppContainer(AppNavigator);