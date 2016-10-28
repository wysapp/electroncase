const _ = require('lodash');
const path = require('path');


const child_process = require('child_process');

class MediaDetector {
  scan() {
    return new Promise((resolve, reject) => {
      let scriptPath;
      if ( process.env.NODE_ENV === 'development') {
        scriptPath = path.resolve(__dirname, '../bin/detect-media.ps1');
      }
    })
  }
}


module.exports = MediaDetector;