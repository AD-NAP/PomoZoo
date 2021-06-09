import React, { useState } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { View, Text, Animated } from 'react-native';
import { globalStyles } from '../styles/global';

export default function Timer({ route, navigation }) {
    const { cycle } = route.params;
    const [key, setKey] = useState(cycle - 1);
    const [duration, setDuration] = useState(5);
    const [breakTime, setBreakTime] = useState(true);
    return (
        <View style={globalStyles.container}>
            <Text>Timer page</Text>
            <CountdownCircleTimer
                key={key}
                onComplete={
                    () => {
                        setBreakTime(breakTime ? false : true)
                        if (breakTime) {
                            setDuration(1);
                        } else {
                            setDuration(5);
                        }
                        setKey(prevKey => prevKey - 1)
                        if (key == 0) {
                            navigation.navigate({
                                name: 'Home',
                                params: { animalReward: cycle/4 + " Chicken" },
                                merge: true,
                            })
                        }
                    }
                }
                isPlaying
                duration={duration}
                colors={[
                    ['#004777', 0.4],
                    ['#F7B801', 0.4],
                    ['#A30000', 0.2],
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
        </View>
    )
}