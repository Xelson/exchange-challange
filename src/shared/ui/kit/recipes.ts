import type { RecipeConfig, SlotRecipeConfig } from '@pandacss/dev';
import { skeleton } from './components/skeleton/recipe';
import { text } from './components/typograpy/recipe';
import { textField } from './components/text-field/recipe';
import { badge } from './components/badge/recipe';
import { dialog } from './components/dialog/recipe';
import { listbox } from './components/listbox/recipe';

export const recipes: Record<string, RecipeConfig> = {
	badge,
	skeleton,
	text,
};

export const slotRecipes: Record<string, SlotRecipeConfig> = {
	listbox,
	dialog,
	textField,
};
