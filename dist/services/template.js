"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);

var _nunjucks = require('../config/nunjucks'); var _nunjucks2 = _interopRequireDefault(_nunjucks);
var _nginx = require('./nginx'); var _nginx2 = _interopRequireDefault(_nginx);

class TemplateService {
  constructor() {
    this.template = _nunjucks2.default;
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
  async listener(containerInfo, container) {
    // generate virual hosts file.
    _nginx2.default.createVirtualHosts(containerInfo, this);
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
    return _nunjucks2.default.render(`${templateName}.njk`, context);
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
      destPath = _path2.default.resolve(__dirname, '..', '..', 'tmp', destPath);

      if (!_fs2.default.existsSync(_path2.default.dirname(destPath))) {
        _fs2.default.mkdirSync(_path2.default.dirname(destPath), { recursive: true });
      }
    }

    _fs2.default.writeFileSync(destPath, fileContent);
  }
}

exports. default = new TemplateService();
