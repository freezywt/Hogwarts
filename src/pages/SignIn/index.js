import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform } from 'react-native';

import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function SignIn() {

  const navigation = useNavigation();

  const [ name, setName  ] = useState('');
  const [ email, setEmail  ] = useState('');
  const [ password, setPassword  ] = useState('');
  const [ type, setType ] = useState(false);

  function handleLogin(){
    if(type){

      if(name === '' || email === '' || password === '') return;

      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          user.user.updateProfile({
            displayName: name,
          })
          .then(() =>{
            navigation.goBack();
          })
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            alert('Email em uso.');
          }
      
          if (error.code === 'auth/invalid-email') {
            alert('Email invalido.');
          }
        })

    }else{
      auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          navigation.goBack();
        })
        .catch((error) => {
          if (error.code === 'auth/invalid-email') {
            alert('Email invalido.');
          }
        })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Hogwarts</Text>
      <Text style={{ marginBottom: 20, color: '#DCDCDC' }}>Venha fazer parte, de Hogwarts com seus amigos.</Text>

      { type && (
              <TextInput 
                style={styles.input}
                value={name}
                onChangeText={ (text) => setName(text) }
                placeholder="Qual seu nome?"
                placeholderTextColor="#c1c1c1"
              />
      )}

      <TextInput 
        style={styles.input}
        value={email}
        onChangeText={ (text) => setEmail(text) }
        placeholder="Seu melhor email"
        placeholderTextColor="#c1c1c1"
      />

      <TextInput 
        style={styles.input}
        value={password}
        onChangeText={ (text) => setPassword(text) }
        placeholder="Sua senha"
        placeholderTextColor="#c1c1c1"
        secureTextEntry={true}
      />

      <TouchableOpacity 
        style={
          [
            styles.buttonLogin, 
            { backgroundColor: type ? '#f53745' : '#2E303D'}
          ]
        }
        onPress={handleLogin}
        >
          <Text style={styles.buttonText}>{type ? 'Cadastrar' : 'Acessar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={ () => setType(!type) }>
        <Text style={{color: '#DCDCDC'}}>{type ? 'Ja possuo uma conta' : 'Criar uma nova conta'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems: 'center',
    backgroundColor: '#242633',
  },
  logo: {
    marginTop: Platform.OS === 'android' ? 55 : 80,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DCDCDC',
  },
  input: {
    color: '#DCDCDC',
    backgroundColor: '#2E303D',
    width: '90%',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
    height: 50,
  },
  buttonLogin: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#DCDCDC',
    fontWeight: 'bold',
    fontSize: 19,
  }

})