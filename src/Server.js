import { Server as RPCServer } from 'jayson/promise';
import events from 'events';

export default class Server {
  constructor(registry, options = {}) {
    this.eventEmitter = new events.EventEmitter(this);
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

  start(host = 'localhost', port = '3000') {
    this.server = new RPCServer(this.methods, this.options);
    this.transport = this.server.http();

    this.transport.listen(port, host, (err)=>{
      if (err) throw err;
      this.registry.register(host, port);
      this.eventEmitter.emit('start', err);
    });
  }

  shutdown() {
    if (!this.transport) {
      return;
    }

    this.transport.close((err)=>{
      if (err) throw err;
      this.registry.deregister();
      this.eventEmitter.emit('stop');
    });
  }

  on(eventName, cb) {
    this.eventEmitter.on(eventName, cb);
  }
}
