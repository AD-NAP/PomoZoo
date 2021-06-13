import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, View, Text, Pressable } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { ThemeProvider, Button } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import { firebase } from '../api/firebase';

export default function Home({ route, navigation }) {

    const [modalVisible, setModalVisible] = useState(false);

    React.useEffect(() => {
        if (route.params?.animalReward) {
            setModalVisible(!modalVisible)
        }
    }, [route.params?.animalReward]);

    const handleLogout = async () => {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.log(error);
        }
    }

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
            <ThemeProvider theme={theme}>
                <Button title="1 hour" onPress={() => navigation.navigate('Timer', { cycle: 4 })} />
                <Button title="2 hours" onPress={() => navigation.navigate('Timer', { cycle: 8 })} />
                <Button title="3 hours" onPress={() => navigation.navigate('Timer', { cycle: 12 })} />
            </ThemeProvider>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text>Congratulations! You are awarded with {route.params?.animalReward} </Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    navigation.dispatch(CommonActions.setParams({ animalReward: undefined }));
                                }}
                            >
                                <Text style={styles.textStyle}>Okay</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
            <Text style={globalStyles.paragraph} onPress={handleLogout} >LOG OUT</Text>
            {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => console.log(route.params?.animalReward)}
            >
                <Text style={styles.textStyle}>check animal</Text>
            </Pressable> */}
        </View >
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});