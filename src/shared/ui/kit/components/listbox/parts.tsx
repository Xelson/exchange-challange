import { Listbox } from '@ark-ui/react';
import type { ComponentProps } from 'react';
import { createStyleContext } from 'styled-system/jsx';
import { listbox } from 'styled-system/recipes';

const { withProvider } = createStyleContext(listbox);

export type RootProps = ComponentProps<typeof Root>;
export const Root = withProvider(Listbox.Root, 'root');
export const Content = withProvider(Listbox.Content, 'content');
export const Item = withProvider(Listbox.Item, 'item');
export const ItemIndicator = withProvider(Listbox.ItemIndicator, 'itemIndicator');
