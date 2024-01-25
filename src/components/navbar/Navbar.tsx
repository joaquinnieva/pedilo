import { Button, Navbar, NavbarBrand, NavbarContent, Tooltip } from '@nextui-org/react';
import { MenuMessage, PreviewRequest, RequestModal } from '..';

export default function Nav({ requests, getData }: any) {
  return (
    <Navbar maxWidth="full" className="bg-card w-full ">
      <NavbarBrand className="ml-4">📦</NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4 mr-2" justify="center">
        <Tooltip content="Actualizar info 🔄️">
          <Button color="primary" onPress={getData} variant="bordered">
            Actualizar
          </Button>
        </Tooltip>
        <MenuMessage />
        <RequestModal spinOptions={requests.map((req: any) => ({ option: req.name }))} />
        <PreviewRequest requests={requests} />
      </NavbarContent>
    </Navbar>
  );
}
