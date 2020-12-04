import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useContext, useState } from 'react';
import userLogin from './src/components/userLogin'
import chat from './src/components/chat'
import rooms from './src/components/rooms'
import io from 'socket.io-client';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatProvider, { ChatContext } from './src/context/chat';
import AsyncStorage from '@react-native-community/async-storage';





export default function App() {

  const Stack = createStackNavigator();
  const context = useContext(ChatContext)

  useEffect(() => {
    const socket = io('https://chatmebackend.herokuapp.com/chat');

    const getStorage = async () => {
      try {
        console.log('asa')
        const name = await AsyncStorage.getItem('name');
        const avatar = await AsyncStorage.getItem('avatar');
        console.log('xxxx', name, avatar)
        context.setName(name);
        context.setAvatar(avatar);
        if(name){
          context.setFirstTime(false);
        }
      }
      catch {
        console.log('test')
      }
    }

    getStorage();
    // socket.emit('createRoom',{roomName:'test', name:'Zeko', avatar:'test.test'})
    // socket.emit('sendMessage', { roomID: '5fca781fd722dc2b19399e20', name: 'Zeko2', avatar: 'test.test', text: 'hellooooo2' })
  }, []);


  return (
    <ChatProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          title: 'User Login',
          headerStyle: {
            backgroundColor: '#262229',
          },
          headerTintColor: '#837B79',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>

          <Stack.Screen name="userLogin" options={{
            title: 'User Login'
          }} component={userLogin} />

          <Stack.Screen name="Rooms" options={{
            title: 'Rooms'
          }} component={rooms} />
          <Stack.Screen name="Chat" options={{
            title: 'Chat'
          }} component={chat} />
          {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </ChatProvider>
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    // </View>
  );
}

