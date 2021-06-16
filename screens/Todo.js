import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles} from '../styles/global';

export default function Todo() {
    return (
        <View style={globalStyles.container}>
            <Text>Todo list page</Text>
        </View>
    )
}