// var WebSocket = require('ws')
// var ws = new WebSocket('ws://130.237.31.26:1755')

var net = require('net')

var client = new net.Socket()
client.connect(1755, '130.237.31.26', function () {
  console.log('Connected')
  client.write('Hello, server! Love, Client.')
  let counter = 0
  setInterval(()=>{
    console.log('Number:'+counter ++)
    client.write('Number:'+counter)
  },1000)
})

client.on('data', function (data) {
  console.log('Received: ' + data)
  client.destroy() // kill client after server's response
})

client.on('close', function () {
  console.log('Connection closed')
})
