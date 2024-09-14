import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RecipesView } from 'src/sections/recipes/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Products - ${CONFIG.appName}`}</title>
      </Helmet>

      <RecipesView />
    </>
  );
}
