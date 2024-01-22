'use client';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const Wheel = dynamic(() => import('react-custom-roulette').then((mod) => mod.Wheel), {
  ssr: false,
});

type Props = {
  spinOptions: { option: string }[];
};
const isBrowser = () => typeof window !== 'undefined';

function RequestModal({ spinOptions }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [show, setShow] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * spinOptions.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };
  useEffect(() => {
    if (isBrowser()) setShow(true);
  }, []);

  if (!show) return null;
  if (spinOptions?.length === 0) return null;
  return (
    <>
      <Tooltip content="Hay que sortearlo 🥚">
        <Button color="warning" variant="flat" onPress={onOpen} disabled={spinOptions?.length === 0}>
          ¿Quién lo tiene que pedir?
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="bg-card" size="3xl">
        <ModalContent className="grid place-items-center">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 place-self-start">¿Quién lo tiene que pedir?</ModalHeader>
              <ModalBody>
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={spinOptions}
                  textColors={['#fff']}
                  backgroundColors={['#df3428', '#ff6f3c', '#155263', '#ff9a3c', '#00bbf0', '#42b883', '#35495e', '#ff7e67']}
                  onStopSpinning={() => {
                    setMustSpin(false);
                  }}
                />
              </ModalBody>
              <ModalFooter className="flex gap-x-4 place-self-end">
                <Button
                  color="secondary"
                  variant="flat"
                  onPress={() => {
                    onClose();
                  }}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleSpinClick}>
                  Girar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
export default RequestModal;
