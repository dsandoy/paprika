type URL = string;

export interface Ingredient {
	/** The ingredient */
	value: string;
	/** database stuff.. */
	dinnerId?: number;
	/** database stuff.. */
	dinner?: Dish;
}

/** Dinner or dish had for dinner */
export interface Dish {
	/** What is the dish called */
	name: string;
	/** Url to the recipe */
	url: URL;
	/** When it was last scheduled in the dinner scheduler */
	lastMade: Date | null;
	/** The image of the dinner */
	image?: URL | null;
	/** Used when creating shopping list */
	ingredients?: Ingredient[];
	/** link to image id */
	imageId?: number | null;
	/** The user email that created the dinner */
	user: string;
}
