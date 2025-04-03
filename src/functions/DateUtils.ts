export function getDateString(date: Date, onlyDate = false) {
	let month: any = date.getMonth() + 1;
	let day: any = date.getDate();
	let hour: any = date.getHours();
	let minute: any = date.getMinutes();
	month = month < 10 ? `0${month}` : month;
	day = day < 10 ? `0${day}` : day;
	hour = hour < 10 ? `0${hour}` : hour;
	minute = minute < 10 ? `0${minute}` : minute;

	const dateAdapter = `${day}/${month} `;
	return onlyDate ? dateAdapter : dateAdapter + `${hour}:${minute}`;
}

export function isToday(value: string) {
	const dateString = value;
	const today = new Date();
	const date = new Date(
		new Date().getFullYear() +
			'-' +
			dateString.split(' ')[0].split('/').reverse().join('-') +
			'T00:00:00',
	);
	return (
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		date.getDate() === today.getDate()
	);
}

export function parseCustomDate(dateStr: string): Date {
	const [datePart, timePart] = dateStr.split(' ');
	const [day, month] = datePart.split('/');
	const [hours, minutes] = timePart.split(':');

	const currentYear = new Date().getFullYear();

	return new Date(
		currentYear,
		parseInt(month) - 1,
		parseInt(day),
		parseInt(hours),
		parseInt(minutes),
	);
}
