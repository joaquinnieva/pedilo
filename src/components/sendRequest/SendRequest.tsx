import { MessageGenerations } from '@/consts/MessageGenerations';
import { FormatCartToText } from '@/functions/GenerateMessage';
import { useState } from 'react';
import toast from 'react-hot-toast';

function SendRequest({ requests }: { requests: any }) {
  const [text, setText] = useState('');

  const previewText = () => {
    setText(FormatCartToText(requests, MessageGenerations.PREVIEW));
    navigator.clipboard.writeText(FormatCartToText(requests, MessageGenerations.COPY));
    toast.success('Copiado al portapapeles');
  };

  return (
    <div className="w-full my-4 flex flex-col items-center">
      <div className="flex gap-4">
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={previewText}>
          Ver PEDIDO
        </button>
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://wa.me/+543517513954?text=${FormatCartToText(requests, MessageGenerations.WP)}`}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          PEDILO
        </a>
      </div>

      <div className="mt-4" dangerouslySetInnerHTML={{ __html: text }}></div>
    </div>
  );
}

export default SendRequest;
