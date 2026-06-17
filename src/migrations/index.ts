import * as migration_20260617_171645_initial from './20260617_171645_initial';

export const migrations = [
  {
    up: migration_20260617_171645_initial.up,
    down: migration_20260617_171645_initial.down,
    name: '20260617_171645_initial'
  },
];
