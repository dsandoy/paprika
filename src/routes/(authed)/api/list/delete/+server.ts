import { ListQueries } from '$lib/server/queries';
import { type RequestHandler, text } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { user } = body;
	await ListQueries.deleteCompleted(user);
	return text('Deleted list entry');
};
