import React, { useContext } from 'react';
import { ChatContext } from '../context/chat';
import { If } from 'react-if'
import {View} from 'react-native'
import { Image, Text, Input, Avatar, Button, Overlay, Icon, CheckBox } from 'react-native-elements';


export default function Loading() {
  const context = useContext(ChatContext);

  // {/* overlayStyle={{ borderRadius: 12, borderWidth: 1, borderColor: '#837B79', justifyContent: 'center', alignItems: 'center', backgroundColor: '#262229' }}  */}
  return (
      <Overlay isVisible={context.loading} onBackdropPress={() => {return}}>
        <Image
        source={{uri:'https://i.pinimg.com/originals/90/80/60/9080607321ab98fa3e70dd24b2513a20.gif'}}
        style={{ marginTop: 20, width: 450, height: 900 }}
        />
        {/* <View style={{ alignItems: 'center' }}>
          <Text>test</Text>
        </View> */}
      </Overlay>
  )
}