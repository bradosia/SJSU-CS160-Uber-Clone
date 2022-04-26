import http from 'http'
import {
  Server
} from 'socket.io'

function ChatServer(app) {
  const httpServer = http.createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    }
  })

  io.on('connection', socket => {
    console.log(`Chat User Connected: ${socket.id}`)

    socket.on('request_target', () => {
      io.allSockets().then((result) => {
        for (let item of result) {
          if (item != socket.id) {
            console.log('targets:', socket.id, item)
            socket.emit('receive_target', item)
            socket.to(item).emit('receive_target', socket.id)
          }
        }
      })
    })

    socket.on('send_pm', (data) => {
      console.log(data)
      socket.to(data.target).emit('receive_pm', data)
    })
  })

  httpServer.listen(4000, function() {
    console.log('Chat Socket server listening at http://localhost:4000')
  })
}

export default ChatServer;