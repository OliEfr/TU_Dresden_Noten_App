/* eslint-disable prettier/prettier */
var PushNotification = require('react-native-push-notification');

//import utils
import Uni from './utils/uni';
import * as storage from './utils/storage';

//This file is used to define and initialize the background task


//see git hub repo from react-native-push-notification for further information
const init_push_notification = () => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
      console.log('Push Notification pressed @', new Date().toLocaleString());

      //ON PRESS NOTIFICATION PROCESSED HERE
      
      //required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
      //notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     */
    requestPermissions: true,
  });
};

const send_push_notification = (_title, _message) => {
  PushNotification.localNotification({
    /* Android Only Properties */
    bigText: _message,

    /* iOS only properties */
    // ...

    /* iOS and Android properties */
    title: _title, // (optional)
    message: _message, // (required)

    largeIcon: "ic_notification",
    smallIcon:"ic_notificatoin"
    
    //Dont use option: repeatType. Its broken.
  });
};

//background task which should be performed
const background_task = async() => {
  return new Promise(async (resolve, reject) => {
  console.log('Triggered Background Task @' + new Date().toLocaleString());
  
  //get user data from storage
  await storage._retrieveDataEncrypted('login_data').then(login_data_string => {
    return JSON.parse(login_data_string);
  }).then(async (login_data_json) => {
    var my_uni = new Uni(login_data_json.username, login_data_json.password, await JSON.parse(await storage._retrieveData('grades_list')), await storage._retrieveData('university') );
    
    //fetch data from hisqis (i.e. user grades)
    my_uni.getGrades().then(async() => {
      if (my_uni.hasChanged()) {
        //save to storage
        my_uni.save();
      }

      //send push notification on new grade
      let newGradeCount = await my_uni.hasNewGrade();
      if (newGradeCount === 1) {
        send_push_notification('Eine neue Note!', 'Deine Note in ' + my_uni.getFirstNewSubjectName() + ' ist da.');
      } else if (newGradeCount > 1) {
        send_push_notification('Neute Noten!', 'Neue Noten in ' + my_uni.getFirstNewSubjectName() + ' und mehr ..');
      }

      //store information in AsynStorage
      if (newGradeCount > 0) {
        //TODO: do the following only, if new grade is exam
        await storage._storeData('new_grade', JSON.stringify({subjectName: my_uni.getFirstNewSubjectName(), subjectYear: my_uni.getFirstNewSubjectYear(), subjectMark: my_uni.getFirstNewSubjectGrade()}));
      }

      //push notificationa and store data if user enrolled for new exam
      let new_exams = await my_uni.enrolledNewExam()
      if (new_exams !== false) {
        send_push_notification('Neue Prüfung', 'Setze dir jetzt Ziele!');
        storage._storeData('new_exam', JSON.stringify({list: new_exams}));
      }
      
      console.log('Finished background task.')
      //resolves for manually triggering bg-task
      if (newGradeCount > 0) {resolve('got_new_grade')}
      if (new_exams !== false) {resolve('got_new_exam')}
      resolve();
      
    })
    .catch(e => reject(e));
  })
})
}

exports.background_task = background_task;
exports.init_push_notification = init_push_notification;
exports.send_push_notification = send_push_notification;
