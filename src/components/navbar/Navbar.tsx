import { Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react';
import { MenuMessage, PreviewRequest, RequestModal } from '..';

export default function Nav({ requests }: any) {
  return (
    <Navbar maxWidth="full" className="bg-card w-full ">
      <NavbarBrand className="ml-4">📦</NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4 mr-2" justify="center">
        <MenuMessage />
        <RequestModal spinOptions={requests.map((req: any) => ({ option: req.name }))} />
        <PreviewRequest requests={requests} />
      </NavbarContent>
    </Navbar>
  );
}
