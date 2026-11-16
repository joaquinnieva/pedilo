import type { AppInfo, MenuItem, OrderRequest } from '@/types';
import {
	type DocumentData,
	type FirestoreDataConverter,
	type QueryDocumentSnapshot,
	type SnapshotOptions,
	collection,
	getDocs,
	query,
} from 'firebase/firestore';
import { db } from './config';

function createConverter<T extends { id: string }>(): FirestoreDataConverter<T> {
	return {
		toFirestore(item: T): DocumentData {
			const { id: _id, ...rest } = item;
			return rest;
		},
		fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T {
			return {
				...(snapshot.data(options) as Omit<T, 'id'>),
				id: snapshot.id,
			} as T;
		},
	};
}

export const menusCollection = collection(db, 'menu').withConverter(createConverter<MenuItem>());
export const requestsCollection = collection(db, 'requests').withConverter(
	createConverter<OrderRequest>(),
);
export const infoCollection = collection(db, 'info').withConverter(createConverter<AppInfo>());

export const getMenus = async (): Promise<MenuItem[]> => {
	const resp = await getDocs(query(menusCollection));
	return resp.docs.map((doc) => doc.data()).sort((a, b) => Number(b.price) - Number(a.price));
};

export const getRequests = async (): Promise<OrderRequest[]> => {
	const resp = await getDocs(query(requestsCollection));
	return resp.docs.map((doc) => doc.data());
};

export const getInfo = async (): Promise<AppInfo[]> => {
	const resp = await getDocs(query(infoCollection));
	return resp.docs.map((doc) => doc.data());
};
