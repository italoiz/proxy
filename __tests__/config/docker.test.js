describe('Dockerode | Config', () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.DOCKER_SOCK;
  });

  it('should to be defined', () => {
    const docker = require('../../src/config/docker').default;

    expect(docker).toBeDefined();
  });

  it.skip('should to be have instance of Docker from dockerode library', () => {
    const Docker = require('dockerode');
    const docker = require('../../src/config/docker').default;

    expect(docker).toBeInstanceOf(Docker);
  });

  it('should to be call new Docker() with socket path correctly', () => {
    const Docker = require('dockerode');
    require('../../src/config/docker');

    expect(Docker).toHaveBeenCalledWith({
      socketPath: '/app/docker.sock',
    });
  });

  it('should to be call new Docker() with DOCKER_SOCK env var if exists', () => {
    process.env.DOCKER_SOCK = '/tmp/docker.sock';

    const Docker = require('dockerode');
    require('../../src/config/docker');

    expect(Docker).toHaveBeenCalledWith({ socketPath: '/tmp/docker.sock' });
  });
});
