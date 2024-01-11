export const FormatCartToText = (cart: any[], toWp = true): string => {
  const total = cart.reduce((accumulator: number, product: any): number => accumulator + Number(product.price), 0);

  const text = cart.reduce(
    (message: string, prod: any): string => message.concat(`∎ ${prod.name}: ${prod.menu} - $${Number(prod.price)} ${prod?.type || 'Efectivo'} \n`),
    ``
  );
  if (!text) return 'Hola quisiera hacerte una consulta';

  if (toWp) return text.concat(`\n| *Total* = $${total} |`)?.replace(/\n/g, '%0A');
  return text.concat(`\n| *Total* = $${total} |`);
};
