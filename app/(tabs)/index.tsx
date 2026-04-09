import HabitCard from '@/components/HabitCard';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import CategoryButton from '@/components/ui/category-button';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitWithDetails, HabitContext } from '../_layout';

export default function IndexScreen() {
  const router = useRouter();
  const context = useContext(HabitContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!context) return null;

  const { habitsWithDetails, categories } = context;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const categoryOptions = [
    'All',
    'Sleep',
    'Health',
    'Study',
    'Hobbies',
  ];

  const filteredHabits = habitsWithDetails.filter((habit: HabitWithDetails) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      habit.name.toLowerCase().includes(normalizedQuery);

// Used to check when a user clicks 'Sleep' button, and the habit belongs to category 1, its then shown
    const matchesCategory =
      selectedCategory === 'All' ||
    (
        selectedCategory === 'Sleep' && habit.categoryId === 1 ||
        selectedCategory === 'Health' && habit.categoryId === 2 ||
        selectedCategory === 'Study' && habit.categoryId === 3 ||
        selectedCategory === 'Hobbies' && habit.categoryId === 4
    );
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Habits"
        subtitle={`${habitsWithDetails.length} habits tracked`}
      />

      <PrimaryButton
        label="Add Habit"
        onPress={() => router.push({ pathname: '../add' })}
      />

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search habits"
        style={styles.searchInput}
      />

      <View style={styles.filterRow}>
         {categoryOptions.map(category => (
           <CategoryButton
             key={category}
             label={category}
             selected={selectedCategory === category}
             onPress={() => setSelectedCategory(category)}
           />
         ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredHabits.length === 0 ? (
          <Text style={styles.emptyText}>No habits match your filters</Text>
        ) : (
          filteredHabits.map((habit: HabitWithDetails) => (
              <HabitCard key={habit.id} habit={habit} />
          ))
        )}
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

  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
  },

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },

  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },

});
