import Tutum from 'tutum-clb';

export default class Registry {
  constructor(user, apiKey) {
    this.clb = new Tutum(user, apiKey);
  }

  getService(service) {
    return this.clb.get(service).then((address)=>{
      return Promise.resolve(`http://${address}`);
    });
  }

  register() {}

  deregister() {}

  watch() {
    this.clb.watch();
  }

}
