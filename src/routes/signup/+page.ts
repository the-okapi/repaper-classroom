import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const data = await parent();
	if (data.loggedIn) {
		return redirect(307, '/home');
	}

	return {
		title: 'Sign Up'
	};
};
