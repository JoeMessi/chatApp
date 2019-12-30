import React from 'react';
import './Messages.css';
import Message from '../Message/Message';
import ScrollToBottom from 'react-scroll-to-bottom';

const Messages = ({ messages, name }) => (
  <ScrollToBottom className='messages'>
    {messages.map((mess, i) => <div key={i}><Message message={mess} name={name} /></div>)}
  </ScrollToBottom>
)

export default Messages;
