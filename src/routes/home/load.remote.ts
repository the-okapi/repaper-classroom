import { getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { string } from 'valibot';
import { unwrap } from '$lib/error';

export const load = query(string(), async (userId) => {
	const { locals } = getRequestEvent();

	try {
		const orgData = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('organization ( id, name ), owner')
				.eq('user', userId)
				.limit(1),
			76
		);

		if (orgData.length === 0) {
			return { organization: null, classes: [] };
		}

		const organization = {
			owner: orgData[0].owner,
			id: orgData[0].organization.id,
			name: orgData[0].organization.name
		};

		const data = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('class ( id, name )')
				.eq('user', userId)
				.eq('owner', true),
			77
		);

		const classes = data.map((c: { class: { id: string; name: string } }) => c.class);

		return { classes, organization };
	} catch {
		return redirect(303, '/error');
	}
});
