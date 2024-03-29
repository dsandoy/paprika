import { writable } from 'svelte/store';
import type { Dish, PlanEntry } from './types';
import type { User } from 'firebase/auth';

export const dishes = writable<Dish[]>([] as Dish[]);

/** used to store the added ingrendients to a dish that is created or edited..
 * NOTE: Only store the strings..
 */
export const ingredients = writable<string[]>([] as string[]);

/** the currently logged in user or null */
export const user = writable<User | null>(null);

/** The plan entries for the current week */
export const currentPlans = writable<PlanEntry[]>([] as PlanEntry[]);

/** The plan entries for the upcoming week */
export const nextWeekPlans = writable<PlanEntry[]>([] as PlanEntry[]);
