import io from 'socket.io-client';

export const socket = io('https://chatmebackend.herokuapp.com/chat');
