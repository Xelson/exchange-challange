import { useCallback, useMemo, type ComponentRef, type Ref } from 'react';
import { Field, useFieldContext } from '@ark-ui/react';
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { textField } from 'styled-system/recipes';
import type { ComponentProps } from 'styled-system/types';
import { createContextFactory, useControllableState, type WithControllableProps } from '@/shared/ui/react';
import { createStyleContext } from 'styled-system/jsx';

const createPropsContext = createContextFactory('textFieldProps');
const createValueContext = createContextFactory('textFieldValue');

const {
	TextFieldPropsProvider,
	useTextFieldPropsStrictContext,
} = createPropsContext<() => {
	'aria-invalid': 'true' | undefined;
	'disabled': boolean | undefined;
}>();

const {
	TextFieldValueProvider,
	useTextFieldValueStrictContext,
} = createValueContext<{
	value: string;
	onValueChange: (value: string) => void;
}>();

interface BaseRootProps extends WithControllableProps<string, HTMLArkProps<'label'>> {
	invalid?: boolean;
	disabled?: boolean;
}

function BaseRoot({ invalid, disabled, value, onValueChange, defaultValue, ...props }: BaseRootProps) {
	const [state, setState] = useControllableState({ value, onValueChange, defaultValue }, '');
	const valueCtx = useMemo(() => ({ value: state, onValueChange: setState }), [state, setState]);
	const field = useFieldContext();
	const getProps = useCallback(() => ({
		'aria-invalid': (invalid || field?.invalid) ? 'true' as const : undefined,
		'disabled': (disabled || field?.disabled) ? true : undefined,
	}), [invalid, disabled, field?.invalid, field?.disabled]);

	return (
		<TextFieldPropsProvider value={getProps}>
			<TextFieldValueProvider value={valueCtx}>
				<ark.label {...props} {...getProps()} />
			</TextFieldValueProvider>
		</TextFieldPropsProvider>
	);
}

type BaseElementProps = HTMLArkProps<'div'>;
function BaseElement(props: BaseElementProps) {
	const getProps = useTextFieldPropsStrictContext();
	return <ark.div {...props} {...getProps()} />;
}

type BaseInputProps = HTMLArkProps<'input'> & { ref: Ref<ComponentRef<'input'>> };
function BaseInput(props: BaseInputProps) {
	const getProps = useTextFieldPropsStrictContext();
	const { value, onValueChange } = useTextFieldValueStrictContext();

	return (
		<Field.Input
			{...props}
			{...getProps()}
			value={props?.value ?? value}
			onChange={(e) => {
				props?.onChange?.(e);

				if (!e.defaultPrevented)
					onValueChange(e.target.value);
			}}
		/>
	);
}

type BaseTextareaProps = Field.TextareaProps;
function BaseTextarea(props: BaseTextareaProps) {
	const getProps = useTextFieldPropsStrictContext();
	const { value, onValueChange } = useTextFieldValueStrictContext();

	return (
		<Field.Textarea
			{...props}
			{...getProps()}
			value={props?.value ?? value}
			onChange={(e) => {
				props?.onChange?.(e);

				if (!e.defaultPrevented)
					onValueChange(e.target.value);
			}}
		/>
	);
}

const { withProvider, withContext } = createStyleContext(textField);

export type RootProps = ComponentProps<typeof Root>;
export const Root = withProvider(BaseRoot, 'root');

export type ElementProps = ComponentProps<typeof Element>;
export const Element = withContext(BaseElement, 'element');

export type InputProps = ComponentProps<typeof Input>;
export const Input = withContext(BaseInput, 'input');

export type TextareaProps = ComponentProps<typeof Textarea>;
export const Textarea = withContext(BaseTextarea, 'input');
