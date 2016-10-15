const ipc = require('electron').ipcRenderer;

const contextMenuBtn = document.getElementById('context-menu');

contextMenuBtn.addEventListener('click', function() {
  ipc.send('show-context-menu');
})