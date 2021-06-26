import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, View, Text, Pressable, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { CommonActions } from '@react-navigation/native';
import { ThemeProvider, Button } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import { firebase } from '../api/firebase';

export default function Home({ route, navigation }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
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
        { source: require('../assets/snake.png'), name: "Sion", key: "10" },
    ]);
    const user = route.params.user;
    const Item = ({ item, onPress, backgroundColor, borderColor, borderWidth }) => (
        <TouchableOpacity onPress={onPress} style={[globalStyles.item, backgroundColor, borderColor, borderWidth]}>
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

    const renderItem = ({ item }) => {
        //const backgroundColor = item.key === selectedId ? "#f28482" : "#8682f2";
        const backgroundColor = "#f28482"
        const borderColor = item.key === selectedId ? "#8682f2" : "#f28482";
        const borderWidth = item.key === selectedId ? 4 : 0;
        // const color = item.key === selectedId ? 'white' : 'black';

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
            // textColor={{ color }}
            />
        );
    };

    React.useEffect(() => {
        if (route.params?.animalNum) {
            const animalNum = route.params.animalNum;
            const animalName = route.params?.animalName;
            const animalKey = images.filter(animal => [animalName].includes(animal.name));
            const updateFirestore = async () => {
                const animalRef = await firebase.firestore().collection('users')
                    .doc(user.id)
                    .collection('animals')
                    .doc(animalName)

                const updateData = await animalRef.get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            animalRef.set({ num: animalNum, key: animalKey[0].key})
                        } else {
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
            updateFirestore().then(setModalVisible(!modalVisible))
        }
    }, [route.params?.animalNum]);

    const handleTimer = (num) => {
        if (selectedAnimal == null) {
            Alert.alert("Please choose an animal")
        } else {
            navigation.navigate('Timer', { cycle: num, animal: selectedAnimal })
        }
    }

    const showModal = () => {
        setModalVisible(!modalVisible);
    }

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
                <Text style={globalStyles.paragraph} onPress={handleLogout} >LOG OUT  <Text style={globalStyles.paragraph} onPress={showModal} >Show Modal</Text></Text>
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