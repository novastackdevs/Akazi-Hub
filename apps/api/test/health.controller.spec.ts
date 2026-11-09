import { HealthController } from '../src/health.controller';

describe('HealthController', () => {
  const prisma = { $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]) };
  const controller = new HealthController(prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it('reports the service as healthy', () => {
    expect(controller.health()).toMatchObject({ status: 'ok', service: 'akazi-hub-api' });
  });

  it('checks database connectivity for readiness', async () => {
    await expect(controller.ready()).resolves.toEqual({ status: 'ready', database: 'connected' });
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });
});
