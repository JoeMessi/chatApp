const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
// import our helper functions
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');
const PORT = process.env.PORT || 5000;
// require router from router.js
const router = require('./router');

// express sever and socket set up
const app = express();
/*
creating an HTTP server with 'http.createServer', instead of having Express creating one)
it's useful if you want to reuse the HTTP server, for example to run socket.io within the same HTTP server instance
*/
const server = http.createServer(app);
const io = socketio(server);

app.use(router);
app.use(cors());


// all is wrapped inside on 'connection'
io.on('connection', (socket) => { // socket para is a client instance of socket
  // when the socket.emit 'join' happens in the client this is triggered
  // the callback is useful for error handling or a way to send back something to  the client
  socket.on('join', ({name, room}, callback) => {
    // we deconstruct error and user because addUser can return either an error or an user
    const { error, user } = addUser({id: socket.id, name, room});
    // if error return it in the callback
    if(error) return callback(error);
    // ELSE FROM NOW ON THE USER IS IN
    // welcome message after user signs in
    socket.emit('message', { user: 'admin', text: `${user.name} welcome to the room ${user.room}` });
    // broadcast method to send message to all but that specific user
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!`});
    // socket method that join a user in a room
    socket.join(user.room);
    // send room data to the current user room
    io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)} )
    callback();
  });


  // on method expect something to happen ( params: a keyword (name) and a callback triggered after the event is reconised )
  // emit method is the other way round, you emit data


  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', { user: user.name, text: message }) // message is coming from the client
    callback();
  })


  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    // if removeUser returns a user to remove
    if(user) {
      // send a message to the room notifing the remaining users that that user left
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` })
      // and send the new state of the room so everything is up to date
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
    }
  })


})


server.listen(PORT, () => console.log(`Server has started on port: ${PORT}`));
