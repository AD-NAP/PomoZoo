import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { globalStyles } from '../styles/global';

export default function SignUp({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Create new</Text>
            <Text style={globalStyles.titleText}>Account</Text>
            <Text style={globalStyles.paragraph} onPress={() => navigation.navigate('Login')}>Already Registered? Log in here.</Text>
            <Text style={globalStyles.paragraph}>USERNAME</Text>
            <TextInput
                style={globalStyles.input}
                onChangeText={(val) => setUsername(val)} />
            <Text style={globalStyles.paragraph}>PASSWORD</Text>
            <TextInput
                style={globalStyles.input}
                onChangeText={(val) => setPassword(val)} />
            <Text style={globalStyles.paragraph}>CONFIRM PASSWORD</Text>
            <TextInput
                style={globalStyles.input}
                onChangeText={(val) => setConfirmPassword(val)} />
            <Button
                title="Sign Up"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    )
}