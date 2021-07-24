import React from 'react';
import { ThemeProvider, Button } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewZoo from '../screens/ViewZoo';
import FriendList from '../screens/FriendList';
import ViewZooFriend from '../screens/ViewZooFriend';

const { Navigator, Screen } = createStackNavigator();

/**
 * A stack for the View Zoo screen. 
 * 
 * Placed in a stack so that each component in the Tab Navigation are stack components. 
 * @param {Object} route The route param from react-navigation 
 * that allows to store paramaters in route.params. In this case
 * the object user is stored so that the ViewZoo screen can access the user's data. 
 * @returns The stack that has the ViewZoo screen. 
 */
const ViewZooStack = ({ route, navigation }) => (
  <Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#8682f2',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }} >
    <Screen
      name="View Zoo"
      component={ViewZoo}
      initialParams={{ user: route.params.user }}
      options={{
        headerRight: () => (
          <ThemeProvider theme={pomoTheme}>
            <Button
              onPress={() => navigation.navigate("FriendList")}
              //title="Info"
              type="clear"
              icon={
                <Icon
                  name="person-circle-outline"
                  size={30}
                  color="white"
                />
              }
            />
          </ThemeProvider>
        ),
      }} />
      <Screen name="FriendList" component={FriendList} initialParams={{ user: route.params.user }}/>
      <Screen name="ViewZooFriend" component={ViewZooFriend} options={{ title: "Friend's Zoo" }}/>
  </Navigator>
);

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

export default ViewZooStack;

