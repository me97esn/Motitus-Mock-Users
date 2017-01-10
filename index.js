const rp = require('request-promise')
const socketIO = require('socket.io-client')

const numberOfUsers = 50
const latitude = 59.28832
const longitude = 18.11787

// Synchronous is fine
for (var i = 0; i < numberOfUsers; i++) {
  let token, userId

  const socket = socketIO('http://localhost:4000')
  socket.on('connect', ()=>console.log('connected'))
  const location = {
      coords: {
          latitude:latitude + (Math.random()-0.5) / 1000,
          accuracy: 5,
          longitude:longitude + (Math.random()-0.5) / 1000,
          altitude: 0
      }
  }


  function authenticate(){
    socket.emit('authenticate', {
          token,
          location})
  }

  function step(){
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
      .then(authenticate)
      .then(()=> setInterval(()=>{
        step()
      },1000))
      .catch(function (err) {
        console.error(err)
      })
}
