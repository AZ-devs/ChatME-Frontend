import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChatContext } from '../context/chat';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';

export default function UserLogin() {
  const [flag, setFlag] = useState(false)
  const navigation = useNavigation();
  const context = useContext(ChatContext)
  const socket = io('http://192.168.1.85:3000/chat');

  useEffect(() => {
    navigation.navigate('Rooms')
  }, [context.firstTime])


  useEffect(() => {

    const getStorage = async () => {
      try {
        const name = await AsyncStorage.getItem('name');
        const avatar = await AsyncStorage.getItem('avatar');
        console.log('User info', name, avatar)
        await context.setName(name);
        await context.setAvatar(avatar);
        // console.log(context.name , context.avatar)
        if(name){
          context.setFirstTime(false);
        }
      }
      catch {
        console.log('Error get storage')
      }
    }
    getStorage();
    // socket.emit('createRoom',{roomName:'test', name:'Zeko', avatar:'test.test'})
    // socket.emit('sendMessage', { roomID: '5fca781fd722dc2b19399e20', name: 'Zeko2', avatar: 'test.test', text: 'hellooooo2' })
  }, []);



  return (
    <View style={styles.container}>
      <Text style={{ marginTop: 25 }}>Name</Text>
      <TextInput
        style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => context.setName(text)}
      />
      <Text style={{ marginTop: 25 }}>Avatar</Text>
      <TextInput required
        style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => context.setAvatar(text)}
      />
      <TouchableOpacity onPress={async () => {
        if (context.name !== '') {

          navigation.navigate('Rooms');
          await AsyncStorage.setItem('name', context.name)
          await AsyncStorage.setItem('avatar', context.avatar)
        }
      }}
        style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});