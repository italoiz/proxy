import { EventEmitter } from 'events';
import dotenv from 'dotenv';
import dot from 'dot-object';

import docker from '../config/docker';
import templateService from '../services/template';

/**
 * @typedef {Object} EnvContainerInspectInfo
 * @property {Object} Config - The Config object.
 * @property {Object} Config.Env - The environment variables object.
 *
 * @typedef {import('dockerode').ContainerInspectInfo & EnvContainerInspectInfo} ContainerInspectInfo
 */

class ContainerEvents extends EventEmitter {
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
    this.on('started', templateService.listener);
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
    const container = await docker.getContainer(containerId);
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
    const EnvObject = dotenv.parse(Env);

    dot.set('Config.Env', EnvObject, inspectInfo);

    return inspectInfo;
  }
}

// start listen.
const containerEvents = new ContainerEvents();
containerEvents.startListen();

export default containerEvents;
