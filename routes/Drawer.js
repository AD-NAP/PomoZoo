import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import TimerStack from "./TimerStack";
import ViewZooStack from "./ViewZooStack";
import TodoStack from "./TodoStack";
import LoginStack from "./LoginStack";
import { createStackNavigator } from "@react-navigation/stack";

const RootDrawerNavigator = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootDrawerNavigator.Navigator>
        <RootDrawerNavigator.Screen name="Login" component={LoginStack} options={{
          drawerLabel: () => null,
          title: null,
          drawerIcon: () => null
        }} />
        <RootDrawerNavigator.Screen name="Home" component={TimerStack} />
        <RootDrawerNavigator.Screen name="View Zoo" component={ViewZooStack} />
        <RootDrawerNavigator.Screen name="Todo" component={TodoStack} />
      </RootDrawerNavigator.Navigator>
    </NavigationContainer>
  );
}