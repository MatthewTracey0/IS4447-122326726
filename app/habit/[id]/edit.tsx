import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import FrequencyButton from '@/components/ui/frequency-button';
import CategoryButton from '@/components/ui/category-button';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { targets as targetsTable } from '@/db/schema';
import { HabitWithDetails, HabitContext } from '../../_layout';

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitContext);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [frequency, setFrequency] = useState<string | 'monthly'>('weekly');
  const [targetValue, setTargetValue] = useState('');

  const habit = context?.habitsWithDetails.find(
    (h: HabitWithDetails) => h.id === Number(id)
  );

  useEffect(() => {
    if (!habit) return;
    setName(habit.name);
    setCategoryId(String(habit.categoryId));
    setFrequency(habit.frequency);

    console.log("category is ", habit.categoryId);
    console.log("habit record is ", habit);
    console.log("targetValue is ", habit.targetValue);
    setTargetValue(habit.targetValue);

  }, [habit]);

  if (!context || !habit) return null;

  const { loadData  } = context;

  const saveChanges = async () => {
        if (name.trim() === '') {
          alert('Please enter a habit name');
          return;
        }
        if (categoryId.trim() === '') {
          alert('Please select a category');
          return;
        }
        if (targetValue.toString().trim() === '') {
          alert('Please enter a target value');
          return;
        }
        if (isNaN(Number(targetValue))) {
          alert('Target value must be a number');
          return;
        }
        if (Number(targetValue) <= 0) {
          alert('Target value must be greater than 0');
          return;
        }
    await db
      .update(habitsTable)
      .set({ name, categoryId: Number(categoryId) })
      .where(eq(habitsTable.id, Number(id)));

    await db
      .update(targetsTable)
      .set({ timePeriod: frequency, targetValue: Number(targetValue) })
      .where(eq(targetsTable.habitId, Number(id)));

    console.log("updated data");

    await loadData();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Edit Habit" subtitle={`Update ${habit.name}`} />
      <View style={styles.form}>
        <FormField label="Habit name" value={name} onChangeText={setName} />
          <View style={styles.row}>
            {context.categories.map(category => (
              <CategoryButton
                key={category.id}
                label={category.name}
                icon={category.icon}
                selected={Number(categoryId) === category.id}
                onPress={() => setCategoryId(String(category.id))}
              />
            ))}
          </View>
          <Text style={styles.label}>Frequency</Text>
          <FrequencyButton
            selectedId={frequency}
            setSelectedId={setFrequency}
          />
          <FormField
            label={`Target`}
            // targetValue has to be a string to show on screen
            value={targetValue.toString()}
            onChangeText={setTargetValue}
          />
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

label: {
  fontSize: 14,
  fontWeight: '500',
  marginTop: 10,
  marginBottom: 6,
  color: '#0F172A'
},

row: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: 10,
},

});
