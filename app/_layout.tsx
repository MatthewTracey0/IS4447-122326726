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

// Shape of the data across the app
type HabitContextType = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  habitsWithDetails: HabitWithDetails[];
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  loadData: () => Promise<void>;
};

export const HabitContext = createContext<HabitContextType | null>(null);

// Function to work out which week of the year a date is in
const getWeekNumber = (date) => {
  const firstDay = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000))
  return Math.ceil((days + firstDay.getDay() + 1) / 7)
}

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsWithDetails, setHabitsWithDetails] = useState<HabitWithDetails[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const today = new Date();
  const currentMonth = new Date().getMonth();

    const loadData = async () => {
      await seedHabitsIfEmpty();

      // Load the basic tables
      const habitRows = await db.select().from(habitsTable);
      const categoryRows = await db.select().from(categoriesTable);
      const habitLogRows = await db.select().from(habitLogsTable);

        console.log("cat: ", categoryRows)

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
      const completedCount = habitLogRows.filter(log => {
        if (log.habitId === row.habit.id && log.value === 1) {
          const logDate = new Date(log.date);

          // For weekly habits, only count logs from this week
          if (row.target?.timePeriod === 'weekly') {
            if (getWeekNumber(logDate) === getWeekNumber(today)) {
              console.log("timePeriod", row.target?.timePeriod);
              console.log("week: ", getWeekNumber(logDate));
              return true;
            }
          }

          // For monthly habits, only count logs from this month
          if (row.target?.timePeriod === 'monthly') {
            if (logDate.getMonth() === currentMonth) {
              console.log("timePeriod", row.target?.timePeriod);
              console.log("month: ", logDate.getMonth());
              return true;
            }
          }
        }

        return false;
      }).length;

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

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <HabitContext.Provider value={{ habits, habitsWithDetails, setHabits, categories, setCategories, loadData }}>
      <Stack />
    </HabitContext.Provider>
  );
}
