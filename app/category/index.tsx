import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitContext, Category } from '../_layout';

export default function IndexScreen() {
  const router = useRouter();
  const context = useContext(HabitContext);

  if (!context) return null;

  const { categories } = context;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Categories"
        subtitle={`${categories.length} categories created`}
      />

      <PrimaryButton
        label="Add Category"
        onPress={() => router.push({ pathname: '/category/add' })}
      />

      {/* List of all categories */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.length === 0 ? (
          <Text style={styles.emptyText}>No categories yet</Text>
        ) : (
          categories.map((category: Category) => (
            <Pressable
              key={category.id}
              style={styles.categoryCard}
              onPress={() =>
                router.push({
                  pathname: '/category/[id]',
                  params: { id: category.id.toString() },
                })
              }
            >
              {/* Show the category icon and name */}
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
            </Pressable>
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

  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  categoryIcon: {
    fontSize: 24,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },

  categoryColour: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },

  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});