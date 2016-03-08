'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _multitransportJsonrpc = require('multitransport-jsonrpc');

var _multitransportJsonrpc2 = _interopRequireDefault(_multitransportJsonrpc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

const RPCClient = _multitransportJsonrpc2.default.client;
const ClientTCP = _multitransportJsonrpc2.default.transports.client.tcp;

const defaultOptions = {
  timeout: null,
  retries: null,
  retryInterval: null,
  reconnects: null,
  reconnectClearInterval: null,
  stopBufferingAfter: null,
  logger: function logger() {}
};

class Client {
  constructor() {
    let server = arguments.length <= 0 || arguments[0] === undefined ? 'localhost' : arguments[0];
    let port = arguments.length <= 1 || arguments[1] === undefined ? '3000' : arguments[1];
    let options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    this.options = _lodash2.default.extend({}, defaultOptions, options);
    this.events = {
      message: null,
      retry: null,
      end: null,
      sweep: null,
      shutdown: null
    };
    this.client = new RPCClient(new ClientTCP(server, port, this.options));
  }

  autoRegister() {
    return new Promise((resolve, reject) => {
      this.client.request('rpc.methodList', [], (err, result) => {
        if (err) return reject(err);
        this.register(result);
        resolve(this);
      });
    });
  }

  register(methodName) {
    this.client.register(methodName);
  }

  on(eventName, cb) {
    if (this.events.hasOwnProperty(eventName)) {
      this.client.transport.on(eventName, cb);
    }
  }

  call(methodName) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return new Promise((resolve, reject) => {
      if (this.client[methodName]) {
        var _client;

        (_client = this.client)[methodName].apply(_client, _toConsumableArray(args.slice(0, args.length)).concat([(err, val) => {
          if (err) {
            return reject(err);
          }

          resolve(val);
        }]));
      } else {
        reject(new Error(`calling ${ methodName } method is not found`));
      }
    });
  }
}
exports.default = Client;