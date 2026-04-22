import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState, useEffect } from 'react';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { habits as habitsTable, habitLogs, targets as targetsTable } from '@/db/schema';
import { HabitWithDetails, HabitContext } from '../_layout';

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitContext);
  const api_url = "https://zenquotes.io/api/quotes/";
  const [quote, setQuote] = useState('');

  if (!context) return null;

  const { loadData  } = context;

  // find the record in habitsWithDetails, copied from the edit.tsx
  const habit = context?.habitsWithDetails.find(
    (h: HabitWithDetails) => h.id === Number(id)
  );

  // log completed - add a habitlog record
  const logHabitToday = async () => {

    await db.insert(habitLogs).values({
      habitId: habit.id,
      date: new Date().toISOString(),
      value: 1
    });

    console.log('habit logged', habit.id);
    await loadData();
    router.back();
  };

  // habitlogs, target and habit deleted
  const deleteHabit = async () => {
    await db
      .delete(habitLogs)
      .where(eq(habitLogs.habitId, Number(id)));

    await db
      .delete(targetsTable)
      .where(eq(targetsTable.habitId, Number(id)));

    await db
      .delete(habitsTable)
      .where(eq(habitsTable.id, Number(id)));

    await loadData();
    router.back();
  };

  // inspiration quote api from zenquotes - no api key needed
  const getQuote = async () => {
    try {
      const response = await fetch(api_url);
      const data = await response.json();

      if (data) {
        // q is for it to return the quote
        setQuote(data[0].q);
      }
    } catch (error) {
      console.log("Error fetching quote:", error);
    }
  };

  useEffect(() => {
    getQuote();
  }, []);

  if (!habit) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={habit.name}/>

      <View style={styles.detailsSection}>
        <View style={styles.infoBlock}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}> {habit.categoryName} </Text>
        </View>

        <View style={styles.infoBlock}>
            <Text style={styles.label}>Frequency</Text>
            <Text style={styles.value}> {habit.frequency} </Text>
        </View>

        <View style={styles.infoBlock}>
            <Text style={styles.label}>Target</Text>
            <Text style={styles.value}>{habit.completedCount} out of {habit.targetValue}</Text>

              {habit.completedCount < habit.targetValue && (
                <Text style={styles.statusText}>
                  Target not met yet, Keep Going!
                </Text>
              )}
              {habit.completedCount === habit.targetValue && (
                <Text style={styles.statusText}>
                  Target met, Well Done!
                </Text>
              )}
              {habit.completedCount > habit.targetValue && (
                <Text style={styles.statusText}>
                  Target exceeded, Great Job!
                </Text>
              )}

              <Text style={styles.quoteText}>Inspirational Quote - {quote}</Text>

        </View>
      </View>

    <View style={styles.buttonGroup}>
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
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20
  },

  label: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2
  },

  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A'
  },

  buttonSpacing: {
    marginTop: 14
  },

  detailsSection: {
    marginTop: 12,
    marginBottom: 24,
  },

  infoBlock: {
    marginBottom: 16,
  },

buttonGroup: {
  marginTop: 8,
},

statusText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#0000FF',
  marginTop: 18,
},

quoteText: {
  fontSize: 14,
  color: '#64748B',
  marginTop: 26,
},

});
