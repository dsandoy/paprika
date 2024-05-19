import { writable } from 'svelte/store';
import { type CreateIngredient, type ReadDish, type ReadPlan, type ReadListEntry } from './types';

export const dishes = writable<ReadDish[]>([] as ReadDish[]);

/** used to store the added ingrendients to a dish that is created or edited..
 */
export const ingredients = writable<CreateIngredient[]>([]);

/** The plan entries for the current week */
export const currentPlans = writable<ReadPlan[]>([]);

/** The plan entries for the upcoming week */
export const nextWeekPlans = writable<ReadPlan[]>([]);

export const closePlans = writable<ReadDish[]>([]);

export const shoppingList = writable<ReadListEntry[]>([]);

export const completeList = writable<ReadListEntry[]>([]);

export const incompleteList = writable<ReadListEntry[]>([]);
