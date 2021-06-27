import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
/**
 * A stack for the login and registration pages. 
 *
 * Both are placed in a stack so that they can be navigated back and forth. 
 */
const { Navigator, Screen } = createStackNavigator();

/**
 * Login stack that will be exported in Tab.js
 * @returns The stack that includes the SignUp and Login screens. 
 */
const LoginStack = () => (
    <Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#8682f2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Screen name="Login" component={Login}/>
        <Screen name="SignUp" component={SignUp}/>
    </Navigator>
);
export default LoginStack;