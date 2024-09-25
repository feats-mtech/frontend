import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { InventoryCreateView } from 'src/sections/inventory-create/view';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Inventory Create - ${CONFIG.appName}`}</title>
      </Helmet>

      <InventoryCreateView />
    </>
  );
}
