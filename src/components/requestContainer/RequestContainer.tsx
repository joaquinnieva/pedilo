import { db } from '@/firebase/config';
import { getRequests } from '@/firebase/service';
import { Button, Popover as RPopover } from '@radix-ui/themes';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';
import { CardRequest, Popover, Separator } from '..';

function RequestContainer({ state, menus }: any) {
  const [requests] = state;

  const addReq = (req: any) => {
    const reqs = collection(db, 'requests');
    toast.promise(addDoc(reqs, req), {
      loading: 'Agregando...',
      success: 'Menu agregado correctamente',
      error: 'No se pudo agregar.',
    });
    const prevReqs = localStorage?.getItem?.('prevReqs') ? JSON.parse(localStorage?.getItem?.('prevReqs') || '') : { value: [] };
    localStorage.setItem('prevReqs', JSON.stringify({ value: [...prevReqs.value, req.name] }));
  };

  const deleteReq = async (req: any) => {
    const reqs = await getRequests();
    const id = reqs.find((reqs: any) => reqs.name === req.name && reqs.menu === req.menu)?.id || '';

    const menu = doc(db, 'requests', id);
    toast.promise(deleteDoc(menu), {
      loading: 'Eliminando...',
      success: 'Eliminado correctamente',
      error: 'No se pudo eliminar.',
    });
  };

  const deleteAllReq = async () => {
    const reqs = await getRequests();

    const deleteAllByIds = async () => {
      for (const { id } of reqs) {
        const menu = doc(db, 'requests', id);
        await deleteDoc(menu);
      }
    };

    toast.promise(deleteAllByIds(), {
      loading: 'Eliminando...',
      success: 'Eliminados correctamente!',
      error: 'No se pudo eliminar.',
    });
  };

  return (
    <div className="w-full">
      <Separator>
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-1 items-center">
            Pedidos <p className="font-normal text-xs">({requests?.length})</p>
          </div>
          <Popover
            align="end"
            trigger={
              <Button className={''} color="red" variant="soft">
                Resetear
              </Button>
            }
            content={
              <span className="flex items-center text-center flex-col gap-2">
                ¿Estás seguro de borrar todos los pedidos?
                <RPopover.Close>
                  <Button color="red" variant="solid" onClick={() => deleteAllReq()}>
                    Confirmar
                  </Button>
                </RPopover.Close>
              </span>
            }
          />
        </div>
      </Separator>
      <div className="flex flex-wrap w-full">
        {requests?.map((info: any, i: number) => (
          <CardRequest key={i} info={info} menus={menus} deleteReq={deleteReq} addReq={addReq} />
        ))}
        <CardRequest isNew addReq={addReq} menus={menus} />
      </div>
    </div>
  );
}

export default RequestContainer;
