import { MessageGenerations } from '@/consts/MessageGenerations';
import { FormatCartToText } from '@/functions/GenerateMessage';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

function PreviewRequest({ requests }: { requests: any }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [text, setText] = useState('');

  const previewText = () => {
    setText(FormatCartToText(requests, MessageGenerations.PREVIEW));
    onOpen();
  };

  const copyText = () => {
    navigator.clipboard.writeText(FormatCartToText(requests, MessageGenerations.COPY));
    toast.success('Copiado al portapapeles');
  };

  const generateSent = () => {
    window.open(`https://wa.me/+543517513954?text=${FormatCartToText(requests, MessageGenerations.WP)}`);
  };

  return (
    <>
      <Tooltip content="Solicitalo o copialo 🙏🏽">
        <Button color="success" onClick={previewText}>
          PEDILO
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="bg-neutral" size="3xl">
        <ModalContent className="grid place-items-center">
          <ModalHeader className="flex flex-col gap-1 place-self-start">Previsualizar mensaje</ModalHeader>
          <ModalBody className="w-10/12">
            <div className="mb-2 rounded bg-foreground-50/50 p-4" dangerouslySetInnerHTML={{ __html: text }}></div>
          </ModalBody>
          <ModalFooter className="flex w-full justify-end">
            <Button color="primary" onPress={copyText}>
              Copiar
            </Button>
            <Button color="warning" onClick={generateSent}>
              PEDILO
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PreviewRequest;
