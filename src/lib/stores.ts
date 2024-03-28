import { writable } from 'svelte/store';
import type { Dish } from './types';
import type { User } from 'firebase/auth';

export const dishes = writable<Dish[]>([] as Dish[]);

/** used to store the added ingrendients to a dish that is created or edited..
 * NOTE: Only store the strings..
 */
export const ingredients = writable<string[]>([] as string[]);

export const user = writable<User | null>(null);
