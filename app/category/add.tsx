import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitContext } from '../_layout';

export default function AddCategory() {
  const router = useRouter();
  const context = useContext(HabitContext);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');

  if (!context) return null;
  const { loadData  } = context;

  const saveCategory = async () => {
      if (name.trim() === '') {
        alert('Please enter a category name');
        return;
      }
      if (icon.trim() === '') {
        alert('Please enter an icon');
        return;
      }
      await db.insert(categoriesTable).values({
        name,
        icon,
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
        <ScreenHeader title="Add Category" subtitle="Create a new category." />
        <View style={styles.form}>
          <FormField label="Category Name" value={name} onChangeText={setName} />
          <FormField label="Icon" value={icon} onChangeText={setIcon} />
        </View>

        <PrimaryButton label="Save Category" onPress={saveCategory} />
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
});