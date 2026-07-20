import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { rename, create, revoke, renameMember, deleteMember, restore } from './actions';

export const load: PageServerLoad = async ({ locals, params }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/home');
	}

	const { data, error } = await locals.supabase
		.from('organization_memberships')
		.select('organization ( name )')
		.eq('user', user.id)
		.eq('owner', true)
		.eq('organization', params.org);

	if (!data?.[0]) {
		return redirect(303, '/home');
	}

	if (error) {
		console.error(error, 'organization/org page.server error');
		return redirect(303, '/error');
	}

	const { data: members, error: membersError } = await locals.supabase
		.from('organization_memberships')
		.select('user ( id, name, email ), owner')
		.eq('organization', params.org);

	if (membersError) {
		console.error(membersError, 'organization/org page.server members');
		return redirect(303, '/error');
	}

	const { data: invitations, error: invitationsError } = await locals.supabase
		.from('invitations')
		.select('id, name, email')
		.eq('organization', params.org);

	if (invitationsError) {
		console.error(invitationsError, 'organization/org page.server invitations');
		return redirect(303, '/error');
	}

	const { data: d, error: deletionsError } = await locals.supabase
		.from('users')
		.select('id, name, email, can_delete')
		.neq('can_delete', null)
		.eq('organization', params.org);

	if (deletionsError) {
		console.error(deletionsError, 'organization/org page.server deletions');
		return redirect(303, '/error');
	}

	const deletions = d.filter((a) => new Date(a.can_delete) < new Date());

	return {
		title: data[0].organization.name,
		members,
		user: user.id,
		invitations,
		deletions
	};
};

export const actions = {
	rename,
	create,
	revoke,
	renameMember,
	delete: deleteMember,
	restore
} satisfies Actions;
