import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { habits as habitsTable, habitLogs } from '@/db/schema';
import { Habit, HabitContext } from '../_layout';

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitContext);

  if (!context) return null;

  const { habits, setHabits } = context;

  const habit = habits.find(
    (h: Habit) => h.id === Number(id)
  );

  if (!habit) return null;

// log completed
  const logHabitToday = async () => {

    await db.insert(habitLogs).values({
      habitId: habit.id,
      date: new Date().toISOString(),
      value: 1
    });

    console.log('habit logged');
    router.back();
  };

// habit deleted
  const deleteHabit = async () => {
    await db
      .delete(habitsTable)
      .where(eq(habitsTable.id, Number(id)));

    const rows = await db.select().from(habitsTable);
    setHabits(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={habit.name} subtitle="Habit details" />
      <View>
        <Text style={styles.label}>Category</Text>
        <Text style={styles.value}> {habit.categoryId} </Text>
      </View>

      <PrimaryButton
        label="Log Habit Completed" onPress={logHabitToday}
      />

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Edit Habit" variant="secondary"
        onPress={() =>
            router.push({
                pathname: '../habit/[id]/edit',
                params: { id }
            })
          }
        />
      </View>

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Delete Habit" variant="secondary" onPress={deleteHabit} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },

  label: {
    fontSize: 14,
    color: '#64748B',
  },

  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },

  buttonSpacing: {
    marginTop: 10,
  },
});
