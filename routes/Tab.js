import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import TimerStack from "./TimerStack";
import ViewZooStack from "./ViewZooStack";
import TodoStack from "./TodoStack";
import LoginStack from "./LoginStack";
import { firebase } from '../api/firebase';
import { decode, encode } from 'base-64';

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null) //Information of users will be stored in user

  if (loading) {
    return (
      <></>
    )
  }

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users'); //Reference to the users collection in firestore

    //Checks if there is any auth state change (Sign in and out)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //User is signed in, hence save the information of the user 
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        //User is signed out, hence reset the information stored to null 
        setLoading(false);
        setUser(null);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      {/* Checks if user is signed in, if true, show the Tab Navigation that includes Home, Todo and View Zoo stacks.
      If not, show the Stack Navigation that includes Signup and Login stacks*/}
        {user ? (
          <Tab.Navigator screenOptions={({ route }) => ({
            //Checks which page is in focused and style the tabBarIcon accordingly 
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'ios-stopwatch' : 'ios-stopwatch-outline';
              } else if (route.name === 'Todo') {
                iconName = focused ? 'ios-reader' : 'ios-reader-outline';
              } else if (route.name === 'View Zoo') {
                iconName = focused ? 'md-paw' : 'md-paw-outline';
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: '#f28482',
            inactiveTintColor: 'gray',
          }}
          initialRouteName="Home"
          >
          <>
            <Tab.Screen name="Todo" component={TodoStack} />
            <Tab.Screen name="Home" component={TimerStack} initialParams={{user: user}}/>
            <Tab.Screen name="View Zoo" component={ViewZooStack} initialParams={{user: user}}/>
          </>
          </Tab.Navigator>
        ) : (
          <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginStack} options={{headerShown: false}} />
          </Stack.Navigator>
        )}
      
    </NavigationContainer>
  );
}