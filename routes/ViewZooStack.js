import React from 'react';
import Header from '../components/Header'; 
import { createStackNavigator } from '@react-navigation/stack';
import ViewZoo from '../screens/ViewZoo';
const { Navigator, Screen } = createStackNavigator();

const ViewZooStack = ({ navigation }) =>(
    <Navigator>
        <Screen name="ViewZoo" component={ViewZoo} options={{
            headerStyle:{
                height: 90
            },  
            headerTitle: () => <Header navigation={navigation} title='ViewZoo Page' />,
        }} />
    </Navigator>
);
export default ViewZooStack;