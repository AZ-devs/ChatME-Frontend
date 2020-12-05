import React, { useState, useEffect } from 'react';

export const ChatContext = React.createContext();
import io from 'socket.io-client';


function ChatProvider(props) {

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [firstTime, setFirstTime] = useState(true)

  // const [activeRoom, setactiveRoom] = useState('')
  // const [messages, setMessages] = useState([])

  const state = { name, setName, avatar, setAvatar, firstTime, setFirstTime };

  return (
    <ChatContext.Provider value={state}>
      {props.children}
    </ChatContext.Provider>
  );

}

export default ChatProvider;