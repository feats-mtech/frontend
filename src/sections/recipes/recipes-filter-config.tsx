export const EXISTING_INGREDIENT_OPTIONS = [{ value: 'yes', label: 'Yes' }];

export const CATEGORY_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Western', label: 'Western' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Local', label: 'Local' },
  { value: 'Others', label: 'Others' },
];

export const VALID_FILTER_CATEGORY = CATEGORY_OPTIONS.filter(
  (category) => category.value !== 'Any' && category.value !== 'Others',
).map((option) => option.value);
export const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

export const COOKING_TIME_OPTIONS = [
  { value: -1, label: 'Any' },
  { value: 30, label: 'Within 30mins' },
  { value: 60, label: 'Within an hour' },
  { value: 2400, label: 'Within a day' },
];

export const DIFFICULTY_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

export const DEFAULT_FILTERS = {
  existingIngredients: [],
  categories: [CATEGORY_OPTIONS[0].value],
  rating: null,
  cookingTime: COOKING_TIME_OPTIONS[0].value,
  difficulty: null,
};

export const _uomType = ['Kg', 'g', 'piece', 'teaspoon', 'ml'];
export const _ingredientType = ['Apple', 'Banana', 'Orange', 'Pineapple', 'Strawberry'];
