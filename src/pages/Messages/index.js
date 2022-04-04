import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView,
  View, 
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet, 
  FlatList, 
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import ChatMessage from '../../components/ChatMessage';

import Wand from '../../Assets/wand.png';

export default function Messages({ route }) {

  const { thread } = route.params;
  const [ messages, setMessages ] = useState([]);
  const [ input, setInput ] = useState('');

  const user = auth().currentUser.toJSON();

  useEffect(() => {

    const unsubscribeListener = firestore().collection('MESSAGE_THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot( querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: firestore.FieldValue.serverTimestamp(),
            ...firebaseData
          }

          if(!firebaseData.system){
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.displayName
            }
          }

          return data;

        })

        setMessages(messages)

      })

      return () => unsubscribeListener()

  }, []);

  async function handleSend(){
    if(input === '') return;

    firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        text: input,
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: {
          _id: user.uid,
          displayName: user.displayName
        }
      })

      await firestore()
        .collection('MESSAGE_THREADS')
        .doc(thread._id)
        .set(
          {
            lastMessage: {
              text: input,
              createAt: firestore.FieldValue.serverTimestamp(),
            }
          },
          {
            merge: true,
          }
        )

        setInput('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList 
        style={{ width: '100%' }}
        data={messages}
        keyExtractor={ item => item._id }
        renderItem={({item}) => <ChatMessage data={item}/>}
        inverted={true}
      />

    <KeyboardAvoidingView 
      behavior={Platform.Os === 'ios' ? 'padding' : 'height'}
      style={{ width: '100%' }}
      keyboardVerticalOffset={100}
    >

      <View style={styles.containerInput}>
        <View style={styles.mainContainerInput}>
          <TextInput
            placeholder='Lance sua magia ...'
            placeholderTextColor='#DCDCDC'
            style={styles.textInput}
            value={input}
            onChangeText={(text) => setInput(text)}
            multiline={true}
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity onPress={handleSend}>
          <View style={styles.buttonContainer}>
            <Image source={Wand} style={styles.buttonContainerImage}/>
          </View>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242633',
  },
  containerInput: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'flex-end',
  },
  mainContainerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E303D',
    flex: 1,
    borderRadius: 25,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#DCDCDC',
    marginHorizontal: 10,
    maxHeight: 130,
    minHeight: 48,
  },
  buttonContainer: {
    backgroundColor: '#2E303D',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    borderRadius: 25,
  },
  buttonContainerImage: {
    width: 20,
    height: 20,
  }
})