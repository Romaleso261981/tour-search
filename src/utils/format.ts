export function formatDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;
  const dayPadded = String(day).padStart(2, '0');
  const monthPadded = String(month).padStart(2, '0');
  return `${dayPadded}.${monthPadded}.${year}`;
}

export function formatPrice(amount: number, currency: string) {
  const formattedAmount = new Intl.NumberFormat('uk-UA').format(amount);
  return `${formattedAmount} ${currency.toUpperCase()}`;
}


