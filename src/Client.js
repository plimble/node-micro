import _ from 'lodash';
import jsonrpc from 'multitransport-jsonrpc';

const RPCClient = jsonrpc.client;
const ClientTCP = jsonrpc.transports.client.tcp;

const defaultOptions = {
  timeout: null,
  retries: null,
  retryInterval: null,
  reconnects: null,
  reconnectClearInterval: null,
  stopBufferingAfter: null,
  logger: function() {},
};

export default class Client {
  constructor(server = 'localhost', port = '3000', options = {}) {
    this.options = _.extend({}, defaultOptions, options);
    this.events = {
      message: null,
      retry: null,
      end: null,
      sweep: null,
      shutdown: null,
    };
    this.client = new RPCClient(new ClientTCP(server, port, this.options));
  }

  autoRegister() {
    return new Promise((resolve, reject)=>{
      this.client.request('rpc.methodList', [], (err, result)=>{
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

  call(methodName, ...args) {
    return new Promise((resolve, reject)=>{
      if (this.client[methodName]) {
        this.client[methodName](...args.slice(0, args.length), (err, val)=>{
          if (err) {
            return reject(err);
          }

          resolve(val);
        });
      } else {
        reject(new Error(`calling ${methodName} method is not found`));
      }
    });
  }
}
