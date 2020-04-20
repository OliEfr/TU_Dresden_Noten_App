/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */

//The users sees this screen when pressing the "Entwickler kontaktieren" Button
//It is for information purposes only

import React from 'react';
import {ScrollView, Button, Text, StyleSheet, Linking} from 'react-native';

//import 3rd party packages
import {withNavigation} from 'react-navigation';

//import secondary files

class ContactDeveloper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Entwickler kontaktieren', 
    };
  };

  async componentDidMount() {

  }

  render() {

    return (
      <ScrollView style={{flex: 1, margin: 30}}>
        <Text style={[styles.greyTextSmall,{}]}>uniXP soll zu besseren Studienleistungen motivieren.{'\n'}</Text>
        <Text style={[styles.greyTextSmall,{}]}>uniXP wird eine Social Network App für Studenten.{'\n'}</Text>
        <Text style={[styles.greyTextSmall,{}]}>Das Projekt soll zeigen, wie Digitalisierung aussehen kann!{'\n'}</Text>
        <Text style={[styles.greyTextSmall,{}]}>Join me?</Text>
        <Text style={[styles.linkText,{}]} onPress={() => this.props.navigation.push('CurrentTasks')}>Aktuelle Aufgaben / ToDo</Text>
        <Text style={[styles.greyTextSmall,{}]}>{'\n'}Du hast weitere Fragen oder Feedback?{'\n'}</Text>
        <Button 
          onPress={() => Linking.openURL('mailto:ollidev97@gmail.com?subject=uniXP Contact') }
          title="E-Mail senden" />
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
    lineHeight: 30,
    color: '#888888',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
});

export default withNavigation(ContactDeveloper);
