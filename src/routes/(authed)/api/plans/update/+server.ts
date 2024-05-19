import { PlanQueries } from '$lib/server/queries';
import { text, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { plan, dishId } = body;
	await PlanQueries.updateDish(plan, dishId);
	return text('Updated plan with dish');
};

export const fallback: RequestHandler = async ({ request }) => {
	return text(`Please use POST, not: ${request.method}`);
};
