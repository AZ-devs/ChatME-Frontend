// import io from 'socket.io-client';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, TouchableHighlight, View, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ChatContext } from '../../context/chat';
// import { Button } from 'react-native';
import { socket } from '../../context/socket'
import DismissKeyboard from '../../util/keyboard';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import { Text, Icon, Header, Overlay, Input, Button } from 'react-native-elements';
import Messages from './messages';
import Online from './online';
import { If } from 'react-if'

import { I18nManager } from 'react-native';
I18nManager.allowRTL(false);

export default function Chat({ navigation }) {
  const [onlineVisible, setOnlineVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [keyboardView, setKeyboardView] = useState(false)
  const [visible, setVisible] = useState(false);


  const context = useContext(ChatContext);

  useEffect(() => {
    socket.emit('getMsg',(context.roomID))
    socket.on('messages', (payload) => {
      context.setMessages(payload);
    })

    navigation.addListener('beforeRemove', (e) => {
      socket.emit('exit', { name: context.name, roomID: context.roomID })
      socket.off('messages');
    })

    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    context.setLoading(false)
    return () => {
      context.setMessages([])
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



  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <Button onPress={() => {
  //         setOnlineVisible(true)
  //       }
  //       } title="online" />
  //     ),
  //   });
  // }, [onlineVisible]);

  function OnlineP() {
    return (
      <TouchableHighlight underlayColor='transparent'  onPress={() => setVisible(true)}>
        <Icon
          name='group'
          color='#F4EFED'
          background='red'
          size={32}
        />
      </TouchableHighlight>
    )
  }

  function Back() {
    return (
      <TouchableHighlight underlayColor='transparent'  onPress={() => navigation.goBack()}>
        <Icon
          // reverse
          containerStyle={{transform: [{rotateY: '180deg'}]}}
          name='exit-to-app'
          type='material-icons'
          color='#F4EFED'
          background='red'
          size={32}
        />
      </TouchableHighlight>
    )
  }

  return (
    < KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container} >
      <View style={styles.container}>
        <Header
          statusBarProps={{ barStyle: 'light-content' }}
          placement="center"
          barStyle="light-content" // or directly
          rightComponent={<OnlineP />}
          leftComponent={<Back />}
          centerComponent={{ text: 'Rooms', style: { color: '#F4EFED', fontSize: 24 } }}
          containerStyle={{
            backgroundColor: '#262229',
            justifyContent: 'space-around',
          }}
        />

        <Overlay overlayStyle={{ borderRadius: 12, borderWidth: 1, paddingHorizontal: 25, paddingVertical: 10, borderColor: '#837B79', justifyContent: 'center', alignItems: 'center', backgroundColor: '#262229' }} isVisible={visible} onBackdropPress={() => { setVisible(false) }}>
          <View style={{ alignItems: 'center' }}>

            <View style={{ marginBottom: 20, justifyContent: 'space-between', flexDirection: 'row', alignSelf: 'stretch' }}>
              <Text></Text>
              <Text style={{ color: '#F4EFED', fontWeight: 'bold', fontSize: 20 }}>Online People</Text>
              {/* <Icon
                name='close'
                type='font-awesome'
                color='#D63C30'
                onPress={() => setVisible(false)}
              /> */}
              <Text></Text>
            </View>
            <View style={{ height: 300, width: 260, alignItems: 'center' }}>
              <InvertibleScrollView>
                <Online />

              </InvertibleScrollView>
            </View>
            <Button
              title='Close'
              buttonStyle={{ backgroundColor: '#D63C30', width: 130, height: 40, marginTop: 20 }}
              onPress={() => {
                setVisible(false)
              }}
              titleStyle={{ color: '#F4EFED', fontSize: 20 }}
            />
          </View>
        </Overlay>

        <InvertibleScrollView style={styles.chatView} inverted>
          <Messages />
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
        {/* <If condition={keyboardView}>
          <View style={styles.form}></View>
        </If> */}

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
    // marginTop: 20,
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