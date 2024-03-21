export type Ingredient = string;

/** Dinner or dish had for dinner */
export interface Dish {
	id?: string;
	/** What is the dish called */
	name: string;
	/** Url to the recipe */
	url: string;
	/** When it was last scheduled in the dinner scheduler */
	lastMade?: Date;
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
	date: Date;
	dish?: Dish;
	checked?: boolean;
}
