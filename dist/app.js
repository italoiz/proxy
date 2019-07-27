"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _docker = require('./config/docker'); var _docker2 = _interopRequireDefault(_docker);
var _container = require('./events/container'); var _container2 = _interopRequireDefault(_container);

class Proxy {
  async start() {
    const stream = await _docker2.default.getEvents();

    stream.on('data', async buffer => {
      try {
        const { Type, Action, Actor } = JSON.parse(buffer.toString());

        /* istanbul ignore else */
        if (Type === 'container') {
          _container2.default.emit(Action, Actor);
        }
      } catch (err) {
        process.stdout.write(`${err.message}\n`);
        // throw new Error('Invalid container event');
      }
    });
  }
}

exports. default = new Proxy();
