// My cusotm notifcation solution
// Only runs here if SW is non existant
if (Notification.permission !== 'granted') {
  Notification.requestPermission()
}

function testNotification(title, icon, body, URL) {
  if (!Notification) {
    alert("I can't Notify you!")
    return
  }

  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
  }

  if (title == null && icon == null && body == null && URL == null) {
    title = '1'
    icon = 'favicon.ico'
    body = '1'
    URL = '1'
  }
  navigator.serviceWorker.ready.then(function (registration) {
    registration.showNotification(title, {
      icon: icon,
      body: body,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      tag: 'vibration-sample-Seff'
    })
  })
}

if ('serviceWorker' in navigator) {
  // Let it do its thing
} else {
  var notify = database.ref('notify')

  notify.on('value', function (snapshot) {
    var val = snapshot.val()
    if (val.send == true) {
      title = val.title
      icon = val.icon
      body = val.body
      URL = val.URL
      notification_api(title, icon, body, URL)
      // Set sent to false
      database.ref('notify/send').set('false')
      console.log('DFT notification sent')
    } else if (val.send != false) {
      // Data validation
      database.ref('notify/send').set('false')
    }
  })

  // Auto notification
  // notification_api("HI", "favicon.ico", "This works", "https://google.com");

  // BUTTON NOTIFICATIONS
  function notification_blank() {
    if (!Notification) {
      alert('Notification!')
      return
    }
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }

    var notification = new Notification('Welcome', {
      icon: 'https://avatars.devrant.io/v-11_c-1_b-1_g-m_9-1_1-1_16-6_3-4_8-1_7-1_5-1_12-1_6-7_10-4_2-15_15-19_18-1_4-1_19-1.png',
      body: 'Greetings from Seth!'
    })

    notification.onclick = function () {
      window.open('https://google.com')
    }
  }

  // My Notifications API
  function notification_api(title, icon, body, URL) {
    if (!Notification) {
      alert('Notification!')
      return
    }
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }

    var notification = new Notification(title, {
      icon: icon,
      body: body
    })

    notification.onclick = function () {
      window.open(URL)
    }
  }
}
