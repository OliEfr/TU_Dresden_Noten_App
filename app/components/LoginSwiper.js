/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  Button,
  Linking,
  StyleSheet
} from 'react-native';

//3rd-party packages
import 'react-native-gesture-handler';
import StepIndicator from 'react-native-step-indicator';
import ScratchView from 'react-native-scratch';

//secondary files
import * as storage from '../utils/storage';
import Uni from '../utils/uni';
import * as utils from '../utils/utils';
import GradeList from '../utils/ExamListClass';
import LottieView from 'lottie-react-native';

/*
  The user sees this screens on first login
  The login screens contain a walkthrough and the user is required to put in login credentials
*/

export default class FlexDirectionBasics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IntroScreenNr: 1, //Number of intro screen to start on
      myUniversity: 'TU Dresden',
      myStudiengang: '',
      myLoginData: {username: '', password: ''},
      myUniversityErrorMsg: '',
      myLoginErrorMsg: '',
      LoginDone: false,
      isLoading: false,
      grades_json: {},
      my_uni: false,
      buttonText:'Weiter >>',
      disableButton: false,
      avarageGrade: 0,
      renderAnimation: false,
      renderRocket: true,
    };
  }

  onScratchDone = ({ isScratchDone, id }) => {
    this.setState({disableButton: false})
    this.setState({renderAnimation: true})
    this.congrats_animation.play()
    storage._storeData('alreadyLaunched', 'true');
  }

  onScratchTouchStateChanged = ({ id, touchState }) => {
  }

  renderContent = () => {
    //SCREEN-1
    if (this.state.IntroScreenNr === -1) {
      return (
          <Text style={[styles.orangeText, { marginHorizontal: 40}]}> Wenn die Uni keine App bringt ...</Text>
      )
    }
    //SCREEN0
    if (this.state.IntroScreenNr === 0) {
      return (
        <View>
          <Text style={[styles.orangeText, {fontWeight: 'bold', marginHorizontal: 30}]}>Dann machen wir es selbst!</Text>
          <Text style={[styles.blueTextSmall, {}]}>{'\n'}#Unoffical</Text>
        </View>
      )
    }
    
    //SCREEN1
    if (this.state.IntroScreenNr === 1) {
      return (
        <View>
          <Text style={[styles.blueTextSmall, ]}>Starte durch, mit{'\n'}</Text>
          <Text style={[styles.orangeTextBold ,{color: '#4a96bf' }]}>Grade<Text style={styles.orangeTextBold}>Race</Text></Text>
        </View>
      );
    }

    //SCREEN2
    if (this.state.IntroScreenNr === 2) {
      return (
        <View>
          <Text style={[styles.orangeText, {fontSize: 30, lineHeight: 50}]}>Noten</Text>
          <Text style={[styles.orangeText, {fontSize: 30, lineHeight: 50}]}>Lernziele</Text>
          <Text style={[styles.orangeText, {fontSize: 30, lineHeight: 50}]}>Benachrichtigungen</Text>
          <Text style={[styles.orangeText, {fontSize: 30, lineHeight: 100, fontWeight: 'bold'}]}>Alles in einer App!</Text>

        </View>
      );
    }

    //SCREEN3
    if(this.state.IntroScreenNr === 3) {
      return(
        <View>
          <Text style={[styles.orangeText, {fontSize: 30, lineHeight: 50}]}>So kann Digitalisierung an der Uni aussehen!</Text>
          <Text style={[styles.blueTextSmall, {lineHeight: 40}]}>{'\n'}100% lokal</Text>
          <Text style={[styles.blueTextSmall, {lineHeight: 40}]}>100% studentisch</Text>
          <Text style={[styles.blueTextSmall, {lineHeight: 40}]}>100% open source</Text>
        </View>
      )
    }

    //SCREEN4
    if (this.state.IntroScreenNr === 4) {
      //choosing a university is required before viewing this screen
      return (
        <View style={{alignItems:'center'}}>
          <Text style={[styles.orangeText, , {fontSize: 30, lineHeight: 50}]}>
            {(() => {
              switch (this.state.myUniversity) {
                case 'TU Dresden':
                  return 'Logge dich mit deinem TU Dresden\nLogin ein:';
                default:
                  return 'Logge dich mit deinem Uni Login ein:\n';
              }
            })()}
          </Text>
          <TextInput autoCapitalize="none"
            placeholder={(() => {
              switch (this.state.myUniversity) {
                case 'TU Dresden':
                  return 's-Nummer / Nutzername';
                default:
                  return 'Nutzername';
              }
            })()}
            style={{
              height: 40,
              width: 200,
              borderColor: '#aaaaaa',
              borderWidth: 1,
              margin: 5,
              marginTop: 30,
            }}
            returnKeyLabel={'next'}
            onChangeText={text => {
              let saveState = this.state.myLoginData;
              saveState.username = text;
              this.setState({myLoginData: saveState});
            }}
          />
          <TextInput autoCapitalize="none"
            placeholder="Passwort"
            secureTextEntry={true}
            style={{
              height: 40,
              width: 200,
              margin: 5,
              borderColor: '#aaaaaa',
              borderWidth: 1,
            }}
            returnKeyType={'done'}
            onChangeText={text => {
              let saveState = this.state.myLoginData;
              saveState.password = text;
              this.setState({myLoginData: saveState});
            }}
          />
          <Text style={[styles.blueTextSmall, {fontSize: 15}]}>{this.state.myLoginErrorMsg}</Text>
          <Text style={[styles.blueTextSmall, {fontSize: 18, marginHorizontal: 20}]}>Nur lokal und verschlüsselt gespeichert.</Text>
        </View>
      );
     
    }

    //SCREEN5
    if (this.state.IntroScreenNr === 5) {
      return(
        <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
          <Text style={[styles.orangeText,  {fontSize: 25, lineHeight: 50, marginHorizontal:20 }]}>Entdecke deine Durschschnittsnote.</Text>
          <Text style={[styles.blueTextSmall,{marginBottom: 20}]}> Fange an mit rubbeln:</Text>
          <View style={[styles.scratchBox, styles.grade, {}]}>
            {(() => {
              if (this.state.avarageGrade) {
                return <Text style={[styles.grade, {marginRight: 18}]}>{this.state.avarageGrade}</Text>
              } else {
                return <Text style={[styles.grade, {fontSize: 22}]}>Noch keine Noten...</Text>
              }
            })()}
            <ScratchView
                id={1} // ScratchView id (Optional)
                brushSize={20} // Default is 10% of the smallest dimension (width/height)
                threshold={50} // Report full scratch after 70 percentage, change as you see fit. Default is 50
                fadeOut={true} // Disable the fade out animation when scratch is done. Default is true
                placeholderColor="#dddddd" // Scratch color while image is loading (or while image not present)
                //imageUrl="http://yourUrlToImage.jpg" // A url to your image (Optional)
                //resourceName="your_image" // An image resource name (without the extension like '.png/jpg etc') in the native bundle of the app (drawble for Android, Images.xcassets in iOS) (Optional)
                resizeMode="cover|contain|stretch" // Resize the image to fit or fill the scratch view. Default is stretch
                onImageLoadFinished={this.onImageLoadFinished} // Event to indicate that the image has done loading
                onTouchStateChanged={this.onTouchStateChangedMethod} // Touch event (to stop a containing FlatList for example)
                onScratchProgressChanged={this.onScratchProgressChanged} // Scratch progress event while scratching
                onScratchDone={this.onScratchDone} // Scratch is done event
            />
          </View>
          {this.renderAnimation()}
        </View>
      )
    }

  };

  //Action of Button-Press and Button-Text depends on current screen
  buttonAction = async () => {
    if (this.state.IntroScreenNr === 0){
      this.gotoNextScreen()
    }
    if (this.state.IntroScreenNr === 1){
      this.setState({renderRocket: false})
      this.gotoNextScreen()
    }
    if (this.state.IntroScreenNr === 2){
      this.gotoNextScreen()
    }
    if (this.state.IntroScreenNr === 3){
      this.setState({buttonText: 'Login >>'})
      this.gotoNextScreen()
    }
    if (this.state.IntroScreenNr === 4){
      this.setState({disableButton: true})
      this.submit_login()
    }
    if (this.state.IntroScreenNr === 5){
      this.submit_scratch()
      this.setState({buttonText: 'Weiter >>'})
    }
  }

  gotoNextScreen = async () => {
    this.setState({IntroScreenNr: this.state.IntroScreenNr + 1});
  }

  submit_scratch = async () => {
    this.props.stateHandler(this.state.grades_json);
  }

  submit_login = async () => {
    //username and pw is required
    if (
      this.state.myLoginData.password === '' ||
      this.state.myLoginData.username === ''
    ) {
      this.setState({myLoginErrorMsg: 'Bitte gib deinen Login an!'});
      this.setState({isLoading: false});
      this.setState({disableButton: false});
      return;
    }
    this.setState({isLoading: true});
    this.setState({disableButton: true});

    var my_uni = new Uni(
      this.state.myLoginData.username,
      this.state.myLoginData.password,
      false,
      this.state.myUniversity,
    );
    this.setState({my_uni: my_uni});

    //check if hisqis reachable
    if(!(await utils.hisqis_reachable())) {
      //alert is promted in utils.hisqis_reachable
      this.setState({isLoading: false});
      this.setState({disableButton: false})
      return;
    }

    //fetch name
    //name will be undefined if error is catched in fetch-function
    var name = await my_uni.getName().catch(e => {
      this.setState({myLoginErrorMsg: 'Fehler: Bitte überprüfe deine Login Daten!'});
      this.setState({isLoading: false});
      this.setState({disableButton: false})
    })

    //check if name could be fetched
    if (name === undefined) {
      return;
    }

    //check if informatik
    let studiengang = await my_uni.getStudiengang() 
    if (studiengang.includes('Informatik')) {
      Alert.alert(
        'Lieber Informatiker',
        'Leider ist jExam noch nicht in die App integriert. Falls du Lust hat mitzuwirken, melde dich bei mir:',
        [
          {text: 'Entwickler kontaktieren', onPress: () => {
            Linking.openURL('mailto:ollidev97@gmail.com?subject=GradeRace Development')
          },
          }
        ],
        { cancelable: false }
      )
      return;
    }

    //check for right name
    if (
      (await utils.AsyncAlert(
        'Willkommen',
        'Hallo ' + name.replace( /\s\s+/g, ' ' ) + ', bist du es?',   //Regex to remove double spaces
      )) === false
    ) {
      this.setState({myLoginErrorMsg: 'Bitte versuche es erneut!'});
      this.setState({isLoading: false});
      this.setState({disableButton: false})
      return;
    }

    //store login_data (encrypted)
    storage.create_credentials(this.state.myLoginData.username, this.state.myLoginData.username,)
    .then(() => {
      storage._storeDataEncrypted(
        'login_data',
        JSON.stringify(this.state.myLoginData),
      );
    });

    //get grades
    this.state.grades_json = await my_uni.getGrades();

    //get studiengang
    this.setState({myStudiengang: studiengang})

    //store everything
    storage._storeData('grades_json', JSON.stringify(this.state.grades_json));
    storage._storeData('grades_list', JSON.stringify(my_uni.getGradesList()));
    storage._storeData('university', this.state.myUniversity);
    storage._storeData('studiengang', studiengang);
    storage._storeData('new_grade', JSON.stringify({list: []}));
    
    //get avarage grade for scratch later
    let myGradeList = new GradeList(my_uni.getGradesList());
    this.setState({avarageGrade: myGradeList.gradeAvarage})

    this.setState({LoginDone: true});
    this.setState({buttonText: 'Weiter >>'})
    this.setState({isLoading: false});
    this.setState({disableButton: true})
    this.gotoNextScreen()
  };

  loadingAnimation = () => {
    if (this.state.isLoading) {
      return (
        <LottieView
            style={{top: 45}}
            autoPlay
            ref={loading_animation => {
            this.loading_animation = loading_animation;
            }}
            source={require('../assets/3905-rocket-loading.json')}
        />
      )
    }
    return null
  }

  //render Animation, start play in OnScratchDone()
  renderAnimation = () => {
    if (this.state.renderAnimation) {
      return (
        <LottieView
            ref={congrats_animation => {
            this.congrats_animation = congrats_animation;
            }}
            source={require('../assets/1370-confetti.json')}
        />
      )
    } else {
      return null
    }
  }

  renderRocket = () => {
    if (this.state.renderRocket){
      return(
        <LottieView
            autoPlay
            style={{
              top:170,
              position: 'absolute',
              transform: [{ rotate: '10deg'}]
            }}
            ref={rocket_animation => {
            this.rocket_animation = rocket_animation;
            }}
            source={require('../assets/7409-rocket-flying.json')}
        />
      )
    }
    return null
  }

  render() {
    //step indicator styles
    const customStyles = {
      stepIndicatorSize: 25,
      currentStepIndicatorSize: 30,
      separatorStrokeWidth: 2,
      currentStepStrokeWidth: 3,
      stepStrokeCurrentColor: '#4a96bf',
      stepStrokeWidth: 3,
      stepStrokeFinishedColor: '#4a96bf',
      stepStrokeUnFinishedColor: '#dedede',
      separatorFinishedColor: '#4a96bf',
      separatorUnFinishedColor: '#dedede',
      stepIndicatorFinishedColor: '#4a96bf',
      stepIndicatorUnFinishedColor: '#ffffff',
      stepIndicatorCurrentColor: '#ffffff',
      stepIndicatorLabelFontSize: 0,
      currentStepIndicatorLabelFontSize: 0,
      stepIndicatorLabelCurrentColor: 'transparent',
      stepIndicatorLabelFinishedColor: 'transparent',
      stepIndicatorLabelUnFinishedColor: 'transparent',
      labelColor: '#999999',
      labelSize: 13,
      labelFontFamily: 'OpenSans-Italic',
      currentStepLabelColor: '#4a96bf',
    };

    //all IntroScreens are rendered within the same frame
    return (
      <View style={{flex: 1}}>
          <View
            style={{
              flex: 10, margin: 40, top: -40,justifyContent: 'center', alignItems: 'center'
              }}>
            {this.renderContent()}
            {this.renderRocket()}
            {this.loadingAnimation()}
          </View>
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              marginHorizontal: 60}}>
            <Button
              title={this.state.buttonText}
              color="#4a96bf"
              disabled={this.state.disableButton}
              onPress={() => this.buttonAction()}/>
          </View>
          <View
            style={{
              flex: 1,
              margin: 10}}>
            {(() => {
              if (this.state.IntroScreenNr > 1) {
                return (
                  <StepIndicator
                    customStyles={customStyles}
                    stepCount={4}
                    currentPosition={this.state.IntroScreenNr - 2}
                  />)
              }
            })()}
          </View>
      </View>
    );
  }
}

//styles
const styles = StyleSheet.create({
  grade: {
    textAlign: 'center',
    justifyContent: 'center',
    textAlignVertical: "center",
    fontSize: 140,
    //random size and position
    //fontSize: Math.floor(Math.random() * (100) + 30),
    //left: Math.floor(Math.random() * (75)),
    //top: Math.floor(Math.random() * (85)),
},
scratchBox: {
  width: 250,
  height: 250,
  borderRadius:15,
  overflow: 'hidden',
  borderColor:'#999999',
  borderWidth: 4,
},
  orangeText: {
    lineHeight: 70,
    textAlign: 'center',
    color: '#f06449',
    fontSize: 35,
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
  orangeTextBold: {
    lineHeight: 100,
    textAlign: 'center',
    color: '#f06449',
    fontSize: 50,
    fontWeight: '400',
    fontFamily: 'Roboto',
  },
});
