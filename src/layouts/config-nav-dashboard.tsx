import { SvgColor } from 'src/components/svg-color';

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Home',
    path: '/',
    icon: icon('ic-home'),
  },
  {
    title: 'Inventory',
    path: '/inventory',
    icon: icon('ic-inventory'),
  },
  {
    title: 'Recipes',
    path: '/recipes',
    icon: icon('ic-recipes'),
  },
  {
    title: 'My Recipes',
    path: '/my-recipes',
    icon: icon('ic-allRecipes'),
  },
  {
    title: 'Expiring',
    path: '/expiring',
    icon: icon('ic-expiring'),
  },
];
