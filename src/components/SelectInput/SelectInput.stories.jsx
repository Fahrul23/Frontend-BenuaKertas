import { SelectInput } from './';

export default {
  title: 'Components/SelectInput',
  component: SelectInput,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label untuk select input',
    },
    unit: {
      control: 'text',
      description: 'Unit yang ditampilkan di sebelah kanan (contoh: "pcs", "cm")',
    },
    value: {
      control: 'text',
      description: 'Value yang dipilih',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Status disabled',
    },
  },
};

const quantityOptions = [
  { value: '1000', label: '1000' },
  { value: '1500', label: '1500' },
  { value: '2000', label: '2000' },
  { value: '2500', label: '2500' },
  { value: '3000', label: '3000' },
];

export const Default = {
  args: {
    label: 'Kuantitas',
    unit: 'pcs',
    value: '',
    options: quantityOptions,
    placeholder: 'Pilih kuantitas...',
  },
};

export const WithValue = {
  args: {
    label: 'Kuantitas',
    unit: 'pcs',
    value: '1000',
    options: quantityOptions,
    placeholder: 'Pilih kuantitas...',
  },
};

export const WithoutUnit = {
  args: {
    label: 'Pilih Kategori',
    value: '',
    options: [
      { value: 'box', label: 'Box' },
      { value: 'packaging', label: 'Packaging' },
      { value: 'label', label: 'Label' },
    ],
    placeholder: 'Pilih kategori...',
  },
};

export const Disabled = {
  args: {
    label: 'Kuantitas',
    unit: 'pcs',
    value: '1000',
    options: quantityOptions,
    disabled: true,
  },
};

export const WithoutLabel = {
  args: {
    unit: 'pcs',
    value: '',
    options: quantityOptions,
    placeholder: 'Pilih...',
  },
};
