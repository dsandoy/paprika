type URL = string;

export type Ingredient = string;

/** Dinner or dish had for dinner */
export interface Dish {
	id?: string;
	/** What is the dish called */
	name: string;
	/** Url to the recipe */
	url: URL;
	/** When it was last scheduled in the dinner scheduler */
	lastMade?: Date;
	/** The image number of the dinner, used if no custom image */
	image?: number;
	/** the user imported custom image */
	customImage?: CustomImage;
	/** Used when creating shopping list */
	ingredients?: Ingredient[];
	/** The user email that created the dinner */
	user: string;
}

export interface CustomImage {
	name: string;
	size: number;
	type: string;
	lastModified: number;
	data: Buffer;
}
