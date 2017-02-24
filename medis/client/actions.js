'use strict';

import { Client } from 'ssh2';
import net from 'net';
import Redis from 'ioredis';
import _ from 'lodash';

const actions = {
  connect(config)  {
    return dispatch => {
      if (config.ssh) {

      } else {
        handleRedis(config);
      }

      function handleRedis(config, override) {
        dispatch({type: 'updateConnectStatus', data: 'Redis connecting...'});
        const redis = new Redis(_.assign({}, config, override, {
          showFriendlyErrorStack: true,
          retryStrategy() {
            return false;
          }
        }));

        redis.once('connect', function() {
          redis.ping((err, res) => {
            if ( err) {
              if (err.message === 'Ready check failed: NOAUTH Authentication required.') {
                err.message = 'Redis Error: Access denied. Please double-check your password.';
              }
              alert(err.message);
              dispatch({type: 'disconnect'});
              return;
            }

            const version = redis.serverInfo.redis_version;
            if (version && version.length >= 5) {
              const versionNumber = Number(version[0] + version[2]);
              if (versionNumber < 28) {
                alert('Medis only supports Redis >= 2.8 because servers older than 2.8 don\'t support SCAN command, which means it not possible to access keys without blocking Redis.');
                dispatch({ type: 'disconnect' });
                return;
              }
            }

            dispatch({type: 'connect', data: {redis, config}});

          })
        });

        redis.once('end', function() {
          dispatch({type: 'disconnect'});
          alert('Redis Error: Connection failed');
        });
      }
    };
  }
};

export default function(type, data, callback) {
  if (actions[type]) {
    return actions[type](data, callback);
  }

  if (typeof data === 'function') {
    return { type, callback: data};
  }

  return { type, data, callback};
}