import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Timer from '../screens/Timer';
/**
 * A stack for the home page and timer page.
 * 
 * Both are placed in a stack so that they can be navigated back and forth after
 * the user selects the timer or after the timer is completed. 
 */
const { Navigator, Screen } = createStackNavigator();

/**
 * Timer stack that will be exported in Tab.js
 * @param {Object} route The route param from react-navigation 
 * that allows to store paramaters in route.params. In this case
 * the object user is stored so that the Home screen can access the user's data. 
 * @returns The stack that includes the Home and Timer screens. 
 */
const TimerStack = ({ route }) => {
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