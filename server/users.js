const users = [];

const addUser = ({id, name, room}) => {

    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // if someone with same name and room is trying to access the chat
    const existingUser = users.find(user => user.name === name && user.room === room);
    if(existingUser) {
      return {error: 'User name is taken'}
    }
    // new user object
    const user = {id, name, room};
    users.push(user);
    return { user }; // just to see what user was pushed
}

const removeUser = (id) => {
  const index = users.findIndex(user => user.id === id);
  if(index !== -1) {
    return users.splice(index, 1)[0];
  }
}

const getUser = (id) => users.find(user => user.id === id);


const getUsersInRoom = (room) => users.filter(user => user.room === room);


// exports our functions
module.exports = { addUser, removeUser, getUser, getUsersInRoom };
