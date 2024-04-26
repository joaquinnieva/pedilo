'use client';
import { MenuContainers, Navbar, RequestContainer } from '@/components';
import { getMenus, getRequests } from '@/firebase/service';
import { Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [menus, setMenus] = useState<any>([]);
  const [requests, setRequests] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const getData = async (load = false) => {
    load && setLoading(true);
    const data = { menus: await getMenus(), reqs: await getRequests() };
    setMenus(data.menus);
    setRequests(data.reqs);
    setLoading(false);
  };

  useEffect(() => {
    getData(true);
  }, []);

  return (
    <section className="dark bg-neutral w-full">
      <Navbar requests={requests} getData={getData} />
      <main className="dark flex min-h-[calc(100vh-64px)] flex-col w-full items-center px-4">
        <MenuContainers state={[menus, setMenus]} />
        <RequestContainer state={[requests, setRequests]} menus={menus} getData={getData} />

        <Toaster position="bottom-right" />
      </main>

      {loading && (
        <div className="h-screen w-screen grid fixed z-10 top-0 left-0 bg-neutral/50 place-content-center">
          <Spinner /> Actualizando información
        </div>
      )}
    </section>
  );
}
