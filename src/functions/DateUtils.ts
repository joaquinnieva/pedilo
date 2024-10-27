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

export function isToday(dateString: string) {
  const today = new Date();
  const date = new Date(new Date().getFullYear() + '-' + dateString.split(' ')[0].split('/').toReversed().join('-') + 'T00:00:00');
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
}
