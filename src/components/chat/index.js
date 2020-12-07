// import io from 'socket.io-client';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ChatContext } from '../../context/chat';
import { Button } from 'react-native';
import { socket } from '../../context/socket'
import DismissKeyboard from '../../util/keyboard';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import { Text, Icon } from 'react-native-elements';
import Messages from './messages';
import Online from './online';
import { If } from 'react-if'

import { I18nManager} from 'react-native';
I18nManager.allowRTL(false);

export default function Chat({ navigation }) {
  const [onlineVisible, setOnlineVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([])
  const [keyboardView, setKeyboardView] = useState(false)


  const context = useContext(ChatContext);

  useEffect(() => {
    socket.on('messages', (payload) => {
      setMessages(payload);
    })

    navigation.addListener('beforeRemove', (e) => {
      socket.emit('exit', { name: context.name, roomID: context.roomID })
      socket.off('messages');
    })

    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);


  const _keyboardDidShow = () => {
    setKeyboardView(true)
  }
  const _keyboardDidHide = () => {
    setKeyboardView(false)
  }



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

  return (
    < KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container} >
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

        <InvertibleScrollView style={styles.chatView} inverted>
          <Messages masgs={messages} />
        </InvertibleScrollView>

        <View style={styles.form}>

          <TextInput required value={message}
            style={{
              height: 40, width: '70%', borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', borderTopLeftRadius: 15, borderBottomLeftRadius: 15

            }}
            onChangeText={text => setMessage(text)}
          />

          <TouchableOpacity onPress={() => {
            if (message.length) {
              socket.emit('sendMessage', { name: context.name, avatar: context.avatar, text: message, roomID: context.roomID })
              setMessage('');
            }
          }}
            style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}> <Icon name='send' /></Text>

          </TouchableOpacity>
        </View>
        <If condition={keyboardView}>
          <View style={styles.form}></View>
        </If>

      </View>
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4EFED',
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
    backgroundColor: "#D63C30",
    paddingHorizontal: 12,
    height: 40,
    width: '20%',
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15
  },
  appButtonText: {
    margin: 10,
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  chatView: {
    alignSelf: 'stretch',
  },
  form: {
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    height: 80,
    alignSelf: 'stretch'

  },
});