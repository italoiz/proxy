"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _events = require('events');
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _dotobject = require('dot-object'); var _dotobject2 = _interopRequireDefault(_dotobject);

var _docker = require('../config/docker'); var _docker2 = _interopRequireDefault(_docker);
var _template = require('../services/template'); var _template2 = _interopRequireDefault(_template);

/**
 * @typedef {Object} EnvContainerInspectInfo
 * @property {Object} Config - The Config object.
 * @property {Object} Config.Env - The environment variables object.
 *
 * @typedef {import('dockerode').ContainerInspectInfo & EnvContainerInspectInfo} ContainerInspectInfo
 */

class ContainerEvents extends _events.EventEmitter {
  /**
   * Start listen container events.
   *
   * @public
   * @method
   *
   * @returns {void}
   */
  startListen() {
    this.on('start', this.$onStart.bind(this));
    this.on('started', _template2.default.listener);
  }

  /**
   * When container start.
   *
   * @param {Object} actor - Actor received from container event.
   * @param {string} actor.ID - The container ID.
   *
   * @private
   * @method
   *
   * @returns {void}
   */
  async $onStart({ ID: containerId }) {
    const container = await _docker2.default.getContainer(containerId);
    const inspectInfo = await container.inspect().then(this.parseEnv);

    this.emit('started', inspectInfo, container);
  }

  /**
   * Parse `Config.Env` to object.
   *
   * @param {import('dockerode').ContainerInspectInfo} inspectInfo - The container info.
   *
   * @returns {ContainerInspectInfo}
   */
  parseEnv(inspectInfo) {
    const Env = inspectInfo.Config.Env.join('\n');
    const EnvObject = _dotenv2.default.parse(Env);

    _dotobject2.default.set('Config.Env', EnvObject, inspectInfo);

    return inspectInfo;
  }
}

// start listen.
const containerEvents = new ContainerEvents();
containerEvents.startListen();

exports. default = containerEvents;
