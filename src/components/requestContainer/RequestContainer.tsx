import { db } from '@/firebase/config';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { CardRequest } from '..';

function RequestContainer({ state, menus }: any) {
  const [requests, setRequests] = state;

  const addReq = (req: any) => {
    const reqs = collection(db, 'requests');
    toast.promise(
      addDoc(reqs, req).then((doc) => {
        setRequests((curr: any) => [...curr, { id: doc.id, ...req }]);
      }),
      {
        loading: 'Agregando...',
        success: <b>Menu agregado correctamente!</b>,
        error: <b>No se pudo agregar.</b>,
      }
    );
  };

  const deleteReq = (id: string) => {
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
        <CardRequest key={i} info={info} menus={menus} onChangeReq={onChangeReq} deleteReq={deleteReq} />
      ))}
      <CardRequest isNew addReq={addReq} menus={menus} />
    </div>
  );
}

export default RequestContainer;
