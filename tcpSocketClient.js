// var WebSocket = require('ws')
// var ws = new WebSocket('ws://130.237.31.26:1755')

var net = require('net')

var client = new net.Socket()
client.connect(1337, '127.0.0.1', function () {
  console.log('Connected')
  client.write('Hello, server! Love, Client.')
  let counter = 0
  setInterval(()=>{
    counter ++
    console.log('Number:'+counter)
    client.write('Number:'+counter)
  },1000)
})

client.on('data', function (data) {
  console.log('Received: ' + data)
})

client.on('close', function () {
  console.log('Connection closed')
})
