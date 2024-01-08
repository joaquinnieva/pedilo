'use-client';
import { useState } from 'react';
import { IconCheck, IconEdit } from '..';

function CardMenu({ info, changeInfo }: any) {
  const [isEdit, setIsEdit] = useState(false);
  return (
    <div className="p-4 w-1/4">
      <div className="flex rounded-lg h-full bg-gray-700 p-8 flex-col">
        <div className="flex items-center mb-3 relative">
          $
          <input
            readOnly={!isEdit}
            disabled={!isEdit}
            value={info?.price}
            placeholder="Precio"
            onChange={(e) => changeInfo({ ...info, price: e.target.value })}
            className={`w-12 h-8 mr-3 inline-flex items-center justify-center bg-gray-700 border-gray-700 rounded border text-white flex-shrink-0 ${
              isEdit ? '!border-white' : ''
            }`}
          />
          <div className="absolute right-0 cursor-pointer" onClick={() => setIsEdit(!isEdit)}>
            {!isEdit ? <IconEdit /> : <IconCheck />}
          </div>
        </div>
        <div className="">
          <input
            readOnly={!isEdit}
            disabled={!isEdit}
            value={info?.menu}
            placeholder="Menu"
            onChange={(e) => changeInfo({ ...info, menu: e.target.value })}
            className={`w-full leading-relaxed text-base bg-gray-700 border-gray-700 rounded border ${isEdit ? '!border-white' : ''}`}
          />
        </div>
      </div>
    </div>
  );
}

export default CardMenu;
