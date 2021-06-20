import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, View, Text, Pressable, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { ThemeProvider, Button } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import { firebase } from '../api/firebase';

export default function Home({ route, navigation }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedAnimal, setSelectedAnimal] = useState(null);

    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[globalStyles.item, backgroundColor]}>
            <Image source={item.source}
                key={item.key}
                style={{
                    width: 120,
                    height: 120,
                    borderWidth: 2,
                    borderColor: '#d35647',
                }}
            />
            {/* <Text style={[globalStyles.item, textColor]}>{item.name}</Text> */}
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => {
        const backgroundColor = item.key === selectedId ? "#f28482" : "#8682f2";
        // const color = item.key === selectedId ? 'white' : 'black';

        return (
            <Item
                item={item}
                onPress={() => {
                    setSelectedId(item.key);
                    setSelectedAnimal(item.name);
                }}
                backgroundColor={{ backgroundColor }}
                // textColor={{ color }}
            />
        );
    };

    const [images, setimages] = useState([
        { source: require('../assets/elephant.png'), name: "Elephant", key: "1" },
        { source: require('../assets/hen.png'), name: "Hen", key: "2" },
        { source: require('../assets/koala.png'), name: "Koala", key: "3" },
        { source: require('../assets/owl.png'), name: "Owl", key: "4" },
        { source: require('../assets/penguin.png'), name: "Penguin", key: "5" },
    ]);

    React.useEffect(() => {
        if (route.params?.animalReward) {
            
            setModalVisible(!modalVisible)
        }
    }, [route.params?.animalReward]);

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

    const theme = {
        Button: {
            raised: true,
            containerStyle: {
                margin: 20,
            },
            buttonStyle: {
                backgroundColor: '#8682f2',
                height: 48,
            }
        },
    };

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
                    <Button title="1 hour" onPress={() => navigation.navigate('Timer', { cycle: 4, animal: selectedAnimal })} />
                    <Button title="2 hours" onPress={() => navigation.navigate('Timer', { cycle: 8, animal: selectedAnimal })} />
                    <Button title="3 hours" onPress={() => navigation.navigate('Timer', { cycle: 12, animal: selectedAnimal })} />
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
                                <Text>Congratulations! You are awarded with {route.params?.animalReward} </Text>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        navigation.dispatch(CommonActions.setParams({ animalReward: undefined }));
                                    }}
                                >
                                    <Text style={styles.textStyle}>Okay</Text>
                                </Pressable>
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
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
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