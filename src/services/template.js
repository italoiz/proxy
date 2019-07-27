import path from 'path';
import fs from 'fs';

import nunjucks from '../config/nunjucks';
import nginxService from './nginx';

class TemplateService {
  constructor() {
    this.template = nunjucks;
    this.listener = this.listener.bind(this);
  }

  /**
   * Listener to container `started` event.
   *
   * @param {import('../events/container').ContainerInspectInfo} containerInfo - The container inspect info.
   * @param {import('dockerode').Container} container - The container object.
   *
   * @method
   * @public
   *
   * @returns {void}
   */
  async listener(containerInfo) {
    // generate virual hosts file.
    nginxService.createVirtualHosts(containerInfo, this);
  }

  /**
   * Render.
   *
   * @param {string} templateName
   * @param {Object} context
   *
   * @returns {string}
   */
  render(templateName, context) {
    return nunjucks.render(`${templateName}.njk`, context);
  }

  /**
   * Write.
   *
   * Write a template to file.
   *
   * @param {string} templateName
   * @param {string} destPath - The destination path.
   * @param {Object} context
   *
   * @returns {void}
   */
  write(templateName, destPath, context) {
    const fileContent = this.render(templateName, context);

    // destination path in development mode.
    if (process.env.NODE_ENV !== 'production') {
      destPath = /^\//.test(destPath) ? destPath.substring(1) : destPath;
      destPath = path.resolve(__dirname, '..', '..', 'tmp', destPath);

      if (!fs.existsSync(path.dirname(destPath))) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
      }
    }

    fs.writeFileSync(destPath, fileContent);
  }
}

export default new TemplateService();
