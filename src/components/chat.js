import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Chat() {
  useEffect(() => {
    console.log('abdallah zakaraa')
  }, [])
  return (
    <View style={styles.container}>
      <Text>Chat</Text>
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