import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, Alert, TouchableWithoutFeedback, Keyboard, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemeProvider, Button, Input } from 'react-native-elements';
import { firebase } from '../api/firebase';


export default function Todo({ route }) {
    const [text, setText] = useState('');
    const user = route.params.user;
    const changeHandler = (val) => {
        setText(val);
    };
    const [todos, setTodos] = useState([]);
    //const todoInput = useRef();

    useEffect(() => {
        return firebase.firestore().collection('users')
            .doc(user.id)
            .collection('todo')
            // .where('completed', '==', false) cannot be used due to restrictions for orderBy() clauses...
            .orderBy("time", "desc")
            .onSnapshot((documents) => {
                const todoItem = [];
                documents.forEach(documentData => {
                    if(documentData.data().completed == false) { //change the check for incompelete to here
                        todoItem.push({
                            ...documentData.data(),
                            key: documentData.id,
                        })
                    }
                })
                setTodos(todoItem);
            })
    }, []);

    const pressHandler = (key) => {
        updateFirestore(key);
    };

    const submitHandler = async (text) => {
        if (text.length > 0) {
            await writeFirestore();
            setText('');
        } else {
            Alert.alert('OOPS', 'Please type something', [
                { text: 'OK', onPress: () => console.log('alert closed') }
            ]);
        }
    };
    const writeFirestore = async () => {
        firebase.firestore().collection('users')
            .doc(user.id)
            .collection('todo')
            .add({
                item: text,
                completed: false,
                time: Date.parse(new Date()),
            })
            .then(() => {
                //console.log('Todo item!');
                //todoInput.current.focus();
            });
    }
    const updateFirestore = async (itemId) => {
        firebase.firestore().collection('users')
            .doc(user.id)
            .collection('todo')
            .doc(itemId)
            .update({
                completed: true,
            })
            .then(() => {
                //console.log('Item completed!');
            });
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View>
                            <ThemeProvider theme={theme}>
                                <Input
                                    placeholder='Add a Todo!'
                                    onChangeText={changeHandler}
                                    value={text}
                                    //ref={todoInput}
                                />
                                <Button title="Add Todo" onPress={() => submitHandler(text)} />
                            </ThemeProvider>
                        </View>
                        <View style={styles.list}>
                            <FlatList
                                data={todos}
                                keyExtractor={item => item.key}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => pressHandler(item.key)}>
                                        <Text style={styles.item}>{item.item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
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
});
const theme = {
    Button: {
        raised: true,
        containerStyle: {
            margin: 10,
        },
        buttonStyle: {
            backgroundColor: '#f28482',
            height: 48,
        }
    },
};