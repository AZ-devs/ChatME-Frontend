import React, { useContext } from 'react';
import { View } from 'react-native';
import { Text,ListItem,Avatar } from 'react-native-elements';
import { ChatContext } from '../../context/chat';

export default function Online() {
  const context = useContext(ChatContext);

  let currentRoom = context.rooms.filter(room => {
    return room._id == context.roomID
  })
  return currentRoom[0].pepole.map((person,index) => {
    return (
      <ListItem containerStyle={{marginBottom:5, width:200,backgroundColor:'#262229',}} key={index} bottomDivider>
        <Avatar rounded source={{uri: person.avatar}} />
        <ListItem.Content style={{ alignItems: 'flex-start' }}>
          <ListItem.Title style={{color:'#F4EFED',fontSize:14}}>{person.name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    )
  })
}