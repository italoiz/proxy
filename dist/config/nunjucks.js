"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _nunjucks = require('nunjucks'); var _nunjucks2 = _interopRequireDefault(_nunjucks);

const templatePath = _path2.default.resolve(__dirname, '..', 'templates');

exports. default = _nunjucks2.default.configure(templatePath, {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
});
