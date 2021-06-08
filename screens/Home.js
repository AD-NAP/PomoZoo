import React from 'react';
import { View, Text } from 'react-native';
import { ThemeProvider, Button } from 'react-native-elements';
import { globalStyles } from '../styles/global';

export default function Home({ navigation }) {
    const theme = {
        Button: {
          raised: true,
          containerStyle: {
              marginTop: 10,
              marginBottom: 10,
          }
        },
      };
      
    return (
        <View style={globalStyles.container}>
            <Text>Timer</Text>
            <ThemeProvider theme={theme}>
                <Button title="1 hour" onPress={() => navigation.navigate('Timer', {cycle: 1} )}/>
                <Button title="2 hours" onPress={() => navigation.navigate('Timer', {cycle: 2} )}/>
                <Button title="3 hours" onPress={() => navigation.navigate('Timer', {cycle: 3} )}/>
            </ThemeProvider>
            <Text style={globalStyles.paragraph} onPress={() => navigation.navigate('Login', { screen: 'Login' })}>LOG OUT</Text>
        </View>
    )
}