'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tutumClb = require('tutum-clb');

var _tutumClb2 = _interopRequireDefault(_tutumClb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Registry {
  constructor(user, apiKey) {
    this.clb = new _tutumClb2.default(user, apiKey);
  }

  getService(service) {
    return this.clb.get(service).then(address => {
      return Promise.resolve(`http://${ address }`);
    });
  }

  register() {}

  deregister() {}

  watch() {
    this.clb.watch();
  }

}
exports.default = Registry;