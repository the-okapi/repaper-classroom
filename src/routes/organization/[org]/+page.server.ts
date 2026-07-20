import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { rename, create, revoke, renameMember } from './actions';

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
		return redirect(303, '/error');
	}

	const { data: members, error: membersError } = await locals.supabase
		.from('organization_memberships')
		.select('user ( id, name, email ), owner')
		.eq('organization', params.org);

	if (membersError) {
		return redirect(303, '/error');
	}

	const { data: invitations, error: invitationsError } = await locals.supabase
		.from('invitations')
		.select('id, name, email')
		.eq('organization', params.org);

	if (invitationsError) {
		return redirect(303, '/error');
	}

	return {
		title: data[0].organization.name,
		members,
		user: user.id,
		invitations
	};
};

export const actions = {
	rename,
	create,
	revoke,
	renameMember
} satisfies Actions;
