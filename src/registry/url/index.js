export default class Registry {
  constructor(url) {
    this.url = url;
  }

  getService() {
    return Promise.resolve(this.url);
  }

  register() {}

  deregister() {}

  watch() {}
}
