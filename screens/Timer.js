import React, { useState, useEffect } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import LottieView from 'lottie-react-native';
import { View, Animated, Modal, StyleSheet, Text, Pressable, ImageBackground } from 'react-native';
import { globalStyles } from '../styles/global';

export default function Timer({ route, navigation }) {
    //Number of cycle and animal name variable retrieved from route.params object
    const { cycle, animal } = route.params;
    /**
     * useState hooks to store variables of timer key, duration of timer, 
     * breaktime duration and modal visibility.
     * Timer key is used to track the number of timer cycles to be completed 
     */
    const [key, setKey] = useState(cycle - 1);
    //For purposes of demo app, productivity is set to 25 seconds instead of the intended 25 mins 
    const [duration, setDuration] = useState(25);
    const [breakTime, setBreakTime] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const image = { uri: "https://i1.wp.com/windowscustomization.com/wp-content/uploads/2020/06/Vector-Mountain-4K.gif?fit=768%2C432&quality=80&strip=all&ssl=1" };



    useEffect(() => {
        //Code added to allow the modal to disappear after 2 seconds if user does not interact with it
        if (modalVisible == true) {
            setTimeout(() => setModalVisible(false), 2000);
        }
    }, [modalVisible]);

    return (
        <View style={globalStyles.container}>
            <ImageBackground source={image} style={styles.image}>
                <View style={globalStyles.innerTimer}>
                    <CountdownCircleTimer
                        key={key}
                        onComplete={
                            () => {
                                //Alternate between break time and productivity 
                                setBreakTime(breakTime ? false : true)
                                if (breakTime) {
                                    setModalVisible(!modalVisible);
                                    setDuration(5); //For purposes of demo app, break time is set to 5 seconds instead of the intended 5 mins
                                } else {
                                    setDuration(25); //For purposes of demo app, productivity is set to 25 seconds instead of the intended 25 mins 
                                }
                                setKey(prevKey => prevKey - 1)
                                //After the number of cycles is completed, navigate back home 
                                //with the animal name and number of animal to be rewarded
                                if (key == 0) {
                                    navigation.navigate({
                                        name: 'Home',
                                        params: {
                                            animalNum: cycle / 4,
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
                            return (<Animated.Text style={{ color: 'black', fontSize:20 }}>
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
            </ImageBackground>
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
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
});