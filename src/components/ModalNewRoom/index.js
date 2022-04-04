import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    TextInput, 
    TouchableOpacity, 
    TouchableWithoutFeedback } 
from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

function ModalNewRoom({ setVisible,setUpdateScreen }){

    const [ roomName, setRoomName ] = useState('');

    const user = auth().currentUser.toJSON();

    function handleButtonCreate() {
        if(roomName === '') return;

        firestore().collection('MESSAGE_THREADS')
            .get()
            .then((snapshot) => {
                let myThreads = 0;

                snapshot.docs.map( docItem => {
                    if(docItem.data().owner === user.uid){
                        myThreads += 1;
                    }
                })

                if(myThreads >= 3){
                    alert('Voce ja atingiu o limite de sala por usuarios');
                }else{
                    createRoom();
                }
            })
    }

    function createRoom(){
        firestore()
            .collection('MESSAGE_THREADS')
            .add({
                name: roomName,
                owner: user.uid,
                lastMessage: {
                    text: `Casa ${roomName} criada. Bem vindo(a)`,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                }
            })
            .then((docRef) => {
                docRef.collection('MESSAGES').add({
                    text:`Casa ${roomName} criada. Bem vindo(a)`,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    system: true,
                })

                .then(() => {
                   setVisible();
                   setUpdateScreen();
                })
            })

            .catch((err) => {
                console.log(err);
            })
    }

    return(
        <View style={styles.container}>

            <TouchableWithoutFeedback onPress={setVisible}>
                <View style={styles.modal}></View>
            </TouchableWithoutFeedback>

            <View style={styles.modalContent}>
                <Text style={styles.title}>Criar uma casa personalizada em Hogwarts</Text>
                <TextInput 
                    style={styles.input}
                    value={roomName}
                    onChangeText={(text) => setRoomName(text)}
                    placeholder="Nome para sua nova casa"
                    placeholderTextColor='#c1c1c1'
                />

                <TouchableOpacity style={styles.buttonCreate} onPress={handleButtonCreate}>
                    <Text style={styles.buttonText}>Criar Casa</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={setVisible}
                    style={styles.backButton}
                >
                    <Text style={{color: '#DCDCDC'}}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ModalNewRoom;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(34, 34, 34, 0.4)',
    },
    modal: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#242633',
        padding: 15,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#DCDCDC',
    },
    input: {
        color: '#DCDCDC',
        borderRadius: 4,
        height: 45,
        backgroundColor: '#2E303D',
        marginVertical: 15,
        marginVertical: 15,
        fontSize: 16,
        paddingHorizontal: 5,
    },
    buttonCreate: {
        borderRadius: 4,
        backgroundColor: '#2E303D',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#DCDCDC',
    },
    backButton: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
})