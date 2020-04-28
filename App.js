/* eslint-disable prettier/prettier */
import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// import secondary files in
import HomeScreen from './app/components/HomeScreen';
import ScratchGrade from './app/components/ScratchGrade';
import CurrentTasks from './app/components/CurrentTasks';
import InfoPage from './app/components/InfoPage';
import SetNewGoals from './app/components/SetNewGoal';
import GetBatteryOptimizationPermission from './app/components/GetBatteryOptimizationPermission';

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
  CurrentTasks: {
    screen: CurrentTasks,
  },
  SetGoals: {
    screen: SetNewGoals,
  },
  GetBatteryOptimizationPermission: {
    screen: GetBatteryOptimizationPermission,
  }
},
{
    initialRouteName: 'Home',
})

export default createAppContainer(AppNavigator);


