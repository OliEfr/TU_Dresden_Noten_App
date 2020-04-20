/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */

//This is a info page of the app
//The user sees the page on clicking on the "i"-Icon
//Here goes updates notes!

import React from 'react';
import {ScrollView, Text, StyleSheet, } from 'react-native';

//import 3rd party packages
import {withNavigation} from 'react-navigation';

//import secondary files

class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Info', 
    };
  };

  async componentDidMount() {

  }

  render() {

    return (
      <ScrollView style={{flex: 1, margin: 30}}>
        <Text style={[styles.greyTextSmall,{}]}>uniXP ist ein studentisches Projekt.{'\n'}</Text>
        <Text style={[styles.greyTextSmall,{fontSize: 22, lineHeight: 50, textDecorationLine: 'underline'}]}>Neue Features:{'\n'}</Text>
        <Text style={[styles.greyTextSmall,{}]}>Push-Benachrichtigung bei neuen Noten.{'\n'}</Text>
        <Text style={[styles.greyTextSmall,{}]}>Klicke auf eine Klausur um die Notenstatistik zu sehen.{'\n'}</Text>
        <Text style={[styles.greyTextSmall,{}]}>Setze dir Lernziele, wenn du dich für Klausuren anmeldest!{'\n'}</Text>
        <Text style={[styles.greyTextSmall,{fontStyle: 'italic'}]}>More coming soon !{'\n'}</Text>
      </ScrollView>
    );
  }
}

//styles
const styles = StyleSheet.create({
  linkText: {
    lineHeight: 25,
    textDecorationLine: "underline",
    color: '#0000FF',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Roboto',
    textAlign: 'center',
    
  },
  greyTextSmall: {
    lineHeight: 32,
    color: '#888888',
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
});

export default withNavigation(InfoPage);
