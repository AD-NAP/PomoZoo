import React from 'react';
import Header from '../components/Header'; 
import { createStackNavigator } from '@react-navigation/stack';
import Todo from '../screens/Todo';
const { Navigator, Screen } = createStackNavigator();

const TodoStack = ({ navigation }) =>(
    <Navigator>
        <Screen name="Todo" component={Todo} options={{
            headerStyle:{
                height: 90
            },  
            headerTitle: () => <Header navigation={navigation} title='Todo List Page' />,
        }} />
    </Navigator>
);
export default TodoStack;