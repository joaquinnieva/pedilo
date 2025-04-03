import { MessageGenerations } from '@/consts/MessageGenerations';
import { PayMethods } from '@/consts/PayMethods';

export const FormatCartToText = ({
	data = [],
	action,
	sendPrice,
}: { data: any[]; action: MessageGenerations; sendPrice?: number }): string => {
	const cart = data.sort((a: any, b: any) => {
		if (a.type < b.type) {
			return -1;
		}
		if (a.type > b.type) {
			return 1;
		}
		return 0;
	});

	const total = cart.reduce(
		(accumulator: number, product: any): number => accumulator + Number(product.price),
		sendPrice,
	);
	const cash = cart.reduce(
		(accumulator: number, product: any): number =>
			product.type === PayMethods.EFECTIVO ? accumulator + Number(product.price) : accumulator + 0,
		0,
	);

	const transfer = cart.reduce(
		(accumulator: number, product: any): number =>
			product.type === PayMethods.TRANSFERENCIA
				? accumulator + Number(product.price)
				: accumulator + 0,
		0,
	);

	const text = cart.reduce(
		(message: string, prod: any): string =>
			message.concat(
				`• ${prod.name}: ${prod.menu} ${prod?.description ? ',' + prod?.description : ''} - $${Number(prod.price)} ${prod?.type || PayMethods.EFECTIVO} \n`,
			),
		``,
	);
	if (!text) return 'Hola quisiera hacerte una consulta';

	const textWithTotals = text
		.concat(transfer === 0 ? '' : `\n| *${PayMethods.TRANSFERENCIA}* = $${transfer} |`)
		.concat(cash === 0 ? '' : `\n| *${PayMethods.EFECTIVO}* = $${cash} |`)
		.concat(sendPrice === 0 ? '' : `\n| *Envío* = ${sendPrice} |`)
		.concat(`\n| *Total* = $${total} |`);

	const ToSend = {
		[MessageGenerations.COPY]: textWithTotals,
		[MessageGenerations.WP]: textWithTotals?.replace(/\n/g, '%0A'),
		[MessageGenerations.PREVIEW]: textWithTotals,
	};
	return ToSend[action];
};
