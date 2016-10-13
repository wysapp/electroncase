const storage = require('electron-json-storage');

const demoBtns = document.querySelectorAll('.js-container-target');

Array.prototype.forEach.call(demoBtns, function(btn) {
  btn.addEventListener('click', function(event) {
    event.target.parentElement.classList.toggle('is-open');

    storage.set('activeDemoButtonId', event.target.getAttribute('id'), function(err) {
      if (err) return console.error(err);
    })
  })
})

storage.get('activeDemoButtonId', function(err, id) {
  if (err) return console.error(err);
  if (id && id.length) document.getElementById(id).click();
})