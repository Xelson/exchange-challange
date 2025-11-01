import currenciesList from './currencies.json';

export type Currency = typeof currenciesList[number];

export const getCurrencyByCode = (code: string) =>
	currenciesList.find(currency => currency.code === code);

export { currenciesList };
