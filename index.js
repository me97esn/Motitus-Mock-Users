const rp = require('request-promise')
const socketIO = require('socket.io-client')

var net = require('net')
const address = '130.237.31.63'
const numberOfUsers = 1
let latitude = 59.28832
let longitude = 18.11787
let port = 5000

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

    // Same ip and port a in Unity code
    client.connect(1337, address, function () {
    // client.connect(1337, '192.168.2.147', function () {
      console.log('Connected to the tcp socket server in unity')
    })

    client.on('data', function (data) {
      console.log('Received: ' + data)
    })

    client.on('close', function () {
      console.log('Connection closed')
    })

    return client
  }

  function rotateSlowly () {
    const dLong = -0.00002
    const dLat = 0.000002

    const dX = 0.1
    let x = 0
    setInterval(() => {
      x += dX
      longitude += dLong
      latitude += dLat
      const floatArr = new Float64Array([x, 0, 0, 0,Math.random() > 0.9 ? 1.0 : 0.0, longitude, latitude])
      const buffer = Buffer.from(floatArr.buffer)
      tcpSocketClient.write(buffer)
    }, 100)
  }

  function startSocketServer () {
    port++
    const socketPort = port

    console.log('starting socket server on port ', socketPort)

    var server = net.createServer(function (socket) {
      socket.on('data', function (chunk) {
        const floats = new Float64Array(chunk.buffer, chunk.byteOffset, chunk.byteLength / Float64Array.BYTES_PER_ELEMENT)
        console.log('data received: ', floats)
      })
    })
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
