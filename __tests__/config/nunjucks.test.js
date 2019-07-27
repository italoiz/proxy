import nunjucks from 'nunjucks';

describe('Nunjucks | Config', () => {
  beforeEach(() => {
    // jest.resetModules();
  });

  it('should to be call nunjucks.configure() method', () => {
    const spyConfigure = jest.spyOn(nunjucks, 'configure');
    require('../../src/config/nunjucks');

    expect(spyConfigure).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        autoescape: true,
        trimBlocks: true,
        lstripBlocks: true,
      })
    );

    spyConfigure.mockRestore();
  });

  it('should to be return render() method when import', () => {
    const template = require('../../src/config/nunjucks').default;

    expect(template).toHaveProperty('render');
  });
});
