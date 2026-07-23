import { getRequestEvent, query } from '$app/server';
import { string } from 'valibot';
import { redirect } from '@sveltejs/kit';
import { unwrap } from '$lib/error';

export const load = query(string(), async (organization: string) => {
	const { locals } = getRequestEvent();
	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 33);

		if (!user) {
			return redirect(303, '/');
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id')
				.eq('organization', organization)
				.eq('owner', true)
				.eq('user', user.id),
			34
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		const data = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('user ( id, name, email ), owner')
				.eq('organization', organization),
			35
		);

		return { data };
	} catch {
		return redirect(303, '/error');
	}
});
