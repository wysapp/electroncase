import _ from 'lodash';

export default {
  getList(listName) {
    const currentList= this.get(`list.${listName}`);
    return _.isEmpty(currentList) ? [] : currentList;
  },

  saveList(listName, list) {
    return this.set(`list.${listName}`, list);
  }, 
  
  get(key) {
    let currentStore = localStorage.getItem(key);
    if ( currentStore !== null) {
      try {
        currentStore = JSON.parse(currentStore);
      } catch (e) {
        currentStore = null;
      }
    }
    return currentStore;
  },

  set(key, data){
    return localStorage.setItem(key, JSON.stringify(data));
  }
}