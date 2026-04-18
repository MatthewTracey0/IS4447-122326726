import { db } from './client';
import { habits, habitLogs, categories, targets } from './schema';

export async function seedHabitsIfEmpty() {
  const existing = await db.select().from(habits);

  if (existing.length > 0) {
    return;
  }

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

  await db.insert(habitLogs).values([
    { habitId: 1, date: '2026-04-07', value: 1 },
    { habitId: 2, date: '2026-04-07', value: 0 },
    { habitId: 3, date: '2026-04-06', value: 1 },

    { habitId: 4, date: '2026-04-07', value: 1 },
    { habitId: 5, date: '2026-04-07', value: 0 },
    { habitId: 6, date: '2026-04-05', value: 1 },

    { habitId: 7, date: '2026-04-07', value: 0 },
    { habitId: 8, date: '2026-04-06', value: 1 },
    { habitId: 9, date: '2026-04-05', value: 1 },

    { habitId: 10, date: '2026-04-07', value: 1 },
    { habitId: 11, date: '2026-04-06', value: 1 },
    { habitId: 12, date: '2026-04-05', value: 0 },
  ]);

  await db.insert(targets).values([
    { habitId: 1, timePeriod: 'weekly', targetValue: 7 },
    { habitId: 2, timePeriod: 'weekly', targetValue: 7 },
    { habitId: 3, timePeriod: 'weekly', targetValue: 7 },

    { habitId: 4, timePeriod: 'weekly', targetValue: 7 },
    { habitId: 5, timePeriod: 'weekly', targetValue: 7 },
    { habitId: 6, timePeriod: 'weekly', targetValue: 7 },

    { habitId: 7, timePeriod: 'weekly', targetValue: 7 },
    { habitId: 8, timePeriod: 'weekly', targetValue: 5 },
    { habitId: 9, timePeriod: 'weekly', targetValue: 5 },

    { habitId: 10, timePeriod: 'weekly', targetValue: 3 },
    { habitId: 11, timePeriod: 'weekly', targetValue: 3 },
    { habitId: 12, timePeriod: 'weekly', targetValue: 2 },
  ]);
}
