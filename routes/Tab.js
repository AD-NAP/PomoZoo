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
  const [user, setUser] = useState(null)

  if (loading) {
    return (
      <></>
    )
  }

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
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
        setLoading(false);
        setUser(null);
      }
    });
  }, []);

  return (
    <NavigationContainer>
        {user ? (
          <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Home') {
                iconName = focused ? 'ios-stopwatch' : 'ios-stopwatch-outline';
              } else if (route.name === 'Todo') {
                iconName = focused ? 'ios-reader' : 'ios-reader-outline';
              } else if (route.name === 'View Zoo') {
                iconName = focused ? 'md-paw' : 'md-paw-outline';
              }
  
              // You can return any component that you like here!
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
//options={{ tabBarVisible: false }}