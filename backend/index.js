import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'
import messagesRoutes from './routes/messages.js'
import friendsRoutes from './routes/friends.js'
import http from 'http'
import { Server } from 'socket.io'

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true)
  next()
})

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser())
app.use(express.json())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  // console.log(`User connected ${socket.id}`)

  socket.on('join_room', (data) => {
    socket.join(data)
    console.log(`User with ID: ${socket.id} joined room: ${data}`)
  })

  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id)
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/friends', friendsRoutes)

app.listen(8800, () => {
  console.log('Api working')
})

server.listen(3001, () => {
  console.log('Server is working')
})
