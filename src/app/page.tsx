'use client';
import { MenuContainers, Navbar, RequestContainer, Separator } from '@/components';
import { getMenus, getRequests } from '@/firebase/service';
import { Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [menus, setMenus] = useState<any>([]);
  const [requests, setRequests] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    setMenus(await getMenus());
    setRequests(await getRequests());
    setLoading(false);
  };

  useEffect(() => {
    window.addEventListener('focus', getData);
    getData();
    return () => {
      window.removeEventListener('focus', getData);
    };
  }, []);

  if (loading)
    return (
      <div className="h-screen w-screen grid bg-neutral place-content-center">
        <Spinner /> Actualizando información
      </div>
    );
  return (
    <section>
      <Navbar requests={requests} />
      <main className="dark flex min-h-[calc(100vh-64px)] flex-col bg-neutral items-center p-4">
        <Separator>Menus</Separator>
        <MenuContainers state={[menus, setMenus]} />
        <Separator>Pedidos</Separator>
        <RequestContainer state={[requests, setRequests]} menus={menus} />
        <Toaster position="bottom-right" />
      </main>
    </section>
  );
}
