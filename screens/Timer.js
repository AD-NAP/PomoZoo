import React, { useState, useEffect } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import LottieView from 'lottie-react-native';
import { View, Animated, Modal, StyleSheet, Text, Pressable } from 'react-native';
import { globalStyles } from '../styles/global';

export default function Timer({ route, navigation }) {
    const { cycle, animal } = route.params;
    const [key, setKey] = useState(cycle - 1);
    const [duration, setDuration] = useState(5); // 10
    const [breakTime, setBreakTime] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (modalVisible == true) {
            setTimeout(() => setModalVisible(false), 2000);
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
                                setDuration(3);
                            } else {
                                setDuration(5);
                            }
                            setKey(prevKey => prevKey - 1)
                            if (key == 0) {
                                navigation.navigate({
                                    name: 'Home',
                                    params: {
                                        animalNum: cycle/4,
                                        animalName: animal
                                    },
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
                                <View style={{ flex: 5 }}>
                                    <Text style={{ alignSelf: "center" }}>Nice! Time to take a 5 min break</Text>
                                    <LottieView
                                        source={require('../assets/break.json')}
                                        autoPlay
                                        loop
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Pressable
                                        style={[styles.button]}
                                        onPress={() => { setModalVisible(!modalVisible); }}
                                    >
                                        <Text style={styles.textStyle}>Okay</Text>
                                    </Pressable>
                                </View>
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
        elevation: 2,
        backgroundColor: "#8682f2",
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