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
    })
  }

  _handleReturnMessage(msg) {
    const {id, error} = msg;
    const waitingHandler = this.waitingHandler[id];
    if ( waitingHandler === undefined)
      return;
    
    if ( error !== undefined) {
      waitingHandler.reject(error);
      delete this.waitingHandlers[id];
      return;
    }

    const result = msg.result;
    waitingHandler.resolve(result);
    delete this.waitingHandlers[id];
  }

  _handleCallMessage(msg) {
    const { id, topic, payload } = msg;
    const topicFunc = this.topicFuncs[topic];
    if  (topicFunc === undefined) {
      this.send(this.channel, { type: 'return', id, error: 'no_func'});
      return;
    }

    let result;
    try {
      result = topicFunc(payload);
    } catch (e) {
      logger.error(e);
      this.send(this.channel, {type: 'return', id, error: e});
      return;
    }

    const isPromise = (result && typeof result.then === 'function');
    if (!isPromise) {
      this.send(this.channel, {type: 'return', id, result});
      return;
    }

    result
      .then((x) => this.send(this.channel, {type: 'return', id, result: x}))
      .catch((e) => {
        logger.error(e);
        this.send(this.channel, {type: 'return', id, error: e});
      });
  }

  define(topic, func) {
    this.topicFuncs[topic] = func;
  }
}


module.exports = {
  create: (channel, send, listen) => {
    return new RpcChannel(channel, send, listen);
  }
}