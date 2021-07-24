import React, { useState, useEffect, useRef } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import LottieView from 'lottie-react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Animated, Modal, StyleSheet, Text, Pressable, ImageBackground, Vibration, AppState, Alert } from 'react-native';
import { ThemeProvider, Button } from 'react-native-elements';
import { BlurView } from 'expo-blur';
import { globalStyles } from '../styles/global';
import { Audio } from 'expo-av';
import { differenceInSeconds } from "date-fns";
// import * as BackgroundFetch from 'expo-background-fetch';
// import * as TaskManager from 'expo-task-manager';

// const BACKGROUND_FETCH_TASK = 'background-fetch-timer';

// // 1. Define the task by providing a name and the function that should be executed
// // Note: This needs to be called in the global scope (e.g outside of your React components)
// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
//     let i = 0
//     console.log('task defined')
//     let test = setTimeout(() => {
//         console.log(i)
//         i++;
//     }, 1000)

//     return BackgroundFetch.Result.NewData;

//     // try {
//     //     const receivedNewData = 
//     //     return receivedNewData ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData;
//     //   } catch (error) {
//     //     return BackgroundFetch.Result.Failed;
//     //   }

//     //console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
//     // Be sure to return the successful result type!
//     // return BackgroundFetch.Result.NewData;
// });

