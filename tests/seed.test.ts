import { seedHabitsIfEmpty } from '../db/seed';
import { db } from '../db/client';
import { habits as habitsTable } from '../db/schema';
import { categories as categoriesTable } from '../db/schema';
import { targets as targetsTable } from '../db/schema';
import { habitLogs as habitLogsTable } from '../db/schema';

jest.mock('../db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

const mockDb = db as unknown as { select: jest.Mock; insert: jest.Mock };

describe('seedHabitsIfEmpty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts data when the habits table is empty', async () => {
    const mockValues = jest.fn().mockResolvedValue(undefined);
    const mockFrom = jest.fn().mockResolvedValue([]);
    mockDb.select.mockReturnValue({ from: mockFrom });
    mockDb.insert.mockReturnValue({ values: mockValues });

    await seedHabitsIfEmpty();

    expect(mockDb.insert).toHaveBeenCalledWith(categoriesTable);
    expect(mockDb.insert).toHaveBeenCalledWith(habitsTable);
    expect(mockDb.insert).toHaveBeenCalledWith(targetsTable);
    expect(mockDb.insert).toHaveBeenCalledWith(habitLogsTable);
  });

  it('does nothing when habits already exist', async () => {
    const mockFrom = jest.fn().mockResolvedValue([
      { id: 1, name: 'Existing Habit' },
    ]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seedHabitsIfEmpty();

    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});
