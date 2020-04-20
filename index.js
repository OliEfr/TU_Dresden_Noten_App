/**
 * @format
*/

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

//secondary files
import App from './App';


import BackgroundFetch from "react-native-background-fetch";
import * as init from './app/init';

AppRegistry.registerComponent(appName, () => App);

//init headless background task
let MyHeadlessTask = async (event) => {
    let taskId = event.taskId;
    
    await init.background_task()

    BackgroundFetch.finish(taskId);
  }
  
// Register BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
