const server = require('http').createServer((request, response) => {
    response.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*'
    })
    response.end('Hi!')
})
const socketIo = require('socket.io')
const io = socketIo(server, {
    cors: {
        origin: '*',
        credentials: false
    }
})

io.on('connection', socket => {
    console.log('Connection!', socket.id)
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId)
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})


const startServer = () => {
    const { address, port } = server.address()
    console.info(`Running on ${address}:${port}`)
}

server.listen(process.env.PORT || 3000, startServer)