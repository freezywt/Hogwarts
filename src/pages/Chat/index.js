import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Modal,
  FlatList,
  Alert,
  StatusBar
} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FabButton from '../../components/FabButton';
import ModalNewRoom from '../../components/ModalNewRoom';
import ChatList from '../../components/ChatList';
import SplashScreen from '../../components/Splash';

export default function Chat() {

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [ user, setUser ] = useState(null);
  const [ modalVisible, setModalVisible ] = useState(false);

  const [ threads, setThreads ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ updateScreen, setUpdateScreen ] = useState(false);

  useEffect(()=> {
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
   
    setUser(hasUser);
  }, [isFocused])

  useEffect(() => {

    let isActive = true;

    function getChats(){
      firestore()
        .collection('MESSAGE_THREADS')
        .orderBy('lastMessage.createdAt', 'desc')
        .limit(10)
        .get()
        .then((snapshot) => {
          const threads = snapshot.docs.map( documentSnapshot => {
            return{
              _id: documentSnapshot.id,
              name: '',
              lastMessage: { text: '' },
              ...documentSnapshot.data()
            }
          })

          if(isActive){
            setThreads(threads);
            setLoading(false);
          }

        })
    }

    getChats();

    return () => {
      isActive = false;
    }

  }, [isFocused, updateScreen]);

  function handleSignOut() {
    auth()
      .signOut()
        .then(() => {
          setUser(null);
          navigation.navigate("SignIn")
        })
        .catch(()=> {
          alert("Nao possui nenhum usuario")
        })
  }

  function deleteRoom(ownerId, idRoom){
    if(ownerId !== user?.uid) return;

    Alert.alert(
      "Atencao!",
      "Voce tem certeza que deseja deletear essa sala?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => handleDeleteRoom(idRoom),
        }
      ]
    )
  }

  async function handleDeleteRoom(idRoom){
    await firestore()
      .collection('MESSAGE_THREADS')
      .doc(idRoom)
      .delete();

      setUpdateScreen(!updateScreen);
  }

  if(loading) {
    return(
      <SplashScreen />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2e303d"/>
      <View style={styles.headerRoom}>
        <View style={styles.headerRoomLeft}>
          { user && (
            <TouchableOpacity onPress={handleSignOut}>
              <MaterialIcons name='arrow-back' size={28} color='#dcdcdc' />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Casas</Text>
        </View>
        <TouchableOpacity onPress={ () => navigation.navigate('Search')}>
          <MaterialIcons name='search' size={28} color='#dcdcdc' />
        </TouchableOpacity>
      </View>

      <FlatList
        style={{marginTop: 5}}
        data={threads}
        keyExtractor={ item => item._id }
        showsVerticalScrollIndicator={false}
        renderItem={ ({ item }) => (
          <ChatList 
            data={item} 
            deleteRoom={ 
              () => deleteRoom(item.owner ,item._id) 
            } 
            userStatus={user} 
          />
        )}
      />

      <FabButton setVisible={ () => setModalVisible(true)} userStatus={user} />

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalNewRoom 
          setVisible={ () => setModalVisible(false)} 
          setUpdateScreen={ () => setUpdateScreen(!updateScreen) }
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#242633',
  },
  headerRoom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#2e303d',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20, 
  },
  headerRoomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#dcdcdc',
    paddingLeft: 10,
  }
})