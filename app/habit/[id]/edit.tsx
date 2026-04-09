import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { Habit, HabitContext } from '../../_layout';

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitContext);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const habit = context?.habits.find(
    (h: Habit) => h.id === Number(id)
  );

  useEffect(() => {
    if (!habit) return;
    setName(habit.name);
    setCategoryId(String(habit.categoryId));
  }, [habit]);

  if (!context || !habit) return null;

  const { setHabits } = context;

  const saveChanges = async () => {
    await db
      .update(habitsTable)
      .set({ name, categoryId: Number(categoryId) })
      .where(eq(habitsTable.id, Number(id)));

    const rows = await db.select().from(habitsTable);
    setHabits(rows);

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Edit Habit" subtitle={`Update ${habit.name}`} />
      <View style={styles.form}>
        <FormField label="Habit name" value={name} onChangeText={setName} />
        <FormField label="Category" value={categoryId} onChangeText={setCategoryId} />
        <FormField label="Frequency" value={categoryId} onChangeText={setCategoryId} />
      </View>

      <PrimaryButton label="Save Changes" onPress={saveChanges} />
      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
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
  form: {
    marginBottom: 6,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});
