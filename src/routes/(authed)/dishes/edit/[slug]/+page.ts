import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return {
		dishName: params.slug
	};
};