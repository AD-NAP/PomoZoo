import React from 'react';
import { View, Text, Button } from 'react-native';
import { globalStyles} from '../styles/global';

export default function Login({ navigation }) {
    return (
        <View style={globalStyles.container}>
            <Text>Login Screen</Text>
            <Button
                title="Log In"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    )
}