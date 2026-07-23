import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	rename,
	create,
	revoke,
	renameMember,
	deleteMember,
	restore,
	promote,
	demote
} from './actions';
import { unwrap } from '$lib/error';

export const load: PageServerLoad = async ({ locals, params }) => {
	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 67);

		if (!user) {
			return redirect(303, '/home');
		}

		const data = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('organization ( name )')
				.eq('user', user.id)
				.eq('owner', true)
				.eq('organization', params.org),
			68
		);

		if (!data?.[0]) {
			return redirect(303, '/home');
		}

		const members = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('user ( id, name, email ), owner')
				.eq('organization', params.org),
			69
		);

		const invitations = unwrap(
			await locals.supabase
				.from('invitations')
				.select('id, name, email')
				.eq('organization', params.org),
			70
		);

		const d = unwrap(
			await locals.supabase
				.from('users')
				.select('id, name, email, can_delete')
				.neq('can_delete', null)
				.eq('organization', params.org),
			71
		);

		const deletions = d.filter(
			(a: { id: string; name: string; email: string; can_delete: string }) =>
				new Date(a.can_delete) < new Date()
		);

		return {
			title: data[0].organization.name,
			members,
			user: user.id,
			invitations,
			deletions
		};
	} catch {
		return redirect(303, '/error');
	}
};

export const actions = {
	rename,
	create,
	revoke,
	renameMember,
	delete: deleteMember,
	restore,
	promote,
	demote
} satisfies Actions;
