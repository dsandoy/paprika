import type { DeleteDishBody } from '$lib/api';
import { DishQueries } from '$lib/server/queries';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as DeleteDishBody;
	try {
		await DishQueries.delete(body.id);
		return new Response(
			JSON.stringify({
				va: {
					is_valid: true,
					message: 'successfully deleted a dish'
				}
			})
		);
	} catch (e) {
		console.error(e);
		return new Response(
			JSON.stringify({
				va: {
					is_valid: false,
					message: 'Failed to delete dish'
				}
			})
		);
	}
};
