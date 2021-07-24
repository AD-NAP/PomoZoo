import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { firebase } from '../api/firebase';
import { Badge } from 'react-native-elements/dist/badge/Badge';

export default function ViewZoo({ route }) {
    //User data retrieved from the route.params object
    const user = route.params.user;
    //The loading status 
    const [loading, setLoading] = useState(true);
    //The data used by Flatlist to list down the animals collected by the user
    const [animals, setAnimals] = useState([]);
    //An array of objects containing the image, name and key of the animals
    const [images, setimages] = useState([
        { source: require('../assets/elephant.png'), name: "Elephant", key: "0", left: 10, top: 100 },
        { source: require('../assets/hen.png'), name: "Hen", key: "1", left: 10, top: 200 },
        { source: require('../assets/koala.png'), name: "Koala", key: "2", left: 10, top: 300 },
        { source: require('../assets/owl.png'), name: "Owl", key: "3", left: 150, top: 100 },
        { source: require('../assets/penguin.png'), name: "Penguin", key: "4", left: 150, top: 200 },
        { source: require('../assets/panda.png'), name: "Panda", key: "5", left: 150, top: 300 },
        { source: require('../assets/monkey.png'), name: "Monkey", key: "6", left: 300, top: 100 },
        { source: require('../assets/rhino.png'), name: "Rhino", key: "7", left: 300, top: 200 },
        { source: require('../assets/sloth.png'), name: "Sloth", key: "8", left: 300, top: 300 },
        { source: require('../assets/lion.png'), name: "Lion", key: "9", left: 50, top: 400 },
        { source: require('../assets/snake.png'), name: "Snake", key: "10", left: 250, top: 400 },
    ]);

    let whiteAnimal = [];

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

    // /**
    //  * 
    //  * @param {Object} item The item object that contains the animal name, image and amount collected 
    //  * @returns A component for each item in the list that displays the image, name and amount collected
    //  */
    // const Item = ({ item }) => {
    //     return (
    //         <View style={globalStyles.container} style={{ backgroundColor: "#f28482", margin: 20, borderRadius: 25 }}>
    //             <TouchableOpacity>
    //                 <Image
    //                     source={images[item.key].source}
    //                     key={item.name}
    //                     style={{
    //                         width: 100,
    //                         height: 100,
    //                         tintColor: "#fff",
    //                         position: 'relative',
    //                         left: item.left,
    //                         top: item.top,
    //                     }}
    //                     resizeMode="contain"
    //                 />
    //                 {/* <View style={{ flexDirection: "row" }}>
    //                     <View style={{ flex: 1 }}>
    //                         <Image
    //                             source={images[item.key].source}
    //                             key={item.name}
    //                             style={{
    //                                 margin: 10,
    //                                 width: 100,
    //                                 height: 100,
    //                                 borderRadius: 50,
    //                                 backgroundColor: "#000",
    //                                 tintColor: "#fff"
    //                             }}
    //                         />
    //                     </View>
    //                     <View style={{ flex: 2, justifyContent: 'center', }}>
    //                         <Text style={{ fontSize: 30, textTransform: 'uppercase' }}>{item.name}:  {item.num}</Text>
    //                     </View>
    //                 </View> */}
    //             </TouchableOpacity>
    //         </View>

    //     )
    // };

    // /**
    //  * 
    //  * @param {Object} item The object that is passed as data from Flatlist.
    //  * @returns The Item component defined previously.
    //  */
    // const renderItem = ({ item }) => {
    //     return (
    //         <Item item={item} />
    //     );
    // };

    const Animal = ({ images }) => {
        for (let i = 0; i < images.length; i++) {
            let match = animals.find(a => a.name == images[i].name)
            if (match != undefined) {
                whiteAnimal.push(
                    // <TouchableOpacity onPress={() => showNumber(images[i])}>
                    <View> 
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 13,
                            height: 25,
                            width: 25,
                            backgroundColor: '#f28482',
                            color: 'white',
                            position: 'absolute',
                            borderWidth: 2,
                            borderColor: 'black',
                            overflow: 'hidden',
                            borderRadius: 5,
                            left: images[i].left + 100,
                            top: images[i].top,
                        }}>{match.num}</Text>
                        <Image
                            key={i}
                            source={images[i].source}
                            style={{
                                width: 100,
                                height: 100,
                                position: 'absolute',
                                left: images[i].left,
                                top: images[i].top,
                            }}
                        />
                    </View>
                    // </TouchableOpacity>
                )
            } else {
                whiteAnimal.push(
                    <Image
                        key={i}
                        source={images[i].source}
                        style={{
                            width: 100,
                            height: 100,
                            tintColor: "#fff",
                            position: 'absolute',
                            left: images[i].left,
                            top: images[i].top,
                        }}
                    />
                )
            }
        }
        return (
            whiteAnimal
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", height: "100%", width: "100%" }}>
            <Image style={styles.background} source={require('../assets/ViewZooBG.png')} />
            <Animal images={images} />
            {/* <Image
                source={images[0].source}
                //key={1}
                style={{
                    //flex: 1,
                    width: 100,
                    height: 100,
                    tintColor: "#fff",
                    position: 'relative',
                    left: 10,
                    top: 200,
                }}
                resizeMode="contain"
            /> */}
            {/* <Image
                source={images[1].source}
                //key={1}
                style={{
                    //flex: 1,
                    width: 100,
                    height: 100,
                    tintColor: "#fff",
                    position: 'relative',
                    left: 10,
                    top: 200,
                }}
                resizeMode="contain"
            />
            <Image
                source={images[2].source}
                //key={1}
                style={{
                    //flex: 1,
                    width: 100,
                    height: 100,
                    tintColor: "#fff",
                    position: 'relative',
                    left: 100,
                    top: 200,
                }}
                resizeMode="contain"
            /> */}
            {/* <FlatList
                data={animals}
                keyExtractor={item => item.name}
                renderItem={renderItem}
            /> */}
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
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
    }
});
