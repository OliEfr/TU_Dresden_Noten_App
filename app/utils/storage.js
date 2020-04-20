import * as Keychain from 'react-native-keychain';
import RNCryptor from 'react-native-rncryptor';
import {sha256} from 'react-native-sha256';
import AsyncStorage from '@react-native-community/async-storage';

/*
    This functions are used to interact with local AsyncStorage

    UserData is stored in AsynStorage
    This UserData is encrypted using sha256
    The password for this encryption is saved in keychain
    The password is created with a hash from username and password.

    Keychain and AsynStorage save key-value-pairs.

*/

//load credentials from keychain-storage
const load_credentials = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      //console.log('Credentials loaded')
      return credentials.password;
    }
  } catch (err) {
    console.log('Could not load credentials. ' + err);
  }
  return false;
};

//create credentials and save in keychain-storage
//this function must return a promise
const create_credentials = async (password, username) => {
  return new Promise(async function(resolve, reject) {
    if (password === '' || username === '') {
      console.log('Provide username and password!');
    } else {
      sha256(username + password)
        .then(async hash => {
          try {
            await Keychain.setGenericPassword('key', hash);
            resolve();
            //console.log('Created and saved credentials.')
          } catch (err) {
            console.log('Could not save credentials: ' + err);
            reject();
          }
        })
        .catch(error => {
          console.log('Error creating hash: ' + error);
          reject();
        });
    }
  });
};

//delte credentials from keychain-storage
const reset = async () => {
  try {
    await Keychain.resetGenericPassword();
    //console.log('Deleted credentials')
  } catch (err) {
    console.log('Could not reset credentials, ' + err);
  }
};

//store data in async storage and encrypt value
//  AsyncStorage saves key-value-pairs
const _storeDataEncrypted = async (key, value) => {
  let password = await load_credentials();
  if (password !== false) {
    RNCryptor.encrypt(value, password)
      .then(async value_encrypted => {
        await AsyncStorage.setItem(key, value_encrypted);
        //console.log('saved data.')
      })
      .catch(err => console.log('Could encrypt and save data:' + err));
  } else {
    console.log('No Password set. Provide credentials first!');
  }
};

//store data unencrypted in async storage
const _storeData = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

//read data from async store and decrypt value
//this function must return a promise!
//  AsyncStorage saves key-value-pairs
const _retrieveDataDecrypted = key => {
  return new Promise(async function(resolve, reject) {
    let value = await AsyncStorage.getItem(key);
    let password = await load_credentials();
    if (value !== null && password !== false) {
      RNCryptor.decrypt(value, password)
        .then(value_decrypted => {
          //console.log('Read value from storage: ' + value_decrypted);
          resolve(value_decrypted);
        })
        .catch(err => {
          console.log('Wrong Password or corrupted data:' + err);
          reject(Error('Wrong Password or corrupted data:' + err));
        });
    } else {
      console.log('No password set. Provide credentials first!');
      reject(Error('Could not retrieve Data. No credentials found.'));
    }
  });
};

//read unencrypted data from async store
//this function must return a promise!
//  AsyncStorage saves key-value-pairs
const _retrieveData = key => {
  return new Promise(async function(resolve, reject) {
    let value = await AsyncStorage.getItem(key);
    resolve(value);
  });
};

exports._retrieveData = _retrieveData;
exports._storeData = _storeData;
exports._retrieveDataEncrypted = _retrieveDataDecrypted;
exports._storeDataEncrypted = _storeDataEncrypted;
exports.reset = reset;
exports.create_credentials = create_credentials;
