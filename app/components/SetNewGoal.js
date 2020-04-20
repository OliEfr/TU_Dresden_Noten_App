/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */

//This screen apperas, when user is enrolled for a new exam
//Here the user can set a goal for a subject mark


import React from 'react';
import {ScrollView, View, Button, Picker, Text, StyleSheet, Alert} from 'react-native';

//import 3rd party packages
import {withNavigation} from 'react-navigation';

// import secondary files
import * as storage from '../utils/storage';
import SetGoalsList from './SetGoalList';

class SetNewGoal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_exams: [],
      new_goals: {},
      notification: ""
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

  async componentDidMount() {
      await this.setState({new_exams: this.props.navigation.getParam('list')})
      if(this.state.new_exams[0] === "Abschlussnote") {
        this.setState({notification: "Denke gut darüber nach - du kannst das später nicht ändern!"})
      }
  }

  handleState = (value, item) => {
    let old_goals = this.state.new_goals
    old_goals[item] = value
    this.setState({new_goals: old_goals})
  }

  renderNewExamsList = () => {
    const items = [];
    for (var item of this.state.new_exams) {
      items.push(
        <SetGoalsList
          item={item}
          stateHandler={this.handleState}
        />
      );
    }
    return items;
  };

  newGoalsIsValid = () => {
    if (Object.keys(this.state.new_goals).length === this.state.new_exams.length) {
      return true
    } else {
      return false
    }
  }

  render() {
    return (
      <ScrollView style={{flex: 1, margin: 30}}>
        <Text style={[styles.orangeTextSmall,{}]}>Welche Noten möchtest du erreichen?{'\n'}</Text>
        <View style={{}}>{this.renderNewExamsList()}</View>
        <Text style={[styles.blueTextSmall, {textAlign: 'center'}]}>{this.state.notification}{'\n'}</Text>
        <Button
              title="Weiter"
              onPress={async () => {
                if(this.newGoalsIsValid()) {
                  //save, if it is 'Abschlussnote' (final_goal)
                  if(Object.keys(this.state.new_goals)[0] === "Abschlussnote") {
                    await storage._storeData('final_goal', JSON.stringify(this.state.new_goals['Abschlussnote']));
                  } else {
                  //save to async storage
                  //goto home screen
                    await storage._retrieveData('new_goals').then((string) => {return JSON.parse(string)})
                      .then((new_grade_json) => {
                        if(typeof new_grade_json === 'object' && new_grade_json !== null) {
                          Object.keys(this.state.new_goals).forEach(key => new_grade_json[key] = this.state.new_goals[key])
                        } else {
                          new_grade_json = this.state.new_goals
                        }
                        storage._storeData('new_goals', JSON.stringify(new_grade_json));
                    });
                    await storage._storeData('new_exam', '');
                  }
                  Alert.alert("Super!", "Ich habe es gespeichert.\nViel Spaß beim Lernen!")
                  this.props.navigation.replace('Home');
                } else {
                  Alert.alert("Meldung", "Deine Leistungen werden am besten, wenn du ein Ziel für jedes Fach angibst!")
                }
              }}/>
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
  orangeTextBold: {
    lineHeight: 100,
    textAlign: 'center',
    color: '#f06449',
    fontSize: 90,
    fontWeight: '400',
    fontFamily: 'Roboto',
  },
  greyTextSmall: {
    lineHeight: 25,
    color: '#888888',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Roboto',
    paddingLeft: 30,
  },
  orangeText: {
    lineHeight: 70,
    textAlign: 'center',
    color: '#f06449',
    fontSize: 40,
    fontWeight: '100',
    fontFamily: 'Roboto',
  },
  orangeTextSmall: {
    lineHeight: 35,
    textAlign: 'center',
    color: '#f06449',
    fontSize: 25,
    fontWeight: '100',
    fontFamily: 'Roboto',
  },
  blueTextSmall: {
    lineHeight: 25,
    textAlign: 'center',
    color: '#4a96bf',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
});

export default withNavigation(SetNewGoal);
