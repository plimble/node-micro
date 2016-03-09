'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('jayson/promise');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Server {
  constructor(registry) {
    let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    this.eventEmitter = new _events2.default.EventEmitter(this);
    this.registry = registry;
    this.options = options;
    this.methods = {};
  }

  registers(methods) {
    this.methods = methods;
  }

  register(methodName, method) {
    this.methods[methodName] = method;
  }

  start() {
    let host = arguments.length <= 0 || arguments[0] === undefined ? 'localhost' : arguments[0];
    let port = arguments.length <= 1 || arguments[1] === undefined ? '3000' : arguments[1];

    this.server = new _promise.Server(this.methods, this.options);
    this.transport = this.server.http();

    this.transport.listen(port, host, err => {
      if (err) throw err;
      this.registry.register(host, port);
      this.eventEmitter.emit('start', err);
    });
  }

  shutdown() {
    if (!this.transport) {
      return;
    }

    this.transport.close(err => {
      if (err) throw err;
      this.registry.deregister();
      this.eventEmitter.emit('stop');
    });
  }

  on(eventName, cb) {
    this.eventEmitter.on(eventName, cb);
  }
}
exports.default = Server;