/* eslint-disable react-native/no-inline-styles */

//This is the first component which is loaded when the users starts the app
//Here is decided, which screen and components should be displayed to the user
//For this, this file contains logic, as well as components

import React from 'react';
import {StyleSheet, View, Text, ScrollView, Button, Dimensions, Alert, ActivityIndicator, Linking} from 'react-native';

// import 3rd-party packages
import 'react-native-gesture-handler';
import {BarChart} from 'react-native-chart-kit';

//import secondary files in ./App
import GradesList from './GradesList';
import LoginSwiper from './LoginSwiper';
import * as storage from '../utils/storage';
import {withNavigation} from 'react-navigation';
import GradeList from '../utils/ExamListClass';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as init from '../init';
import BackgroundFetch from 'react-native-background-fetch';
import * as utils from '../utils/utils'

// USER VARIABLES
const current_version = 16  //used to manage versions internally and trigger events on app-update
//


class HomeScreen extends React.Component {
  constructor(props) {
	super(props);
    this.state = {
      firstLaunch: null,  //true, if user starts  app first time
      newGrade: undefined, //{subjectName: '', subjectYear: '', subjectMark: ''} | not null, when new grade
      newExam: {},  //{list: [Exam1, Exam2, ]} | not null, when enrolled to new exam
      grades_json: {},  //store all current grades and subjects. See university.js for details
      data: { //data for grade overview statistic
        labels: ['1', '2', '3', '4', 'failed'], //grades will be rounded to even numbers. 5 is 'not passed'.
        datasets: [{data: [0, 0, 0, 0, 0]}],
      },
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      gradeAvarage: 0,  //avarage grade
      examsCount: 0,  //number of exams
      isUpdatingScreens: false, //used to update screens when app is opened. For example on manually updating grades
      disableUpdateButton: false,
      InfoIconColor: '#BBBBBB',
      InfoIconSize: 25,
      InfoIconBackground: '#ffffff',
      currentGoals: '', //contains a concatenated list of current goals, seperated by {'\n'}
      finalGoal: null, //final gratuation goal
    };

    this.onLayout = this.onLayout.bind(this)
  }

  static navigationOptions = {
    headerShown: false,
    //title: 'Deine Notenübersicht',
    //headerTitleStyle: {
    //  alignSelf: 'center',
    //  flex:1,
    //  textAlign: 'center'
    //}
  };

