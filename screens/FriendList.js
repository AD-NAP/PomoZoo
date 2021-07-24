import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, TouchableWithoutFeedback, Keyboard, Text, Modal, SafeAreaView, Pressable, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider, Button, Input, ListItem } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import { firebase } from '../api/firebase';


export default function FriendList({ route, navigation }) {
    const [emailText, setEmailText] = useState('');
    // const [emailExist, setEmailExist] = useState(false);
    // const [friendId, setFriendId] = useState('');
    // const [friendName, setFriendName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const user = route.params.user;
    const [friends, setFriends] = useState([]);
    const usersRef = firebase.firestore().collection('users')
    const friendsRef = firebase.firestore().collection('users').doc(user.id).collection('friends')

    // useEffect(() => {
    //     const subscriber = friendsRef.onSnapshot((documents) => {
    //         const friendsList = [];
    //         documents.forEach(documentData => {
    //             friendsList.push({
    //                 ...documentData.data(),
    //                 friendStreak: 2
    //             })
    //         })
    //         setFriends(friendsList);
    //     })
    //     return () => subscriber()
    // }, []);


    // useEffect(() => {
    //     const subscriber = friendsRef.onSnapshot((documents) => {
    //         const friendsList = [];
    //         const friendsListStreak = [];
    //         documents.forEach(documentData => {
    //                     friendsList.push({
    //                         ...documentData.data(),
    //             })
    //         })

    //         friendsList.forEach(friend => {
    //             usersRef.doc(friend.friendId).get().then(doc => {
    //                 let friendStreak = doc.data().streak

    //                 if (friendStreak != undefined) {
    //                     friendsListStreak.push({
    //                         ...friend,
    //                         friendStreak: friendStreak
    //                     })
    //                 } else {
    //                     friendsListStreak.push({
    //                         ...friend,
    //                         friendStreak: 0
    //                     })
    //                 }
    //             })
    //         })
    //         setFriends(friendsListStreak);
    //     })
    //     return () => subscriber()
    // }, []);

    useEffect(() => {
        const subscriber = friendsRef.onSnapshot((documents) => {
            const friendsList = [];
            let streakNum;
            documents.forEach(documentData => {
                firebase.firestore().collection('users').doc(documentData.data().friendId).get().then(doc => {
                    streakNum = doc.data().streak;
                    if (streakNum != undefined) {
                        friendsList.push({
                            ...documentData.data(),
                            friendStreak: streakNum
                        })
                    } else {
                        friendsList.push({
                            ...documentData.data(),
                            friendStreak: 0
                        })
                    }
                })
            })
            setFriends(friendsList);
        })
        return () => subscriber()
    }, []);

    // useEffect(() => {
    //     console.log(friends)
    //     console.log('hi')
    // }, [friends])

    const addFriend = async () => {
        let emailExist = false;
        let friendId = '';
        let friendName = '';
        let friendEmail = '';
        //check if email exist
        if (user.email == emailText) {
            alert("Are you trying to add yourself?")
            return
        }
        await usersRef.get().then(querySnapshot => {
            querySnapshot.forEach(document => {
                if (document.data().email == emailText) {
                    emailExist = true;
                    friendId = document.data().id;
                    friendName = document.data().fullName;
                    friendEmail = document.data().email
                }
            })
        })
        //if exist, add friend 
        if (emailExist) {
            if (friends.length !== 0 && friends.filter((friendObj) => friendObj.friendEmail === emailText).length !== 0) {
                alert('User already added! :)')
                return
            } else {
                friendsRef.add({
                    friendId: friendId,
                    friendName: friendName,
                    friendEmail: friendEmail
                })
                setModalVisible(!modalVisible)
            }
        } else {
            alert('user does not exist')
        }
    }

    const pressHandler = (friendId) => {
        navigation.navigate("ViewZooFriend", { friend: friendId });
    }

    const renderItem = ({ item }) => {
        // console.log(item)
        if (item.friendStreak != 0) {
            return (
                <TouchableOpacity onPress={() => pressHandler(item.friendId)}>
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title>{item.friendName} - 🔥{item.friendStreak}🔥</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => pressHandler(item.friendId)}>
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title>{item.friendName} - 💤</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                </TouchableOpacity>
            )
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.content}>
                <View style={globalStyles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <View style={globalStyles.centeredView}>
                                <View style={globalStyles.modalView}>
                                    <ThemeProvider theme={pomoTheme}>
                                        <View style={{ flex: 2 }}>
                                            <Text style={{ alignSelf: "center", marginBottom: 30 }}>Add a friend through email!</Text>
                                            <Input
                                                onChangeText={val => setEmailText(val)}
                                                autoCapitalize="none"
                                                leftIcon={
                                                    <Icon
                                                        name='mail'
                                                        size={25}
                                                        color='#f28482'
                                                    />
                                                }
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flex: 1, flexDirection: "row" }}>
                                                <Pressable
                                                    style={styles.cancel}
                                                    onPress={() => setModalVisible(!modalVisible)}
                                                >
                                                    <Text style={styles.textStyle}>Cancel</Text>
                                                </Pressable>
                                                <Pressable
                                                    style={styles.button}
                                                    onPress={addFriend}
                                                >
                                                    <Text style={styles.textStyle}>Add Friend!</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </ThemeProvider>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
                <View style={styles.list}>
                    <FlatList
                        data={friends}
                        keyExtractor={item => item.friendId}
                        renderItem={renderItem}
                    />
                </View>
                <View>
                    <ThemeProvider theme={pomoTheme}>
                        <Button title="Add Friend" onPress={() => { setModalVisible(!modalVisible) }} />
                    </ThemeProvider>
                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
    list: {
        marginTop: 20,
    },
    header: {
        height: 80,
        paddingTop: 38,
        backgroundColor: 'coral',
    },
    title: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    item: {
        padding: 16,
        marginTop: 16,
        borderColor: '#bbb',
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 1,
        borderRadius: 10,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "#f28482",
        margin: 20,
    },
    cancel: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "#8682f2",
        margin: 20,
    },
});

const pomoTheme = {
    Input: {
        containerStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
        },
    },
    Image: {
        containerStyle: {
            alignSelf: "center",
            width: 200,
            height: 200,
            marginBottom: 30,
        },
    },
    Button: {
        raised: true,
        containerStyle: {
            marginTop: 40,
            margin: 10,
        },
        buttonStyle: {
            backgroundColor: '#f28482',
            height: 48,
        }
    },
};