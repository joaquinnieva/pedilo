import { FormatCartToText } from '@/functions/GenerateMessage';
import { useState } from 'react';

function SendRequest({ requests }: { requests: any }) {
  const [text, setText] = useState('');

  return (
    <div className="w-full my-4 flex flex-col items-center">
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://wa.me/+543517513954?text=${FormatCartToText(requests)}`}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Generar mensaje
      </a>

      <div className="mt-4">
        <p>{text}</p>
      </div>
    </div>
  );
}

export default SendRequest;
