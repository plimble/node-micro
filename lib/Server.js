'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _multitransportJsonrpc = require('multitransport-jsonrpc');

var _multitransportJsonrpc2 = _interopRequireDefault(_multitransportJsonrpc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ServerTCP = _multitransportJsonrpc2.default.transports.server.tcp;

const defaultOptions = {
  retries: null,
  retry: null,
  retryInterval: null,
  logger: function logger() {}
};

class Server {
  constructor() {
    let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    this.options = _lodash2.default.extend({}, defaultOptions, options);
    this.scopes = {};
    this.events = {
      connection: null,
      message: null,
      closedConnection: null,
      listening: null,
      retry: null,
      error: null,
      shutdown: null
    };
  }

  registers(scopes) {
    this.services = scopes;
  }

  register(methodName, scope) {
    this.scopes[methodName] = scope;
  }

  start() {
    let host = arguments.length <= 0 || arguments[0] === undefined ? 'localhost' : arguments[0];
    let port = arguments.length <= 1 || arguments[1] === undefined ? '3000' : arguments[1];

    this.server = new _multitransportJsonrpc.server(new ServerTCP(port, _extends({}, this.options)), this.scopes);

    for (const eventName in this.events) {
      if (this.events.hasOwnProperty(eventName)) {
        if (this.events[eventName]) {
          this.server.transport.on(eventName, this.events[eventName]);
        }
      }
    }
  }

  shutdown() {
    if (!this.server) {
      return;
    }

    this.server.shutdown(() => {
      process.exit();
    });
  }

  on(eventName, cb) {
    if (this.events.hasOwnProperty(eventName)) {
      this.events[eventName] = cb;
    }
  }
}
exports.default = Server;