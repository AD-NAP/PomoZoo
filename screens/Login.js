import React, { useState, useRef } from 'react';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider, Input, Image, Button } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import { firebase } from '../api/firebase';

export default function Login({ navigation }) {
    /**
     * useState hooks to store variables of email, password and loading status. 
     * useRef used to improve UX when filling up their credentials 
     */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const ref_password = useRef();

    /**
     * Function to handle when user press the login button 
     */
    const handleLogin = () => {
        setLoading(true); //Set loading to true, this lets the login button display a loading status animation
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password) //Sign in with Firebase Auth 
            .then((response) => {
                //Get the data of the user from firestore database after user has successfully logged in
                const uid = response.user.uid
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.")
                            return;
                        }
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                setLoading(false);
                alert(error)
            })
    }

    const pomoTheme = {
        Input: {
            containerStyle: {
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
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
                height: 50,
                marginBottom: 20,
            }
        },
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={globalStyles.innerTop}>
                    <ThemeProvider theme={pomoTheme}>
                        <Image source={require('../assets/logo.png')} />
                        <Input
                            placeholder='Email'
                            returnKeyType="next"
                            onSubmitEditing={() => ref_password.current.focus()}
                            autoCapitalize="none"
                            onChangeText={(val) => setEmail(val)}
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
                        <Button
                            title="Log in"
                            loading={isLoading}
                            onPress={handleLogin}
                        />
                        <Text style={globalStyles.footerText}>Need an account? <Text onPress={() => navigation.navigate('SignUp')} style={globalStyles.footerLink}>Register here.</Text></Text>
                    </ThemeProvider>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}