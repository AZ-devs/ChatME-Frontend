import React, { useState } from 'react';

export const ChatContext = React.createContext();

function ChatProvider(props) {

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [firstTime, setFirstTime] = useState(true)
  const [rooms, setRooms] = useState([])

  // const [activeRoom, setactiveRoom] = useState('')
  // const [messages, setMessages] = useState([])

  const state = { name, setName, avatar, setAvatar, firstTime, setFirstTime,rooms, setRooms };

  return (
    <ChatContext.Provider value={state}>
      {props.children}
    </ChatContext.Provider>
  );

}

export default ChatProvider;