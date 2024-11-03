const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const path = require('path')
const PORT = 3001;

let users = [];
let turn = null;

app.use(cors({ origin: true }));
app.use(express.static(path.resolve('')))

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "DELETE"]
    }
})

app.get('/', (req, res) => {
    return res.sendFile('index.html');
})

io.on('connection', (socket) => {

    if (users.length < 2) {
        let newGuy = {
            id: socket.id
        }
        users = [...users, newGuy];
    }

    if (users.length === 2) {
        let start = Math.round(Math.random());
        io.emit('game_start', {
            turn: users[start].id,
            users: users
        });
    }

    socket.on('move', data => {
        io.emit('pionMoved', data);
    })

    socket.on('block', data => {
        let turn = data.id === users[0].id ? users[1].id : users[0].id
        io.emit('caseBlocked', {
            id: data.id,
            ligne: data.ligne,
            colonne: data.colonne,
            turn: turn
        })
    })

    socket.on('disconnect', () => {
        users.forEach((user, index) => {
            if (user.id === socket.id) {
                users.splice(index, 1);
                io.emit('disco');
                return;
            }
        })
        console.log(`${socket.id} is disconnected`, users)
    })

    socket.on('gameOver', data => {
        let loser = users.filter(user => user.id === data.id)
        let winner = users.filter(user => user.id !== data.id)
        console.log(winner, loser);
        io.to(loser[0].id).emit('GameIsOver', {
            message: "Vous avez perdu !"
        })
        io.to(winner[0].id).emit('GameIsOver', {
            message: "Vous avez gagné !"
        })
    })
})

server.listen(PORT, () => console.log('Working on ' + PORT))