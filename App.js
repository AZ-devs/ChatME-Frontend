import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import Chat from './src/components/chat'
// import userLogin from './src/components/userLogin'
// import Rooms from './src/components/rooms'
import Home from './src/components/home'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatProvider from './src/context/chat';
import { LogBox } from 'react-native'
LogBox.ignoreLogs(['Setting a timer']);
import { ThemeProvider } from 'react-native-elements';

const theme = {
  Button: {
    titleStyle: {
      color: 'red',
    },
  },
};

export default function App() {
  const Stack = createStackNavigator();

  return (
    <ChatProvider>
      <ThemeProvider them={theme}>

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
            <Stack.Screen name="Home" options={{
              title: 'Home',
            }} component={Home} options={{ headerShown: false }} />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{
                title: 'Chat',
                headerShown: false
              }}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeProvider>

    </ChatProvider>
  );
}