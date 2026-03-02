import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

type StudentCardProps = {
  id: number;
  name: string;
  major: string;
  year: string;
  count: number;
  onUpdate: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onEdit: (id: number) => void;
};

export default function StudentCard({
  id,
  name,
  major,
  year,
  count,
  onUpdate,
  onRemove,
  onEdit,
}: StudentCardProps) {
  return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
      <Text style={{ fontSize: 18 }}>{name}</Text>
      <Text>Major: {major}</Text>
      <Text>Year: {year}</Text>
      <Text>Count: {count}</Text>

      <Button title="+1" onPress={() => onUpdate(id, 1)} />
      <Button title="-1" onPress={() => onUpdate(id, -1)} />
      <Button title="Edit" onPress={() => onEdit(id)} />
      <Button title="Remove" onPress={() => onRemove(id)} />

      <Button
        title="View Details"
        onPress={() =>
          router.push({
            pathname: '/student/[id]',
            params: { id: id.toString() },
          })
        }
      />
    </View>
  );
}