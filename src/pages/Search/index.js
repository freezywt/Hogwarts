import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Keyboard,
  FlatList,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { useIsFocused } from '@react-navigation/native';
import ChatList from '../../components/ChatList';

export default function Search() {

  const isFocused = useIsFocused();

  const [ input, setInput ] = useState('');
  const [ user, setUser ] = useState(null);
  const [ chats, setChats ] = useState([]);

  useEffect(() => {

    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
    setUser(hasUser);

  }, [isFocused]);

  async function handleSearch(){
    if(input === '') return;

    const responseSearch = await firestore()
      .collection('MESSAGE_THREADS')
      .where('name', '>=', input)
      .where('name', '<=', input + '\uf8ff')
      .get()
      .then( (querySnapshot) => {

        const threads = querySnapshot.docs.map(documentSnapshot => {
          return{
            _id: documentSnapshot.id,
            name: '',
            lastMessage: { text: '' },
            ...documentSnapshot.data()
          }
        })

        setChats(threads);
        setInput('');
        Keyboard.dismiss();
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput 
          placeholder='Digite o nome da casa que esta a buscar'
          placeholderTextColor="#c1c1c1"
          value={input}
          onChangeText={(text) => setInput(text)}
          style={styles.input}
          autoCapitalize={"none"}
        />
        <TouchableOpacity style={styles.buttonSearch} onPress={handleSearch}>
          <MaterialIcons name='search' size={30} color='#DCDCDC' />
        </TouchableOpacity>
      </View>

      <FlatList 
        showsVerticalScrollIndicator={false}
        data={chats}
        keyExtractor={ item => item._id }
        renderItem={({item}) => <ChatList data={item} userStatus={user}/>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#242633',
  },
  containerInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 14,
  },
  input: {
    backgroundColor: '#2E303D',
    color: '#DCDCDC',
    marginLeft: 10,
    height: 50,
    width: '80%',
    borderRadius: 4,
    padding: 5,
  },
  buttonSearch: {
    backgroundColor: '#2E303D',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
    marginLeft: 5,
    marginRight: 10,
  }
})