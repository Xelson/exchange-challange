import { computed, onLineAtom } from '@reatom/core';

export const useCache = computed(() => !onLineAtom(), 'useCache');
