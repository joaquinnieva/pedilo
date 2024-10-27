import { db } from '@/firebase/config';
import { getRequests } from '@/firebase/service';
import { Button } from '@nextui-org/react';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { CardRequest, Separator } from '..';

function RequestContainer({ state, menus, getData }: any) {
  const [requests, setRequests] = state;

  const addReq = (req: any) => {
    const reqs = collection(db, 'requests');
    toast.promise(
      addDoc(reqs, req).then(async (doc) => {
        await getData();
      }),
      {
        loading: 'Agregando...',
        success: <b>Menu agregado correctamente!</b>,
        error: <b>No se pudo agregar.</b>,
      }
    );
    const prevReqs = localStorage?.getItem?.('prevReqs') ? JSON.parse(localStorage?.getItem?.('prevReqs') || '') : { value: [] };
    localStorage.setItem('prevReqs', JSON.stringify({ value: [...prevReqs.value, req.name] }));
  };

  const deleteReq = (id: string) => {
    const menu = doc(db, 'requests', id);
    toast.promise(
      deleteDoc(menu).then(async () => {
        await getData();
      }),
      {
        loading: 'Eliminando...',
        success: <b>Eliminado correctamente!</b>,
        error: <b>No se pudo eliminar.</b>,
      }
    );
  };

  const onPressDelete = () => {
    toast.remove();
    toast(
      (t) => (
        <span className="flex items-center text-center flex-col">
          ¿Estás seguro de borrar todos los pedidos?
          <Button
            color="danger"
            variant="solid"
            onPress={() => {
              deleteAllReq();
              toast.dismiss(t.id);
            }}>
            Confirmar
          </Button>
        </span>
      ),
      { position: 'bottom-center' }
    );
  };

  const deleteAllReq = async () => {
    const reqs = await getRequests();

    const deleteAllByIds = async () => {
      for (const { id } of reqs) {
        const menu = doc(db, 'requests', id);
        await deleteDoc(menu);
      }
      setRequests([]);
    };

    toast.promise(deleteAllByIds(), {
      loading: 'Eliminando...',
      success: <b>Eliminados correctamente!</b>,
      error: <b>No se pudo eliminar.</b>,
    });
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
    <div className="w-full">
      <Separator>
        <div className="flex w-full justify-between items-center">
          Pedidos
          <Button className={''} color="danger" variant="flat" onPress={onPressDelete}>
            Resetear
          </Button>
        </div>
      </Separator>
      <div className="flex flex-wrap w-full">
        {requests.map((info: any, i: number) => (
          <CardRequest key={i} info={info} menus={menus} onChangeReq={onChangeReq} deleteReq={deleteReq} />
        ))}
        <CardRequest isNew addReq={addReq} menus={menus} />
      </div>
    </div>
  );
}

export default RequestContainer;
