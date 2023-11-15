let users = [];

const addUser = ({ id, name, room }) => {
  console.log(users);
  //name = name.trim().toLowerCase();
  //room = room.trim().toLowerCase();
  if (!name || !room) {
    return { error: "name and room required" };
  }

  if (users.length) {
    const existingUser = users.find(
      (each) => each.name === name && each.room === room
    );

    if (existingUser) {
      return { error: "user already exist" };
    }
  }

  const user = { id, name, room };

  users.push(user);

  return { user };
};

const getUser = (id) => {
  return users.find((each) => each.id == id);
};

const getRoomUsers = (room) => {
  return users.filter((each) => each.room === room);
};

const removeUser = (id) => {
  const findIdx = users.findIndex((each) => each.id == id);

  if (findIdx >= 0) {
    return users.splice(findIdx, 1)[0];
  }
};
module.exports = {
  addUser,
  getUser,
  removeUser,
  getRoomUsers,
};

// let users = [];

// const addUsers = ({ id, name, room }) => {
//   console.log(users);
//   if (!name || !room) {
//     return { error: "name and room is required" };
//   }
//   //   name = name.trim().toLowerCase();
//   //   room = room.trim().toLowercase();

//   if (users.length) {
//     const existingUser = users.find(
//       (each) => each.name === name && each.room === room
//     );

//     if (existingUser) {
//       return { error: "User already exist" };
//     }
//   }
//   const user = { id, name, room };
//   users.push(user);
//   return { user };
// };

// const removeUser = (id) => {
//   const findIdx = users.findIndex((each) => each.id == id);

//   if (findIdx >= 0) {
//     return users.splice(findIdx, 1)[0];
//   }
// };

// const getUser = (id) => {
//   return users.find((each) => each.id == id);
// };

// const getUserInRoom = (room) => {
//   return users.filter((each) => each.room == room);
// };
// module.exports = {
//   addUsers,
//   removeUser,
//   getUser,
//   getUserInRoom,
// };
