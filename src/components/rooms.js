import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { ChatContext } from '../context/chat';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';



export default function Rooms() {
  const socket = io('http://192.168.1.85:3000/chat');

  const [rooms, setRooms] = useState([])
  const [roomName, setRoomName] = useState('')
  const [myPassword, setMyPassword] = useState('')

  const [password, setPassword] = useState('')


  const context = useContext(ChatContext);
  const navigation = useNavigation();

  useEffect(() => {
    socket.on('lobby', (payload) => {
      setRooms(payload)
    })
  }, []);
  
  function createRoom() {
    if (roomName !== '') {
      socket.emit('createRoom', { roomName, password: myPassword, name: context.name, avatar: context.avatar })
      navigation.navigate('Chat'); 
    }
  }

  function ListItem({ item }) {
    return (
      <View >
        <TouchableOpacity activeOpacity={0.7}>
          <Text>{item.name}</Text>
          <Text>{item.pepole.length}</Text>
          <Text>{item.islocked.toString()}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item._id.toString()}
      />
      <Text>Rooms</Text>
      <TextInput
        style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setRoomName(text)}
      />
      <TextInput
        style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setMyPassword(text)}
      />
      <TouchableOpacity
        onPress={() => createRoom()}
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
});