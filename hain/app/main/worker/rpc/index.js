'use strict';

const procMsg = require('./proc-msg');
const RpcChannel = require('../../shared/rpc-channel');

const rpc = RpcChannel.create('#worker', procMsg.send.bind(this), procMsg.on.bind(procMsg));

procMsg.start();

module.exports = rpc;