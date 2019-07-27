import docker from './config/docker';
import containerEvents from './events/container';

class Proxy {
  async start() {
    const stream = await docker.getEvents();

    stream.on('data', async buffer => {
      try {
        const { Type, Action, Actor } = JSON.parse(buffer.toString());

        /* istanbul ignore else */
        if (Type === 'container') {
          containerEvents.emit(Action, Actor);
        }
      } catch (err) {
        process.stdout.write(`${err.message}\n`);
        // throw new Error('Invalid container event');
      }
    });
  }
}

export default new Proxy();
