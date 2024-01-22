'use client';
import { MenuContainers, RequestContainer, SendRequest, Separator } from '@/components';
import { getMenus, getRequests } from '@/firebase/service';
import { useEffect, useState } from 'react';
import { LoaderIcon, Toaster } from 'react-hot-toast';

export default function Home() {
  const [menus, setMenus] = useState<any>([]);
  const [requests, setRequests] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setMenus(await getMenus());
    setRequests(await getRequests());
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  if (loading)
    return (
      <div className="h-screen w-screen grid bg-neutral place-content-center">
        <LoaderIcon />
      </div>
    );
  return (
    <main className="dark flex min-h-screen flex-col bg-neutral items-center p-4">
      <Separator>Menus</Separator>
      <MenuContainers state={[menus, setMenus]} />
      <Separator>Pedidos</Separator>
      <RequestContainer state={[requests, setRequests]} menus={menus} />
      <SendRequest requests={requests} />
      <Toaster position="top-right" />
    </main>
  );
}
