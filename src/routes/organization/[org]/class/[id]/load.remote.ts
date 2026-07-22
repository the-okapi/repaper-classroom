import { getRequestEvent, query } from '$app/server';
import { string } from 'valibot';
import { redirect } from '@sveltejs/kit';

export const load = query(string(), async (organization: string) => {
	const { locals } = getRequestEvent();

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	const { data: check } = await locals.supabase
		.from('organization_memberships')
		.select('id')
		.eq('organization', organization)
		.eq('owner', true)
		.eq('user', user.id);

	if (!check?.[0]) {
		return redirect(303, '/home');
	}

	const { data, error } = await locals.supabase
		.from('organization_memberships')
		.select('user ( id, name, email ), owner')
		.eq('organization', organization);

	if (error) {
		return redirect(303, '/error');
	}

	return { data };
});
