// import io from 'socket.io-client';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { ChatContext } from '../context/chat';
import { Button } from 'react-native';
import { socket } from '../context/socket'

export default function Chat({ navigation }) {
  const [onlineVisible, setOnlineVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([])

  const context = useContext(ChatContext);

  useEffect(() => {

    socket.on('messages', (payload) => {
      setMessages(payload);
    })

    navigation.addListener('beforeRemove', (e) => {
      socket.emit('exit', { name: context.name, roomID: context.roomID })
    })
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => {
          setOnlineVisible(true)
        }
        } title="online" />
      ),
    });
  }, [onlineVisible]);



  function Online() {
    let currentRoom = context.rooms.filter(room => {
      return room._id == context.roomID
    })
    console.log(currentRoom[0].pepole)
    return currentRoom[0].pepole.map((person) => {
      return (<View key={person.name} style={{ marginTop: 30 }}>
        <Text>{person.name}</Text>
      </View>)
    })
  }

  function Messages() {
    return messages.map((message, index) => {
      // if(message.name === context.name){
      return (
        <View key={`${message.name}+${index}`} style={{ marginTop: 20 }}>
          <Text style={{ color: 'green' }}>{message.name}</Text>
          <Text>{message.text}</Text>
        </View>
      )
      // }else{
      //   <View key={`${message.name}+${index}`} style={{ marginTop: 20 }}>
      //   <Text style={{color:'red'}}>{message.name}</Text>
      //   <Text>{message.text}</Text>
      // </View>
      // }

    })
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={onlineVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.modalView}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => {
            setOnlineVisible(false)
          }}>
            <Text>X</Text>
          </TouchableOpacity>
          <Online />
        </View>
      </Modal>
      <Messages />

      <TextInput required
        style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setMessage(text)}
      />
      <TouchableOpacity onPress={() => {
        socket.emit('sendMessage', { name: context.name, avatar: context.avatar, text: message, roomID: context.roomID })
      }}
        style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>Send</Text>
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
  modalView: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
    marginTop: 200,
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
    elevation: 2
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