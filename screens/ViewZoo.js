import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { globalStyles } from '../styles/global';
import { firebase } from '../api/firebase';

export default function ViewZoo({ route }) {
    //User data retrieved from the route.params object
    const user = route.params.user;
    //The loading status 
    const [loading, setLoading] = useState(true);
    //The data used by Flatlist to list down the animals collected by the user
    const [animals, setAnimals] = useState([]);
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
    
    /** 
     * Upon component mount, get the collections of animals tied to the current user and push
     * the data into an array which will be stored in the useState of animals variable. 
     */
    useEffect(() => {
        return firebase.firestore().collection('users')
            .doc(user.id)
            .collection('animals')
            .onSnapshot(animalsSnapshot => {
                const result = [];

                animalsSnapshot.forEach(animalDoc => {
                    result.push({
                        num: animalDoc.data().num,
                        key: animalDoc.data().key,
                        name: animalDoc.id,
                    });
                });

                setAnimals(result);
                setLoading(false);
            })
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }

    /**
     * 
     * @param {Object} item The item object that contains the animal name, image and amount collected 
     * @returns A component for each item in the list that displays the image, name and amount collected
     */
    const Item = ({ item }) => {
        return (
            <View style={globalStyles.container} style={{ backgroundColor: "#f28482", margin: 20 }}>
                <TouchableOpacity>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                            <Image
                                source={images[item.key].source}
                                key={item.name}
                                style={{
                                    margin: 10,
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                    backgroundColor: "#fff"
                                }}
                            />
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center', }}>
                            <Text style={{ fontSize: 30, textTransform: 'uppercase' }}>{item.name}:  {item.num}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

        )
    };

    /**
     * 
     * @param {Object} item The object that is passed as data from Flatlist.
     * @returns The Item component defined previously.
     */
    const renderItem = ({ item }) => {
        return (
            <Item item={item} />
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", height: "100%", width: "100%"}}>
            <FlatList
                data={animals}
                keyExtractor={item => item.name}
                renderItem={renderItem}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 40,
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
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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
});
