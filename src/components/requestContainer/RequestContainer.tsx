import { db } from '@/firebase/config';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { CardRequest, IconAdd } from '..';

function RequestContainer({ state, menus }: any) {
  const [requests, setRequests] = state;

  const addMenu = () => {
    const menu = collection(db, 'requests');
    toast.promise(
      addDoc(menu, { name: '', price: 0, type: 'Efectivo' }).then((doc) => {
        setRequests((curr: any) => [...curr, { id: doc.id, name: '', price: 0, type: 'Efectivo' }]);
      }),
      {
        loading: 'Agregando...',
        success: <b>Menu agregado correctamente!</b>,
        error: <b>No se pudo agregar.</b>,
      }
    );
  };

  const deleteMenu = (id: string) => {
    const menu = doc(db, 'requests', id);
    toast.promise(
      deleteDoc(menu).then(() => {
        setRequests((curr: any) => curr.filter((menuItem: any) => menuItem.id !== id));
      }),
      {
        loading: 'Eliminando...',
        success: <b>Eliminado correctamente!</b>,
        error: <b>No se pudo eliminar.</b>,
      }
    );
  };

  const onChangeReq = (info: any) => {
    const newRequests = [];
    for (let i = 0; i < requests.length; i++) {
      const element = requests[i];
      if (element.id === info.id) {
        newRequests.push(info);
      } else {
        newRequests.push(element);
      }
    }
    setRequests(newRequests);
  };
  return (
    <div className="flex flex-wrap w-full">
      {requests.map((info: any, i: number) => (
        <CardRequest key={i} info={info} menus={menus} onChangeReq={onChangeReq} deleteMenu={deleteMenu} />
      ))}
      <div className="p-4 w-1/4">
        <div onClick={addMenu} className="flex rounded-lg gap-2 h-full bg-card p-8 justify-center items-center cursor-pointer">
          <IconAdd /> Agregar pedido
        </div>
      </div>
    </div>
  );
}

export default RequestContainer;
