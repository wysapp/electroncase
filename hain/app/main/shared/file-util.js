'use strict';

const fs = require('fs-extra');
const tarball = require('tarball-extract');

const self = {};

self.move = function(src, dst) {
  return new Promise((resolve, reject) => {
    fs.move(src, dst, { clobber: true}, (err) => {
      if (err) return reject(err);
      return resolve();
    })
  })
}