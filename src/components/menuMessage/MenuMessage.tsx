import { db } from '@/firebase/config';
import { getInfo } from '@/firebase/service';
import { getDateString } from '@/functions/DateUtils';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Tooltip, useDisclosure } from '@nextui-org/react';
import { doc, updateDoc } from 'firebase/firestore';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

function MenuMessage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState('');
  const [sendPrice, setSendPrice] = useState('0');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');

  const closeModal = () => {
    onOpenChange();
    setIsEdit(false);
  };

  const openModal = async () => {
    const [data]: any = await getInfo();
    setMessage(data?.message);
    setDate(data?.date ? getDateString(new Date(data?.date)) : '');
    setSendPrice(data?.sendPrice || 0);
    setPhone(data?.phone || '+543517513954');
    onOpen();
  };
  const acceptEdition = () => {
    const newDate = new Date().toISOString();
    if (isEdit) {
      onOpenChange();
      toast.promise(updateDoc(doc(db, 'info', 'info'), { message, sendPrice, phone, date: newDate }), {
        loading: 'Editando...',
        success: () => {
          setDate(newDate);
          return <b>Editando correctamente!</b>;
        },
        error: <b>No se pudo editar.</b>,
      });
    }
    setIsEdit(!isEdit);
  };

  return (
    <>
      <Tooltip content="Configuración y datos 📲">
        <Button color="secondary" onPress={openModal} variant="bordered" className="px-2 min-w-6">
          <Settings />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={closeModal} className="bg-neutral" size="3xl">
        <ModalContent className="grid place-items-center">
          <ModalHeader className="flex flex-col gap-1 place-self-start">Configuración</ModalHeader>
          <ModalBody className="w-10/12 h-full">
            <Textarea
              isReadOnly={!isEdit}
              rows={20}
              className="w-full"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Ingresá el mensaje de difusión"
              value={message}
              disableAutosize
              onChange={(e) => setMessage(e.target.value)}
              style={{ background: 'transparent', height: '500px!important' }}
            />
            <Input
              isReadOnly={!isEdit}
              style={{ background: 'transparent' }}
              variant="bordered"
              size="sm"
              startContent={'$'}
              type="number"
              value={sendPrice}
              label="Precio de envío"
              onChange={(e) => setSendPrice(e.target.value)}
              className={`w-full`}
            />
            <Input
              isReadOnly={!isEdit}
              style={{ background: 'transparent' }}
              variant="bordered"
              size="sm"
              type="text"
              value={phone}
              label="Celular"
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full`}
            />
            Última edición: {date}
          </ModalBody>
          <ModalFooter className="flex w-full justify-end">
            <Button color="primary" onPress={acceptEdition}>
              {isEdit ? 'Guardar' : 'Editar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MenuMessage;
