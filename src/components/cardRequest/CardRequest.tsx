import { PayMethods } from '@/consts/PayMethods';
import { db } from '@/firebase/config';
import { Input, Select, SelectItem } from '@nextui-org/react';
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
      <div className="flex rounded-lg h-full bg-card p-3 flex-col relative">
        <IconClose className="absolute top-0 right-0 m-2 cursor-pointer" onClick={() => deleteMenu(info.id)} />
        <div className="flex items-center mb-3 relative">
          <Input
            disabled={!isEdit}
            variant="bordered"
            size="sm"
            value={info?.name}
            placeholder="Nombre"
            onChange={(e) => onChangeReq({ ...info, name: e.target.value })}
            className={`w-9/12 !bg-card`}
          />
          <div className="absolute right-0 cursor-pointer" onClick={acceptEdition}>
            {!isEdit ? <IconEdit /> : <IconCheck />}
          </div>
        </div>
        <div className="flex flex-col">
          <Select
            size="sm"
            isDisabled={!isEdit}
            label="Tipo de pago"
            className="w-full"
            variant="bordered"
            defaultSelectedKeys={['Efectivo']}
            onSelectionChange={(type) => onChangeReq({ ...info, type })}>
            <SelectItem key={PayMethods.EFECTIVO} value={PayMethods.EFECTIVO}>
              {PayMethods.EFECTIVO}
            </SelectItem>
            <SelectItem key={PayMethods.TRANSFERENCIA} value={PayMethods.TRANSFERENCIA}>
              {PayMethods.TRANSFERENCIA}
            </SelectItem>
          </Select>

          <Select
            size={'sm'}
            // isDisabled={!isEdit}
            aria-readonly={!isEdit}
            label="Menú"
            className="w-full"
            variant="bordered"
            defaultSelectedKeys={[info.menu]}
            onSelectionChange={(menu) => onChangeReq({ ...info, menu })}>
            {menus.map((menu: any) => (
              <SelectItem key={menu.menu} value={menu.menu}>
                {menu.menu}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

export default CardRequest;
