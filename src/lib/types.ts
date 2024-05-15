import type { Timestamp } from 'firebase/firestore';

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

export interface CreateIngredient {
	value: string;
}

export interface CreateImage {
	name: string;
	size: number;
	type: string;
	lastModified: number;
	data: Buffer;
}

export interface CreateDish {
	name: string;
	url: string;
	user: string;
	ingredients?: CreateIngredient[];
	image?: CreateImage;
}

export interface UpdateImage {
	name: string;
	size: number;
	type: string;
	lastModified: number;
	data: Buffer;
}

export interface UpdateIngredient {
	// id: number;
	value: string;
	// dishId?: number;
}

export interface UpdateDish {
	id: number;
	name: string;
	url: string;
	ingredients?: UpdateIngredient[];
	image?: UpdateImage;
}

export interface ReadIngredient {
	id: number;
	value: string;
}

export interface ReadDish {
	id: number;
	name: string;
	url: string;
	user: string;
	ingredients?: ReadIngredient[];
}
