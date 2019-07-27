import path from 'path';
import nunjucks from 'nunjucks';

const templatePath = path.resolve(__dirname, '..', 'templates');

export default nunjucks.configure(templatePath, {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
});
