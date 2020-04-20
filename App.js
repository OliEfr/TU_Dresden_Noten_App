/* eslint-disable prettier/prettier */
import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// import secondary files in
import HomeScreen from './app/components/HomeScreen';
import ScratchGrade from './app/components/ScratchGrade';
import ContactDeveloper from './app/components/ContactDeveloper';
import CurrentTasks from './app/components/CurrentTasks';
import InfoPage from './app/components/InfoPage';
import SetNewGoals from './app/components/SetNewGoal';

//using react naivgation to manage screens
const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Info: {
    screen: InfoPage,
  },
  Scratch: {
    screen: ScratchGrade,
  },
  ContactDeveloper: {
    screen: ContactDeveloper,
  },
  CurrentTasks: {
    screen: CurrentTasks,
  },
  SetGoals: {
    screen: SetNewGoals,
  }
},
{
    initialRouteName: 'Home',
})

export default createAppContainer(AppNavigator);


