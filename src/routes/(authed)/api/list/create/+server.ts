import { ListQueries } from '$lib/server/queries';
import { text, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	await ListQueries.create(body);
	return text('Created list entry');
};
