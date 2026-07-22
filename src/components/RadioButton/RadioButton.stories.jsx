import { useState } from 'react';
import RadioButton from './RadioButton';

export default {
  title: 'Components/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text untuk radio button',
    },
    value: {
      control: 'text',
      description: 'Value dari radio button',
    },
    name: {
      control: 'text',
      description: 'Name group untuk radio button',
    },
    checked: {
      control: 'boolean',
      description: 'Status checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Status disabled',
    },
  },
};

// Default story
export const Default = {
  args: {
    label: '300 gsm',
    value: '300',
    name: 'thickness',
    checked: false,
  },
};

// Checked state
export const Checked = {
  args: {
    label: '300 gsm',
    value: '300',
    name: 'thickness',
    checked: true,
  },
};

// Disabled state
export const Disabled = {
  args: {
    label: '300 gsm',
    value: '300',
    name: 'thickness',
    checked: false,
    disabled: true,
  },
};

// Disabled and checked
export const DisabledChecked = {
  args: {
    label: '300 gsm',
    value: '300',
    name: 'thickness',
    checked: true,
    disabled: true,
  },
};

// Interactive group example
export const RadioGroup = () => {
  const [selected, setSelected] = useState('300');

  const options = [
    { label: '300 gsm', value: '300' },
    { label: '350 gsm', value: '350' },
    { label: '400 gsm', value: '400' },
    { label: '450 gsm', value: '450' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-color-secondary mb-4">Ketebalan Bahan</h3>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <RadioButton
            key={option.value}
            label={option.label}
            value={option.value}
            name="thickness"
            checked={selected === option.value}
            onChange={(e) => setSelected(e.target.value)}
          />
        ))}
      </div>
      <p className="text-sm text-color-gray mt-4">
        Selected: <strong>{selected} gsm</strong>
      </p>
    </div>
  );
};

// Without label
export const WithoutLabel = {
  args: {
    value: '300',
    name: 'thickness',
    checked: false,
  },
};
