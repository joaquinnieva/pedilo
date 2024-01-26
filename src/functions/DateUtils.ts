export function getDateString(date: Date, onlyDate = false) {
  const year = date.getFullYear();
  let month: any = date.getMonth() + 1;
  let day: any = date.getDate();
  const hour: any = date.getHours();
  const minute: any = date.getMinutes();
  const sec: any = date.getUTCSeconds();
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  const dateAdapter = `${day}/${month}/${year} `;
  return onlyDate ? dateAdapter : dateAdapter + `${hour}:${minute}`;
}
