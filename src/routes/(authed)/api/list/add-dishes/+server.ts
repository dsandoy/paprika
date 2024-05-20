import { DishQueries, ListQueries } from '$lib/server/queries';
import type { CreateListEntry } from '$lib/types';
import { text, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { plans, email } = body;
	if (plans.length == 0) return text('No plans to add to shopping list');
	if (!email) return text('No email provided');

	for (const p of plans) {
		if (p.dishId) {
			const dish = await DishQueries.getById(p.dishId, email);
			if (!dish.ingredients) continue;

			const entries: CreateListEntry[] = [];
			for (const i of dish.ingredients) {
				const newEntry: CreateListEntry = {
					text: i.value,
					dishName: dish.name,
					user: email
				};
				entries.push(newEntry);
			}

			await ListQueries.createMany(entries);
		}
	}

	return text('Added dishes to shopping list');
};
