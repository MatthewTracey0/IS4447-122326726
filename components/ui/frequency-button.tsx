import React, { useMemo } from 'react';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';

type Props = {
  selectedId: string | undefined;
  setSelectedId: (id: string | undefined) => void;
};

export default function FrequencyButton({ selectedId, setSelectedId }: Props) {

  // Creating the two frequency options
  const radioButtons: RadioButtonProps[] = useMemo(() => ([
    {
      id: 'weekly',
      label: 'Weekly',
      value: 'weekly'
    },
    {
      id: 'monthly',
      label: 'Monthly',
      value: 'monthly'
    }
  ]), []);

  return (
    // Show the weekly and monthly radio buttons
    <RadioGroup
      radioButtons={radioButtons}
      selectedId={selectedId}
      onPress={setSelectedId}
      layout="row"
    />
  );
}