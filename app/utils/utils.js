/* eslint-disable prettier/prettier */
import {Alert} from 'react-native';

//import secondary files
import * as storage from '../utils/storage';
import * as init from '../init';

//some utils

//reset app = local storage
const reset = async() => {
  if (
    (await AsyncAlert(
      'Achtung!',
      'Diese Aktion löscht alle Daten!\nDu kannst dich aber später erneut anmelden.',
    )) === true
  ) {
    //probably better with: AsyncStorage.removeItem('userId');
    storage._storeData('grades_json', '');
    storage._storeData('grades_list', '');
    storage._storeData('university', '');
    storage._storeData('alreadyLaunched', '');
    storage._storeData('studiengang', '');
    storage._storeData('new_grade', '');
    Alert.alert('Alle Daten wurden gelöscht.', 'Starte die App neu.')
  } else {Alert.alert('Nicht gelöscht', 'Du bist weiterhin angemeldet.')}
  
}

const send_push_notification = () => {
  init.send_push_notification('send1!', 'send2!');
}

const store_new_grade = () => {
  storage._storeData('new_grade', JSON.stringify({subjectName: 'Chemie', subjectYear: 'WiSe 17/18', subjectMark: '2,0'}));
}

const AsyncAlert = async (title, text, yesButton = 'Weiter', noButton = 'Zurück') =>
  new Promise(resolve => {
    Alert.alert(
      title,
      text,
      [
        {text: noButton, onPress: () => {resolve(false);}},
        {text: yesButton, onPress: () => {resolve(true);}},
      ],
      {cancelable: false},
    );
  });

//check if hisqis reachable via internet
const hisqis_reachable = ()=> {
  return new Promise((resolve, reject) => {
    fetch('https://qis.dez.tu-dresden.de/qisserver/rds?state=user&type=1&category=auth.login&startpage=portal.vm')
    .then((resp) =>  {
      if(!resp.ok) {
        throw new Error("Network unreachable or hisqis down!")
      }
      resolve(true)
    })
    .catch((e) => {
      Alert.alert('Hisqis ist nicht erreichbar' , 'Entweder ist der Service gerade nicht verfügbar, oder du bist Offline!')
      resolve(false)
    })
  })
}

exports.hisqis_reachable = hisqis_reachable;
exports.AsyncAlert = AsyncAlert;
exports.reset = reset;
exports.send_push_notification = send_push_notification;
exports.store_new_grade = store_new_grade;
