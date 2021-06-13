import React, { useState, useRef } from 'react';
import { Text, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, SafeAreaView, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider, Input, Image, Button } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import { firebase } from '../api/firebase';

export default function SignUp({ navigation }) {
    const [fullName, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const ref_email = useRef();
    const ref_password = useRef();
    const ref_confirmPassword = useRef();

    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        setLoading(true);
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
                        navigation.navigate('Home', { user: data })
                    })
                    .catch((error) => {
                        alert(error)
                    });
            })
            .catch((error) => {
                setLoading(false);
                alert(error)
            });
    }

    const pomoTheme = {
        Input: {
            containerStyle: {
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
            },
        },
        Image: {
            containerStyle: {
                alignSelf: "center",
                width: 200,
                height: 200,
                marginBottom: 30,
            },
        },
        Button: {
            buttonStyle: {
                backgroundColor: '#8682f2',
                height: 48,
                marginBottom: 20,
            }
        },
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={globalStyles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={globalStyles.inner}>
                        <ThemeProvider theme={pomoTheme}>
                            <Image source={require('../assets/logo.png')} />
                            <Input
                                placeholder='Name'
                                returnKeyType="next"
                                onSubmitEditing={() => ref_email.current.focus()}
                                onChangeText={(val) => setName(val)}
                                leftIcon={
                                    <Icon
                                        name='account-circle'
                                        size={25}
                                        color='#f28482'
                                    />
                                }
                            />
                            <Input
                                placeholder='Email'
                                returnKeyType="next"
                                onSubmitEditing={() => ref_password.current.focus()}
                                autoCapitalize="none"
                                onChangeText={(val) => setEmail(val)}
                                ref={ref_email}
                                leftIcon={
                                    <Icon
                                        name='mail'
                                        size={25}
                                        color='#f28482'
                                    />
                                }
                            />
                            <Input
                                placeholder='Password'
                                returnKeyType="next"
                                onSubmitEditing={() => ref_confirmPassword.current.focus()}
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={(val) => setPassword(val)}
                                ref={ref_password}
                                leftIcon={
                                    <Icon
                                        name='lock'
                                        size={25}
                                        color='#f28482'
                                    />
                                }
                            />
                            <Input
                                placeholder='Confirm Password'
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={(val) => setConfirmPassword(val)}
                                ref={ref_confirmPassword}
                                leftIcon={
                                    <Icon
                                        name='lock'
                                        size={25}
                                        color='#f28482'
                                    />
                                }
                            />
                            <Button
                                title="Sign Up"
                                loading={isLoading}
                                onPress={handleRegister}
                            />
                            <Text style={globalStyles.footerText}>Already Registered? <Text onPress={() => navigation.navigate('Login')} style={globalStyles.footerLink}>Log in here.</Text></Text>
                        </ThemeProvider>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}