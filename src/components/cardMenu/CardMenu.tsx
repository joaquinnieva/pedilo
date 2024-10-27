'use-client';
import { db } from '@/firebase/config';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IconAdd, IconEdit } from '..';

function CardMenu({ info = null, changeInfo, deleteMenu, addMenu, isNew = false }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formInfo, setFormInfo] = useState(info);

  const closeModal = () => {
    onOpenChange();
    setFormInfo(info);
  };

  const acceptEdition = () => {
    toast.promise(updateDoc(doc(db, 'menu', info.id), formInfo), {
      loading: 'Editando...',
      success: () => {
        changeInfo(formInfo);
        return <b>Editado correctamente!</b>;
      },
      error: <b>No se pudo editar.</b>,
    });
    onOpenChange();
  };

  const onPressDelete = () => {
    toast.remove();
    toast(
      (t) => (
        <span className="flex items-center flex-col">
          ¿Estás seguro de borrar este menú?
          <Button
            color="danger"
            variant="solid"
            onPress={() => {
              deleteReq(info.id);
              toast.dismiss(t.id);
            }}>
            Confirmar
          </Button>
        </span>
      ),
      { position: 'bottom-center' }
    );
  };

  const deleteReq = (id: string) => {
    deleteMenu(id);
    onOpenChange();
  };

  const addNewMenu = async () => {
    await addMenu(formInfo);
    closeModal();
  };

  return (
    <div className="p-4 w-1/4 text-white">
      <Tooltip content={info?.menu || 'Crear Menu'}>
        {!isNew ? (
          <div onClick={onOpen} className="cursor-pointer flex shadow-lg hover:animate-pulse rounded-lg h-full p-4 pr-8 gap-2 flex-row relative bg-card">
            <div className="absolute right-3 cursor-pointer">
              <IconEdit />
            </div>
            <div className="text-primary-300">${info?.price}</div>
            <div className="text-gray truncate">{info?.menu.charAt(0).toUpperCase() + info?.menu.slice(1)}</div>
          </div>
        ) : (
          <div onClick={onOpen} className="flex shadow-lg hover:animate-pulse rounded-lg gap-2 h-full py-4 justify-center items-center cursor-pointer bg-card">
            <IconAdd /> Agregar menu
          </div>
        )}
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={closeModal} className="bg-neutral" size="3xl">
        <ModalContent className="grid place-items-center">
          <>
            <ModalHeader className="flex flex-col gap-1 place-self-start">Editar menu</ModalHeader>
            <ModalBody className="w-2/3">
              <div className="flex flex-col gap-2">
                <Input
                  style={{ background: 'transparent' }}
                  variant="bordered"
                  size="sm"
                  value={formInfo?.price}
                  label="Precio"
                  startContent={'$'}
                  type="number"
                  onChange={(e) => setFormInfo({ ...formInfo, price: e.target.value })}
                  className={`w-full`}
                />
                <Input
                  style={{ background: 'transparent' }}
                  variant="bordered"
                  size="sm"
                  value={formInfo?.menu}
                  label="Menu"
                  onChange={(e) => setFormInfo({ ...formInfo, menu: e.target.value })}
                  className={`w-full`}
                />
              </div>
            </ModalBody>
            <ModalFooter className="flex w-full justify-between">
              <Button className={isNew ? 'invisible' : ''} color="warning" variant="flat" onPress={onPressDelete}>
                Eliminar
              </Button>
              <Button isDisabled={!formInfo?.price || !formInfo?.menu} color="primary" onPress={isNew ? addNewMenu : acceptEdition}>
                {isNew ? 'Crear' : 'Editar'}
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default CardMenu;
