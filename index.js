'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.requestSendingMiddleware = requestSendingMiddleware;
exports.send = send;
exports.hcMiddleware = hcMiddleware;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function requestSendingMiddleware(store) {
  return function (next) {
    return function (action) {
      var payload = action.payload,
          meta = action.meta,
          type = action.type;
      // if its a network request
      // fire an action that indicates the request has
      // been sent

      if (payload && payload.then) {
        var requestSendingAction = {
          payload: null,
          type: type + 'Sent',
          meta: meta
        };
        store.dispatch(requestSendingAction);
      }
      return next(action);
    };
  };
}

function send(namespace, fnName, data) {
  var stringified = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === "object" ? JSON.stringify(data) : data;
  return _axios2.default.post('/fn/' + namespace + '/' + fnName, stringified).then(function (res) {
    if (typeof res.data === "string" && res.data.indexOf("Error") > -1) {
      return Promise.reject(new Error(res.data));
    }
    return Promise.resolve(res.data);
  }).catch(function (err) {
    console.log(err);
  });
}

function hcMiddleware(store) {
  return function (next) {
    return function (action) {
      var type = action.type,
          meta = action.meta;

      if (!(meta && meta.isHc)) return next(action);
      // the rest will be handled by redux-promises
      var sendRequest = send(meta.namespace, type, meta.data);
      sendRequest = meta.then ? sendRequest.then(meta.then) : sendRequest;
      var newAction = Object.assign({}, action, {
        payload: sendRequest
      }, {
        meta: Object.assign({}, meta, { isHc: false })
      });
      return next(newAction);
    };
  };
}
