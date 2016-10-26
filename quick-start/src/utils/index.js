const pjson = require('../../package.json');

export default {

  mod: (n, m) => {
    return ((n % m) + m) % m;
  },

  isAnime: (type) => {
    return (
      ['tv', 'movie', 'ova', 'special', 'ona', 'music']
      .indexOf(type ? type.toLowerCase() : '') > -1
    )
  },

  isUrl(string) {
    return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[:?\d]*)\S*$/.test(string);
  },

  version: () => {
    return pjson.version;
  }
};