export type Ingredient = string;
type URL = string;

export interface Dinner {
	name: string;
	url: URL;
	lastMade: Date;
	image: URL | undefined;
	ingredients?: Ingredient[];
}
