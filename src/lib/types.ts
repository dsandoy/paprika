import type { Timestamp } from 'firebase/firestore';

export type Ingredient = string;

/** Dinner or dish had for dinner */
export interface Dish {
	id?: string;
	/** What is the dish called */
	name: string;
	/** Url to the recipe */
	url: string;
	/** When it was last scheduled in the dinner scheduler */
	lastMade?: Timestamp;
	/** The image number of the dinner, used if no custom image */
	image?: number;
	/** the user uploaded custom image */
	customImage?: string;
	/** Used when creating shopping list */
	ingredients?: Ingredient[];
	/** The user email that created the dinner */
	user: string;
}

export interface PlanEntry {
	id?: string;
	date: Timestamp;
	/** The id of the dish */
	dish?: string;
	user?: string;
	checked?: boolean;
}

export interface ShoppingListEntry {
	text: string;
	is_complete: boolean;
	dish?: string;
}

export interface ShoppingList {
	id?: string;
	/* the uid of the user */
	user: string;
	list: ShoppingListEntry[];
}
