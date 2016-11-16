'use strict';

module.exports = class AppAPI {
  constructor(context) {
    this.appService = context.appService;
  }
  restart() {
    this.appService.restart();
  }
  quit() {
    this.appService.quit();
  }

  open(query) {
    this.appService.open(query);
  }
  close(dontRestoreFocus){
    this.appService.mainWindow.hide(dontRestoreFocus);
  }
}