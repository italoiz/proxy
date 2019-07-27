import { spawnSync } from 'child_process';
import dot from 'dot-object';

import templateService from './template';

class NginxService {
  constructor() {
    this.configPath = '/etc/nginx/conf.d';
    this.containerReadyListener = this.containerReadyListener.bind(this);
  }

  /**
   * Listener `container_ready` event.
   *
   * @param {import('../events/container').ContainerInspectInfo} containerInfo - The container inspect info.
   * @param {import('dockerode').Container} container - The container object.
   *
   * @method
   * @public
   *
   * @returns {void}
   */
  containerReadyListener(containerInfo) {
    if (!this.isProxiedContainer(containerInfo)) return;

    // write template of virtual host.
    this.writeVirtualHostTemplate(containerInfo);

    // restart nginx server
    this.nginxRestart();
  }

  /**
   * Write template file.
   *
   * @param {import('../events/container').ContainerInspectInfo} containerInfo
   *
   * @return {void}
   */
  writeVirtualHostTemplate(containerInfo) {
    const filename = this.getVirtualHostFilename(containerInfo);

    // move `Config.Env` to root of object.
    dot.move('Config.Env', 'Env', containerInfo);

    templateService.write('nginx/server', filename, containerInfo);
  }

  /**
   * Get virtual host filename.
   *
   * @param {import('../events/container').ContainerInspectInfo} containerInfo
   *
   * @return {string}
   */
  getVirtualHostFilename(containerInfo) {
    const [virtualHost] = this.getVirtualHosts(containerInfo);

    return `${this.configPath}/${virtualHost}.conf`;
  }

  /**
   * Is generate virtual host file
   *
   * @param {import('../events/container').ContainerInspectInfo} containerInfo
   *
   * @returns {boolean}
   */
  isProxiedContainer({ Config: { Env } }) {
    return Object.keys(Env).includes('VIRTUAL_HOST') && !!Env.VIRTUAL_HOST;
  }

  /**
   * Get virtual hosts of container from `Config.Env.VIRTUAL_HOST`
   *
   * @param {import('../events/container').ContainerInspectInfo} containerInfo
   *
   * @returns {string[]}
   */
  getVirtualHosts({ Config: { Env } }) {
    return Env.VIRTUAL_HOST.split(',').filter(domain => !!domain);
  }

  /**
   * Get version of Nginx.
   *
   * Return false if return a error or not exists, return version if exists.
   *
   * @returns {Boolean}
   */
  nginxVersion() {
    try {
      const { error, stdout, status } = spawnSync('nginx', ['-v']);

      if (error || status !== 0) {
        throw new Error('could not find nginx');
      }

      return stdout.toString().trim();
    } catch (err) {
      return false;
    }
  }

  /**
   * Restart Nginx server.
   *
   * @returns {void}
   */
  nginxRestart() {
    if (this.nginxVersion() !== false) {
      try {
        const { error, status } = spawnSync('nginx', ['-s', 'reload']);

        if (error || status !== 0) {
          throw new Error('could not restart nginx');
        }
      } catch (err) {
        process.stdout.write(err.message);
      }
    } else if (process.env.NODE_ENV === 'production') {
      process.stderr.write('nginx not found');
      process.exit(126);
    }
  }
}

export default new NginxService();
