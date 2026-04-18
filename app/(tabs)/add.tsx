import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import CategoryButton from '@/components/ui/category-button';
import FrequencyButton from '@/components/ui/frequency-button';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { targets as targetsTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitContext } from '../_layout';

export default function AddHabit() {
  const router = useRouter();
  const context = useContext(HabitContext);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [frequency, setFrequency] = useState<string | 'monthly'>('weekly');
  const [targetValue, setTargetValue] = useState('');

  if (!context) return null;
  const { loadData, categories } = context;

// Making sure the user inputs text/number
  const saveHabit = async () => {
        if (name.trim() === '') {
          alert('Please enter a habit name');
          return;
        }
        if (categoryId === null) {
          alert('Please select a category');
        return;
        }
        if (targetValue.trim() === '') {
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
    // Insert the new habit into the habits table
    const [newHabitId] = await db.insert(habitsTable).values({
      name,
      categoryId: Number(categoryId),
      createdAt: Date.now(),
    })
    .returning({ id: habitsTable.id });;

    // get the habit.id value from above in newHabitId and use it to create the target table
    await db.insert(targetsTable).values({
       habitId: newHabitId.id,
       timePeriod: frequency,
       targetValue: Number(targetValue)
    });

    await loadData();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Add Habit" subtitle="Create a new habit." />
        <View style={styles.form}>
        <FormField label="Name of Habit" value={name} onChangeText={setName} />
        <Text style={styles.label}> Category </Text>

        <View style={styles.row}>
          {categories.map(category => (
            <CategoryButton
              key={category.id}
              label={category.name}
              icon={category.icon}
              selected={categoryId === category.id}
              onPress={() => setCategoryId(category.id)}
            />
          ))}
        </View>
          <Text style={styles.label}>Frequency</Text>
          <FrequencyButton
            selectedId={frequency}
            setSelectedId={setFrequency}
          />
          <FormField
            label={`Target (${frequency})`}
            value={targetValue}
            onChangeText={setTargetValue}
          />
        </View>

        <PrimaryButton label="Save Habit" onPress={saveHabit} />
        <View style={styles.backButton}>
          <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },

  content: {
    paddingBottom: 24,
  },

  form: {
    marginBottom: 6,
  },

  backButton: {
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
  marginBottom: 10
},

});
