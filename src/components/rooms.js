import React , {useState , useEffect} from 'react';
import { StyleSheet, View,Text } from 'react-native';
import io from 'socket.io-client';

export default function Rooms() {
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const socket = io('https://chatmebackend.herokuapp.com/chat');
    socket.on('lobby' , (payload)=>{
      setRooms(payload)
    })
  }, []);
  
  return (
    <View style={styles.container}>
      <Text>Rooms</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});