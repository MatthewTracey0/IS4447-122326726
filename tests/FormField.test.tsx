import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FormField from '../components/ui/form-field';

describe('FormField', () => {
  it('renders the label and fires onChangeText', () => {
    const onChangeText = jest.fn();
    const { getByText, getByDisplayValue, getByPlaceholderText } = render(
      <FormField
        label="Habit Name"
        value=""
        placeholder="Enter habit name"
        onChangeText={onChangeText}
      />
    );

    expect(getByText('Habit Name')).toBeTruthy();

    fireEvent.changeText(getByPlaceholderText('Enter habit name'), 'Drink Water');
    expect(onChangeText).toHaveBeenCalledWith('Drink Water');
  });
});
