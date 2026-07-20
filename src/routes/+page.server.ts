import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const data = await parent();
	if (data.loggedIn) {
		return redirect(307, '/home');
	}

	return {
		title: 'Repaper Classroom'
	};
};
