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

export interface CreatePlan {
	date: Date;
	user: string;
}

export interface UpdatePlan {
	id: number;
	date: Date;
	user: string;
	dishId?: number | null;
	dish?: ReadDish | null;
	note?: Note | null;
}

export interface ReadPlan {
	id: number;
	date: Date;
	user: string;
	dish: ReadDish | null;
	dishId: number | null;
	note?: Note | null;
	checked?: boolean;
}

export type Note = string;

export interface CreateListEntry {
	user: string;
	text: string;
	dishName?: string;
}

export interface UpdateListEntry {
	user: string;
	id: number;
	text: string;
	is_complete: boolean;
	dishName?: string;
}

export interface ReadListEntry {
	user: string;
	id?: number;
	text: string;
	is_complete: boolean;
	dishName?: string | null;
}

export interface DemoDish {
	id: number;
	name: string;
	url: string;
	ingredients?: string[];
	image?: string;
}

export interface DemoPlan {
	date: Date;
	dish?: DemoDish;
	note?: Note;
}
