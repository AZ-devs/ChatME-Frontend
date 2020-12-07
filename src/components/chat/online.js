import React, { useContext } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { ChatContext } from '../../context/chat';

export default function Online() {
  const context = useContext(ChatContext);

  let currentRoom = context.rooms.filter(room => {
    return room._id == context.roomID
  })
  return currentRoom[0].pepole.map((person) => {
    return (<View key={person.name} style={{ marginTop: 30 }}>
      <Text>{person.name}</Text>
    </View>)
  })
}