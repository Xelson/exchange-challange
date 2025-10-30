import currenciesList from './currencies.json';

export type Currency = typeof currenciesList[number];

export { currenciesList };
