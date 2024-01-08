'use client';
import { MenuContainers, RequestContainer, Separator } from '@/components';
import SendRequest from '@/components/sendRequest/SendRequest';
import { useState } from 'react';

export default function Home() {
  const [menus, setMenus] = useState([{ id: 1, menu: 'Menu 1', price: 2500 }]);
  const [requests, setRequests] = useState([{ id: 1, name: 'Nombre', type: 'Efectivo' }]);
  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <Separator>Menus</Separator>
      <MenuContainers state={[menus, setMenus]} />
      <Separator>Pedidos</Separator>
      <RequestContainer state={[requests, setRequests]} menus={menus} />
      <SendRequest requests={requests} />
    </main>
  );
}
