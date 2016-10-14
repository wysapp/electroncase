const ipc = require('electron').ipcRenderer;
const saveBtn = document.getElementById('save-dialog');

saveBtn.addEventListener('click', function(event) {
  ipc.send('save-dialog');
})

ipc.on('saved-file', function(event, path) {
  if ( !path) path= 'No Path';
  document.getElementById('file-saved').innerHTML = `Path selected: ${path}`;
})