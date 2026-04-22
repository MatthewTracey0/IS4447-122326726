import { db } from './client';
import { sql } from 'drizzle-orm';

import { habits, habitLogs, categories, targets } from './schema';

export async function seedHabitsIfEmpty() {
  const existing = await db.select().from(habits);

  if (existing.length > 0) {
    return;
  }

  /* delete the data in the 4 tables
  await db.delete(habitLogs);
  await db.delete(targets);
  await db.delete(habits);
  await db.delete(categories);

  //have to reset the ids on the tables as it was causing data not to display
  await db.run(sql`DELETE FROM sqlite_sequence WHERE name = 'habit_logs'`);
  await db.run(sql`DELETE FROM sqlite_sequence WHERE name = 'targets'`);
  await db.run(sql`DELETE FROM sqlite_sequence WHERE name = 'habits'`);
  await db.run(sql`DELETE FROM sqlite_sequence WHERE name = 'categories'`);
  */

  await db.insert(categories).values([
    { name: 'Sleep', icon: '😴'},
    { name: 'Health', icon: '❤️'},
    { name: 'Study', icon: '📚'},
    { name: 'Hobbies', icon: '🎸'},
  ]);

  await db.insert(habits).values([
    { name: 'Sleep 7+ hours a day', categoryId: 1, createdAt: Date.now() },
    { name: 'No phone before bed', categoryId: 1, createdAt: Date.now() },
    { name: 'No food 2 hours before bed', categoryId: 1, createdAt: Date.now() },

    { name: 'Eat fruit and vegetables', categoryId: 2, createdAt: Date.now() },
    { name: 'Drink at least 2L of water', categoryId: 2, createdAt: Date.now() },
    { name: 'No fizzy drinks', categoryId: 2, createdAt: Date.now() },

    { name: 'Study 2+ hours a day', categoryId: 3, createdAt: Date.now() },
    { name: 'Do assignments', categoryId: 3, createdAt: Date.now() },
    { name: 'Use flashcards', categoryId: 3, createdAt: Date.now() },

    { name: 'Practise drawing', categoryId: 4, createdAt: Date.now() },
    { name: 'Play guitar', categoryId: 4, createdAt: Date.now() },
    { name: 'Practise soccer', categoryId: 4, createdAt: Date.now() },
  ]);

  await db.insert(targets).values([
    { habitId: 1, timePeriod: 'weekly', targetValue: 7 },
    { habitId: 2, timePeriod: 'weekly', targetValue: 7 },
    { habitId: 3, timePeriod: 'monthly', targetValue: 20 },

    { habitId: 4, timePeriod: 'monthly', targetValue: 14 },
    { habitId: 5, timePeriod: 'weekly', targetValue: 7 },
    { habitId: 6, timePeriod: 'weekly', targetValue: 7 },

    { habitId: 7, timePeriod: 'weekly', targetValue: 7 },
    { habitId: 8, timePeriod: 'weekly', targetValue: 5 },
    { habitId: 9, timePeriod: 'weekly', targetValue: 5 },

    { habitId: 10, timePeriod: 'monthly', targetValue: 5 },
    { habitId: 11, timePeriod: 'monthly', targetValue: 8 },
    { habitId: 12, timePeriod: 'weekly', targetValue: 2 },
  ]);

  await db.insert(habitLogs).values([
    { habitId: 1, date: '2026-04-06', value: 1 },
    { habitId: 1, date: '2026-04-07', value: 1 },
    { habitId: 1, date: '2026-04-09', value: 1 },
    { habitId: 1, date: '2026-04-10', value: 1 },
    { habitId: 1, date: '2026-04-11', value: 1 },
    { habitId: 1, date: '2026-04-13', value: 1 },
    { habitId: 1, date: '2026-04-14', value: 1 },
    { habitId: 1, date: '2026-04-15', value: 1 },
    { habitId: 1, date: '2026-04-16', value: 1 },
    { habitId: 1, date: '2026-04-17', value: 1 },
    { habitId: 1, date: '2026-04-18', value: 1 },
    { habitId: 1, date: '2026-04-19', value: 1 },
    { habitId: 1, date: '2026-04-20', value: 1 },
    { habitId: 1, date: '2026-04-21', value: 1 },
    { habitId: 1, date: '2026-04-22', value: 1 },

    { habitId: 2, date: '2026-04-06', value: 1 },
    { habitId: 2, date: '2026-04-07', value: 1 },
    { habitId: 2, date: '2026-04-08', value: 1 },
    { habitId: 2, date: '2026-04-09', value: 1 },
    { habitId: 2, date: '2026-04-10', value: 1 },
    { habitId: 2, date: '2026-04-11', value: 1 },
    { habitId: 2, date: '2026-04-12', value: 1 },
    { habitId: 2, date: '2026-04-13', value: 1 },
    { habitId: 2, date: '2026-04-14', value: 1 },
    { habitId: 2, date: '2026-04-15', value: 1 },
    { habitId: 2, date: '2026-04-16', value: 1 },
    { habitId: 2, date: '2026-04-17', value: 1 },
    { habitId: 2, date: '2026-04-18', value: 1 },
    { habitId: 2, date: '2026-04-19', value: 1 },

    { habitId: 3, date: '2026-03-14', value: 1 },
    { habitId: 3, date: '2026-03-15', value: 1 },
    { habitId: 3, date: '2026-03-16', value: 1 },
    { habitId: 3, date: '2026-03-17', value: 1 },
    { habitId: 3, date: '2026-03-18', value: 1 },
    { habitId: 3, date: '2026-03-19', value: 1 },
    { habitId: 3, date: '2026-03-20', value: 1 },
    { habitId: 3, date: '2026-03-21', value: 1 },
    { habitId: 3, date: '2026-03-22', value: 1 },
    { habitId: 3, date: '2026-03-20', value: 1 },
    { habitId: 3, date: '2026-03-21', value: 1 },
    { habitId: 3, date: '2026-03-22', value: 1 },
    { habitId: 3, date: '2026-04-01', value: 1 },
    { habitId: 3, date: '2026-04-02', value: 1 },
    { habitId: 3, date: '2026-04-03', value: 1 },
    { habitId: 3, date: '2026-04-04', value: 1 },
    { habitId: 3, date: '2026-04-05', value: 1 },
    { habitId: 3, date: '2026-04-06', value: 1 },
    { habitId: 3, date: '2026-04-07', value: 1 },
    { habitId: 3, date: '2026-04-08', value: 1 },
    { habitId: 3, date: '2026-04-09', value: 1 },
    { habitId: 3, date: '2026-04-10', value: 1 },
    { habitId: 3, date: '2026-04-11', value: 1 },
    { habitId: 3, date: '2026-04-12', value: 1 },
    { habitId: 3, date: '2026-04-13', value: 1 },
    { habitId: 3, date: '2026-04-14', value: 1 },
    { habitId: 3, date: '2026-04-15', value: 1 },
    { habitId: 3, date: '2026-04-16', value: 1 },
    { habitId: 3, date: '2026-04-17', value: 1 },
    { habitId: 3, date: '2026-04-18', value: 1 },
    { habitId: 3, date: '2026-04-19', value: 1 },
    { habitId: 3, date: '2026-04-20', value: 1 },

    { habitId: 4, date: '2026-02-17', value: 1 },
    { habitId: 4, date: '2026-02-18', value: 1 },
    { habitId: 4, date: '2026-02-19', value: 1 },
    { habitId: 4, date: '2026-02-20', value: 1 },
    { habitId: 4, date: '2026-02-21', value: 1 },
    { habitId: 4, date: '2026-03-03', value: 1 },
    { habitId: 4, date: '2026-03-08', value: 1 },
    { habitId: 4, date: '2026-03-09', value: 1 },
    { habitId: 4, date: '2026-03-12', value: 1 },
    { habitId: 4, date: '2026-03-14', value: 1 },
    { habitId: 4, date: '2026-04-17', value: 1 },
    { habitId: 4, date: '2026-04-18', value: 1 },

    { habitId: 5, date: '2026-04-07', value: 0 },
    { habitId: 6, date: '2026-04-05', value: 1 },

    { habitId: 7, date: '2026-04-07', value: 0 },
    { habitId: 8, date: '2026-04-06', value: 1 },
    { habitId: 9, date: '2026-04-05', value: 1 },

    { habitId: 10, date: '2026-04-07', value: 1 },
    { habitId: 11, date: '2026-04-06', value: 1 },
    { habitId: 12, date: '2026-04-05', value: 0 },
  ]);

}
