import { writable } from 'svelte/store';
import type { Dish, Ingredient } from './types';

export const dishes = writable<Dish[]>([] as Dish[]);


/** used to store the added ingrendients to a dish that is created or edited.. */
export const ingredients = writable<Ingredient[]>([] as Ingredient[]);
