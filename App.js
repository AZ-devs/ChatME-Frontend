import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React,{useEffect} from 'react';
import userLogin from './src/components/userLogin'
import Chat from './src/components/chat'
import Rooms from './src/components/rooms'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatProvider from './src/context/chat';


export default function App() {
  const Stack = createStackNavigator();

  return (
      <ChatProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
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
            }} component={Rooms} />
            <Stack.Screen name="Chat" options={{
              title: 'Chat'
            }} component={Chat} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ChatProvider>
  );
}

