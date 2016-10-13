const storage = require('electron-json-storage');

/*storage.keys(function(err, keys) {
  if ( err) throw err;

  for(var key of keys) {
    console.log('There is a key called: ' + key);
  }
})
*/
storage.get('activeSectionButtonId', function(err, id) {

  if (err) return console.error(err);

  if (id && id.length) {
    showMainContent();
    const section = document.getElementById(id);
    
    if ( section) section.click();
  } else {
    activateDefaultSection();
    displayAbout();
  }
})

document.body.addEventListener('click', function(event) {
  
  if ( event.target.dataset.section) {
    handleSectionTrigger(event);
  } else if(event.target.dataset.modal) {
    handleModalTrigger(event);
  } else if (event.target.classList.contains('modal-hide')) {
    hideAllModals();
  }
})

function handleSectionTrigger(event) {
  hideAllSectionsAndDeselectButtons();

  event.target.classList.add('is-selected');

  const sectionId = event.target.dataset.section + '-section';
  document.getElementById(sectionId).classList.add('is-shown');

  const buttonId = event.target.getAttribute('id');
  storage.set('activeSectionButtonId', buttonId, function(err) {
    if (err) return console.error(err);
  })
}

function activateDefaultSection() {
  document.getElementById('button-windows').click();
}


function showMainContent() {
  document.querySelector('.js-nav').classList.add('is-shown');
  document.querySelector('.js-content').classList.add('is-shown');
}

function displayAbout() {
  document.querySelector('#about-modal').classList.add('is-shown');
}