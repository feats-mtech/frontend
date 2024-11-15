import { Ingredient } from '../../src/types/Ingredient';

export const mockIngredients: Ingredient[] = [
  {
    id: 1,
    name: 'apple',
    uom: 'kg',
    // 2 days from now
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    quantity: 5,
  },
  {
    id: 2,
    name: 'orange',
    uom: 'kg',
    // 4 days from now
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
    quantity: 1,
  },
  {
    id: 3,
    name: 'papaya',
    uom: 'kg',
    // 3 months from now
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
    quantity: 3,
  },
  {
    id: 4,
    name: 'bean',
    uom: 'g',
    // 2 days from now
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 8)).toISOString(),
    quantity: 5,
  },
  {
    id: 5,
    name: 'bread',
    uom: 'pieces',
    // 4 days from now
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 10)).toISOString(),
    quantity: 1,
  },
  {
    id: 6,
    name: 'milk',
    uom: 'l',
    // 3 months from now
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString(),
    quantity: 3,
  },
];
