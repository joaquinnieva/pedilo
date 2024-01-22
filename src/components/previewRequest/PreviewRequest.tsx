import { MessageGenerations } from '@/consts/MessageGenerations';
import { FormatCartToText } from '@/functions/GenerateMessage';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

function PreviewRequest({ requests }: { requests: any }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [text, setText] = useState('');

  const previewText = () => {
    onOpen();
    setText(FormatCartToText(requests, MessageGenerations.PREVIEW));
    navigator.clipboard.writeText(FormatCartToText(requests, MessageGenerations.COPY));
    toast.success('Copiado al portapapeles');
  };

  return (
    <>
      <Button color="primary" onClick={() => previewText()}>
        Ver PEDIDO
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="bg-neutral" size="3xl">
        <ModalContent className="grid place-items-center">
          <ModalHeader className="flex flex-col gap-1 place-self-start">Previsualizar mensaje</ModalHeader>
          <ModalBody className="w-2/3">
            <div className="mb-6" dangerouslySetInnerHTML={{ __html: text }}></div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PreviewRequest;
