import { db } from '@/firebase/config';
import { getDateString } from '@/functions/DateUtils';
import { Button, TextField, Tooltip } from '@radix-ui/themes';
import { doc, updateDoc } from 'firebase/firestore';
import { DollarSign, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Modal, Popover } from '..';
import { getMenus } from '@/firebase/service';

function CardMenu({ info = null, deleteMenu, addMenu, isNew = false }: any) {
  const [formInfo, setFormInfo] = useState(info);
  const [isOpen, setOpen] = useState(false);
  const onOpenChange = () => setOpen(!isOpen);
  const onOpen = () => {
    setFormInfo(info);
    setOpen(true);
  };

  const closeModal = () => {
    onOpenChange();
    setFormInfo(info);
  };

  const acceptEdition = async () => {
    const menuRes = await getMenus();
    const id = menuRes.find((menu: any) => menu.price === info.price && menu.menu === info.menu)?.id || '';
    toast.promise(updateDoc(doc(db, 'menu', id), formInfo), {
      loading: 'Editando...',
      success: 'Editado correctamente!',
      error: 'No se pudo editar.',
    });
    onOpenChange();
  };

  const deleteMenuHandler = (id: string) => {
    deleteMenu(id);
    onOpenChange();
  };

  const addNewMenu = async () => {
    await addMenu({ ...formInfo, date: getDateString(new Date()) });
    closeModal();
  };

  return (
    <div className="p-4 w-1/4 text-white">
      <Tooltip content={info?.menu} hidden={!info?.menu}>
        {!isNew ? (
          <div
            onClick={onOpen}
            className="cursor-pointer flex flex-col gap-2 shadow-lg rounded-lg h-full p-3 relative bg-card/50 hover:bg-card/100 border-gray-500/50 border backdrop-blur-xs">
            <div className="absolute right-3 p-1 cursor-pointer">
              <Pencil className="w-4 h-4" />
            </div>
            <div className="text-primary-300 font-semibold flex items-center gap-2">
              ${info?.price} <p className="text-xs text-gray-400 font-normal">({info?.date || 'viejaso'})</p>
            </div>
            <div className="text-gray truncate text-sm">{info?.menu.charAt(0).toUpperCase() + info?.menu.slice(1)}</div>
          </div>
        ) : (
          <div
            onClick={onOpen}
            className="flex shadow-lg rounded-lg gap-2 h-full py-4 justify-center items-center cursor-pointer bg-card/50 hover:bg-card/100 border-gray-500/50 border group backdrop-blur-xs">
            <Plus />
            <p className="w-0 h-6 group-hover:w-auto interpolate-size transition-all overflow-hidden ">Agregar menu</p>
          </div>
        )}
      </Tooltip>

      <Modal open={isOpen} onOpenChange={closeModal} title={isNew ? 'Crear menu' : 'Editar menu'}>
        <div className="w-full">
          <div className="flex flex-col gap-2">
            <label>
              Precio
              <TextField.Root
                style={{ background: 'transparent' }}
                value={formInfo?.price}
                type="number"
                onChange={(e) => setFormInfo({ ...formInfo, price: e.target.value })}
                className={`w-full`}>
                <TextField.Slot>
                  <DollarSign className="w-4 h-4" />
                </TextField.Slot>
              </TextField.Root>
            </label>

            <label>
              Menu
              <TextField.Root
                style={{ background: 'transparent' }}
                value={formInfo?.menu}
                onChange={(e) => setFormInfo({ ...formInfo, menu: e.target.value })}
                className={`w-full`}
              />
            </label>
          </div>
        </div>
        <div className="flex w-full justify-between mt-4">
          <Popover
            trigger={
              <Button className={isNew ? '!invisible' : ''} color="red" variant="soft">
                Eliminar
              </Button>
            }
            content={
              <span className="flex items-center flex-col gap-2">
                ¿Estás seguro de borrar este menú?
                <Button color="red" onClick={() => deleteMenuHandler(info)}>
                  Confirmar
                </Button>
              </span>
            }
          />

          <Button disabled={!formInfo?.price || !formInfo?.menu} onClick={isNew ? addNewMenu : acceptEdition}>
            {isNew ? 'Crear' : 'Editar'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default CardMenu;
