import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ViewZoo from '../screens/ViewZoo';

const { Navigator, Screen } = createStackNavigator();

/**
 * A stack for the View Zoo screen. 
 * 
 * Placed in a stack so that each component in the Tab Navigation are stack components. 
 * @param {Object} route The route param from react-navigation 
 * that allows to store paramaters in route.params. In this case
 * the object user is stored so that the ViewZoo screen can access the user's data. 
 * @returns The stack that has the ViewZoo screen. 
 */
const ViewZooStack = ({ route }) =>(
    <Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#8682f2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Screen name="View Zoo" component={ViewZoo} initialParams={{user: route.params.user}}/>
    </Navigator>
);
export default ViewZooStack;