export function getDateString(date: Date, onlyDate = false): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hour = String(date.getHours()).padStart(2, '0');
	const minute = String(date.getMinutes()).padStart(2, '0');

	const dateAdapter = `${day}/${month}`;
	return onlyDate ? `${dateAdapter} ` : `${dateAdapter} ${hour}:${minute}`;
}

export function isToday(value?: string): boolean {
	if (!value) return false;
	const datePart = value.trim().split(' ')[0];
	const parts = datePart?.split('/');
	if (!parts || parts.length !== 2) return false;

	const [dayStr, monthStr] = parts;
	const day = Number.parseInt(dayStr, 10);
	const month = Number.parseInt(monthStr, 10);
	if (Number.isNaN(day) || Number.isNaN(month)) return false;

	const today = new Date();
	return today.getDate() === day && today.getMonth() + 1 === month;
}

export function parseCustomDate(dateStr?: string): Date {
	if (!dateStr) return new Date(0);
	const [datePart, timePart = '00:00'] = dateStr.trim().split(' ');
	const [dayStr, monthStr] = datePart?.split('/') ?? [];
	const [hoursStr = '0', minutesStr = '0'] = timePart.split(':');

	const day = Number.parseInt(dayStr ?? '', 10);
	const month = Number.parseInt(monthStr ?? '', 10);
	const hours = Number.parseInt(hoursStr, 10);
	const minutes = Number.parseInt(minutesStr, 10);

	if (Number.isNaN(day) || Number.isNaN(month)) {
		return new Date(0);
	}

	const currentYear = new Date().getFullYear();
	return new Date(
		currentYear,
		month - 1,
		day,
		Number.isNaN(hours) ? 0 : hours,
		Number.isNaN(minutes) ? 0 : minutes,
	);
}
