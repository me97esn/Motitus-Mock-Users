const rp = require('request-promise')
const socketIO = require('socket.io-client')

var net = require('net')

const numberOfUsers = 1
const latitude = 59.28832
const longitude = 18.11787
let port = 2000

// Synchronous is fine
for (var i = 0; i < numberOfUsers; i++) {
  let token, userId, tcpSocketClient

  const socket = socketIO('http://localhost:4000')
  socket.on('connect', () => console.log('connected to server with socket io'))
  const location = {
    coords: {
      latitude: latitude + (Math.random() - 0.5) / 1000,
      accuracy: 5,
      longitude: longitude + (Math.random() - 0.5) / 1000,
      altitude: 0
    }
  }

  function startSocketClient () {
    var client = new net.Socket()

    // Same ip and port as in Unity code
    client.connect(1337, '130.237.31.26', function () {
      console.log('Connected to the tcp socket server in unity')
      client.write('Hello, Unity! This is node.js talking.')
    })

    client.on('data', function (data) {
      console.log('Received: ' + data)
    })

    client.on('close', function () {
      console.log('Connection closed')
    })

    return client
  }

  function rotateSlowly(){
    let x=0,y=0,z=0
    setInterval(()=>{
      y += 0.1
      const transform = {rotate:[x,y,z]}
      tcpSocketClient.write(JSON.stringify({transform})+ '<EOF>')
    }, 1000/60)
  }

  function startSocketServer () {
    port++
    const socketPort = port

    console.log('starting socket server on port ', socketPort)

    var server = net.createServer(function (socket) {
      socket.on('data', function (data) {
        console.log(`Received from tcp socket:${data} on port ${socketPort}`)
      })
    })
    const address = '127.0.0.1'
    server.listen(socketPort, address)
    return {address, port: socketPort}
  }

  function authenticate ({address, port}) {
    socket.emit('authenticate', {
      token,
      location,
      tcpSocketPort: port,
      ip: address})
  }

  function step () {
    location.coords.latitude += 0.00001
    location.coords.longitude += 0.00001
    socket.emit('location', {
      location})
  }

  // TODO just run one interval, so every user steps the same time
  rp({
    method: 'POST',
    uri: 'http://localhost:4000/api/user',
    body: {},
    json: true
  })
      .then(body => {
        token = body.token
        userId = body.userId
        return
      })
      .then(startSocketClient)
      .then(_tcpSocketClient => tcpSocketClient = _tcpSocketClient)
      .then(startSocketServer)
      .then(authenticate)
      .then(rotateSlowly)
      .catch(function (err) {
        console.error(err)
      })
}
