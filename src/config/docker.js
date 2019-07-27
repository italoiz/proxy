import Docker from 'dockerode';

export default new Docker({
  socketPath: process.env.DOCKER_SOCK || '/app/docker.sock',
});
