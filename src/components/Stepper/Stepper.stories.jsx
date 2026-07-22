import Stepper from './Stepper';

export default {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    currentStep: { control: { type: 'number', min: 1, max: 8 } },
  },
};

const defaultSteps = [
  { id: 1, label: 'Model\nProduk' },
  { id: 2, label: 'Ukuran' },
  { id: 3, label: 'Bahan' },
  { id: 4, label: 'Warna\nKemasan' },
  { id: 5, label: 'Finishing\nLaminasi' },
  { id: 'ellipsis', label: '', isEllipsis: true },
  { id: 8, label: '' },
];

export const Default = {
  args: {
    steps: defaultSteps,
    currentStep: 3,
  },
};

export const CustomSteps = {
  args: {
    steps: [
      { id: 1, label: 'Step 1' },
      { id: 2, label: 'Step 2' },
      { id: 3, label: 'Step 3' },
    ],
    currentStep: 2,
  },
};

export const Completed = {
  args: {
    steps: defaultSteps,
    currentStep: 9, // All completed
  },
};
