/**
 * Takes two `|` separated date strings `to` and `from` and returns them in formatted way. Ex: 23 August - 24 March, 2018
 */
export function ToFromDateFilter(value) {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  let dates = value.split('|');
  dates = dates.map(d => new Date(d));

  const from = dates[0], to = dates[1];
  return `${from.getDate()} ${MONTHS[from.getMonth()]} - ${to.getDate()} ${MONTHS[to.getMonth()]}, ${to.getFullYear()}`;
}