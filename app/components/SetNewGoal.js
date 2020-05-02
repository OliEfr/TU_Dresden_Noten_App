import React from 'react';
import {ScrollView, View, Button, Picker, Text, StyleSheet, Alert} from 'react-native';

//import 3rd party packages
import {withNavigation} from 'react-navigation';

// import secondary files
import * as storage from '../utils/storage';
import SetGoalsList from './SetGoalList';

/*
  This screen apperas, when user is enrolled for a new exam
  Here the user can set a goal for a subject mark
  This screen is also used to set "Abschlussnote" on first login
*/

class SetNewGoal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_exams: [],    //list of new exams the user is enrolled in
      new_goals: {},    //here the new goals are saved
      notification: ""  //only required if "Abschlussnote"
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Meine Ziele', 
      header: null,
      navigationOptions: {
        headershown: false,
      }
    }
  }

  componentDidMount() {
      this.setState({new_exams: this.props.navigation.getParam('list')})
      //display alert if setting abschlussnote
      if(this.state.new_exams[0] === "Abschlussnote") {
        this.setState({notification: "Denke gut darüber nach - du kannst das später nicht ändern!"})
      }
  }

  //state handler, to set new goals in this component
  handleState = (value, item) => {
    let old_goals = this.state.new_goals
    old_goals[item] = value
    this.setState({new_goals: old_goals})
  }

  renderNewExamsList = () => {
    const items = []
    //create list entry for every new exam
    for (var item of this.state.new_exams) {
      items.push(
        <SetGoalsList
          item={item}
          stateHandler={this.handleState}
        />
      )
    }
    return items
  }

  //true, if there is a goal for each new
  newGoalsIsValid = () => {
    if (Object.keys(this.state.new_goals).length === this.state.new_exams.length) {
      return true
    } else {
      return false
    }
  }

  render() {
    return (
      <ScrollView style={{margin: 30, }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
        <View style={{}}>
          <Text style={[styles.orangeTextSmall,{}]}>Welche Noten möchtest du erreichen?{'\n'}</Text>
          <View style={{}}>{this.renderNewExamsList()}</View>
          <Text style={[styles.blueTextSmall, {textAlign: 'center'}]}>{this.state.notification}{'\n'}</Text>
        </View>
        <View style={{marginBottom: 40}}>
          <Button
            color="#4a96bf"
            title="Weiter"
            onPress={async () => {
              if(this.newGoalsIsValid()) {
                //save, if it is 'Abschlussnote' (final_goal)
                if(Object.keys(this.state.new_goals)[0] === "Abschlussnote") {
                  await storage._storeData('final_goal', JSON.stringify(this.state.new_goals['Abschlussnote']));
                } else {
                //save else
                  await storage._retrieveData('new_goals').then((string) => {return JSON.parse(string)})
                  .then(async (new_grade_json) => {
                    //add new goals to previous new goals
                    if(typeof new_grade_json === 'object' && new_grade_json !== null) {
                      Object.keys(this.state.new_goals).forEach(key => new_grade_json[key] = this.state.new_goals[key])
                    } else {
                      new_grade_json = this.state.new_goals
                    }
                    await storage._storeData('new_goals', JSON.stringify(new_grade_json));
                  })
                  //clear new_exam
                  await storage._storeData('new_exam', '');
                }
                //if user visits first time, goto GetBatteryOptimizationPermission Screen else goto homescreen
                if(Object.keys(this.state.new_goals)[0] === "Abschlussnote") {
                  this.props.navigation.replace('GetBatteryOptimizationPermission')
                } else {
                  Alert.alert("Super!", "Ich habe es gespeichert.\nViel Spaß beim Lernen!") 
                  this.props.navigation.replace('Home')
                }
              //alert if new goals are not valid
              } else {
                Alert.alert("Meldung", "Deine Leistungen werden am besten, wenn du ein Ziel für jedes Fach angibst!")
              }
            }}/>
        </View>
      </ScrollView>
    );
  }
}

//styles
const styles = StyleSheet.create({
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
