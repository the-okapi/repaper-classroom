import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	const { data, error } = await locals.supabase
		.from('class_memberships')
		.select('class ( name, organization ( id, name ) )')
		.eq('class', params.id)
		.eq('user', user.id)
		.eq('owner', true);

	if (!data?.[0]) {
		return redirect(303, '/home');
	}

	if (error) {
		console.error(error, 'organization/org/class/id page.server error');
		return redirect(303, '/error');
	}

	const { data: classData, error: classError } = await locals.supabase
		.from('class_memberships')
		.select('user ( id, name ), owner')
		.eq('class', params.id)
		.neq('user', user.id);

	if (classError) {
		console.error(classError, 'organization/org/class/id page.server class');
		return redirect(303, '/error');
	}

	return {
		students: classData,
		title: data[0].class.name,
		organization: data[0].class.organization
	};
};
