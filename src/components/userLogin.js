import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChatContext } from '../context/chat';
import AsyncStorage from '@react-native-community/async-storage';
import { socket } from '../context/socket'
import * as Random from 'expo-random';
import { uriToBlob, uploadToFirebase, imageHandler } from '../util/upload'

export default function Login() {
  const context = useContext(ChatContext)

  return (
    <View style={styles.container}>
      <Text style={{ marginTop: 25 }}>Name</Text>
      <TextInput
        style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => context.setName(text)}
      />
      <Text style={{ marginTop: 25 }}>Avatar</Text>

      <TouchableOpacity onPress={async () => {
        const check = await imageHandler()
        if (check) {
          context.setAvatar(check);
        }
      }}>
        <Image style={styles.image} source={{ uri: context.avatar }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={async () => {
        if (context.name !== '') {
          socket.on('auth', async (payload) => {
            if (payload.check) {
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
              console.log('exist name')
            }
          })
          socket.emit('auth', { username: context.name, image: context.avatar })
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