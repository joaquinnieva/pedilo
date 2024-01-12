'use client';
import { MenuContainers, RequestContainer, SendRequest, Separator } from '@/components';
import { getMenus, getRequests } from '@/firebase/service';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [menus, setMenus] = useState<any>([]);
  const [requests, setRequests] = useState<any>([]);

  const getData = async () => {
    setMenus(await getMenus());
    setRequests(await getRequests());
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <Separator>Menus</Separator>
      <MenuContainers state={[menus, setMenus]} />
      <Separator>Pedidos</Separator>
      <RequestContainer state={[requests, setRequests]} menus={menus} />
      <SendRequest requests={requests} />
      <Toaster />
    </main>
  );
}
