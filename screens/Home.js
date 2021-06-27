import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, View, Text, Pressable, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { CommonActions } from '@react-navigation/native';
import { ThemeProvider, Button } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import { firebase } from '../api/firebase';

export default function Home({ route, navigation }) {
    //Boolean for visibility of modal
    const [modalVisible, setModalVisible] = useState(false);
    //The id of the animal selected
    const [selectedId, setSelectedId] = useState(null);
    //The name of the animal selected
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    //An array of objects containing the image, name and key of the animals
    const [images, setimages] = useState([
        { source: require('../assets/elephant.png'), name: "Elephant", key: "0" },
        { source: require('../assets/hen.png'), name: "Hen", key: "1" },
        { source: require('../assets/koala.png'), name: "Koala", key: "2" },
        { source: require('../assets/owl.png'), name: "Owl", key: "3" },
        { source: require('../assets/penguin.png'), name: "Penguin", key: "4" },
        { source: require('../assets/panda.png'), name: "Panda", key: "5" },
        { source: require('../assets/monkey.png'), name: "Monkey", key: "6" },
        { source: require('../assets/rhino.png'), name: "Rhino", key: "7" },
        { source: require('../assets/sloth.png'), name: "Sloth", key: "8" },
        { source: require('../assets/lion.png'), name: "Lion", key: "9" },
        { source: require('../assets/snake.png'), name: "Snake", key: "10" },
    ]);
    
    //User data retrieved from the route.params object
    const user = route.params.user;

    /**
     * 
     * @param {Object} item The object that contains the data of each item.
     * @param {Function} onPress The function to handle when the item is pressed.
     * @param {String} backgroundColor The string that contains the color of the background.
     * @param {String} borderColor The string that contains the color of the border. Pink by default, purple if item is selected.
     * @param {Number} borderWidth The number that defines the border width. 0 by default, 4 if item is selected.
     * @returns 
     */
    const Item = ({ item, onPress, backgroundColor, borderColor, borderWidth }) => (
        <TouchableOpacity onPress={onPress} activeOpacity={1} style={[globalStyles.item, backgroundColor, borderColor, borderWidth]}>
            <Image source={item.source}
                key={item.key}
                style={{
                    alignContent: 'center',
                    justifyContent: 'center',
                    width: 100,
                    height: 100,
                }}
            />
            {/* <Text style={[globalStyles.item, textColor]}>{item.name}</Text> */}
        </TouchableOpacity>
    );

    /**
     * Function to render each Item from the Flatlist to have a border when the item is selected.
     * @param {Object} item The object that is passed as data from Flatlist
     * @returns The Item component defined previously.
     */
    const renderItem = ({ item }) => {
        const backgroundColor = "#f28482"
        const borderColor = item.key === selectedId ? "#8682f2" : "#f28482";
        const borderWidth = item.key === selectedId ? 4 : 0;

        return (
            <Item
                item={item}
                onPress={() => {
                    setSelectedId(item.key);
                    setSelectedAnimal(item.name);
                }}
                backgroundColor={{backgroundColor}}
                borderColor={{borderColor}}
                borderWidth={{borderWidth}}
            />
        );
    };

    React.useEffect(() => {
        /*
        Check if parameter of animalNum has been updated upon component mounting. The variable animalNum
        will only be updated upon timer completion from the timer screen. Hence it will only run the following
        codes if the timer is completed.
        */
        if (route.params?.animalNum) {
            const animalNum = route.params.animalNum; //Get the number of animals to be rewarded
            const animalName = route.params?.animalName; //Get the name of the animal selected previously 
            const animalKey = images.filter(animal => [animalName].includes(animal.name)); //Get the key of the animal by filtering with the animal name

            // Function to update the data into Firestore database
            const updateFirestore = async () => { 
                const animalRef = await firebase.firestore().collection('users') //Reference of the users collection
                    .doc(user.id)
                    .collection('animals')
                    .doc(animalName)

                //Update the number of animal in the firestore 
                const updateData = await animalRef.get() 
                    .then(firestoreDocument => {
                        //If the animal document does not exist, then create a new document with the animal name and data 
                        //This allows adding more animals in the future without changing the codes 
                        if (!firestoreDocument.exists) {
                            animalRef.set({ num: animalNum, key: animalKey[0].key})
                        } else {
                            //If animal document already exist, then run transaction to increment the number of animals accordingly 
                            firebase.firestore().runTransaction(async transaction => {
                                const postSnapshot = await transaction.get(animalRef);

                                if (!postSnapshot.exists) {
                                    throw 'Post does not exist!';
                                }
                                else {
                                    transaction.update(animalRef, {
                                        num: postSnapshot.data().num + animalNum,
                                    })
                                }
                            });
                        }
                    })
                    .catch(error => {
                        Alert.alert(error)
                    });


            }
            //Run the updateFirestore function and then show the user the modal 
            updateFirestore().then(setModalVisible(!modalVisible))
        }
    }, [route.params?.animalNum]);

    /*
    Function to handle the onPress of the timer buttons. Navigate to timer page 
    with the number of cycles of timer and the animal selected. If user has yet to 
    select any animal, alert the user to do so without navigating. 
    */
    const handleTimer = (num) => {
        if (selectedAnimal == null) {
            Alert.alert("Please choose an animal")
        } else {
            navigation.navigate('Timer', { cycle: num, animal: selectedAnimal })
        }
    }

    /*
    Function to handle the log out process when the logout button is pressed.  
    */
    const handleLogout = async () => {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={globalStyles.container}>
                <View style={globalStyles.animalContainer}>
                    <FlatList
                        numColumns={3}
                        data={images}
                        renderItem={renderItem}
                    />
                </View>
            </View>
            <View style={globalStyles.container}>
                <ThemeProvider theme={theme}>
                    <Button title="1 hour" onPress={() => handleTimer(4)}/>
                    <Button title="2 hours" onPress={() => handleTimer(8)} />
                    <Button title="3 hours" onPress={() => handleTimer(12)} />
                    <Button title="Log out" onPress={handleLogout} buttonStyle={{backgroundColor: '#8682f2'}}/>
                </ThemeProvider>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={globalStyles.centeredView}>
                            <View style={globalStyles.modalView}>
                                <View style={{ flex: 5 }}>
                                    <Text style={{ alignSelf: "center" }}>Congratulations!</Text>
                                    <Text>You are awarded with {route.params?.animalNum} {route.params?.animalName}</Text>
                                    <LottieView
                                        source={require('../assets/award.json')}
                                        autoPlay
                                        loop
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={() => {
                                            setModalVisible(!modalVisible);
                                            navigation.dispatch(CommonActions.setParams({ animalName: undefined, animalNum: undefined }));
                                        }}
                                    >
                                        <Text style={styles.textStyle}>Okay</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "#f28482",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

const theme = {
    Button: {
        raised: true,
        containerStyle: {
            margin: 20,
        },
        buttonStyle: {
            backgroundColor: '#f28482',
            height: 48,
        }
    },
};