import React, { useState, useEffect } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { View, Animated, Modal, StyleSheet, Text, Pressable} from 'react-native';
import { globalStyles } from '../styles/global';

export default function Timer({ route, navigation }) {
    const { cycle, animal } = route.params;
    const [key, setKey] = useState(cycle - 1);
    const [duration, setDuration] = useState(10);
    const [breakTime, setBreakTime] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (modalVisible == true) {
            setTimeout(() => setModalVisible(!modalVisible), 2000);
        }
      }, [modalVisible]);

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.innerTimer}>
                <CountdownCircleTimer
                    key={key}
                    onComplete={
                        () => {
                            setBreakTime(breakTime ? false : true)
                            if (breakTime) {
                                setModalVisible(!modalVisible);
                                setDuration(5);
                            } else {
                                setDuration(10);
                            }
                            setKey(prevKey => prevKey - 1)
                            if (key == 0) {
                                navigation.navigate({
                                    name: 'Home',
                                    params: { animalReward: cycle / 4 + " " + animal },
                                    merge: true,
                                })
                            }
                        }
                    }
                    isPlaying
                    duration={duration}
                    colors={[
                        ['#f28482', 0.3],
                        ['#8682f2', 0.3],
                        ['#f28482', 0.2],
                        ['#8682f2', 0.2],
                    ]}
                >
                    {({ remainingTime, animatedColor }) => {
                        const minutes = Math.floor(remainingTime / 60);
                        const seconds = remainingTime % 60;
                        return (<Animated.Text style={{ color: animatedColor }}>
                            {`${minutes}:${seconds}`}
                        </Animated.Text>)
                    }}
                </CountdownCircleTimer>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            //Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={globalStyles.centeredView}>
                            <View style={globalStyles.modalView}>
                                <Text>Nice! Time to take a 5 min break </Text>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {setModalVisible(!modalVisible);}}
                                >
                                    <Text style={styles.textStyle}>Okay</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
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