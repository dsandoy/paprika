export type Ingredient = string;
type URL = string;

export interface Dinner {
	name: string;
	url: URL;
	lastMade: Date | null;
	image?: URL | null;
	ingredients?: Ingredient[];
	imageId?: number | null;
}
