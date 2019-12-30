// useState used for react hooks
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// importing css for Join
import './Join.css';

const Join = () => {
  // react hooks for name and room variable ( syntax: const [varName, setterFunc] = useState(initialValue) )
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');


  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <input placeholder="Room" className="joinInput mt-20" type="text" onChange={e => setRoom(e.target.value)} />
        </div>
        <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
          <button className={'button mt-20'} type="submit">Sign In</button>
        </Link>
      </div>
   </div>
  );
}

export default Join;
