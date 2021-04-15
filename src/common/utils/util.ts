import { DateTime } from "luxon";

export const genRandom = (no = 6) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < no; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

export const getNextDaysDate = (noOfDays: number, date?: Date): string => {
  if(!date)
    date = new Date();

  return DateTime.fromJSDate(date).plus({ days: noOfDays }).toFormat('yyyy-MM-dd');
}
