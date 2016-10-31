export default class UrlMapper {

  constructor(db, update) {
    this._db = db;
    this._update = update;
    this._map = {};
    this._wildcards = {};

    this._db.find({}, (err, mappedUrls) => {
      mappedUrls.forEach((mappedUrl) => {
        this._addMemoryCopy(mappedUrl);
      });
      update();
    });
  }


  mappings() {
    const list = [];
    for (const key in this._map) {
      if (!this._map.hasOwnProperty(key)) {
        continue;
      }

      list.push(JSON.parse(JSON.stringify(this._map[key])));
    }

    for(const key in this._wildcards) {
      if ( !this._wildcards.hasOwnProperty(key)) {
        continue;
      }

      list.push(JSON.parse(JSON.stringify(this._wildcards[key])));
    }

    return list;
  }

  _addMemoryCopy(mappedUrl) {
    this._removeMemoryCopy(mappedUrl.url);

    if ( !mappedUrl.url) {
      return;
    }

    if ( mappedUrl.url.indexOf('*') === -1) {
      this._map[mappedUrl.url] = mappedUrl;
      return;
    }

    this._wildcards[mappedUrl.url] = mappedUrl;
  }

  _removeMemoryCopy(url) {
    delete this._map[url];
    delete this._wildcards[url];
  }
}