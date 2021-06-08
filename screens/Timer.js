import React from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { View, Text, Animated } from 'react-native';
import { globalStyles } from '../styles/global';

export default function Timer( { route } ) {
    const { cycle } = route.params; 
    return (
        <View style={globalStyles.container}>
            <Text>Timer page</Text>
            <CountdownCircleTimer
                onComplete={() => {
                    // add to database the animal 
                    return [true, 1000] // repeat animation in 1 seconds
                }}
                isPlaying
                duration={10 * cycle}
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