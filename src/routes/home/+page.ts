import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {
	const parentData = await parent();
	if (!parentData.loggedIn) {
		return redirect(307, '/');
	}

	return { title: 'Home', ...data };
};
