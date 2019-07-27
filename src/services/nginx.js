import { spawnSync } from 'child_process';

class NginxService {
  constructor() {
    this.virtualHostTemplate = 'virtual-host';
    this.configPath = '/etc/nginx/conf.d';
  }

  /**
   * Create virtual host file to nginx server. Default path is
   * `/etc/nginx/conf.d/default.conf`.
   *
   * @param {import('../events/container').ContainerInspectInfo} containerInfo
   * @param {import('./template').default} templateService
   *
   * @returns {void}
   */
  createVirtualHosts(containerInfo, templateService) {
    if (!this.isGenerateVirtualHostFile(containerInfo.Config.Env)) return;

    const virtualHosts = this.getVirtualHosts(containerInfo);
    const filename = `${this.configPath}/${virtualHosts[0]}.conf`;

    const { Env } = containerInfo.Config;

    templateService.write(this.virtualHostTemplate, filename, {
      ...containerInfo,
      Env,
    });

    // restart nginx server
    this.restart();
  }

  /**
   * Is generate virtual host file
   *
   * @param {Object} envs - Environment variables.
   *
   * @returns {boolean}
   */
  isGenerateVirtualHostFile(envs) {
    return Object.keys(envs).includes('VIRTUAL_HOST') && !!envs.VIRTUAL_HOST;
  }

  /**
   * Get virtual hosts of container from `Config.Env.VIRTUAL_HOST`
   *
   * @param {import('../events/container').ContainerInspectInfo} containerInfo
   *
   * @returns {string[]}
   */
  getVirtualHosts(containerInfo) {
    return containerInfo.Config.Env.VIRTUAL_HOST.split(',').filter(
      domain => !!domain
    );
  }

  /**
   * Get version of Nginx.
   *
   * Return false if return a error or not exists, return version if exists.
   *
   * @returns {Boolean}
   */
  version() {
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
  restart() {
    if (this.version() !== false) {
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
