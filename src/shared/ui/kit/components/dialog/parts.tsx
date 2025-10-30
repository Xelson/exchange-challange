import { Dialog } from '@ark-ui/react/dialog';
import { dialog } from 'styled-system/recipes';
import type { ComponentProps, HTMLStyledProps } from 'styled-system/types';
import { Icons } from '../../icons';
import { createStyleContext, styled } from 'styled-system/jsx';

const { withRootProvider, withContext } = createStyleContext(dialog);

export type RootProviderProps = ComponentProps<typeof RootProvider>;
export const RootProvider = withRootProvider(Dialog.RootProvider);

export type RootProps = ComponentProps<typeof Root>;
export const Root = withRootProvider(Dialog.Root);
export const Backdrop = withContext(Dialog.Backdrop, 'backdrop');
export const CloseTrigger = withContext(Dialog.CloseTrigger, 'closeTrigger');
export const Content = withContext(Dialog.Content, 'content');
export const Description = withContext(Dialog.Description, 'description');
export const Positioner = withContext(Dialog.Positioner, 'positioner');
export const Title = withContext(Dialog.Title, 'title');
export const Trigger = withContext(Dialog.Trigger, 'trigger');

export const CloseButton = (props: HTMLStyledProps<'button'>) => (
	<CloseTrigger asChild>
		<styled.button
			top='1rem'
			right='1rem'
			color='neutral.500'
			position='absolute'
			cursor='pointer'
			_icon={{ boxSize: '1.25rem' }}
			{...props}
		>
			<Icons.Close />
		</styled.button>
	</CloseTrigger>
);

export { DialogContext as Context } from '@ark-ui/react/dialog';
