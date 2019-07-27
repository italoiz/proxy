"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _dockerode = require('dockerode'); var _dockerode2 = _interopRequireDefault(_dockerode);

exports. default = new (0, _dockerode2.default)({
  socketPath: process.env.DOCKER_SOCK || '/app/docker.sock',
});
