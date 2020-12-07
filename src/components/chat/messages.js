import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ChatContext } from '../../context/chat';
import { If, Then } from 'react-if';
import { Image, Text, Avatar, Divider } from 'react-native-elements';



export default function Messages(props) {
  const context = useContext(ChatContext);
  return props.masgs.map((message, index) => {
    if (message.name === context.name) {
      return (
        <View key={`${message.name}+${index}`} style={{ alignItems: 'flex-end' }} >
          <If condition={index == 0 || props.masgs[index - 1].name !== message.name}>
            <Then >
              <Divider style={{ backgroundColor: '#262229', alignSelf: 'stretch'  , marginHorizontal : 45 ,  marginTop : 27 ,marginBottom : 5  }} />
              <View style={styles.message}>
                <Text style={{ marginRight: 3, fontSize: 18, fontWeight: 'bold' }}>{message.name}</Text>
                <Avatar rounded
                  source={{ uri: message.avatar }}
                  style={{ width: 30, height: 30 }}
                />
              </View>
            </Then>
          </If>
          <Text style={styles.textMessageR}>{message.text}</Text>
        </View>
      )
    } else {
      return (
        <View key={`${message.name}+${index}`} >
          <If condition={index == 0 || props.masgs[index - 1].name !== message.name}>
            <Then>
              <Divider style={{ backgroundColor: '#262229' , alignSelf: 'stretch'  , marginHorizontal : 45 , marginTop : 27 , marginBottom : 5 }} />
              <View style={styles.message}>
                <Avatar rounded
                  source={{ uri: message.avatar }}
                  style={{ width: 30, height: 30 }}
                />
                <Text style={{ marginLeft: 3, fontSize: 18, fontWeight: 'bold' }}>{message.name}</Text>
              </View>
            </Then>
          </If>
          <View  >
            <Text style={styles.textMessageL}>{message.text}</Text>
          </View>
        </View>

      )
    }
  })
}

const styles = StyleSheet.create({
  message: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
  },
  textMessageL: {
    marginLeft: 10,
    alignSelf: 'flex-start',
    fontSize: 16,
    padding: 5,
    margin: 5,
    color: 'black',
    backgroundColor: 'rgba(131, 123, 121, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(131, 123, 121, 0.6)',
    overflow: 'hidden'

  },
  textMessageR: {
    marginRight: 10,
    alignSelf: 'flex-end',
    fontSize: 16,
    padding: 5,
    margin: 5,
    color: 'black',
    backgroundColor: 'rgba(214, 60, 48, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(214, 60, 48, 0.6)',
    overflow: 'hidden'
  },
});