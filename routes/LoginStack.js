import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
const { Navigator, Screen } = createStackNavigator();


const LoginStack = ({ navigation }) => (
        <Navigator>
            <Screen name="Sign Up" component={SignUp} />
            <Screen
                name="Login"
                component={Login}
                options={{
                    headerTitle: 'Log In Page',
                }} />
        </Navigator>
);
export default LoginStack;