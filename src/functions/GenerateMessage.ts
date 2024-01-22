import { MessageGenerations } from '@/consts/MessageGenerations';
import { PayMethods } from '@/consts/PayMethods';

export const FormatCartToText = (data: any[], action: MessageGenerations): string => {
  const cart = data.sort((a: any, b: any) => {
    if (a.type < b.type) {
      return -1;
    }
    if (a.type > b.type) {
      return 1;
    }
    return 0;
  });

  const total = cart.reduce((accumulator: number, product: any): number => accumulator + Number(product.price), 200);
  const cash = cart.reduce(
    (accumulator: number, product: any): number => (product.type === PayMethods.EFECTIVO ? accumulator + Number(product.price) : accumulator + 0),
    0
  );
  const transfer = cart.reduce(
    (accumulator: number, product: any): number => (product.type === PayMethods.TRANSFERENCIA ? accumulator + Number(product.price) : accumulator + 0),
    0
  );

  const text = cart.reduce(
    (message: string, prod: any): string => message.concat(`• ${prod.name}: ${prod.menu} - $${Number(prod.price)} ${prod?.type || PayMethods.EFECTIVO} \n`),
    ``
  );
  if (!text) return 'Hola quisiera hacerte una consulta';

  const textWithTotals = text
    .concat(`\n| *${PayMethods.TRANSFERENCIA}* = $${transfer} |`)
    .concat(`\n| *${PayMethods.EFECTIVO}* = $${cash} |`)
    .concat(`\n| *Envío* = $200 |`)
    .concat(`\n| *Total* = $${total} |`);

  const ToSend = {
    [MessageGenerations.COPY]: textWithTotals,
    [MessageGenerations.WP]: textWithTotals?.replace(/\n/g, '%0A'),
    [MessageGenerations.PREVIEW]: textWithTotals?.replace(/\n/g, '<br/>'),
  };
  return ToSend[action];
};
