import React, { useState } from 'react';
import { View, Text, TextInput, Button, Keyboard } from 'react-native';
import { globalStyles } from '../styles/global';
import { CommonActions } from "@react-navigation/native";
import * as Authentication from '../api/auth';

export default function SignUp({ navigation }) {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);

    const handleRegister = () => {
        Keyboard.dismiss();
        setIsRegisterLoading(true);
    
        Authentication.createAccount(
            { name: username, email, password },
            (user) => navigation.dispatch(CommonActions.reset({
                index: 0,
                routes: [{
                name: "Home",
                params: { name: user.displayName }
                }]
            })),
            (error) => {
                setIsRegisterLoading(false);
                return console.error(error);
            }
            );
        }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Create new</Text>
            <Text style={globalStyles.titleText}>Account</Text>
            <Text style={globalStyles.paragraph} onPress={() => navigation.navigate('Login')}>Already Registered? Log in here.</Text>
            <Text style={globalStyles.paragraph}>NAME</Text>
            <TextInput
                style={globalStyles.input}
                onChangeText={(val) => setName(val)} />
            <Text style={globalStyles.paragraph}>EMAIL</Text>
            <TextInput
                style={globalStyles.input}
                onChangeText={(val) => setEmail(val)} />
            <Text style={globalStyles.paragraph}>PASSWORD</Text>
            <TextInput
                style={globalStyles.input}
                onChangeText={(val) => setPassword(val)} />
            <Button
                title="Sign Up"
                onPress={handleRegister}
            />
        </View>
    )
}