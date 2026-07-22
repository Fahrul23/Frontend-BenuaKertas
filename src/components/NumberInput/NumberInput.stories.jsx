import NumberInput from './NumberInput';

export default {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    unit: { control: 'text' },
    value: { control: 'number' },
  },
};

export const Default = {
  args: {
    label: 'Panjang',
    unit: 'cm',
    defaultValue: 1,
  },
};

export const WithCustomUnit = {
  args: {
    label: 'Jumlah Pesanan',
    unit: 'pcs',
    defaultValue: 500,
  },
};
