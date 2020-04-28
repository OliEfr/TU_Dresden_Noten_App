/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */

//Get BatteryOptimization Settings Permission
//The user sees this page once on setup after setting final grade goal

import React from 'react';
import {Text, StyleSheet, Button, View} from 'react-native';

//import 3rd party packages
import {withNavigation} from 'react-navigation';
//import AndroidOpenSettings from 'react-native-android-open-settings'
var SendIntentAndroid = require("react-native-send-intent");

class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     buttonText: 'Zu den Einstellungen',
     finished: false
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Meine Ziele', 
      header: null,
      navigationOptions: {
        headershown: false,
      }
    };
  };

  async componentDidMount() {}

  render() {
    return (
      <View style={{
        flex:1, margin: 40
        }}>
        <Text style={[styles.blueTextSmall, { flex: 5, textAlignVertical: 'center'}]}>Um Benachrichtigung bei neuen Noten zu bekommen, musst du die Batterie Optimierung für Grade<Text style={[styles.blueTextSmall,{color: '#f06449',}]}>Race</Text> deaktivieren.{'\n'}</Text>
        <Text style={[styles.greyTextSmall, { flex: 3, marginTop: 0, }]}>wähle "Alle Apps"{'\n'}suche "GradeRace"{'\n'}wähle "nicht-optimieren"{'\n'}</Text>
        <View
            style={{
              flex: 1,
              alignContent: 'center',}}>
          <Button 
            color="#4a96bf"
            onPress={() => {
              if(this.state.finished) {this.props.navigation.replace('Home')} 
              else {
                SendIntentAndroid.showIgnoreBatteryOptimizationsSettings()
                this.setState({buttonText: 'Fertig >>', finished: true})
              }
            }}
            title={this.state.buttonText} />
        </View>
      </View>
    );
  }
}

//styles
const styles = StyleSheet.create({
  blueTextSmall: {
    lineHeight: 38,
    color: '#4a96bf',
    fontSize: 25,
    fontFamily: 'Roboto',
  },
  greyTextSmall: {
    lineHeight: 28,
    color: '#888888',
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Roboto',
    textAlign: 'center'
  },
});

export default withNavigation(InfoPage);
