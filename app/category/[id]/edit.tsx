import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { HabitContext } from '../../_layout';

export default function EditCategory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitContext);
  const [name, setName] = useState('');
  const [colour, setColour] = useState('');
  const [icon, setIcon] = useState('');

  const category = context?.categories.find(
    (c) => c.id === Number(id)
  );

  useEffect(() => {
    if (!category) return;
    setName(category.name);
    setColour(category.colour);
    setIcon(category.icon);

    console.log("category record is ", category);
  }, [category]);

  if (!context || !category) return null;

  const { setCategories } = context;

  const saveChanges = async () => {
      if (name.trim() === '') {
        alert('Please enter a category name');
        return;
      }
      if (colour.trim() === '') {
        alert('Please enter a colour');
        return;
      }
      if (icon.trim() === '') {
        alert('Please enter an icon');
        return;
      }
    await db
      .update(categoriesTable)
      .set({ name, colour, icon })
      .where(eq(categoriesTable.id, Number(id)));

    console.log("updated data");

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Edit Category" subtitle={`Update ${category.name}`} />
      <View style={styles.form}>
        <FormField label="Category name" value={name} onChangeText={setName} />
        <FormField label="Colour" value={colour} onChangeText={setColour} />
        <FormField label="Icon" value={icon} onChangeText={setIcon} />
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

