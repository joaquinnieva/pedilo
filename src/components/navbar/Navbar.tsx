import { Button, Navbar, NavbarBrand, NavbarContent, Tooltip } from '@nextui-org/react';
import { RefreshCcw } from 'lucide-react';
import { MenuMessage, PreviewRequest, RequestModal } from '..';

export default function Nav({ requests, getData }: any) {
  return (
    <Navbar maxWidth="full" className="bg-card w-full shadow-lg rounded-b-lg">
      <NavbarBrand className="ml-4">📦 Pedilo!</NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4 mr-2" justify="center">
        <RequestModal spinOptions={requests.map((req: any) => ({ option: req.name }))} />
        <PreviewRequest requests={requests} />

        <Tooltip content="Actualizar info 🔄️">
          <Button color="primary" onPress={getData} variant="bordered" className="px-2 min-w-6">
            <RefreshCcw />
          </Button>
        </Tooltip>
        <MenuMessage />
      </NavbarContent>
    </Navbar>
  );
}
