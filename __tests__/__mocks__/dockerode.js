const Dockerode = jest.genMockFromModule('dockerode');

Dockerode.prototype.getEvents = jest.fn().mockResolvedValue({
  on: jest.fn(() => null),
  emit: jest.fn(() => null),
});

Dockerode.prototype.getContainer = jest.fn().mockResolvedValue({
  inspect: jest.fn().mockResolvedValue({
    Id: '123456789',
    Name: 'foobar-container',
    NetworkSettings: {
      IPAddress: '172.17.0.2',
    },
    Config: {
      Env: ['VAR1=value1', 'VAR2=value2'],
    },
  }),
});

module.exports = Dockerode;
