const rp = require('request-promise')
const socketIO = require('socket.io-client')
// Synchronous is fine
for (var i = 0; i < 10; i++) {
  let token, userId

  const socket = socketIO('http://localhost:4000')
  socket.on('connect', ()=>console.log('connected'))
  const location = {
      coords: {
          latitude: 59.28832,
          accuracy: 5,
          longitude: 18.11787,
          altitude: 0
      }
  }


  function authenticate(){
    socket.emit('authenticate', {
          token,
          location})
  }

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
      .then(authenticate)
      .catch(function (err) {
        console.error(err)
      })
}
