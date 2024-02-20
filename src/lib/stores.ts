import { writable } from "svelte/store";
import type { Dinner } from "./types";


export const dinners = writable<Dinner[]>([] as Dinner[])
