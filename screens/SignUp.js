import React, { useState } from 'react';
import { View, Text, TextInput, Button, Keyboard } from 'react-native';
import { globalStyles } from '../styles/global';
import { firebase } from '../api/firebase';

export default function SignUp({ navigation }) {
    const [fullName, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const data = {
                    id: uid,
                    email,
                    fullName,
                };
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .set(data)
                    .then(() => {
                        navigation.navigate('Home', {user: data})
                    })
                    .catch((error) => {
                        alert(error)
                    });
            })
            .catch((error) => {
                alert(error)
        });
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Create new</Text>
            <Text style={globalStyles.titleText}>Account</Text>
            <Text style={globalStyles.paragraph} onPress={() => navigation.navigate('Login')}>Already Registered? Log in here.</Text>
            <Text style={globalStyles.paragraph}>NAME</Text>
            <TextInput
                style={globalStyles.input}
                onChangeText={(val) => setName(val)} 
                value={fullName} />
            <Text style={globalStyles.paragraph}>EMAIL</Text>
            <TextInput
                style={globalStyles.input}
                onChangeText={(val) => setEmail(val)} 
                />
            <Text style={globalStyles.paragraph}>PASSWORD</Text>
            <TextInput
                style={globalStyles.input}
                placeholderTextColor="#aaaaaa"
                secureTextEntry
                placeholder='Password'
                onChangeText={(val) => setPassword(val)} 
                value={password} 
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <Text style={globalStyles.paragraph}>CONFIRM PASSWORD</Text>
            <TextInput
                style={globalStyles.input}
                placeholderTextColor="#aaaaaa"
                secureTextEntry
                placeholder='Confirm Password'
                onChangeText={(val) => setConfirmPassword(val)}
                value={confirmPassword}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <Button
                title="Sign Up"
                onPress={handleRegister}
            />
        </View>
    )
}