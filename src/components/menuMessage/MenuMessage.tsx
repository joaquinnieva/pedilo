import { db } from '@/firebase/config';
import { getInfo } from '@/firebase/service';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Tooltip, useDisclosure } from '@nextui-org/react';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import toast from 'react-hot-toast';

function MenuMessage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState('');

  const closeModal = () => {
    onOpenChange();
    setIsEdit(false);
  };

  const openModal = async () => {
    const [data]: any = await getInfo();
    setMessage(data.message);
    onOpen();
  };
  const acceptEdition = () => {
    if (isEdit) {
      onOpenChange();
      toast.promise(updateDoc(doc(db, 'info', 'info'), { message }), {
        loading: 'Editando...',
        success: <b>Editando correctamente!</b>,
        error: <b>No se pudo editar.</b>,
      });
    } else {
      setIsEdit(!isEdit);
    }
  };

  return (
    <>
      <Tooltip content="Ver mensaje de Carlitos 📲">
        <Button color="secondary" onPress={openModal} variant="bordered">
          Ver mensaje
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={closeModal} className="bg-neutral" size="3xl">
        <ModalContent className="grid place-items-center">
          <ModalHeader className="flex flex-col gap-1 place-self-start">Previsualizar mensaje</ModalHeader>
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
