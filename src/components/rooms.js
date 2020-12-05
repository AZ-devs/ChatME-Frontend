import io from 'socket.io-client';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Modal, TouchableHighlight } from 'react-native';
import { ChatContext } from '../context/chat';
import { useNavigation } from '@react-navigation/native';

const socket = io('https://chatmebackend.herokuapp.com/chat');
export default function Rooms() {

  const [roomName, setRoomName] = useState('')
  const [myPassword, setMyPassword] = useState('')
  const [password, setPassword] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [roomID, setRoomID] = useState('');

  // socket

  const context = useContext(ChatContext);
  const navigation = useNavigation();

  useEffect(() => {
    socket.on('lobby', (payload) => {
      context.setRooms(payload)
    })
    socket.on('messages', (payload) => {

    })
    socket.on('joinLocked', (payload) => {
      setModalVisible(false);
      navigation.navigate('Chat');
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
      <View style={{ marginTop: 30 }}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => {
          if (!item.islocked) {
            const payload = { roomID: item._id, name: context.name, avatar: context.avatar, password: '' }
            socket.emit('join', payload)
            navigation.navigate('Chat');
          } else {
            setRoomID(item._id)
            setModalVisible(!modalVisible);
          }
        }}>
          <Text>{item.name}</Text>
          <Text>{item.pepole.length}</Text>
          <Text>{item.islocked.toString()}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {context.rooms ? <FlatList
        data={context.rooms}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item._id.toString()}
      /> : <></>}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      // onRequestClose={() => {
      //   Alert.alert("Modal has been closed.");
      // }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text >Password</Text>
            <TextInput
              style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1 }}
              onChangeText={text => setPassword(text)}
            />
            <TouchableHighlight
              // style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                const payload = { roomID, name: context.name, avatar: context.avatar, password }
                socket.emit('join', payload)
              }}
            >
              <Text>Join</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});