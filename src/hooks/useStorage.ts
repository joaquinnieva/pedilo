import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

function getStorageValue<T>(key: string, defaultValue: T): T {
	try {
		const saved = localStorage.getItem(key);
		if (!saved) return defaultValue;
		const parsed = JSON.parse(saved) as T | null;
		return parsed ?? defaultValue;
	} catch {
		return defaultValue;
	}
}

export const useLocalStorage = <T>(
	key: string,
	defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] => {
	const [value, setValue] = useState<T>(() => getStorageValue(key, defaultValue));

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
};
