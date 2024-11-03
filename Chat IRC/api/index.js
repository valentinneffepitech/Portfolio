const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const { channel } = require("diagnostics_channel");
const PORT = 3001;

let users = [];
let channels = [];
let sockets = {};

app.use(cors({ origin: true }));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE"]
    }
})

io.on('connection', (socket) => {
    console.log(`user ${socket.id} has connected`)
    sockets[socket.id] = socket;
    socket.on('userlog', (name) => {
        const user = {
            username: name,
            id: socket.id
        }
        socket.join(socket.id)
        users.push(user);
        if (name !== "") {
            io.emit('new user', [users, channels]);
        }
    })

    socket.on('join_channel', (room, name) => {
        let test = false;
        let results = [];
        let backrooms = socket.adapter.rooms.get(room);
        if (backrooms) {
            backrooms.forEach(user => {
                if (user === socket.id) {
                    test = true;
                }
                users.forEach(element => {
                    if (element.id === user) {
                        results.push({
                            username: element.username,
                            id: element.id
                        })
                    }
                })
            })
        }
        if (!test) {
            socket.join(room)
            io.to(room).emit('userjoin', {
                room: room,
                content: name + " has join the room !",
                author: name,
                user_id: socket.id,
                status: 'public'
            })
        }
        io.to(room).emit('users_channel', results)
    })

    socket.on('supprimer_channel', room => {
        let element;
        channels.forEach((chan) => {
            if (chan.room === room.room) {
                element = channels[channels.indexOf(chan)]
                console.log(element);
            }
        })
        if (!element) {
            return;
        }
        if (element.id_user !== socket.id) {
            return;
        }
        io.to(room.room).emit('getMSG', {
            room: room.room,
            content: room.room + " has been closed by its owner !",
            author: 'Server',
            user_id: socket.id,
            status: 'public'
        });
        io.socketsLeave(room.room)
        channels.forEach(() => {
            const channelIndex = channels.findIndex(({ salon }) => salon === room.room)
            channels.splice(channelIndex, 1)
        })
        io.emit('channel_deleted', {
            room: room.room,
            channels: channels
        })
    })

    socket.on('create_channel', (room) => {
        if (!socket.adapter.rooms.get(room)) {
            socket.join(room);
            channels.push({
                room: room,
                id_user: socket.id
            });
            io.emit('new room', channels);
        }
    })

    socket.on('changeNick', data => {
        users.forEach((user) => {
            if (user.id === socket.id) {
                let index = users.indexOf(user);
                users[index].username = data.username
                return;
            }
        })
        io.emit('updateUser', [data, users]);
        io.to(data.room).emit('users_channel');
    })

    socket.on('list_users', data => {
        if (data !== '') {
            let backroom = [...socket.adapter.rooms.get(data)];
            let results = [];
            backroom.forEach(room => {
                users.forEach(user => {
                    if (user.id === room) {
                        results.push({
                            username: user.username,
                            user_id: room
                        })
                    }
                })
            })
            io.to(socket.id).emit('users_channel', results)
        }
    })

    socket.on('disconnect', () => {
        socket.leave('users');
        let leaver;
        users.forEach((user) => {
            if (user.id === socket.id) {
                let index = users.indexOf(user);
                leaver = users[index];
                users.splice(index, 1);
                return;
            }
        })
        io.emit('disco', [users, leaver]);
        console.log(`${socket.id} is disconnected`)
    })

    socket.on('leaveroom', (room, user) => {
        io.to(room).emit('userleft', {
            room: room,
            content: user + " has left the room !",
            author: user,
            user_id: socket.id,
            status: 'public'
        })
        socket.leave(room)
    })

    socket.on('envoyer_message', data => {
        io.to(data.room).emit('getMSG', data);
    })
})


server.listen(PORT, () => console.log('working'))