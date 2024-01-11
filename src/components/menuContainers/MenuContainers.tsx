import { db } from '@/firebase/config';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { CardMenu, IconAdd } from '..';

function MenuContainers({ state }: any) {
  const [menus, setMenus] = state;

  const addMenu = () => {
    const menu = collection(db, 'menu');
    toast.promise(
      addDoc(menu, { menu: '', price: 0 }).then((doc) => {
        setMenus((curr: any) => [...curr, { id: doc.id, menu: '', price: 0 }]);
      }),
      {
        loading: 'Agregando...',
        success: <b>Menu agregado correctamente!</b>,
        error: <b>No se pudo agregar.</b>,
      }
    );
  };

  const deleteMenu = (id: string) => {
    const menu = doc(db, 'menu', id);
    toast.promise(
      deleteDoc(menu).then(() => {
        setMenus((curr: any) => curr.filter((menuItem: any) => menuItem.id !== id));
      }),
      {
        loading: 'Eliminando...',
        success: <b>Eliminado correctamente!</b>,
        error: <b>No se pudo eliminar.</b>,
      }
    );
  };

  const changeInfo = (info: any) => {
    const newRequests: any = [];
    for (let i = 0; i < menus.length; i++) {
      const element = menus[i];
      if (element.id === info.id) {
        newRequests.push(info);
      } else {
        newRequests.push(element);
      }
    }
    setMenus(newRequests);
  };
  return (
    <div className="flex flex-wrap w-full">
      {menus.map((info: any, i: number) => (
        <CardMenu key={i} info={info} changeInfo={changeInfo} deleteMenu={deleteMenu} />
      ))}
      <div className="p-4 w-1/4">
        <div onClick={addMenu} className="flex rounded-lg gap-2 h-full bg-gray-700 p-8 justify-center items-center cursor-pointer">
          <IconAdd /> Agregar menu
        </div>
      </div>
    </div>
  );
}

export default MenuContainers;
