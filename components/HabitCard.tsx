import InfoTag from '@/components/ui/info-tag';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import HabitProgressBar from '@/components/ui/progress-bar';

// Used for now, data is split across tables currently
type Habit = {
  id: number;
  name: string;
  categoryName: string;
  frequency: 'weekly' | 'monthly';
  targetValue: number;
  completedCount: number;
};

type Props = {
  habit: Habit;
};

export default function HabitCard({ habit }: Props) {
  const router = useRouter();
  const openDetails = () =>
    router.push({ pathname: '/habit/[id]', params: { id: habit.id.toString() } });
  const habitSummary = `${habit.name}, ${habit.targetValue}, per ${habit.frequency}`;
  const progress = Math.min(habit.completedCount / habit.targetValue, 1);  // work out % progress

  return (
    <Pressable
      accessibilityLabel={`${habitSummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View>
        <Text style={styles.name}>{habit.name}</Text>
      </View>

      <View style={styles.tags}>
        <InfoTag label="Category" value={habit.categoryName} />
        <InfoTag label="Frequency" value={habit.frequency} />
        <InfoTag label="Target" value={habit.targetValue.toString()} />
      </View>

      <HabitProgressBar progress={progress} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  name: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
});
