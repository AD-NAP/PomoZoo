import React from 'react';
import Header from '../components/Header'; 
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Timer from '../screens/Timer';
const { Navigator, Screen } = createStackNavigator();

const TimerStack = ({ navigation }) =>(
    <Navigator>
        <Screen name="Home" component={Home} options={{
            headerStyle:{
                height: 90
            },  
            headerTitle: () => <Header navigation={navigation} title='Home Page' />,
        }} />
        <Screen 
        name="Timer" 
        component={Timer}
        options={{
            headerTitle: 'Timer Page',
        }} />
    </Navigator>
);
export default TimerStack;