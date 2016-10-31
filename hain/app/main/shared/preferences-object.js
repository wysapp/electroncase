'use strict';

const lo_get = require('lodash.get');
const lo_isEqual = require('lodash.isequal');
const lo_assign = require('lodash.assign');

const EventEmitter = require('events');

const schemaDefaults = require('../../utils/schema-defaults');

class PreferencesObject extends EventEmitter {
  constructor(store, id, schema ) {
    super();

    this.store = store;
    
    this.id = id;
    this.schema = schema;

    this.model = {};
    this._isDirty = false;

    this.load();
  }

  get isDirty() {
    return this._isDirty;
  }

  load() {
    const defaults = schemaDefaults(this.schema);
    if ( this.store) {
      const loadedData = this.store.get(this.id);
      
      this.model = lo_assign({}, defaults, loadedData);
    } else {
      this.model = lo_assign({}, defaults);
    }
  }
}


module.exports = PreferencesObject;