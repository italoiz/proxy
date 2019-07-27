import docker from '../../src/config/docker';

import containerEvents from '../../src/events/container';

describe('Container | Events', () => {
  afterEach(async () => {
    const container = await docker.getContainer('123456789');

    container.inspect.mockResolvedValue({
      Id: '123456789',
      Name: 'foobar-container',
      NetworkSettings: {
        IPAddress: '172.17.0.2',
      },
      Config: {
        Env: ['VAR1=value1', 'VAR2=value2'],
      },
    });
  });

  it('should to be defined', () => {
    // const containerEvents = require('../../src/events/container').default;

    expect(containerEvents).toBeDefined();
    expect(containerEvents).not.toBeEmpty();
  });

  it('should to be exists startListen() method', () => {
    // const containerEvents = require('../../src/events/container').default;

    expect(containerEvents).toHaveProperty('startListen');
    expect(containerEvents.startListen).toBeInstanceOf(Function);
  });

  it('should to be call this.on() method when use startListen() method', () => {
    // const containerEvents = require('../../src/events/container').default;
    const spyOn = jest.spyOn(containerEvents, 'on');

    containerEvents.startListen();

    expect(spyOn).toHaveBeenCalled();
    spyOn.mockRestore();
  });

  it('should to be call this.on() with `start` event when use startListen() method', () => {
    // const containerEvents = require('../../src/events/container').default;
    const spyOn = jest.spyOn(containerEvents, 'on');

    containerEvents.startListen();

    expect(spyOn).toHaveBeenCalledWith('start', expect.any(Function));
    spyOn.mockRestore();
  });

  it('should to be exists $onStart() method', () => {
    // const containerEvents = require('../../src/events/container').default;

    expect(containerEvents).toHaveProperty('$onStart');
    expect(containerEvents.$onStart).toBeInstanceOf(Function);
  });

  it('should to get container when $onStart method called', () => {
    const spyGetContainer = jest.spyOn(docker, 'getContainer');

    const Actor = { ID: 'd0e8a1033d7d' };
    containerEvents.$onStart(Actor);

    expect(spyGetContainer).toHaveBeenCalledWith(Actor.ID);
    spyGetContainer.mockRestore();
  });

  it('should to inspect container when $onStart method called', async () => {
    const Actor = { ID: 'd0e8a1033d7d' };
    containerEvents.$onStart(Actor);

    const container = await docker.getContainer(Actor.ID);

    expect(container.inspect).toHaveBeenCalled();
  });

  it('should to emit `started` event to listeners when $onStart method called', async () => {
    const spyEmit = jest.spyOn(containerEvents, 'emit');

    const Actor = { ID: 'd0e8a1033d7d' };
    await containerEvents.$onStart(Actor);

    expect(spyEmit).toHaveBeenCalledWith(
      'started',
      expect.objectContaining({
        Config: {
          Env: expect.objectContaining({ VAR1: 'value1' }),
        },
      }),
      expect.any(Object)
    );

    spyEmit.mockRestore();
  });
});
