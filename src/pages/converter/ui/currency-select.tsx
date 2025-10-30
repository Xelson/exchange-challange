import { Dialog, Listbox, TextField } from '@/shared/ui/kit/components';
import { reatomControllablePopup, reatomScrollPagination } from '@/shared/ui/reatom';
import { currenciesList, type Currency } from '../model/currency';
import { atom, computed, reatomNumber, reatomString, withChangeHook, wrap } from '@reatom/core';
import { createListCollection, Portal } from '@ark-ui/react';
import { reatomComponent } from '@reatom/react';
import { Icons } from '@/shared/ui/kit/icons';
import { CurrencyItem } from './CurrencyItem';
import { memo } from 'react';

type InputParams = { defaultCurrency?: Currency };
type OutputParams = Currency;

export const currencySelectDialog = reatomControllablePopup<Dialog.RootProps, InputParams, OutputParams>(
	({ requestArgs, requestClose, name }) => {
		const value = atom<Currency | null>(null, `${name}.value`);
		const searchText = reatomString('', `${name}.searchText`).extend(target => ({
			ref: atom<HTMLInputElement | null>(null, `${target.name}._ref`),
		}));

		const itemsToShow = reatomNumber(15, `${name}.itemsToShow`);

		const scrollPagination = reatomScrollPagination({
			shouldStop: () => false,
			onLoadMore: () => itemsToShow.increment(30),
		}, `${name}.scrollPagination`);

		const collectionAtom = computed(() => {
			const search = searchText().toLowerCase();
			const items = currenciesList.slice(0, itemsToShow());
			const filteredItems = search
				? items.filter(item => item.name.toLowerCase().includes(search) || item.code.toLowerCase().includes(search))
				: items;

			return createListCollection({
				items: filteredItems,
				itemToValue: item => item.code,
				itemToString: item => item.name,
			});
		}, `${name}.collection`);

		requestArgs.extend(withChangeHook((args) => {
			if (args?.defaultCurrency)
				value.set(args.defaultCurrency);

			searchText.reset();
			itemsToShow.reset();
		}));

		const SearchField = reatomComponent(() => {
			return (
				<TextField.Root
					width='full'
					flexShrink='0'
					value={searchText()}
					onValueChange={wrap(searchText.set)}
				>
					<TextField.Element>
						<Icons.Search />
					</TextField.Element>

					<TextField.Input
						ref={wrap((el) => { searchText.ref.set(el); })}
						placeholder='Search currencies...'
					/>
				</TextField.Root>
			);
		}, `${name}.SearchField`);

		const CurrenciesList = memo(reatomComponent(() => {
			const collection = collectionAtom();
			const selectedCurrency = value();

			const handleSelect = (code: string) => {
				const newCurrency = value.set(collection.find(code) ?? null);
				requestClose(newCurrency);
			};

			return (
				<Listbox.Root
					// @ts-expect-error lost generic type
					collection={collection}
					flexGrow='1'
					minHeight='0'
					width='full'
					value={selectedCurrency ? [selectedCurrency.code] : []}
					onValueChange={wrap(details => handleSelect(details.value[0]))}
				>
					<Listbox.Content
						ref={wrap((el) => { scrollPagination.containerRef.set(el); })}
						alignItems='start'
						gap='0.5rem'
						flexGrow='1'
						overflowY='auto'
					>
						{collection.items.map(currency => (
							<Listbox.Item key={currency.code} item={currency}>
								<CurrencyItem currency={currency} />

								<Listbox.ItemIndicator>
									<Icons.Check />
								</Listbox.ItemIndicator>
							</Listbox.Item>
						))}
					</Listbox.Content>
				</Listbox.Root>
			);
		}, `${name}.CurrenciesList`));

		return ({ controller, ...props }) => {
			return (
				<Dialog.Root
					lazyMount
					unmountOnExit
					initialFocusEl={searchText.ref}
					{...props}
					{...controller}
				>
					<Portal>
						<Dialog.Backdrop />
						<Dialog.Positioner>
							<Dialog.Content maxHeight='27.4375rem' height='full'>
								<Dialog.Title>Select currency</Dialog.Title>
								<Dialog.CloseButton />

								<Dialog.Description>
									Choose a currency from the list below or use the search bar to find a specific currency.
								</Dialog.Description>

								<SearchField />
								<CurrenciesList />
							</Dialog.Content>
						</Dialog.Positioner>
					</Portal>
				</Dialog.Root>
			);
		};
	},
	'currencySelectDialog',
);