export default function Timer({ route, navigation }) {
    //Number of cycle, animal name and token variable retrieved from route.params object
    const { cycle, animal } = route.params;

    const workDur = 25;
    const breakDur = 5;
    const totalTime = (workDur + breakDur) * (cycle / 2)
    const [expoPushToken, setExpoPushToken] = useState(route.params.token);
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    //Sound variable to be played when break alert is needed
    const [sound, setSound] = React.useState();
    /**
     * useState hooks to store variables of timer key, duration of timer, 
     * breaktime duration and modal visibility.
     * Timer key is used to track the number of timer cycles to be completed 
     */
    const [timerkey, setTimerKey] = useState(cycle - 1);
    //For purposes of demo app, productivity is set to 25 seconds instead of the intended 25 mins 
    const [duration, setDuration] = useState(workDur);
    const [initialRemainingTime, setInitialRemainingTime] = useState(null);
    const [workMode, setWorkMode] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const appState = useRef(AppState.currentState);
    const [elapsed, setElapsed] = useState(0);

    // 2. Register the task at some point in your app by providing the same name, and some configuration options for how the background fetch should behave
    // Note: This does NOT need to be in the global scope and CAN be used in your React components!
    // async function registerBackgroundFetchAsync() {
    //     return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    //       minimumInterval: 60 * 15, // 15 minutes
    //       stopOnTerminate: false, // android only,
    //       startOnBoot: true, // android only
    //     });
    // }

    // 3. (Optional) Unregister tasks by specifying the task name
    // This will cancel any future background fetch calls that match the given name
    // Note: This does NOT need to be in the global scope and CAN be used in your React components!
    // async function unregisterBackgroundFetchAsync() {
    //     return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    // }

    // let workTimer = () => setTimeout(() => {
    //     console.log('work timer ended')
    //     setDuration(breakDur);
    //     setWorkMode(false);
    //     setModalVisible(!modalVisible);
    //     Vibration.vibrate();
    // }, 1000 * workDur);

    // let breakTimer = () => setTimeout(() => {
    //     if (key == 0) {
    //         navigation.navigate({
    //             name: 'Home',
    //             params: {
    //                 animalNum: cycle / 4,
    //                 animalName: animal
    //             },
    //             merge: true,
    //         })
    //     } else {
    //         console.log('break timer ended')
    //         setDuration(workDur);
    //         setWorkMode(true);
    //     }
    // }, 1000 * breakDur);

    useEffect(() => {
        AppState.addEventListener("change", handleAppStateChange);
        return () => AppState.removeEventListener("change", handleAppStateChange);
    }, []);

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            //console.log(response);
        });

        recordStartTime();

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [])

    const updateTimer = async () => {
        elapsedTime = await getElapsedTime()
        let remainingTime = totalTime - elapsedTime;
        let i = remainingTime
        let key = 0;
        let workMode = true;
        if (remainingTime <= 0) {
            navigation.navigate({
                name: 'Home',
                params: {
                    animalNum: cycle / 4,
                    animalName: animal
                },
                merge: true,
            })
        }
        if (i != totalTime) {
            if (i == breakDur) {
                workMode = false;
            } else {
                while (i > breakDur) {
                    i = i - breakDur;
                    key++;
                    if (i <= workDur) {
                        workMode = true;
                        break;
                    }
                    i = i - workDur;
                    key++
                    if (i <= breakDur) {
                        workMode = false;
                        break;
                    }
                }
            }
        } else {
            key = cycle - 1
        }

        // console.log('is it time for work: ' + workMode)
        //console.log('key: ' + (key))
        //console.log('remaining time: ' + remainingTime)
        //console.log('RT for that session: ' + i)

        if (workMode) {
            // console.log('updating to work mode')
            setDuration(workDur)
            setWorkMode(workMode)
            setInitialRemainingTime(i)
            setTimerKey(key)
        } else {
            // console.log('updating to break mode')
            setDuration(breakDur)
            setWorkMode(workMode)
            setInitialRemainingTime(i)
            setTimerKey(key)
        }

    }

    const handleAppStateChange = async (nextAppState) => {
        if (appState.current.match(/inactive|background/) &&
            nextAppState === "active") {
            // We just became active again: recalculate elapsed time based 
            // on what we stored in AsyncStorage when we started.
            const elapsedTime = await getElapsedTime();
            // Update the elapsed seconds state
            setElapsed(elapsedTime);
        }
        appState.current = nextAppState;
    };

    useEffect(() => {
        //console.log('elapsed state: ' + elapsed)
        updateTimer();
    }, [elapsed]);

    const getElapsedTime = async () => {
        try {
            const startTime = await AsyncStorage.getItem("@start_time");
            const now = new Date();
            return differenceInSeconds(now, Date.parse(startTime));
        } catch (err) {
            // TODO: handle errors from setItem properly
            console.warn(err);
        }
    };

    const recordStartTime = async () => {
        try {
            //console.log("Timer started, setting time now")
            const now = new Date();
            await AsyncStorage.setItem("@start_time", now.toISOString());
        } catch (err) {
            // TODO: handle errors from setItem properly
            console.warn(err);
        }
    };

    // useEffect(() => {
    //     console.log('register background fetch')

    //     async function test() {
    //         await registerBackgroundFetchAsync();
    //     }
    //     test();

    //     if (appState.current.match(/active/)) {
    //         console.log('active')
    //         if (workMode) {
    //             //console.log('running work timer now')
    //             workTimer();
    //         } else {
    //             //console.log('running break timer now')
    //             breakTimer();
    //         }
    //         setKey(prevKey => prevKey - 1)
    //         //console.log(key)
    //     } else {
    //         const remainingTime = totalTime - elapsed;
    //         console.log(remainingTime);
    //     }
    // }, [workMode]);

    //Handling Notification
    Notifications.setNotificationHandler({
        handleNotification: async (notification) => {
            //console.log(notification.request.content.title)
            if (notification.request.content.title == "BEEP BEEP") {
                playWorkSound();
                Vibration.vibrate();
            } else if (notification.request.content.title == "Time for a break!") {
                playBreakSound();
                setModalVisible(true);
                Vibration.vibrate();
            } else {

            }
            return ({
                shouldShowAlert: false,
                shouldPlaySound: false,
                shouldSetBadge: false,
            })
        }
    });

    // async function schedulePushNotification() {
    //     await Notifications.scheduleNotificationAsync({
    //         content: {
    //             title: "BEEP BEEP",
    //             body: 'Take a 5 min break',
    //             //data: { data: 'goes here' },
    //         },
    //         trigger: { seconds: workDur },
    //     });
    // }

    async function scheduleNotificationForBreak(delay) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Time for a break!",
                body: 'Relax for 5 mins',
                vibrate: true,
                sound: 'default',
                ios: { sound: true },
                //data: { data: 'goes here' },
            },
            trigger: { seconds: workDur + delay },
        });
    }

    async function scheduleNotificationForWork(delay) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "BEEP BEEP",
                body: 'Get back to work',
                sound: 'default',
                ios: { sound: true },
                //data: { data: 'goes here' },
            },
            trigger: { seconds: workDur + breakDur + delay },
        });
    }

    async function scheduleNotificationForReward(delay) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "NICE",
                body: 'Tap here to receive your reward!',
                sound: 'default',
                ios: { sound: true },
                //data: { data: 'goes here' },
            },
            trigger: { seconds: ((workDur + breakDur) * delay) },
        });
    } 

    async function scheduleAllPushNotification() {
        let repeater = (cycle/2) - 1
        const delay = workDur + breakDur
        for (repeater; repeater >= 0; repeater--) {
            await scheduleNotificationForBreak(delay * repeater)
            if (repeater != 0) {
                await scheduleNotificationForWork(delay * (repeater - 1))
            } else {
                await scheduleNotificationForReward(cycle/2)
            }
        }
    }

    useEffect(() => {
        scheduleAllPushNotification()
    }, [])

    // async function sendPushNotification() {
    //     const message = {
    //         to: expoPushToken,
    //         sound: 'default',
    //         title: 'BEEP BEEP',
    //         body: '5 min break!',
    //         ios: { sound: true },
    //         //data: { someData: 'goes here' },
    //     };

    //     await fetch('https://exp.host/--/api/v2/push/send', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Accept-encoding': 'gzip, deflate',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(message),
    //     });
    // }

    async function playBreakSound() {
        // console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/breakTime.mp3')
        );
        setSound(sound);

        // console.log('Playing Sound');
        await sound.playAsync();
    }

    async function playWorkSound() {
        // console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/workTime.mp3')
        );
        setSound(sound);

        // console.log('Playing Sound');
        await sound.playAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                // console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);


    useEffect(() => {
        //Code added to allow the modal to disappear after 1.5 seconds if user does not interact with it
        if (modalVisible == true) {
            setTimeout(() => setModalVisible(false), 1500);
        }
    }, [modalVisible]);

    const createTwoButtonAlert = () =>
        Alert.alert(
            "Are you sure?",
            "You will not be awarded the animal if you return to home",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => {
                    Notifications.cancelAllScheduledNotificationsAsync()
                    navigation.navigate('Home')
                }}
            ]
        );

    return (
        <View style={globalStyles.container}>
            <ImageBackground source={require('../assets/timerBg.gif')} style={styles.image}>
            <BlurView intensity={90} style={[StyleSheet.absoluteFill]}>
                <View style={globalStyles.innerTimer}>
                <Text style={{fontSize: 20, textAlign: 'center', margin: 20,}}>{workMode ? 'FOCUS MODE' : 'Break Time!'}</Text>
                    <CountdownCircleTimer
                        key={timerkey} 
                        onComplete={
                            () => {
                                setInitialRemainingTime(null)
                                updateTimer();
                                // if (key == 0) {
                                //     navigation.navigate({
                                //         name: 'Home',
                                //         params: {
                                //             animalNum: cycle / 4,
                                //             animalName: animal
                                //         },
                                //         merge: true,
                                //     })
                                // } else {
                                //     updateTimer();
                                // }
                                // Alternate between break time and productivity 
                                //     setWorkMode(workMode ? false : true)
                                //     if (!workMode) {
                                //         //playSound();
                                //         //sendPushNotification();
                                //         setModalVisible(!modalVisible);
                                //         Vibration.vibrate();
                                //         setDuration(breakDur); //For purposes of demo app, break time is set to 5 seconds instead of the intended 5 mins
                                //     } else {
                                //         setDuration(workDur); //For purposes of demo app, productivity is set to 25 seconds instead of the intended 25 mins 
                                //     }
                                //     setKey(prevKey => prevKey - 1)
                                //     //After the number of cycles is completed, navigate back home 
                                //     //with the animal name and number of animal to be rewarded
                                //     if (key == 0) {
                                //         navigation.navigate({
                                //             name: 'Home',
                                //             params: {
                                //                 animalNum: cycle / 4,
                                //                 animalName: animal
                                //             },
                                //             merge: true,
                                //         })
                                //     }
                            }
                        }
                        isPlaying
                        duration={duration}
                        initialRemainingTime={initialRemainingTime}
                        colors={[
                            ['#f28482', 1],
                            // ['#8682f2', 0.3],
                            // ['#f28482', 0.2],
                            // ['#8682f2', 0.2],
                        ]}
                    >
                        {({ remainingTime }) => {
                            const minutes = Math.floor(remainingTime / 60);
                            const seconds = remainingTime % 60;
                            return (
                                <View>
                                <Animated.Text style={{ color: '#fff', fontSize: 45, alignSelf: 'center' }}>
                                    {`${minutes}:${seconds}`}
                                </Animated.Text>
                                </View>
                            )
                        }}
                    </CountdownCircleTimer>
                    <ThemeProvider theme={theme}>
                        <Button title="Home" onPress={createTwoButtonAlert} />
                    </ThemeProvider>
                    <View style={styles.centeredView}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(false);
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
                                            onPress={() => { setModalVisible(false); }}
                                        >
                                            <Text style={styles.textStyle}>Okay</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
                </BlurView>
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
    nonBlurredContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const theme = {
    Button: {
        raised: true,
        containerStyle: {
            margin: 10,
        },
        buttonStyle: {
            backgroundColor: '#f28482',
            height: 48,
        }
    },
};