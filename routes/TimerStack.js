import React from 'react';
import Header from '../components/Header'; 
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Timer from '../screens/Timer';
const { Navigator, Screen } = createStackNavigator();

const TimerStack = ({ route, navigation }) => {
    return (
    <Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#8682f2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Screen name="Home" component={Home} initialParams={{user: route.params.user}}/>
        <Screen name="Timer" component={Timer}/>
    </Navigator>
)};
export default TimerStack;