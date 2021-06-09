import React, { useState } from 'react';
import { View, Text, Button, TextInput, Keyboard } from 'react-native';
import { globalStyles} from '../styles/global';
import { firebase } from '../api/firebase';

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
      firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
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
                  const user = firestoreDocument.data()
              })
              .catch(error => {
                  alert(error)
              });
      })
      .catch(error => {
          alert(error)
      })
      }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.paragraph}>EMAIL</Text>
            <TextInput
                style={globalStyles.input}
                onChangeText={(val) => setEmail(val)} />
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
            <Button
                title="Log in"
                onPress={handleLogin}
            />
        </View>
    )
}