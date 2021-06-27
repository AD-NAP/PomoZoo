import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { globalStyles} from '../styles/global';

export default function Todo() {
    const image = { uri: "https://cdn.dribbble.com/users/293796/screenshots/6340315/cat-space.gif" };

    return (
        <View style={globalStyles.container}>
            <ImageBackground source={image} style={styles.image}>
            <Text style={styles.textStyle}>Todo list page coming soon...</Text>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
});