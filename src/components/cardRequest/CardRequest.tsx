import { PayMethods } from '@/consts/PayMethods';
import { db } from '@/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IconCheck, IconEdit } from '..';
import IconClose from '../iconClose/IconClose';

function CardRequest({ info, menus, onChangeReq, deleteMenu }: any) {
  const [isEdit, setIsEdit] = useState(false);

  const selectMenu = (e: any) => {
    const menu = e.target.value;
    if (menu === 'Selecciona') {
      onChangeReq({ ...info, menu: 'Selecciona', price: 0 });
    } else {
      const menuselected = menus.find((menuItem: any) => menuItem.menu === menu);
      onChangeReq({ ...info, menu, price: menuselected.price });
    }
  };

  const acceptEdition = () => {
    setIsEdit(!isEdit);
    if (!isEdit) return;
    toast.promise(updateDoc(doc(db, 'requests', info.id), info), {
      loading: 'Editando...',
      success: <b>Editando correctamente!</b>,
      error: <b>No se pudo editar.</b>,
    });
  };
  return (
    <div className="p-4 w-1/4">
      <div className="flex rounded-lg h-full bg-card p-8 flex-col relative">
        <IconClose className="absolute top-0 right-0 m-2 cursor-pointer" onClick={() => deleteMenu(info.id)} />
        <div className="flex items-center mb-3 relative">
          <input
            readOnly={!isEdit}
            disabled={!isEdit}
            value={info?.name}
            placeholder="Nombre"
            onChange={(e) => onChangeReq({ ...info, name: e.target.value })}
            className={`w-9/12 h-8 mr-3 px-1 inline-flex items-center justify-center bg-card border-card rounded border text-white flex-shrink-0 ${
              isEdit ? '!border-white' : ''
            }`}
          />
          <div className="absolute right-0 cursor-pointer" onClick={acceptEdition}>
            {!isEdit ? <IconEdit /> : <IconCheck />}
          </div>
        </div>
        <div className="flex flex-col">
          <select
            onChange={(e) => onChangeReq({ ...info, type: e.target.value })}
            disabled={!isEdit}
            className={`bg-card mb-3 rounded ${isEdit ? 'border' : ''}`}>
            <option value={PayMethods.EFECTIVO}>{PayMethods.EFECTIVO}</option>
            <option value={PayMethods.TRANSFERENCIA}>{PayMethods.TRANSFERENCIA}</option>
          </select>
          <select value={info?.menu} onChange={selectMenu} disabled={!isEdit} className={`bg-card rounded ${isEdit ? 'border' : ''}`}>
            <option value="Selecciona">Selecciona</option>
            {menus.map((menu: any, i: number) => (
              <option key={i} value={menu.menu}>
                {menu.menu}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default CardRequest;
