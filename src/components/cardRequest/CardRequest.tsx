import { PayMethods } from '@/consts/PayMethods';
import { db } from '@/firebase/config';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IconEdit } from '..';

function CardRequest({ info, menus, onChangeReq, deleteReq }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formInfo, setFormInfo] = useState(info);

  const closeModal = (e: any) => {
    setFormInfo(info);
    onOpenChange();
  };

  const selectMenu = ({ currentKey }: any) => {
    const menu = currentKey;
    if (menu === 'Selecciona') {
      setFormInfo({ ...formInfo, menu: 'Selecciona', price: 0 });
    } else {
      const menuselected = menus.find((menuItem: any) => menuItem.menu === menu);
      setFormInfo({ ...formInfo, menu, price: menuselected.price });
    }
  };

  const acceptEdition = () => {
    onOpenChange();
    toast.promise(updateDoc(doc(db, 'requests', info.id), formInfo), {
      loading: 'Editando...',
      success: () => {
        onChangeReq(formInfo);
        return <b>Editando correctamente!</b>;
      },
      error: <b>No se pudo editar.</b>,
    });
  };
  const onPressDelete = () => {
    toast.remove();
    toast(
      (t) => (
        <span className="flex items-center flex-col">
          ¿Estás seguro de borrar este pedido?
          <Button
            color="danger"
            variant="solid"
            onPress={() => {
              deleteRequest(info.id);
              toast.dismiss(t.id);
            }}>
            Confirmar
          </Button>
        </span>
      ),
      { position: 'bottom-center' }
    );
  };
  const deleteRequest = (id: string) => {
    deleteReq(id);
    onOpenChange();
  };
  return (
    <div className="p-4 w-1/4">
      <div className="flex rounded-lg h-full bg-card p-4 gap-2 flex-col relative">
        <div className="absolute right-4 z-10 cursor-pointer" onClick={onOpen}>
          <IconEdit />
        </div>
        <div className="flex items-center relative">{info?.name}</div>
        <div className="flex flex-col">{info.type}</div>
        <div className="flex flex-col">{info.menu}</div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={closeModal} className="bg-neutral" size="3xl">
        <ModalContent className="grid place-items-center">
          <>
            <ModalHeader className="flex flex-col gap-1 place-self-start">Editar pedido</ModalHeader>
            <ModalBody className="w-2/3">
              <div className="flex flex-col gap-2">
                <Input
                  style={{ background: 'transparent' }}
                  variant="bordered"
                  size="sm"
                  value={formInfo?.name}
                  label="Nombre"
                  onChange={(e) => setFormInfo({ ...formInfo, name: e.target.value })}
                  className={`w-full`}
                />

                <Select
                  size="sm"
                  label="Tipo de pago"
                  className="w-full"
                  variant="bordered"
                  defaultSelectedKeys={[info.type]}
                  onSelectionChange={(type) => setFormInfo({ ...formInfo, type })}>
                  <SelectItem key={PayMethods.EFECTIVO} value={PayMethods.EFECTIVO}>
                    {PayMethods.EFECTIVO}
                  </SelectItem>
                  <SelectItem key={PayMethods.TRANSFERENCIA} value={PayMethods.TRANSFERENCIA}>
                    {PayMethods.TRANSFERENCIA}
                  </SelectItem>
                </Select>

                <Select size={'sm'} label="Menú" className="w-full" variant="bordered" defaultSelectedKeys={[info.menu]} onSelectionChange={selectMenu}>
                  {menus.map((menu: any) => (
                    <SelectItem key={menu.menu} value={menu.menu}>
                      {menu.menu}
                    </SelectItem>
                  ))}
                </Select>
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

export default CardRequest;
