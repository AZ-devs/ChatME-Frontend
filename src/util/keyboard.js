import React from 'react';
import { Keyboard, TouchableWithoutFeedback,KeyboardAvoidingView } from 'react-native';

export default DismissKeyboard = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};