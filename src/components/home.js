import React, { useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Login from './userLogin'
import Rooms from './rooms'
import { ChatContext } from '../context/chat';
import { If } from 'react-if'



export default function Home() {
  const context = useContext(ChatContext)
  // const [check, setCheck] = useState('loading')

  useEffect(() => {


    const getStorage = async () => {
      try {
        const name = await AsyncStorage.getItem('name');
        const avatar = await AsyncStorage.getItem('avatar');
        console.log('User info', name, avatar)

        if (name && avatar) {
          context.setFirstTime('Rooms')
          await context.setName(name);
          await context.setAvatar(avatar);
        } else {
          context.setFirstTime('firstTime')
        }
      }
      catch {
        console.log('Error get storage')
      }
    }
    // AsyncStorage.clear()
    getStorage();
  }, [])

  return (
    <>
      <If condition={context.firstTime == 'loading'}>
      </If>
      <If condition={context.firstTime == 'Rooms'}>
        <Rooms />
      </If>
      <If condition={context.firstTime == 'firstTime'}>
        <Login />
      </If>

    </>
  )
}