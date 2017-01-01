const rp = require('request-promise')

var options = {
    method: 'POST',
    uri: 'http://localhost:4000/api/user',
    body: {},
    json: true // Automatically stringifies the body to JSON
}

const socket = require('socket.io-client')('http://localhost:4000');
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

let token, userId
rp(options)
    .then(body => {
      token = body.token
      userId = body.userId
      return
    })
    .then(authenticate)
    .catch(function (err) {
        // POST failed...
    });


/*
"authenticate",
        {
            "location": {
                "coords": {
                    "latitude": 59.28832,
                    "accuracy": 5,
                    "longitude": 18.11787,
                    "altitude": 0
                }
            },
            "token": "eyJhbGciOiJIUzI1NiJ9.ZjgzNTE5NzItMmQ3Yi00YzYwLTk1ZjAtMjY5ZTA4OTcwYzZi.m-gFhljdZ6F7UQg9uHnpK8Abd6icavNCuaa3j7wPhps"
        }*/
