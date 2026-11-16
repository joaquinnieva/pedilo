import type { PayMethods } from '@/consts/PayMethods';

export interface MenuItem {
	id: string;
	menu: string;
	price: number | string;
	date?: string;
}

export interface OrderRequest {
	id: string;
	name: string;
	menu: string;
	price: number | string;
	type: PayMethods | string;
	description?: string;
	date?: string;
	paid?: boolean;
}

export interface AppInfo {
	id: string;
	message?: string;
	sendPrice?: number | string;
	phone?: string;
	date?: string;
	winner?: string;
	winnerDrawId?: string;
	wheelLocked?: boolean;
}
