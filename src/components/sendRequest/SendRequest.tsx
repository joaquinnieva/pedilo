'use client';
import { MessageGenerations } from '@/consts/MessageGenerations';
import { FormatCartToText } from '@/functions/GenerateMessage';
import { Button } from '@nextui-org/react';
import { RequestModal } from '..';
import PreviewRequest from '../previewRequest/PreviewRequest';

function SendRequest({ requests }: { requests: any }) {
  const generateSent = () => {
    window.open(`https://wa.me/+543517513954?text=${FormatCartToText(requests, MessageGenerations.WP)}`);
  };

  return (
    <div className="w-full my-4 flex flex-col items-center">
      <div className="flex gap-4">
        <PreviewRequest requests={requests} />
        <Button color="primary" onClick={generateSent}>
          PEDILO
        </Button>
        <RequestModal spinOptions={requests.map((req: any) => ({ option: req.name }))} />
      </div>
    </div>
  );
}

export default SendRequest;