  //on layout change, to detect when user rotates device
  onLayout(e) {
    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    });
  }

  //handler is required to get states of child components
  stateHandler = value => {
    this.setState({
      grades_json: value,
    });
    this.setState({firstLaunch: false});
    this.getGradeList();
    console.log('Finished login process and initialized background task!');
  };

  componentDidMount() {    
    //initialize backgroud task ('headfull', for when the app is not terminated)
    BackgroundFetch.configure({
      minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
      // Android options
      forceAlarmManager: false,     // <-- Set true to bypass JobScheduler.
      stopOnTerminate: false,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Default
      forceAlarmManager: false,
      enableHeadless: true
    }, async (taskId) => {
      await init.background_task()
      BackgroundFetch.finish(taskId);
    }, (error) => {
      console.log("Background-Fetch Task failed to start: " + error);
    });
   
    //read data from storage to decide, which screen to show to the user
    storage._retrieveData('alreadyLaunched').then(async value => {
      //if user is not registered yet or app is launched first time
      if (value === null || value === 'false') {
        this.setState({firstLaunch: true});
        this.setState({newGrade: null});
        this.setState({newExam: null})
      } else {
        //load new grade, to see whether there is a new grade
        storage._retrieveData('new_grade').then((string) => JSON.parse(string))
          .then((new_grade_json) => {
            //store first element of this list
            this.setState({newGrade: new_grade_json.list[0]});
          });
        //load new exam, to see whether enrolled in new exam
        storage._retrieveData('new_exam').then((string) => JSON.parse(string))
          .then((new_exam_json) => {
            this.setState({newExam: new_exam_json});
          });
        //get final_goal
        storage._retrieveData('final_goal').then((string) => JSON.parse(string))
        .then((final_goal) => {
          this.setState({finalGoal: final_goal});
        });
        //load current goals
        this.getCurrentGoals()
        //load version to detect update
        await storage._retrieveData('internal_version').then((string) => {
          if (string === null) return null
          return parseInt(string)
        })
        .then((version) => {
          //if update, notify user and store new version and reset visit count
          if (version < current_version || version === null) {
            storage._storeData('internal_version', current_version.toString())
            storage._storeData('visit_counter', '0')
            //set color of info icon
            this.setState({InfoIconColor: '#ff0000'})
            this.setState({InfoIconSize: 30})
            this.setState({InfoIconBackground: '#ffd4d1'})
          }
        })

        //get visit counter and display message and ask for Feedback
        storage._retrieveData('visit_counter').then((string) => {
          if (string === null) return 0
          return parseInt(string)
        })
        .then((visit_counter) => {
          let current_visit = visit_counter + 1
          storage._storeData('visit_counter', current_visit.toString())
          //if (current_visit === 7) {
          //  Alert.alert(
          //    'Danke!',
          //    'Cool, dass du die App nutzt. Bitte sende uns jetzt kurz Feedback:',
          //    [
          //      {text: 'Feedback senden', onPress: () => {
          //        Linking.openURL('mailto:ollidev97@gmail.com?subject=GradeRace Feedback&body=Bitte gib hier ein kurzes Feedback zur App. Was soll verbessert werden? Bekommst du Push-Benachrichtigungen? Was wünschst du dir für die Zukunft?')
          //      },
          //      }
          //    ],
          //    { cancelable: false }
          //  )
          //}
        })

        //prepare grade list for display in chart
        this.getGradeList();

        //await timer to show splash screen
        await new Promise(r => setTimeout(r, 200));
        
        //load grade overview from storage
        storage
          ._retrieveData('grades_json')
          .then(grades_json_string => {
            return JSON.parse(grades_json_string);
          })
          .then(grades_json_json => {
            this.setState({grades_json: grades_json_json});
            this.setState({firstLaunch: false});
          });
      }
    });
  }

  getCurrentGoals = () => {
    storage._retrieveData('new_goals').
      then(new_goals_string => {
        return JSON.parse(new_goals_string)
      })
      .then(new_goals_json => {
        let new_goals_concat = ''
        if(typeof new_goals_json === 'object' && new_goals_json !== null) {
          Object.keys(new_goals_json).forEach(key => {
            new_goals_concat = new_goals_concat + key + ": " + (new_goals_json[key]).toFixed(1) + '\n'
          })
        }
        this.setState({currentGoals: new_goals_concat})
      })
  }

  //prepare grade list for chart
  getGradeList = () => {
    storage._retrieveData('grades_list').
        then(grades_list_string => {
          return JSON.parse(grades_list_string);
        })
        .then(grades_list_json => {
          let myGradeList = new GradeList(grades_list_json);
          const dataCopy = this.state.data;
          dataCopy.datasets[0].data = myGradeList.gradesCountConverted;
          this.setState({data: dataCopy});
          this.setState({examsCount: myGradeList.examsCount})
          this.setState({gradeAvarage: myGradeList.gradeAvarage})
    })
  }

  renderGradesList = () => {
    const items = [];
    for (var item of this.state.grades_json.modules) {
      items.push(
        <GradesList
          module_name={item.module_name}
          subjects={item.subjects}
          module_mark={item.module_mark}
          status={item.status}
        />,
      );
    }
    //if no grades yet
    if (items.length === 0) {
      items.push(
        <View style={{marginTop: 30, marginBottom: 40}}>
          <Text style={[styles.orangeText, {fontSize: 25, lineHeight:25}]}>Du hast noch keine Noten.{'\n'}</Text>
          <Text style={[styles.orangeText, {marginVertical: 10, fontSize: 20, lineHeight:20}]}>Ich benachrichtige dich, sobald du eine hast!</Text>
        </View>
      )
    }
    return items;
  };

  RenderLoginScreens = () => {
    return <LoginSwiper stateHandler={this.stateHandler} />;
  };

  RenderLoadingScreen = () => {
    return <Text style={[styles.orangeTextBold ,{color: '#4a96bf' }]}>Grade<Text style={styles.orangeTextBold}>Race</Text></Text>;
  };

  //main render function
    //upon the data loaded from storage it is decided, which screen to show
    //splash screen is always shown at beginning
  render() {
    //config for chart
    const chartConfig = {
      backgroundGradientFrom: "#4a96bf",
      backgroundGradientTo: "#4a96bf",
      decimalPlaces: 0.1, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    };

    //show splashscreen until loaded data from async storage
    if (this.state.firstLaunch === null) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {this.RenderLoadingScreen()}
        </View>
      );
    //if user visits first time show login walkthrough
    } else if (this.state.firstLaunch === true) {
       return ( 
        <View style={{flex: 1}}>
          {this.RenderLoginScreens()}
        </View>
      )
    //if user has been seen already
    } else {
      //ask for final goal if not set yet
      if ((this.state.finalGoal === undefined || this.state.finalGoal === '' || this.state.finalGoal === null)) {
        this.props.navigation.replace('SetGoals', {list:['Abschlussnote']})
      }
      //goto ScratchGrade if new grade
      if (!(this.state.newGrade === undefined || this.state.newGrade === '' || this.state.newGrade === null)) {
        this.setState({newGrade: undefined})
        //use navigate because this function is called multiple times. Actually this is a bug..
        this.props.navigation.navigate('Scratch', this.state.newGrade)
        //For testing:
        //this.props.navigation.navigate('Scratch', {subjectName: 'Chemie', subjectYear: 'WiSe 16/17', subjectMark: '1,0'})
      }
      //goto SetNewGoal if enrolled in new exam
      if (this.state.newExam!== null) {
        //use navigate because this function is called multiple times. Actually this is a bug..
        this.props.navigation.navigate('SetGoals', this.state.newExam)
      }
      //normal app view = 'HomeScreen'. This is the grade overview.
      return (
        <ScrollView style={{marginTop:20}} onLayout={this.onLayout}>
          <Text style={[styles.blueTextSmall, {marginVertical: 15}]}>Deine Notenübersicht</Text>
          <BarChart
          style={{
            borderRadius: 5,
            alignItems: 'center',
            marginBottom: 10
          }}
          data={this.state.data}
          width={Dimensions.get('window').width - 25}
          height={200}
          chartConfig={chartConfig}/>
          <View  style={{position: 'absolute', right: 0, top: 5}}>
            <Icon.Button
               name={'info-outline'}
               size={this.state.InfoIconSize}
               color={this.state.InfoIconColor}
               backgroundColor={this.state.InfoIconBackground}
               onPress={() => {
                this.setState({InfoIconColor: '#BBBBBB'})
                this.setState({InfoIconSize: 25})
                this.setState({InfoIconBackground: '#ffffff'})
                 this.props.navigation.push('Info')
                 }}></Icon.Button>
            </View>
          <View> 
           <Text style={[styles.greyTextSmall, {marginLeft:-10}]}>Anzahl Prüfungen:  {this.state.examsCount}</Text>
           <Text style={[styles.greyTextSmall, {marginLeft:-10}]}>Durchschnittsnote: {this.state.gradeAvarage}</Text>
           <Text style={[styles.greyTextSmall, {marginLeft:-10, textDecorationLine: 'underline', marginTop: 8}]}>Deine aktuellen Ziele:</Text>
           <Text style={[styles.greyTextSmall, {marginLeft:-10, marginTop: 0}]}>Abschlussnote: {this.state.finalGoal}</Text>
           {(() => {
              if (this.state.currentGoals != '') {
                return ( 
                    <Text style={[styles.greyTextSmall, {marginLeft:-10, marginTop: 0}]}>{this.state.currentGoals}</Text>
                )
              }
            })()}
           <Text style={[styles.greyTextSmall, {marginLeft:-10, marginTop: 12}]}>Ich benachrichtige dich bei neuen Noten!</Text>
          </View>
          <View style={{marginHorizontal: 60, marginVertical: 20}}>
            <Button
              color='#4a96bf'
              title="Jetzt aktualisieren"
              disabled={this.state.disableUpdateButton}
              onPress={async () => {
                this.setState({disableUpdateButton: true, isUpdatingScreens: true})
                //check network connection to hisqis
                  //the if-clauses need to be as they are!
                if (await utils.hisqis_reachable()) {
                  //execute background task
                  init.background_task().then(async (resp) => {
                    //if another screen needs to be shown, because there is an update
                    if(resp === 'got_new_grade' || resp === "got_new_exam") {
                      this.props.navigation.replace('Home')
                    }
                    this.setState({disableUpdateButton: false, isUpdatingScreens: false})
                  }) 
                } else {
                  this.setState({disableUpdateButton: false, isUpdatingScreens: false})
                }
              }}/>
          </View>
          {this.state.isUpdatingScreens && (
            <ActivityIndicator
              size="large"
              color="#f06449"
              animating={this.state.isUpdatingScreens}
              hidesWhenStopped={true}
            />
          )}
          <View style={{marginHorizontal: 12, marginTop: 5}}>{this.renderGradesList()}</View>
          {//Following buttons are for debugging only
          }
          {<View style={{marginHorizontal: 60, marginVertical: 20}}>
            <Button
              color="#4a96bf"
              title="App zurücksetzten"
              onPress={() => utils.reset()}/></View>}
          {/*<View style={{marginHorizontal: 60, marginVertical: 20}}>
            <Button
              style={{margin: 30}}
              title="Send Push Notification"
              onPress={() => utils.send_push_notification()}/></View>*/} 
          {/*<View style={{marginHorizontal: 60, marginVertical: 20}}>
            <Button
              style={{margin: 30}}
              title="Store new grade"
            onPress={() => utils.store_new_grade()}/></View>*/}
            {/*<View style={{marginHorizontal: 60, marginVertical: 20}}>
            <Button
              style={{margin: 30}}
              title="Test BG-Task"
          onPress={() => init.background_task()}/></View>*/}
        </ScrollView>
      );
    }
  }
}
//styles
const styles = StyleSheet.create({
  orangeTextBold: {
    lineHeight: 100,
    textAlign: 'center',
    color: '#f06449',
    fontSize: 50,
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
  blueTextSmall: {
    lineHeight: 25,
    textAlign: 'center',
    color: '#4a96bf',
    fontSize: 25,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
});

export default withNavigation(HomeScreen);
