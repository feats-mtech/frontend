import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { MyRecipesView } from 'src/sections/recipes/view/my-recipes-view';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Products - ${CONFIG.appName}`}</title>
      </Helmet>
      <MyRecipesView />
    </>
  );
}
