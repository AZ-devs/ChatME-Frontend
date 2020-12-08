import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChatContext } from '../context/chat';
import AsyncStorage from '@react-native-community/async-storage';
import { socket } from '../context/socket'
import * as Random from 'expo-random';
import { uriToBlob, uploadToFirebase, imageHandler } from '../util/upload'
import { Image, Text, Input, Avatar, Button, Overlay, Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { If } from 'react-if'
import Loading from './loading'

export default function Login() {
  const [keyboardView, setKeyboardView] = useState(false)
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    socket.on('lobby', (payload) => {
      context.setRooms(payload)
    })
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, [])

  const _keyboardDidShow = () => {
    setKeyboardView(true)
  }
  const _keyboardDidHide = () => {
    setKeyboardView(false)
  }
  const context = useContext(ChatContext)
  {/* <View style={styles.inner}>
        <Text style={styles.header}>Header</Text>
        <TextInput placeholder="Username" style={styles.textInput} />
        <View style={styles.btnContainer}>
          <Button title="Submit" onPress={() => null} />
        </View>
      </View> */}
  return (
    < KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container} >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* <Loading /> */}
        <View style={styles.container}>
          <Header
            statusBarProps={{ barStyle: 'light-content' }}
            placement="center"
            barStyle="light-content" // or directly
            centerComponent={<Image
              source={{ uri: 'https://www.freelogodesign.org/download/file?id=12b62204-dd65-4e69-9ed6-a6b59552af05_200x200.png' }}
              style={{ marginTop: 20, width: 90, height: 90 }}
            />}
            containerStyle={{
              backgroundColor: '#F4EFED',
              justifyContent: 'space-around',
            }}
          />
          {/* <If condition={!keyboardView}>
            <Image
              source={{ uri: 'https://www.freelogodesign.org/download/file?id=12b62204-dd65-4e69-9ed6-a6b59552af05_200x200.png' }}
              style={{ marginTop: 20, width: 200, height: 200 }}
            />
          </If> */}

          <View style={styles.form}>
            <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={async () => {
              const check = await imageHandler()
              if (check) {
                context.setAvatar(check);
              }
            }}>
              {/* <Image style={styles.image} source={{ uri: context.avatar }} /> */}
              <Avatar
                size={180}
                rounded
                source={{
                  uri:
                    context.avatar ? context.avatar : 'https://devtalk.blender.org/uploads/default/original/2X/c/cbd0b1a6345a44b58dda0f6a355eb39ce4e8a56a.png',
                }}
              >
              </Avatar>
              <Icon2
                name='mode-edit'
                size={24}
                color='#D63C30'
              />
            </TouchableOpacity>
            <Input containerStyle={{ width: 300, marginTop: 30 }}
              placeholder='Username'
              onChangeText={text => context.setName(text)}
              leftIcon={
                <Icon
                  name='user'
                  size={24}
                  color='#262229'
                />
              }
            />
          </View>
          <Button
            title="Go Online"
            raised
            buttonStyle={{ backgroundColor: '#262229', width: 180, height: 50 }}
            containerStyle={{ marginBottom: 20 }}
            titleStyle={{ color: '#F4EFED', fontSize: 20 }}
            onPress={async () => {
              if (context.name !== '') {
                socket.on('auth', async (payload) => {
                  if (payload.check) {
                    // context.setLoading(true)
                    const fileExtension = payload.image.split('.').pop();
                    let uuid = Random.getRandomBytes(4);
                    let name = ''
                    uuid.forEach((item) => {
                      name += item;
                    })
                    const fileName = `${name}.${fileExtension}`;

                    uriToBlob(payload.image)
                      .then((blob) => uploadToFirebase(blob, fileName, fileExtension)).then(async (uri) => {
                        await AsyncStorage.setItem('name', context.name)
                        context.setAvatar(uri)
                        await AsyncStorage.setItem('avatar', uri)
                        context.setFirstTime('Rooms')
                      })
                  } else {
                    setVisible(true)
                  }
                })
                socket.emit('auth', { username: context.name, image: context.avatar })
              }
            }}
          />
          <Overlay  overlayStyle={{ width: 280, height: 150, borderRadius: 12, borderWidth: 1, borderColor: '#837B79', justifyContent: 'center', alignItems: 'center', backgroundColor: '#262229' }} isVisible={visible} onBackdropPress={() => { setVisible(false) }}>
            <View style={{ alignItems: 'center', }}>

              <View style={{ flexDirection: 'row', border: '' }}>
                <Text style={{ color: '#F4EFED', fontWeight: 'bold', fontSize: 20 }}>{context.name} </Text>
                <Text style={{ fontSize: 20, color: '#F4EFED' }}>already exist</Text>
              </View>
              <Button
                title='Close'
                buttonStyle={{ backgroundColor: '#D63C30', width: 130, height: 40, marginTop: 30 }}
                onPress={() => { setVisible(false) }}
                titleStyle={{ color: '#F4EFED', fontSize: 20 }}
              />
            </View>
          </Overlay>
        </View >
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4EFED',
    alignItems: 'center',
    // padding: 40,
    justifyContent: 'space-between',
    // marginTop: 0,
  },
  form: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 400,
    height: 200,
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