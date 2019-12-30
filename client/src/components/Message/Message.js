import React from 'react';
import './Message.css';
import ReactEmoji from 'react-emoji';

const Message = ({ message: {user, text}, name }) => {
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();

  // with this conditional statement we'll apply the correct style to the messages seen by the current user
  // in other words, if I sent it, it should be blue and on the right,
  // if I received it, it should be gray and on the left side
  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
     ? (
       <div className='messageContainer justifyEnd'>
         <p className='sentText pr-10'>{trimmedName}</p>
         <div className='messageBox backgroundBlue'>
           <p className='messageText colorWhite'>{ReactEmoji.emojify(text)}</p>
         </div>
       </div>
     )
     : (
       <div className='messageContainer justifyStart'>
         <div className='messageBox backgroundLight'>
           <p className='messageText colorDark'>{ReactEmoji.emojify(text)}</p>
         </div>
         <p className='sentText pl-10'>{user}</p>
       </div>
     )
  )
}

export default Message;
