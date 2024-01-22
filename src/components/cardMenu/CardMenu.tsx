'use-client';
import { db } from '@/firebase/config';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IconEdit } from '..';

function CardMenu({ info, changeInfo, deleteMenu }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formInfo, setFormInfo] = useState(info);

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

  return (
    <div className="p-4 w-1/4 text-white">
      <Tooltip content={info?.menu}>
        <div className="flex rounded-lg h-full bg-card p-3 flex-col relative">
          <div className="flex flex-col gap-2 relative text-white">
            <div className="absolute right-3 cursor-pointer" onClick={onOpen}>
              <IconEdit />
            </div>
            <div className="">${info?.price}</div>
            <div className="">{info?.menu}</div>
          </div>
        </div>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="bg-neutral" size="3xl">
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
              <Button color="warning" variant="flat" onPress={onPressDelete}>
                Eliminar
              </Button>
              <Button color="primary" onPress={acceptEdition}>
                Editar
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default CardMenu;
