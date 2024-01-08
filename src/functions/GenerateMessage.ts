export const FormatCartToText = (cart: any[]): string => {
  const total = cart.reduce((accumulator: number, product: any): number => accumulator + product.price, 0);

  const text = cart.reduce((message: string, prod: any): string => message.concat(`∎ ${prod.name}: ${prod.menu} - $${prod.price} ${prod.type} \n`), ``);
  if (!text) return 'Hola quisiera hacerte una consulta';

  return text.concat(`\n| *Total* = $${total} |`)?.replace(/\n/g, '%0A');
};
