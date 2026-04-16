import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
};

export default function CategoryButton({ label, icon, selected, onPress,}: Props) {
  return (

      <Pressable
        onPress={onPress}
        style={[
          styles.button,
          selected && styles.buttonSelected
        ]}
      >
        {/* Show the category name and icon */}
        <Text
            style={[
                styles.text,
                selected && styles.textSelected
            ]}
        >
            {label} {icon}
        </Text>

      </Pressable>
  );
}

const styles = StyleSheet.create({

  button: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },

  buttonSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#CBD5E1'
  },

  text: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500'
  },

  textSelected: {
    color: '#FFFFFF'
  }

});





