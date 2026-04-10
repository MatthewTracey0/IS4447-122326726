import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { categories as categoriesTable } from '@/db/schema';
import { targets as targetsTable } from '@/db/schema';
import { habitLogs as habitLogsTable } from '@/db/schema';
import { seedHabitsIfEmpty } from '@/db/seed';
import { eq } from 'drizzle-orm';

export type Habit = {
  id: number;
  name: string;
  categoryId: number;
  createdAt: number;
};

export type Category = {
  id: number;
  name: string;
  colour: string;
  icon: string;
};

export type Target = {
  id: number;
  habitId: number;
  timePeriod: string;
  targetValue: number;
};

export type HabitWithDetails = {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  frequency: 'weekly' | 'monthly';
  targetValue: number;
  completedCount: number;
};

type HabitContextType = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  habitsWithDetails: HabitWithDetails[];
  categories: Category[];
};

export const HabitContext = createContext<HabitContextType | null>(null);

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsWithDetails, setHabitsWithDetails] = useState<HabitWithDetails[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

useEffect(() => {
    const loadData = async () => {
      await seedHabitsIfEmpty();

      const habitRows = await db.select().from(habitsTable);
      const categoryRows = await db.select().from(categoriesTable);
      const habitLogRows = await db.select().from(habitLogsTable);

      const joinedRows = await db
        .select({
          habit: habitsTable,
          category: categoriesTable,
          target: targetsTable,
        })
        .from(habitsTable)
        .leftJoin(categoriesTable, eq(habitsTable.categoryId, categoriesTable.id))
        .leftJoin(targetsTable, eq(habitsTable.id, targetsTable.habitId));

    const mappedHabitsWithDetails: HabitWithDetails[] = joinedRows.map((row) => {

      // work out filter the number of habitlog records and put into completedcount
      const completedCount = habitLogRows.filter(
        log => log.habitId === row.habit.id
      ).length;

      return {
        id: row.habit.id,
        name: row.habit.name,
        categoryId: row.habit.categoryId,
        categoryName: row.category?.name ?? 'No category',
        frequency: row.target?.timePeriod === 'monthly' ? 'monthly' : 'weekly',
        targetValue: row.target?.targetValue ?? 0,
        completedCount,
      };
    });

      setHabits(habitRows);
      setCategories(categoryRows);
      setHabitsWithDetails(mappedHabitsWithDetails);
    };

    void loadData();
  }, []);

  return (
    <HabitContext.Provider value={{ habits, habitsWithDetails, setHabits, categories }}>
      <Stack />
    </HabitContext.Provider>
  );
}
