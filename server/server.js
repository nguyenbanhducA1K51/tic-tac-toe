import express from "express"
import path from "path"
import http from "http"
import { Server } from "socket.io"
import { generateRandomDigits } from './utils.js'
import cors from 'cors'
const app = express()
const server = http.createServer(app)
const __dirname = path.resolve();
const PORT = 3004


const io = new Server(server, {
    cors: {
        origin: '*'
    }
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors());

const room_ids = new Set()
let avail_rooms = new Set()
let hosts={}
const DIGITS = 5

const broadCast = (eventName, message) => {
    io.emit(eventName,message)
}
io.on("connection", socket => {

    console.log('Client connect');
    broadCast("avail_rooms",{ avail_rooms:[...avail_rooms]})
    socket.on('get_avail_rooms', () => {
        socket.emit('avail_rooms', { avail_rooms: [...avail_rooms] })
    })
    socket.on('exit', () => {

        console.log('User choose to left the room');
        let rid = socket.rid
        if (rid && room_ids.has(rid)) {

            console.log('Delete room', rid);
            room_ids.delete(rid)
        }
        if (rid && avail_rooms.has(rid)) {
            avail_rooms.delete(rid)
        }
        // broadCast("avail_rooms", { avail_rooms: [...avail_rooms] })
        socket.broadcast.to(rid).emit('user_left')
    })
    socket.on('disconnect', () => {
        console.log('User disconnected');
        let rid = socket.rid
        if (rid && room_ids.has(rid)) {

            console.log('Delete room', rid);
            room_ids.delete(rid)
            socket.broadcast.to(rid).emit('user_left')

        }
        if (rid && avail_rooms.has(rid)) {
            avail_rooms.delete(rid)
        }
    });
    socket.on("win", (e) => {
        console.log('sev win');
        room_ids.delete(socket.rid)
        socket.broadcast.to(socket.rid).emit('opp_win')
        
    })
    socket.on("new_room", (e) => {

        let rid = null
        while (rid === null || room_ids.has(rid)) {

            rid = generateRandomDigits(DIGITS)
        }

        room_ids.add(rid)
        avail_rooms.add(rid)
        console.log('sev new_room', rid);
        socket.rid = rid
        socket.join(rid)
        hosts[rid]=e.usr_name
        socket.emit("create_room", {
            "rid": rid
        })
        broadCast("avail_rooms", { avail_rooms: [...avail_rooms] })
    })
    socket.on("join_room", (e) => {
        console.log('se join_room');

        const rid = e.rid
        if (!room_ids.has(rid)) {
            socket.emit("wrong_rid")
        }
        else {
            socket.join(rid)
            socket.rid = rid
            
            if (avail_rooms.has(rid)) {
                avail_rooms.delete(rid)
            }
            const turn = Math.round(Math.random())

            socket.emit("room_connect", {
                "rid": rid,
                "turn": turn,
                "opp_usr_name":hosts[rid]
            })
            socket.broadcast.to(socket.rid).emit('other_join', {
                
                "turn": 1 - turn,
                "opp_usr_name":e.usr_name
            })
            broadCast("avail_rooms", { avail_rooms: [...avail_rooms] })
        }
    })
    socket.on("next_turn", (e) => {
        console.log('se next_turn');
        const rid = e.rid
        socket.broadcast.to(rid).emit('next_turn', e.pos)

    })

    socket.on("sendMsg", (e) => {
        // console.log('Sev sendMsg',e);

        const { rid, msg } = e
        socket.broadcast.to(rid).emit('otherMsg',{"msg":msg})

    })
})

server.listen(PORT, () => {
    console.log("Server open at ", PORT)
})
