import React, { useState } from 'react';

export const ChatContext = React.createContext();

function ChatProvider(props) {

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png')
  const [firstTime, setFirstTime] = useState('loading')
  const [rooms, setRooms] = useState([])
  const [roomID, setRoomID] = useState('');
  // const [messages, setMessages] = useState([])


  // const [activeRoom, setactiveRoom] = useState('')



  const state = { name, setName, avatar, setAvatar, firstTime, setFirstTime, rooms, setRooms, roomID, setRoomID };

  return (
    <ChatContext.Provider value={state}>
      {props.children}
    </ChatContext.Provider>
  );

}

export default ChatProvider;