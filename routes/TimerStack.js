import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from '../screens/Home';
import Timer from '../screens/Timer';
import { firebase } from '../api/firebase';

const handleLogout = async () => {
  try {
      await firebase.auth().signOut();
  } catch (error) {
      console.log(error);
  }
}

/**
 * A stack for the home page and timer page.
 * 
 * Both are placed in a stack so that they can be navigated back and forth after
 * the user selects the timer or after the timer is completed. 
 */
const { Navigator, Screen } = createStackNavigator();

/**
 * Timer stack that will be exported in Tab.js
 * @param {Object} route The route param from react-navigation 
 * that allows to store paramaters in route.params. In this case
 * the object user is stored so that the Home screen can access the user's data. 
 * @returns The stack that includes the Home and Timer screens. 
 */
 const TimerStack = ({ route }) => {
  return (
  <Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#8682f2',
      },
      headerTintColor: '#fff',
      headerLeft: null,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      navigationOptions: {
        swipeEnabled: false,
      },

    }}>
      <Screen 
      name="Home" 
      component={Home} 
      initialParams={{user: route.params.user}}
      options={{
        headerRight: () => (
          <ThemeProvider theme={pomoTheme}>
            <Button
              onPress={() => handleLogout()}
              type="clear"
              icon={
                <Icon
                  name="exit-outline"
                  size={30}
                  color="white"
                />
              }
            />
          </ThemeProvider>
        ),
      }} />
      <Screen
      name="Timer" 
      component={Timer}
      options={{gestureEnabled: false}} />
  </Navigator>
)};
export default TimerStack;

const pomoTheme = {
  Button: {
    buttonStyle: {
      backgroundColor: "#8682f2",
    },
    containerStyle: {
      marginRight: 10,
    }
  },
};