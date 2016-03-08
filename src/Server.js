import _ from 'lodash';
import jsonrpc, { server as RPCServer } from 'multitransport-jsonrpc';

const ServerTCP = jsonrpc.transports.server.tcp;

const defaultOptions = {
  retries: null,
  retry: null,
  retryInterval: null,
  logger: function() {},
};

export default class Server {
  constructor(options = {}) {
    this.options = _.extend({}, defaultOptions, options);
    this.scopes = {};
    this.events = {
      connection: null,
      message: null,
      closedConnection: null,
      listening: null,
      retry: null,
      error: null,
      shutdown: null,
    };
  }

  registers(scopes) {
    this.services = scopes;
  }

  register(methodName, scope) {
    this.scopes[methodName] = scope;
  }

  start(host = 'localhost', port = '3000') {
    this.server = new RPCServer(new ServerTCP(port, {
      ...this.options,
    }), this.scopes);

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

    this.server.shutdown(()=>{
      process.exit();
    });
  }

  on(eventName, cb) {
    if (this.events.hasOwnProperty(eventName)) {
      this.events[eventName] = cb;
    }
  }
}
