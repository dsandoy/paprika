import { writable } from 'svelte/store';
import type { ShoppingList, CreateIngredient, ReadDish, ReadPlan } from './types';
import type { User } from 'firebase/auth';

export const dishes = writable<ReadDish[]>([] as ReadDish[]);

/** used to store the added ingrendients to a dish that is created or edited..
 */
export const ingredients = writable<CreateIngredient[]>([]);

/** the currently logged in user or null */
export const user = writable<User | null>(null);

/** The plan entries for the current week */
export const currentPlans = writable<ReadPlan[]>([]);

/** The plan entries for the upcoming week */
export const nextWeekPlans = writable<ReadPlan[]>([]);

export const closePlans = writable<ReadDish[]>([]);

export const shoppingList = writable<ShoppingList>({} as ShoppingList);
