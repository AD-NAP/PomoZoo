import React from 'react';
import Header from '../components/Header'; 
import { createStackNavigator } from '@react-navigation/stack';
import ViewZoo from '../screens/ViewZoo';
const { Navigator, Screen } = createStackNavigator();

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