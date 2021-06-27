import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Todo from '../screens/Todo';

const { Navigator, Screen } = createStackNavigator();

/**
 * A stack for the Todo list screen. 
 * 
 * Placed in a stack so that each component in the Tab Navigation are stack components. 
 * @returns The stack that has the Todo screen. 
 */
const TodoStack = () => {
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
            <Screen name="Todo" component={Todo}/>
        </Navigator>
    )};
export default TodoStack;