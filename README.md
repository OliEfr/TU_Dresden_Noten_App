# UniApp
A App for TU Dresden Students, Developed by TU Dresden Students.
Written in React-Native. Currently developed for Android only :/
100% local - 100% students - 100% open source!

# Strategy 
## Current Project Status
Conduction survey among TU Dresden Students.
Looking for contributors.

## Feedback / Bugs

- 0011 in der Notenübersicht-Chart entfernen
- Icon bei Push-Notification nicht angezeigt. >> TROUBLES
- Screen-Transition : Horizontal. See react-navigation docs! >> TROUBLES
- Make difference between new grade for subject and module: Scratch subject / only show for module

## ToDo
### High Priority
- Fächerbewertung Front- und Backend
- Notenspiegel Front- und Backend
- support selma und jexam
- make available for iOS
- Ziel für Abschlussnote setzen & anzeigen

## Contributors
currently only me

## ToDo, on releasing new version (only for OliEfr)
- change internal_version in HomeScreen.js
- add update notes in InfoPage.js
- use real fetch() function

## Documentation

### local storage (AsyncStorage)
This represents the data contained in the local AsyncStorage on the phone.
```
{
    'alreadyLaunched': 'true'                         //unencrypted, ='true', if login process was completed once.
    'new_grade': {list: [{name: '',                   //unencrypted, list of new grades
                          year: '', 
                          mark: ''}, {...}]
                }
    'login_data': {username: '', password: ''}        //encrypted, used for hisqis login
    'grades_json': see university.js for details      //encrypted, contains relevant user data
    'grades_list': see university.js for details      //unencrypted, list of grades for background task
    'university: ''                                   //unencrypted, name of university
    'studiengang: ''                                  //unencrypted, name of studiengang
    'new_exam': {list: [Exam1, Exam2]}                //unencrypted, only exists if user enrolled for new exam and  didnt open app
    'new_goals': {"Subject1": 1, "Subject2": 2}       //unencrypted, exists if user set new goal for grade which is not available yet
    'internal_version': '1'                           //used, to detect  new update. In ascending order
    'visit_counter': '1'                              //number of times, the user opened the app.
    'final_goal: '1.0'                                //goal of graduation grade!
}
```
### Filesystem
index.js is entry point for the app. It also registers the background task. The screens are managed in App.js

All related files can be found in /app.

- **Colors.js**: in the future, this file should contain all user colors
- **init.js**: functions, which are performed on app start: register push-notification, register background-task.
- **app/assets**: Containts assets. For now only animations for lottie.
- **app/components**: contains all components (e.g. screens, elements) which are display on UI
  - **CurrentTasks.js**: Screen to show current tasks
  - **GradesList.js**: Component, which is the grades list in Home Screen. Used in HomeScreen.js.
  - **HomeScreen.js**: This is called on app start. Here it is decided which screen should be shown to the user on start. It also containt visual elements of the home screen (this should be changed in the future!)
  - **LoginSwiper.js**: Screen, shown on first start up of app = user login
  - **ScratchGrade.js**: Screen, where the user can discover a new grade
  - **SetGoalList.js**: Component, containing a list of subjects where the user can set goals. Used in SetNewGoal.js.
  - **SetNewGoal.js**: Screen, where the user can set new goals. 

## Setting up the project
### 1. Setting up your PC
Working with Linux (Ubuntu) is recommended.
This repo did not work on windows so far.

Follow the instructions on https://facebook.github.io/react-native/docs/getting-started
Some packages in this repo dont work with expo. Thus, using react-native CLI is required. 

### 2. Setting up the repo on your PC
Clone repo to your local PC.
Install required dependencies running the following in the root of the project:
```
npm install
```
  
### 3. Running the App
Using a physical device is recommended (instead of a virtual device).
Follow this instruction: https://facebook.github.io/react-native/docs/getting-started.
If using a physical device make sure it is accessible trying:
```
adb devices
```
If a device is listed you are good to proceed:
```
react-native start
```
```
react-native run-android
```
Most Features should work on Android Virtual Device as well.

### Common issues
#### "react-native start" error
Error:
```
Loading dependency graph...jest-haste-map: Watchman crawl failed. 
Retrying once with node crawler.
Usually this happens when watchman isn't running. [...] 
Error: Watchman error: A non-recoverable condition has triggered.  [...] 
The user limit on the total number of inotify watches was reached; increase the fs.inotify.max_user_watches sysctl [...] 
```
One-Time Solution:
```
echo 400000 | sudo tee -a /proc/sys/fs/inotify/max_user_watches && echo 400000 | 
sudo tee -a /proc/sys/fs/inotify/max_queued_events && echo 400000 | 
sudo tee -a /proc/sys/fs/inotify/max_user_instances && 
watchman shutdown-server && sudo sysctl -p
```
However, when rebooting this has to be done again.

Permanent Solution:
Append the following lines to your /etc/sysctl.conf and reboot:

```
fs.inotify.max_user_watches = 400000
fs.inotify.max_queued_events = 400000 
fs.inotify.max_user_instances = 400000
```
And then run the command above (see One-Time Solution).
**Note**: The optimum number of max_user_watches etc. might change from system to system.

### 3rd-party packages
  **Note**: if you run "npm install" these packages will be installed already. 
        This list is just to keep track of the 3rd-party packages and list particularities.
        This list in *uncomplete* !
        Only packages effecting the whole app framework are listed.
        
#### react-navigation
- used to manage screens

#### react-native-push-notification https://github.com/zo0r/react-native-push-notification
 - Dont use the option "repeatType:""". Its is broken.

#### react-native-background-fetch 
 - used to perform background tasks (this is, fetching from hisqis)
 - very well maintained
 - bg-task can be tested manually
 - previously: rn-background-task were used, but it didnt work for new android versions.
 
#### react-native-vector-icons https://github.com/oblador/react-native-vector-icons
 - some nice icons
 - ToDo: only import required files/icons

#### cheerio-without-node-native
- requires "util", "stream" and "buffer" dependencies
- for using cheerio in RN (i.e. webscraping)

  
