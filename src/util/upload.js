import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../firebase/config';

export const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      // return the blob
      resolve(xhr.response);
    };

    xhr.onerror = function () {
      // something went wrong
      reject(new Error('uriToBlob failed'));
    };
    // this helps us get a blob
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);

    xhr.send(null);
  });
};

export const uploadToFirebase = (blob,fileName,ext) => {
  if(ext=='jpg') ext='jpeg';
  return new Promise((resolve, reject) => {
    var storageRef = firebase.storage().ref();
    storageRef
      .child(`photos/${fileName}`)
      .put(blob, {
        contentType: `image/${ext}`,
      })
      .then((snapshot) => {
        blob.close();
        resolve(storageRef.child(`photos/${fileName}`).getDownloadURL());
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const imageHandler = async () => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Sorry, we need camera roll permissions to make this work!');
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      return result.uri
      // setURL(result.uri);
      // context.setAvatar(result.uri);
    }else return false
  }
};