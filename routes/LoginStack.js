import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
const { Navigator, Screen } = createStackNavigator();


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
        <Screen name="Sign Up" component={SignUp}/>
        <Screen name="Login" component={Login}/>
    </Navigator>
);
export default LoginStack;