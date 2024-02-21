import { writable } from 'svelte/store';
import type { Dish } from './types';

export const dishes = writable<Dish[]>([] as Dish[]);
