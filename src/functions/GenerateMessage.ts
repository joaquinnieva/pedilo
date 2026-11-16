import { MessageGenerations } from '@/consts/MessageGenerations';
import type { OrderRequest } from '@/types';

const groupBy = (items: OrderRequest[]): Array<[string, number]> => {
	const counts = items.reduce<Record<string, number>>((acc, item) => {
		const key = `${item.menu}${item.description ? `, ${item.description}` : ''}`;
		acc[key] = (acc[key] ?? 0) + 1;
		return acc;
	}, {});

	return Object.entries(counts);
};

export const FormatCartToText = ({
	data = [],
	action,
	sendPrice = 0,
}: {
	data: OrderRequest[];
	action: MessageGenerations;
	sendPrice?: number;
}): string => {
	if (!data || data.length === 0) {
		const fallback = 'Hola quisiera hacerte una consulta';
		return action === MessageGenerations.WP ? encodeURIComponent(fallback) : fallback;
	}

	const cart = [...data].sort((a, b) => (a.type ?? '').localeCompare(b.type ?? ''));
	const shipping = Number.isFinite(sendPrice) ? sendPrice : 0;

	const total = cart.reduce(
		(accumulator, product) => accumulator + (Number(product.price) || 0),
		shipping,
	);

	const text = groupBy(cart).reduce(
		(message, [label, count]) => message.concat(`• ${label}: ${count} \n`),
		'Hola, buen día, este sería el pedido de Box: \n \n',
	);

	const textWithTotals = text.concat(`\nTotal: $${total}`);

	const toSend: Record<MessageGenerations, string> = {
		[MessageGenerations.COPY]: textWithTotals,
		[MessageGenerations.PREVIEW]: textWithTotals,
		[MessageGenerations.WP]: textWithTotals.replace(/\n/g, '%0A'),
	};

	return toSend[action];
};
