import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { HabitContext } from '../_layout';

export default function CategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitContext);

  if (!context) return null;

  const { categories, habits, setCategories } = context;

  const category = categories.find(
    (c) => c.id === Number(id)
  );

  if (!category) return null;

// exact same as habit[id].tsx but just one new check to make sure no habit is using the category
const deleteCategory = async () => {
  const linkedHabits = habits.filter(
    (habit) => habit.categoryId === Number(id)
  );

// Stop the delete if the category is still in use
  if (linkedHabits.length > 0) {
    alert('You cant delete this category because it is being used by a habit');
    return;
  }

  await db
    .delete(categoriesTable)
    .where(eq(categoriesTable.id, Number(id)));

// Reload the category and update the context
  const rows = await db.select().from(categoriesTable);
  setCategories(rows);
  router.back();
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={category.name} />
      <View>
        <Text style={styles.label}>Colour</Text>
        <Text style={styles.value}>{category.colour}</Text>
        <Text style={styles.label}>Icon</Text>
        <Text style={styles.value}>{category.icon}</Text>
      </View>

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Edit Category" variant="secondary"
          onPress={() =>
            router.push({
              pathname: '../category/[id]/edit',
              params: { id },
            })
          }
        />
      </View>

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Delete Category" variant="secondary" onPress={deleteCategory} />
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
    color: '#64748B'
  },

  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A'
  },

  buttonSpacing: {
    marginTop: 10
  },
});