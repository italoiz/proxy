import app from '../src/app';

describe('Server', () => {
  it('should to be call app.start() method from app module', () => {
    const spyStart = jest.spyOn(app, 'start');

    require('../src/server');

    expect(spyStart).toHaveBeenCalled();
    spyStart.mockRestore();
  });
});
