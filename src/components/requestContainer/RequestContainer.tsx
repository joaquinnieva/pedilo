import { CardRequest, IconAdd } from '..';

function RequestContainer({ state, menus }: any) {
  const [requests, setRequests] = state;

  const onChangeReq = (info: any) => {
    const newRequests = [];
    for (let i = 0; i < requests.length; i++) {
      const element = requests[i];
      if (element.id === info.id) {
        newRequests.push(info);
      } else {
        newRequests.push(element);
      }
    }
    setRequests(newRequests);
  };
  return (
    <div className="flex flex-wrap w-full">
      {requests.map((info: any, i: number) => (
        <CardRequest key={i} info={info} menus={menus} onChangeReq={onChangeReq} />
      ))}
      <div className="p-4 w-1/4">
        <div
          onClick={() => setRequests((curr: any) => [...curr, { id: requests.length + 1, name: '', price: '', type: 'Efectivo' }])}
          className="flex rounded-lg gap-2 h-full bg-gray-700 p-8 justify-center items-center cursor-pointer">
          <IconAdd /> Agregar pedido
        </div>
      </div>
    </div>
  );
}

export default RequestContainer;
