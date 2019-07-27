import path from 'path';
import fs from 'fs';

import nunjucks from '../config/nunjucks';

class TemplateService {
  constructor() {
    this.template = nunjucks;
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
    return this.template.render(`${templateName}.njk`, context);
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
