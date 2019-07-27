import app from '../src/app';
import docker from '../src/config/docker';
import containerEvents from '../src/events/container';

describe('App', () => {
  let containerEventPayload;

  beforeEach(() => {
    process.env.DOCKER_SOCK = '/var/run/docker.sock';

    containerEventPayload = {
      Type: 'container',
      Action: 'start',
      Actor: {
        ID: 'e24ad433bd4b295663efdcb99e52e9a58ce6b1b4a08d6f2ccac5f27cc853e519',
      },
    };
  });

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

  it('should to be exists start() method', () => {
    expect(app).toHaveProperty('start');
    expect(app.start).toBeInstanceOf(Function);
  });

  it('should to be call docker.getEvents() to get container events', async () => {
    await app.start();

    expect(docker.getEvents).toHaveBeenCalled();
  });

  it('should to be listen `data` events from docker.getEvents() stream', async () => {
    const spyOn = await docker.getEvents().then(({ on }) => on);

    await app.start();

    expect(spyOn).toHaveBeenCalledWith('data', expect.any(Function));
  });

  it('should to be get data from `data` event inside callback function', async () => {
    const spyJSON = jest.spyOn(JSON, 'parse');

    const spyOn = await docker.getEvents().then(({ on }) => on);
    await app.start();

    const callback = spyOn.mock.calls[0][1];
    await callback(Buffer.from(JSON.stringify(containerEventPayload)));

    expect(spyJSON).toHaveBeenCalledWith(JSON.stringify(containerEventPayload));
    spyJSON.mockRestore();
  });

  it('should throw error when data from `data` event is invalid', async () => {
    const spyStdoutWrite = jest
      .spyOn(process.stdout, 'write')
      .mockReturnValue(null);

    const spyOn = await docker.getEvents().then(({ on }) => on);
    await app.start();

    const callback = spyOn.mock.calls[0][1];
    await callback(Buffer.from('{}{}'));

    // await expect(callback(Buffer.from('{}{}'))).rejects.toThrow();
    expect(spyStdoutWrite).toHaveBeenCalled();
  });

  it('should emit events to `containerEvents` when receive event from type container', async () => {
    // const spyJSON = jest.spyOn(JSON, 'parse');
    const spyEmitContainer = jest.spyOn(containerEvents, 'emit');

    const spyOn = await docker.getEvents().then(({ on }) => on);
    await app.start();

    const callback = spyOn.mock.calls[0][1];
    await callback(Buffer.from(JSON.stringify(containerEventPayload)));

    const { Actor, Action } = containerEventPayload;

    expect(spyEmitContainer).toHaveBeenCalledWith(Action, Actor);
    spyEmitContainer.mockRestore();
  });
});
