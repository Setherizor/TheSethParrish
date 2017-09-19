// ProjectURL: https://thesethparrish.firebaseio.com/
// Initialize Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope)
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err)
    })
  })
}

// Get a reference to the database service
database = firebase.database()
var c = null
var body = null

var config = database.ref('config')
config.on('value', function (snapshot) {
  var c = snapshot.val()

  body = document.body
  updateBody(c.body)
  updateNav(c.nav)
})

var updateBody = function (c) {
  body.style.background = c.background
  body.style.color = c.color
  document.getElementById('desc').innerHTML = c.desc
}

var updateNav = function (c) {
  var curr = document.querySelectorAll('.nav,.nav__right-wrapper')
  curr[0].style.background = c.main
  curr[1].style.background = c.main

  curr = document.querySelectorAll('.nav__toggle')
  curr.background = c.toggle

  curr = document.getElementById('logo')
  curr.color = c['logo-color']
  curr.innerHTML = '<strong>' + c.logo + '</strong>'
}

// Changes firebase value to send notifications to all connected clients.
function updateFields() {
  var input1 = document.getElementById('input1').value
  var input2 = document.getElementById('input2').value

  if (input1 !== '' && input1 !== null) firebase.database().ref('notify/title').set(input1)
  if (input2 !== '' && input2 !== null) firebase.database().ref('notify/body').set(input2)
}

document.getElementById('input1').onkeydown = function (event) {
  if (event.keyCode === 13) {
    updateFields()
  }
}

document.getElementById('input2').onkeydown = function (event) {
  if (event.keyCode === 13) {
    updateFields()
  }
}

function sendNotification() {
  firebase.database().ref('notify/send').set('true')
}
