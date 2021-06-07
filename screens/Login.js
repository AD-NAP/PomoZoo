import React, { useState } from 'react';
import { View, Text, Button, TextInput, Keyboard } from 'react-native';
import { globalStyles} from '../styles/global';
import { CommonActions } from "@react-navigation/native";
import * as Authentication from "../api/auth";

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    const handleLogin = () => {
        Keyboard.dismiss();
        setIsLoginLoading(true);
    
        Authentication.login(
          { email, password },
          (user) => navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{
              name: "Home",
              params: { name: user.displayName }
            }]
          })),
          (error) => {
            setIsLoginLoading(false);
            return console.error(error);
          }
        );
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
                onChangeText={(val) => setPassword(val)} />
            <Button
                title="Log in"
                onPress={handleLogin}
            />
        </View>
    )
}