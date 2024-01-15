import { MessageGenerations } from '@/consts/MessageGenerations';
import { FormatCartToText } from '@/functions/GenerateMessage';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { RequestModal } from '..';

function SendRequest({ requests }: { requests: any }) {
  const [text, setText] = useState('');

  const previewText = () => {
    setText(FormatCartToText(requests, MessageGenerations.PREVIEW));
    navigator.clipboard.writeText(
      FormatCartToText(requests, MessageGenerations.COPY)
    );
    toast.success('Copiado al portapapeles');
  };

  const generateSent = () => {
    window.open(
      `https://wa.me/+543517513954?text=${FormatCartToText(
        requests,
        MessageGenerations.WP
      )}`
    );
  };

  return (
    <div className='w-full my-4 flex flex-col items-center'>
      <div className='flex gap-4'>
        <Button color='primary' onClick={previewText}>
          Ver PEDIDO
        </Button>
        <Button color='primary' onClick={generateSent}>
          PEDILO
        </Button>
        <RequestModal
          spinOptions={requests.map((req: any) => ({ option: req.name }))}
        />
      </div>
      <div className='mt-4' dangerouslySetInnerHTML={{ __html: text }}></div>
    </div>
  );
}

export default SendRequest;
