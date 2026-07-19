import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent, data }) => {
	const parentData = await parent();
	if (!parentData.claims) {
		return redirect(303, '/');
	}

	return data;
};
