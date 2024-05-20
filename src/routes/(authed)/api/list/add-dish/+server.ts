import { ListQueries } from '$lib/server/queries';
import type { CreateListEntry } from '$lib/types';
import { text, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { dish, email } = body;
	if (!dish.ingredients) return text('No ingredients in dish');
	const ingredients = dish.ingredients;
	if (ingredients.length == 0) return text('The ingredients are empty');

	const entries: CreateListEntry[] = [];
	for (const i of ingredients) {
		const newEntry: CreateListEntry = {
			text: i.value,
			dishName: dish.name,
			user: email
		};
		entries.push(newEntry);
	}

	await ListQueries.createMany(entries);
	return text('Added ingredients to shopping list');
};
