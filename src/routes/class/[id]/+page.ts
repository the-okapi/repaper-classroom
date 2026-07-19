import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {
	const parentData = await parent();
	if (!parentData.claims) {
		return redirect(307, '/');
	}

	return data;
};
