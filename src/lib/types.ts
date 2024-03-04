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
	id?: number;
	/** What is the dish called */
	name: string;
	/** Url to the recipe */
	url: URL;
	/** When it was last scheduled in the dinner scheduler */
	lastMade: Date | null;
	/** The image number of the dinner, used if no custom image */
	image?: number;
	/** the id of the custom image */
	customImageId?: number;
	/** the user imported custom image */
	customImage?: File | null;
	/** Used when creating shopping list */
	ingredients?: Ingredient[];
	/** link to image id */
	imageId?: number | null;
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
