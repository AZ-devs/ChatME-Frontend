import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Modal, TouchableHighlight } from 'react-native';
import { ChatContext } from '../context/chat';
import { useNavigation } from '@react-navigation/native';
import { socket } from '../context/socket'
import { Header } from 'react-native-elements'
import { Image, Text, Input, Avatar, Button, Overlay, Icon, CheckBox, ListItem, Badge } from 'react-native-elements';
import { If } from 'react-if'
import Loading from './loading'

export default function Rooms(props) {

  const [roomName, setRoomName] = useState('')
  const [myPassword, setMyPassword] = useState('')
  const [password, setPassword] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false)

  // socket

  const context = useContext(ChatContext);
  const navigation = useNavigation();

  useEffect(() => {
    socket.emit('rooms',{})
    socket.on('lobby', (payload) => {
      context.setRooms(payload)
    })
    socket.on('joinLocked', (payload) => {
      setModalVisible(false);
      navigation.navigate('Chat');
    })

    socket.on('createdRoom', (payload) => {
      socket.emit('join', { roomID: payload.roomID, name: payload.name, avatar: payload.avatar, password: payload.password })
      context.setRoomID(payload.roomID)
    })
    navigation.addListener('beforeRemove', (e) => {
      socket.off('joinLocked');
      socket.off('createdRoom');
    })
    context.setLoading(false)
  }, []);

  function createRoom() {
    if (roomName !== '') {
      socket.emit('createRoom', { roomName, password: myPassword, name: context.name, avatar: context.avatar })
    }
  }

  function List({ item }) {
    return (
      <View style={{ flex: 1, marginTop: 20, }}>
        <ListItem underlayColor='#F4EFED' containerStyle={{ backgroundColor: '#F4EFED',alignItems:'flex-end',borderRadius:40,borderColor:'#262229',borderBottomWidth:2.32 }} onPress={() => {
          if (!item.islocked) {
            context.setLoading(true)
            const payload = { roomID: item._id, name: context.name, avatar: context.avatar, password: '' }
            socket.emit('join', payload)
            context.setRoomID(item._id)
          } else {
            context.setRoomID(item._id)
            setModalVisible(!modalVisible);
          }
        }}>
          <ListItem.Content style={{ alignItems: 'flex-start' }}>
          <Icon
              name={item.islocked?'lock':'unlock'}
              type='font-awesome'
              color='#D63C30'
              onPress={() => setVisible(false)}
            />
          </ListItem.Content>
          <ListItem.Content style={{ alignItems: 'center', }}>
            <ListItem.Title style={{ color: '#262229',fontSize:20,fontWeight:'bold' }}>{item.name}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Content style={{ alignItems: 'flex-end' }}>
            <Badge
              badgeStyle={{ backgroundColor: '#262229', width: 35, height: 30,borderWidth:1.5,borderColor:'#837B79' }}
              value={item.pepole.length}
              textStyle={{ color: '#F4EFED', fontSize: 18,fontWeight:'bold' }}
              containerStyle={{ marginTop: 0 }}
            />
          </ListItem.Content>
        </ListItem>
      </View>
    );
  }

  function AddRoom() {
    return (
      <TouchableHighlight underlayColor='transparent'  onPress={() => setVisible(true)}>
        <Icon
          name='add-circle'
          color='#F4EFED'
          background='red'
          underlayColor='#F4EFED'
          size={32}
        />
      </TouchableHighlight>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        statusBarProps={{ barStyle: 'light-content' }}
        placement="center"
        barStyle="light-content" // or directly
        rightComponent={<AddRoom />}
        centerComponent={{ text: 'Rooms', style: { color: '#F4EFED', fontSize: 24 } }}
        containerStyle={{
          backgroundColor: '#262229',
          justifyContent: 'space-around',
        }}
      />
      {/* <Loading /> */}
      <Overlay overlayStyle={{ borderRadius: 12, borderWidth: 1, borderColor: '#837B79', justifyContent: 'center', alignItems: 'center', backgroundColor: '#262229' }} isVisible={visible} onBackdropPress={() => { setVisible(false) }}>
        <View style={{ alignItems: 'center' }}>

          <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignSelf: 'stretch' }}>
            <Text></Text>
            <Text style={{ color: '#F4EFED', fontWeight: 'bold', fontSize: 20 }}>Create Room</Text>
            <Icon
              name='close'
              type='font-awesome'
              color='#D63C30'
              onPress={() => setVisible(false)}
            />
          </View>
          <Input inputStyle={{ color: '#F4EFED', textDecorationLine: 'none' }} containerStyle={{ width: 300, marginTop: 30 }}
            placeholder='Room name'
            onChangeText={text => setRoomName(text)}
          />
          <If condition={checked}>
            <Input inputStyle={{ color: '#F4EFED', textDecorationLine: 'none' }} containerStyle={{ width: 300, marginTop: 0 }}
              placeholder='Password'
              onChangeText={text => setMyPassword(text)}
            />
          </If>
          <CheckBox
            containerStyle={{ backgroundColor: '#262229', borderColor: '#837B79', borderWidth: 0, marginTop: 0, paddingTop: 0 }}
            textStyle={{ color: '#F4EFED', fontSize: 17 }}
            left
            title='Lock the room'
            checkedColor='#D63C30'
            checked={checked}
            onPress={() => {
              setChecked(!checked)
            }}
          />

          <Button
            title='Create'
            buttonStyle={{ backgroundColor: '#D63C30', width: 130, height: 40, marginTop: 10 }}
            onPress={() => {
              context.setLoading(true);
              createRoom()
              setRoomName('');
              setMyPassword('');
              setChecked(false);
              setVisible(false)
            }}
            titleStyle={{ color: '#F4EFED', fontSize: 20 }}
          />
        </View>
      </Overlay>

      <Overlay overlayStyle={{ borderRadius: 12, borderWidth: 1, borderColor: '#837B79', justifyContent: 'center', alignItems: 'center', backgroundColor: '#262229' }} isVisible={modalVisible} onBackdropPress={() => { setModalVisible(false) }}>
        <View style={{ alignItems: 'center' }}>

          <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignSelf: 'stretch' }}>
            <Text></Text>
            <Text style={{ color: '#F4EFED', fontWeight: 'bold', fontSize: 20 }}>Join Locked Room</Text>
            <Icon
              name='close'
              type='font-awesome'
              color='#D63C30'
              onPress={() => setModalVisible(false)}
            />
          </View>
          <Input inputStyle={{ color: '#F4EFED', textDecorationLine: 'none' }} containerStyle={{ width: 300, marginTop: 30 }}
            placeholder='Password'
            onChangeText={text => setPassword(text)}
          />

          <Button
            title='Join'
            buttonStyle={{ backgroundColor: '#D63C30', width: 130, height: 40, marginTop: 10 }}
            onPress={() => {
              context.setLoading(true)
              const payload = { roomID: context.roomID, name: context.name, avatar: context.avatar, password }
              socket.emit('join', payload)
              setModalVisible(false)
            }}
            titleStyle={{ color: '#F4EFED', fontSize: 20 }}
          />
        </View>
      </Overlay>

      {context.rooms ? <FlatList
        style={{ alignSelf: 'stretch',backgroundColor:'#F4EFED',padding:10 }}
        data={context.rooms}
        renderItem={({ item }) => <List item={item} />}
        keyExtractor={(item) => item._id.toString()}
      /> : <></>}

      {/* <Modal
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
                const payload = { roomID: context.roomID, name: context.name, avatar: context.avatar, password }
                socket.emit('join', payload)
              }}
            >
              <Text>Join</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
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