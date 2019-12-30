import React, { useState, useEffect } from 'react';
//import { Container, Row, Col } from 'react-bootstrap';
import queryString from 'query-string'; // used to retrive data from url
import io from 'socket.io-client'; // socket.io for the client
import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

// empty socket variable
let socket;

const Chat = ({ location }) => {
  // react hooks for name and room variable ( syntax: const [varName, setterFunc] = useState(initialValue) )
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  // server endpoint variable
  const ENDPOINT = 'https://sever-side-chat-app.herokuapp.com/';

  // useEffect acts like a componentDidMount
  useEffect(() => {
    // get data from url using queryString
    // location is given to us as prop when rendering a component using react router
    // location.search is a string of only the paramenter of the url ( ?name=joe&room=Boe )
    // queryString give us an object from location.search
    // and we can deconstruct that into our variables
    const { name, room } = queryString.parse(location.search);

     socket = io(ENDPOINT); // instance of socket
     // set hooks state
     setName(name);
     setRoom(room);
     // socket emit method, takes a string and you can pass data as an object
     // the emit method will be reconised on the back end socket
     // 3rd para is a callback triggered only when the callback in the server is called
     socket.emit('join', {name, room}, () => {

     });

     // the return works as unmounting and disconnect the user
     return () => {
       socket.emit('disconnect');
       socket.off();
     }

  }, [ENDPOINT, location.search]) // array that specify when useEffect is called. if any of the items in the array changes useEffect is called again


  // state for messages
  useEffect(() => {
    // message method that adds a message to the array of messages in state
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    })
  }, [messages]); // again, this is triggered only when messages change

  // state for users
  useEffect(() => {
    socket.on('roomData', ({users}) => {
      setUsers(users);
    })
  }, [users]); // this is triggered only when users change


  // func for sending messages
  const sendMessage = (e) => {
    e.preventDefault();
    if(message) {
      socket.emit('sendMessage', message, () => setMessage('')); // when the callback from the server is called, it's handled here, we clear the input field by setting message to ''
    }
  }


  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room}/>
        <Messages messages={messages} name={name}/>
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users} />
    </div>
  );

} // end Chat component

export default Chat;
