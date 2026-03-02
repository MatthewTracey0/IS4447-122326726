import StudentCard from '@/components/StudentCard';
import { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Student = {
  id: number;
  name: string;
  major: string;
  year: string;
  count: number;
};

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Emilia', major: 'Computer Science', year: '3', count: 0 },
    { id: 2, name: 'Jackie', major: 'Business', year: '2', count: 0 },
    { id: 3, name: 'Sammy', major: 'Engineering', year: '4', count: 0 },
  ]);

  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const updateCount = (id: number, delta: number) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id
          ? { ...student, count: student.count + delta }
          : student
      )
    );
  };

  const removeStudent = (id: number) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const saveStudent = () => {
    if (!name.trim()) return;

    if (editingId) {
      setStudents(prev =>
        prev.map(student =>
          student.id === editingId
            ? { ...student, name, major, year }
            : student
        )
      );
      setEditingId(null);
    } else {
      const newStudent: Student = {
        id: Date.now(),
        name,
        major,
        year,
        count: 0,
      };
      setStudents(prev => [...prev, newStudent]);
    }

    setName('');
    setMajor('');
    setYear('');
  };

  const resetAll = () => {
    setStudents(prev =>
      prev.map(student => ({ ...student, count: 0 }))
    );
  };

  const total = students.reduce((sum, s) => sum + s.count, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.total}>Total Score: {total}</Text>

        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Major"
          value={major}
          onChangeText={setMajor}
          style={styles.input}
        />

        <TextInput
          placeholder="Year"
          value={year}
          onChangeText={setYear}
          style={styles.input}
        />

        <Button
          title={editingId ? 'Save Changes' : 'Add Student'}
          onPress={saveStudent}
          disabled={!name.trim()}
        />

        <View style={{ marginVertical: 10 }}>
          <Button title="Reset All" onPress={resetAll} />
        </View>

        {students.map(student => (
          <StudentCard
            key={student.id}
            {...student}
            onUpdate={updateCount}
            onRemove={removeStudent}
            onEdit={(id) => {
              const student = students.find(s => s.id === id);
              if (!student) return;

              setEditingId(id);
              setName(student.name);
              setMajor(student.major);
              setYear(student.year);
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  total: { fontSize: 22, marginBottom: 10 },
  input: { borderWidth: 1, marginVertical: 5, padding: 8 },
});