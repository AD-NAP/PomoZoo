import React from 'react';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import TimerStack from "./TimerStack";
import ViewZooStack from "./ViewZooStack";
import TodoStack from "./TodoStack";
import LoginStack from "./LoginStack";


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Tab.Navigator>
        <Tab.Screen name="Login" component={LoginStack} />
          <Tab.Screen name="Home" component={TimerStack} />
          <Tab.Screen name="View Zoo" component={ViewZooStack} />
          <Tab.Screen name="Todo" component={TodoStack} />
        </Tab.Navigator>
    </NavigationContainer>
  );
}
