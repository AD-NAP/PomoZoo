import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from "@react-navigation/native";
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
      <Tab.Navigator>
        {user ? (
          <>
              <Tab.Screen name="View Zoo" component={ViewZooStack} />
              <Tab.Screen name="Home" component={TimerStack} />
              {props => <HomeScreen {...props} extraData={user} />}
              <Tab.Screen name="Todo" component={TodoStack} />
          </>
        ) : (
            <Tab.Screen name="Login" component={LoginStack} options={{ headerShown: false, tabBarVisible: false }} />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
