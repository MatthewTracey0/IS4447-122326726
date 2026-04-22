import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { habitLogs as habitLogsTable } from '@/db/schema';
import { useEffect, useState, useContext } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { HabitContext, HabitWithDetails } from '../_layout';


type HabitLog = {
  id: number;
  habitId: number;
  date: string;
  value: number;
};

// Gets the phone screen width
const screenWidth = Dimensions.get('window').width;

// Shared styling for all charts
const chartConfig = {
  backgroundColor: '#FFFFFF',
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.6,
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#2563EB',
  },
};

export default function StatsScreen() {
  const context = useContext(HabitContext);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);

  if (!context) return null;
  const { habitsWithDetails } = context;

  useEffect(() => {
    const loadLogs = async () => {
      const rows = await db.select().from(habitLogsTable);
      setHabitLogs(rows);
    };

    void loadLogs();
  }, []);

  // Makes sure that there is atleast 1 habit loaded and the user hasnt selected one already
  useEffect(() => {
    if (habitsWithDetails.length > 0 && selectedHabitId === null) {
      setSelectedHabitId(habitsWithDetails[0].id);
    }
  }, [habitsWithDetails, selectedHabitId]);

  // Loojs through habitWithDetails and finds the habit id that matches the selected id
  const selectedHabit = habitsWithDetails.find(
    (habit: HabitWithDetails) => habit.id === selectedHabitId
  );

const completedLogs = habitLogs.filter(
  log => log.value === 1 && log.habitId === selectedHabitId
);

  // DAILY DATA
  // Build labels and values for the last 7 days
  const dailyLabels: string[] = [];
  const dailyValues: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Label for each day like Mon Tue Wed
    dailyLabels.push(date.toLocaleDateString('en-GB', { weekday: 'short' }));

    const count = completedLogs.filter(log => {
      const logDate = new Date(log.date);
      return (
        logDate.getDate() === date.getDate() &&
        logDate.getMonth() === date.getMonth() &&
        logDate.getFullYear() === date.getFullYear()
      );
    }).length;

    dailyValues.push(count);
  }

  // WEEKLY DATA
  // Build labels and values for the last 4 weeks
  const weeklyLabels: string[] = [];
  const weeklyValues: number[] = [];

  for (let i = 3; i >= 0; i--) {
    const today = new Date();
    const day = today.getDay();

    // Work out the Monday of this week
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(diff - i * 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    weeklyLabels.push(`Wk${4 - i}`);

    // Count completed logs in that week
    const count = completedLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= startOfWeek && logDate <= endOfWeek;
    }).length;

    weeklyValues.push(count);
  }

  // MONTHLY DATA
  // Build labels and values for the last 6 months
  const monthlyLabels: string[] = [];
  const monthlyValues: number[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const month = date.getMonth();
    const year = date.getFullYear();

    // Label for each month like Jan Feb Mar
    monthlyLabels.push(date.toLocaleDateString('en-GB', { month: 'short' }));

    // Count completed logs in that month
    const count = completedLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getMonth() === month && logDate.getFullYear() === year;
    }).length;

    monthlyValues.push(count);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Stats"
          subtitle="Progress for each Habit"
        />
        {/* This is the dropdown */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedHabitId}
            onValueChange={(itemValue) => setSelectedHabitId(itemValue)}
          >
            {habitsWithDetails.map((habit: HabitWithDetails) => (
              <Picker.Item
                key={habit.id}
                label={habit.name}
                value={habit.id}
              />
            ))}
          </Picker>
        </View>

        {selectedHabit && (
          <View style={styles.selectedHabitCard}>
            <Text style={styles.selectedHabitName}>{selectedHabit.name}</Text>
            <Text style={styles.selectedHabitText}>
              Category: {selectedHabit.categoryName}
            </Text>
            <Text style={styles.selectedHabitText}>
              Frequency: {selectedHabit.frequency}
            </Text>
            <Text style={styles.selectedHabitText}>
              Target: {selectedHabit.targetValue}
            </Text>
          </View>
        )}

        {/* Daily bar chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily View</Text>
          <BarChart
            data={{
              labels: dailyLabels,
              datasets: [{ data: dailyValues }],
            }}
            width={screenWidth - 36}
            height={220}
            fromZero
            showValuesOnTopOfBars
            chartConfig={chartConfig}
            style={styles.chart}
          />
          <Text style={styles.summaryText}>
            Completed in last 7 days: {dailyValues.reduce((sum, value) => sum + value, 0)}
          </Text>
        </View>

        {/* Weekly line chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly View</Text>
          <LineChart
            data={{
              labels: weeklyLabels,
              datasets: [{ data: weeklyValues }],
            }}
            width={screenWidth - 36}
            height={220}
            fromZero
            bezier
            chartConfig={chartConfig}
            style={styles.chart}
          />
          <Text style={styles.summaryText}>
            Completed in last 4 weeks: {weeklyValues.reduce((sum, value) => sum + value, 0)}
          </Text>
        </View>

        {/* Monthly line chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly View</Text>
          <LineChart
            data={{
              labels: monthlyLabels,
              datasets: [{ data: monthlyValues }],
            }}
            width={screenWidth - 36}
            height={220}
            fromZero
            bezier
            chartConfig={chartConfig}
            style={styles.chart}
          />
          <Text style={styles.summaryText}>
            Completed in last 6 months: {monthlyValues.reduce((sum, value) => sum + value, 0)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },

  content: {
    paddingBottom: 24,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },

  chart: {
    borderRadius: 16,
  },

  summaryText: {
    fontSize: 15,
    color: '#0F172A',
    marginTop: 14,
  },

  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 14,
    overflow: 'hidden',
  },

  selectedHabitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  selectedHabitName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  selectedHabitText: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 4,
  },

});