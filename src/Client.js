import { client } from 'jayson';

export default class Client {
  constructor(registry, options) {
    this.options = options;
    this.registry = registry;
    this.registry.watch();
  }

  call(service, method, params, id) {
    return this.registry.getService(service).then((address)=>{
      return new Promise((resolve, reject)=>{
        if (id === undefined) {
          client.http(address).request(method, params, (err, resp)=>{
            if (err) return reject(err);
            resolve(resp);
          });
        } else {
          client.http(address).request(method, params, id, (err, resp)=>{
            if (err) return reject(err);
            resolve(resp);
          });
        }
      });
    });
  }
}
