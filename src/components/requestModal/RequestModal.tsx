'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';

type Props = {
  spinOptions: { option: string }[];
};

function RequestModal({ spinOptions }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * spinOptions.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  if (spinOptions?.length === 0) return null;
  return (
    <>
      <Button
        color='warning'
        onPress={onOpen}
        disabled={spinOptions?.length === 0}
      >
        ¿Quién lo tiene que pedir?
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className='bg-card'
        size='3xl'
      >
        <ModalContent className='grid place-items-center'>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1 place-self-start'>
                ¿Quién lo tiene que pedir?
              </ModalHeader>
              <ModalBody>
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={spinOptions}
                  textColors={['#fff']}
                  backgroundColors={[
                    '#df3428',
                    '#ff6f3c',
                    '#155263',
                    '#ff9a3c',
                    '#00bbf0',
                    '#42b883',
                    '#35495e',
                    '#ff7e67',
                  ]}
                  onStopSpinning={() => {
                    setMustSpin(false);
                  }}
                />
              </ModalBody>
              <ModalFooter className='flex gap-x-4 place-self-end'>
                <Button
                  color='secondary'
                  variant='flat'
                  onPress={() => {
                    onClose();
                  }}
                >
                  Cerrar
                </Button>
                <Button color='primary' onPress={handleSpinClick}>
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
