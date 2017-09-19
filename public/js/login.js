// Login With Google
var provider = new firebase.auth.GoogleAuthProvider()

function googleLogout() {
  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    console.log('Logged out Successfully')
    alert('You have been logged out')
  }).catch(function (error) {
    // An error happened.
  })
}

function googleLogin() {
  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken
    // The signed-in user info.
    var user = result.user
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code
    var errorMessage = error.message
    // The email of the user's account used.
    var email = error.email
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential
  })
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // Assume user is signed in here
    // Fix button
    var button = document.getElementById('loginButton')
    button.onclick = function () {
      googleLogout()
    }
    button.style.cursor = 'pointer'
    button.style.cursor = 'hand'
    button.innerHTML = 'Logout of Google'

    var name, email, photoUrl, uid, emailVerified

    name = user.displayName
    email = user.email
    photoUrl = user.photoURL
    emailVerified = user.emailVerified

    // console.log("Signed in as: " + name);
    document.getElementById('headerName').innerHTML = name

    user.getToken(true).then(function (token) {
      // token is the value you'll need to remember for later
      // console.log("USER TOKEN:" + token);
    })
  } else {
    var button = document.getElementById('loginButton')
    button.onclick = function () {
      googleLogin()
    }
    button.style.cursor = 'pointer'
    button.style.cursor = 'hand'
    button.innerHTML = 'Login with Google'
  }
})
