/* eslint-disable react-native/no-inline-styles */

//This screen appears, when user has a new mark in a module
//The user can discover and unscratch his grade on this screen

import React from 'react';
import {StyleSheet, Alert, View, Text, Button} from 'react-native';

// import 3rd-party packages
import {withNavigation} from 'react-navigation';
import ScratchView from 'react-native-scratch';
import LottieView from 'lottie-react-native';

// import secondary files in ./App
import * as storage from '../utils/storage';

class ScratchGrade extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          ButtonDisabled: true,
          myGrade: '',
          myYear: '',
          myName: '',
          myGoal: null,
          renderAnimation: false,
          status: "",
          text:""
      };
    }

    static navigationOptions = {
        header: null,
        navigationOptions: {
          headershown: false,
        },
      };
  
    async componentDidMount() {
        this.setState({myYear: this.props.navigation.getParam('subjectYear')})
        this.setState({myName: this.props.navigation.getParam('subjectName')})
        await new Promise(r => setTimeout(r, 500));
        this.setState({myGrade: this.props.navigation.getParam('subjectMark')})
        let new_goals = await JSON.parse(await storage._retrieveData('new_goals', ''));
        if(typeof new_goals === 'object' && new_goals !== null) {
            if (new_goals.hasOwnProperty(this.state.myName)) {
                this.setState({myGoal: new_goals[this.state.myName]})
            }
        }
    }
  
    onImageLoadFinished = ({ id, success }) => {
        // Do something
    }
 
    onScratchProgressChanged = ({ value, id }) => {
        // Do domething like showing the progress to the usera
    }
 
    onScratchDone = ({ isScratchDone, id }) => {
        // show animation
        this.setState({renderAnimation: true})
        console.log(parseFloat(this.state.myGrade.replace(",", ".")))
        if(parseFloat(this.state.myGrade.replace(",", ".")) <= parseFloat(this.state.myGoal)) {
            this.setState({status: 'ReachedGoal'})
            this.congrats_animation.play()
            this.setState({text: "Glückwunsch! Du hast dein Ziel erreicht."})
        } else if(this.state.myGoal !== null) {
            this.setState({status: 'FailedGoal'})
            this.pitty_animation.play()
            this.setState({text: "Schade, du hast dein Ziel nicht erreicht. Mehr lernen!"})

        }
        this.setState({ButtonDisabled: false})
    }
 
    onScratchTouchStateChanged = ({ id, touchState }) => {
        // Example: change a state value to stop a containing
        // FlatList from scrolling while scratching
        this.setState({ scrollEnabled: !touchState });
    }

    renderAnimation=()=>{
        if (this.state.renderAnimation) {
            if(this.state.status === 'ReachedGoal') {
                return (
                        <LottieView
                            style={{bottom: 100}}
                            ref={congrats_animation => {
                            this.congrats_animation = congrats_animation;
                            }}
                            source={require('../assets/1370-confetti.json')}
                        />
                )
            }
            if(this.state.status === "FailedGoal") {
                return (
                    <LottieView
                        style={{bottom: 100}}
                        ref={pitty_animation => {
                        this.pitty_animation = pitty_animation;
                        }}
                        source={require("../assets/2394-dislike.json")}
                    />
                )
            }
        } else {
            return null
        }
    }
 
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
                <Text style={[styles.orangeText, {marginTop: 25}]}>Du hast eine neue Note: {'\n'}{'\n'} {this.state.myName}</Text>
                <Text style={[styles.blueTextSmall]}>Fange an mit rubbeln:</Text>
                <View style={[styles.scratchBox, styles.grade]}>
                    <Text style={styles.grade}>{this.state.myGrade}</Text>
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
                <Text style={[styles.orangeTextSmall,{marginHorizontal: 20}]}>{this.state.text}</Text>
                <Button
                    color="#4a96bf"
                    title="Weiter"
                    disabled={this.state.ButtonDisabled}
                    onPress={ async () => {
                        //remove first element from storage
                        await storage._retrieveData('new_grade').then((string) => JSON.parse(string))
                        .then(async (new_grades) => {
                          await new_grades.list.shift()
                          storage._storeData('new_grade', JSON.stringify(new_grades));
                        });
                        //delete this goal from storage.
                        let old_goals = await JSON.parse(await storage._retrieveData('new_goals', ''));
                        if(typeof old_goals === 'object' && old_goals !== null) {
                            if (old_goals.hasOwnProperty(this.state.myName)) {
                                delete old_goals[this.state.myName]
                                storage._storeData('new_goals', JSON.stringify(old_goals))
                            }
                        }
                        //use navigation.replace() to prevent going back!
                        this.props.navigation.replace('Home')
                    }}
                />
                {this.renderAnimation()}
               
            {/*<LottieView
                ref={pitty_animation => {
                this.pitty_animation = pitty_animation;
                }}
                source={require('../assets/2394-dislike.json')}
            />*/}
            </View>
        )
    }
}

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
        lineHeight: 40,
        textAlign: 'center',
        color: '#f06449',
        fontSize: 32,
        fontWeight: '100',
        fontFamily: 'Roboto',
      },
      blueTextSmall: {
        lineHeight: 25,
        textAlign: 'center',
        color: '#4a96bf',
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'Roboto',
      },
      orangeTextSmall: {
        lineHeight: 25,
        textAlign: 'center',
        color: '#f06449',
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'Roboto',
      },
      orangeTextBold: {
        lineHeight: 100,
        textAlign: 'center',
        color: '#f06449',
        fontSize: 90,
        fontWeight: '400',
        fontFamily: 'Roboto',
      },
});

export default withNavigation(ScratchGrade);
