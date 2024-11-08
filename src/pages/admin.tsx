import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { AdminView } from 'src/sections/profile/view';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Admin - ${CONFIG.appName}`}</title>
      </Helmet>

      <AdminView />
    </>
  );
}
