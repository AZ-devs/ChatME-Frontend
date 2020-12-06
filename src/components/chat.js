import io from 'socket.io-client';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { ChatContext } from '../context/chat';
import { Button } from 'react-native';
const socket = io('https://chatmebackend.herokuapp.com/chat');

export default function Chat({ navigation }) {
  const [onlineVisible, setOnlineVisible] = useState(false);
  const [pepole, setPepole] = useState([]);
  const [message, setMessage] = useState('');

  const context = useContext(ChatContext);

  useEffect(() => {
    socket.on('sendMessage', (payload) => {
      console.log('welcome')
      let preMessages = context.messages;
      preMessages.push({ name: payload.name, avatar: payload.avatar, text: payload.text });
      context.setMessages(preMessages);
    })
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => {
          setOnlineVisible(true)
          getPepole()
        }
        } title="online" />
      ),
    });
  }, [navigation, setOnlineVisible]);

  function getPepole() {
    let currentRoom = context.rooms.filter(room => {
      return room._id == context.roomID
    })
    setPepole(currentRoom[0].pepole);
  }

  function ListItem({ item }) {
    return (
      <View style={{ marginTop: 30 }}>
        <Text>{item.name}</Text>
      </View>
    );
  }

  function MessageCo() {
    return (
      <View style={{ marginTop: 20 }}>
        <Text>{item.name}</Text>
        <Text>{item.avatar}</Text>
        <Text>{item.text}</Text>
      </View>
    );
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
          <FlatList
            data={pepole}
            renderItem={({ item, index }) => <ListItem item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Modal>
      <FlatList
        data={context.messages}
        renderItem={({ item, index }) => <MessageCo item={item} />}
        keyExtractor={(item, index) => index.toString()}
      />

        <TextInput required
          style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => setMessage(text)}
        />
        <TouchableOpacity onPress={() => {
          socket.emit('sendMessage', { name: context.name, avatar: context.avatar, text: message })
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