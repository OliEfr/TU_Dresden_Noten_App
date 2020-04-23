/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */

//This is a info page of the app
//The user sees the page on clicking on the "i"-Icon
//Here goes updates notes!

import React from 'react';
import {ScrollView, Text, StyleSheet, Button, Linking} from 'react-native';

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
        <Text style={[styles.greyTextSmall,{}]}>Diese App ist ein studentisches Projekt und soll zeigen, wie Digitalisierung aussehen kann.{'\n'}</Text>
        <Text style={[styles.greyTextSmall,{lineHeight: 50, textDecorationLine: 'underline'}]}>Aktuelle Features:</Text>
        <Text style={[styles.greyTextSmall,{}]}>Push-Benachrichtigung bei neuen Noten.</Text>
        <Text style={[styles.greyTextSmall,{}]}>Lernziele setzen, wenn du dich für Klausuren anmeldest.</Text>
        <Text style={[styles.greyTextSmall,{fontStyle: 'italic'}]}>{'\n'}More coming soon !</Text>
        <Text style={[styles.greyTextSmall,{}]}>{'\n'}Fragen, Feedback, Mitmachen?{'\n'}</Text>
        <Button 
          onPress={() => Linking.openURL('mailto:ollidev97@gmail.com?subject=GradeRace Contact') }
          title="Kontakt" />
        <Text style={{color: 'blue'}}
          onPress={() => Linking.openURL('http://google.com')}>
          Github
        </Text>
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
