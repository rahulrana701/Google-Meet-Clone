const { Server } = require("socket.io");
const io = new Server(8000, {
    cors: true
});

// have to create a rooms object as we have to store the users in that room so that I can send the local
// description to all the users in that room.

const users = {};
const rooms = {};

io.on('connection', (socket) => {
    console.log('connected with socket server', socket.id);
    socket.on('new-user-joined', (data) => {
        console.log('socket mei user aaya', data.name);
        users[socket.id] = { name: data.name, room: data.roomno };
        socket.join(data.roomno);

        // Initialize the room data if it doesn't exist
        if (!rooms[data.roomno]) {
            rooms[data.roomno] = { users: [] };
        }
        rooms[data.roomno].users.push(socket.id);

        io.to(socket.id).emit('user-joined', data);
    });

    socket.on('joining-room', () => {
        const userData = users[socket.id];
        if (userData) {
            io.to(userData.room).emit('join-room', userData.name);
        }
    });

    socket.on('send', (message) => {
        const userData = users[socket.id];
        if (userData) {
            console.log(message);
            socket.to(userData.room).emit('recieve', message, userData.name);
        }
    });

    socket.on("localDescription", (params) => {
        if (users[socket.id]) {
            let roomId = users[socket.id].room;
            let otherUsers = rooms[roomId].users;

            otherUsers.forEach(otherUser => {
                if (otherUser !== socket.id) {
                    io.to(otherUser).emit("localDescription", {
                        description: params.description
                    });
                }
            });
        }
    });

    socket.on("remoteDescription", (params) => {
        if (users[socket.id]) {
            let roomId = users[socket.id].room;
            let otherUsers = rooms[roomId].users;

            otherUsers.forEach(otherUser => {
                if (otherUser !== socket.id) {
                    io.to(otherUser).emit("remoteDescription", {
                        description: params.description
                    });
                }
            });
        }
    });

    socket.on("iceCandidate", (params) => {
        if (users[socket.id]) {
            let roomId = users[socket.id].room;
            let otherUsers = rooms[roomId].users;

            otherUsers.forEach(otherUser => {
                if (otherUser !== socket.id) {
                    io.to(otherUser).emit("iceCandidate", {
                        candidate: params.candidate
                    });
                }
            });
        }
    });
    

    socket.on("iceCandidateReply", (params) => {
        if (users[socket.id]) {
            let roomId = users[socket.id].room;
            let otherUsers = rooms[roomId].users;

            otherUsers.forEach(otherUser => {
                if (otherUser !== socket.id) {
                    io.to(otherUser).emit("iceCandidateReply", {
                        candidate: params.candidate
                    });
                }
            });
        }                                                                                                                                                           
    });
    socket.on('disconnect', () => {
        const userData = users[socket.id];
        if (userData) {
            io.to(userData.room).emit('userleft', userData.name);

            // Remove the user from the room's user list
            if (rooms[userData.room]) {
                rooms[userData.room].users = rooms[userData.room].users.filter(user => user !== socket.id);
            }

            delete users[socket.id];
        }
    });
});
