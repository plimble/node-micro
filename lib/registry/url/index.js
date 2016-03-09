"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Registry {
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
exports.default = Registry;