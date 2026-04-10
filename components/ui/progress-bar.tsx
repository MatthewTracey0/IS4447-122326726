import * as Progress from 'react-native-progress';
import { StyleSheet, View } from 'react-native';

type Props = {
  progress: number;
};

export default function HabitProgressBar({ progress }: Props) {
  return (
    <View style={styles.wrapper}>
      <Progress.Bar
        progress={progress}
        width={null}
        borderWidth={0}
        height={8}
        borderRadius={999}
        unfilledColor="#DBEAFE"
        color="#2563EB"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
    width: '100%',
  },
});