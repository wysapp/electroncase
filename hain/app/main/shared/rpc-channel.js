'use strict';

const uuid = require('uuid');
const logger = require('./logger');

class RpcChannel {
  constructor(channel, send, listen) {
    this.channel = channel;
    this.send = send;
    this.topicFuncs = {};
    this.waitingHandlers = {};
    this._startListen(listen);
  }

  _startListen(listen) {
    listen(this.channel, (msg) => {
      const msgType = msg.type;
      if ( msgType === 'return') {
        this._handleReturnMessage(msg);
      } else if (msgType === 'call') {
        this._handleCallMessage(msg);
      }
    });
  }

  _handleReturnMessage(msg) {
    const { id, error } = msg;
    const waitingHandler = this.waitingHandlers[id];
    if ( waitingHandler === undefined) {
      return;
    }

    if ( error !== undefined) {
      waitingHandler.reject(error);
      delete this.waitingHandlers[id];
      return;
    }

    const result = msg.result;
    waitingHandler.resolve(result);
    delete this.waitingHandlers[id];
  }

  define(topic, func) {
    this.topicFuncs[topic] = func;
  }
}

module.exports = {
  create: (channel, send, listen) => {
    return new RpcChannel(channel, send, listen);
  },
  createWithIpcRenderer: (channel, ipc) => {
    return new RpcChannel(channel, ipc.send.bind(ipc), (ipcChannel, listener) => {
      ipc.on(ipcChannel, (evt, msg) => listener(msg));
    });
  }
};