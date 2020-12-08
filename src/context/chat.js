import React, { useState } from 'react';

export const ChatContext = React.createContext();

function ChatProvider(props) {

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('https://devtalk.blender.org/uploads/default/original/2X/c/cbd0b1a6345a44b58dda0f6a355eb39ce4e8a56a.png')
  const [firstTime, setFirstTime] = useState('loading')
  const [rooms, setRooms] = useState([])
  const [roomID, setRoomID] = useState('');
  const [joinedRoom, setJoinedRoom] = useState('Room');
  const [loading,setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  // const [messages, setMessages] = useState([])


  // const [activeRoom, setactiveRoom] = useState('')



  const state = { name, setName, avatar, setAvatar, firstTime, setFirstTime, rooms, setRooms, roomID, setRoomID,loading,setLoading,messages, setMessages,joinedRoom, setJoinedRoom };

  return (
    <ChatContext.Provider value={state}>
      {props.children}
    </ChatContext.Provider>
  );

}

export default ChatProvider;