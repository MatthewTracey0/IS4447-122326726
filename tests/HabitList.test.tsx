import React from 'react';
import { render } from '@testing-library/react-native';
import { HabitContext } from '../app/_layout';
import IndexScreen from '../app/(tabs)/index';

jest.mock('@/db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

const mockHabit = {
  id: 1,
  name: 'Drink Water',
  categoryId: 1,
  categoryName: 'Health',
  frequency: 'weekly',
  targetValue: 8,
  completedCount: 3,
};

describe('IndexScreen', () => {
  it('renders the habit and the add button', () => {
    const { getByText } = render(
      <HabitContext.Provider value={{ habits: [], habitsWithDetails: [mockHabit], setHabits: jest.fn(), categories: [], loadData: jest.fn(), habitLogs: [], }}>
        <IndexScreen />
      </HabitContext.Provider>
    );

    expect(getByText('Drink Water')).toBeTruthy();
    expect(getByText('Add Habit')).toBeTruthy();
  });
});
