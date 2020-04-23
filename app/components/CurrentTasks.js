/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */

//This screen is display to the user, when the users presses "Aktuelle Aufgaben / TODO"
//It is for information purposes only

import React from 'react';
import {ScrollView, Button, Text, StyleSheet, Linking} from 'react-native';

//import 3rd party packages
import {withNavigation} from 'react-navigation';

//import secondary files

class CurrentTasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Aktuelle Aufgaben / ToDO', 
    };
  };

  async componentDidMount() {

  }

  render() {

    return (
      <ScrollView style={{flex: 1, margin: 30}}>
        <Text style={[styles.greyTextSmall,{}]}>Ich habe Bock mit neusten Technologien zu Arbeiten. Daraus ist GradeRace entstanden.{'\n'}</Text>
        <Text style={[styles.greyTextSmall,{}]}>Die App ist für alle Ideen und Features offen!{'\n'}</Text>
        <Text style={[styles.greyTextSmall,{}]}>Du willst mitzumachen? Ich suche nach:</Text>
        <Text style={[styles.IdeaText,{}]}>Backend Dev (DB, Infrastructure){'\n'}Front-End Dev (React Native){'\n'}iOS Dev{'\n'}</Text>
        <Text style={[styles.greyTextSmall,{}]}>Upcoming ToDo meinerseits:</Text>
        <Text style={[styles.IdeaText,{}]}>UI-Rework{'\n'}Feature: Lernziele setzen{'\n'}iOS implementation{'\n'}</Text>
        <Button 
          onPress={() => Linking.openURL('mailto:ollidev97@gmail.com?subject=GradeRace Development') }
          title="E-Mail senden" />
      </ScrollView>
    );
  }
}

//styles
const styles = StyleSheet.create({
  IdeaText: {
    lineHeight: 25,
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

export default withNavigation(CurrentTasks);
