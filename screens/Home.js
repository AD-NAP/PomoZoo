import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles} from '../styles/global';





export default function Home({ navigation }) {
    return(
        <View style={globalStyles.container}>
            <Text>Timer</Text>
            <Text style={globalStyles.paragraph} onPress={() => navigation.navigate('Timer')}>Start Timer</Text>
            <Text style={globalStyles.paragraph} onPress={() => navigation.navigate('Login', { screen: 'Login' } )}>LOG OUT</Text>
        </View>
        )
}