import { getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { string } from 'valibot';

export const load = query(string(), async (userId) => {
	const { locals } = getRequestEvent();

	const { data: orgData, error: orgError } = await locals.supabase
		.from('organization_memberships')
		.select('organization ( id, name ), owner')
		.eq('user', userId)
		.limit(1);

	if (orgError) {
		console.error(orgError, 'home/page.server org');
		return redirect(303, '/error');
	}

	if (orgData.length === 0) {
		return { organization: null, classes: [] };
	}

	const organization = {
		owner: orgData[0].owner,
		id: orgData[0].organization.id,
		name: orgData[0].organization.name
	};

	const { data, error } = await locals.supabase
		.from('class_memberships')
		.select('class ( id, name )')
		.eq('user', userId)
		.eq('owner', true);

	if (error) {
		console.error(error, 'home/page.server error');
		return redirect(303, '/error');
	}

	const classes = data.map((c) => c.class);

	return { classes, organization };
});
