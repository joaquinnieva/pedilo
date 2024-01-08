import { CardMenu, IconAdd } from '..';

function MenuContainers({ state }: any) {
  const [menus, setMenus] = state;

  const changeInfo = (info: any) => {
    const newRequests = [];
    for (let i = 0; i < menus.length; i++) {
      const element = menus[i];
      if (element.id === info.id) {
        newRequests.push(info);
      } else {
        newRequests.push(element);
      }
    }
    setMenus(newRequests);
  };
  return (
    <div className="flex flex-wrap w-full">
      {menus.map((info: any, i: number) => (
        <CardMenu key={i} info={info} changeInfo={changeInfo} />
      ))}
      <div className="p-4 w-1/4">
        <div
          onClick={() => setMenus((curr: any) => [...curr, { id: menus.length + 1, name: '', price: 0 }])}
          className="flex rounded-lg gap-2 h-full bg-gray-700 p-8 justify-center items-center cursor-pointer">
          <IconAdd /> Agregar menu
        </div>
      </div>
    </div>
  );
}

export default MenuContainers;
