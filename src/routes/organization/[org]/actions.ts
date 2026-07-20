import { redirect, fail } from '@sveltejs/kit';
import type { RouteParams } from './$types';
import resend from '$lib/resend';

type ActionData = {
	request: Request;
	params: RouteParams;
	locals: App.Locals;
};

export const rename = async ({ request, params, locals }: ActionData) => {
	const formData = await request.formData();
	const name = String(formData.get('name') ?? '');

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	const { data: check } = await locals.supabase
		.from('organization_memberships')
		.select('organization ( name )')
		.eq('organization', params.org)
		.eq('user', user.id)
		.eq('owner', true);

	if (!check?.[0]) {
		return redirect(303, '/home');
	}

	const { error } = await locals.supabase
		.from('organizations')
		.update({
			name
		})
		.eq('id', params.org)
		.eq('name', check[0].organization.name);

	if (error) {
		return { renameError: true, message: error.message };
	}

	return { success: true };
};

export const create = async ({ locals, request, params }: ActionData) => {
	const formData = await request.formData();
	const name = String(formData.get('name') ?? '');
	const email = String(formData.get('email') ?? '');

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	const { data: foundData, error: foundError } = await locals.supabase
		.from('users')
		.select('id')
		.eq('email', email);

	if (foundError) {
		return fail(500, { createError: true, message: foundError.message });
	}

	if (foundData.length > 0) {
		return fail(409, { createError: true, message: 'A user with that email already exists.' });
	}

	const { data: check } = await locals.supabase
		.from('organization_memberships')
		.select('organization ( name )')
		.eq('user', user.id)
		.eq('owner', true)
		.eq('organization', params.org);

	if (!check?.[0]) {
		return redirect(303, '/home');
	}

	const { data: invitation, error } = await locals.supabase
		.from('invitations')
		.insert({
			name,
			email,
			organization: params.org
		})
		.select('id');

	if (error) {
		return fail(500, { createError: true, message: error.message });
	}

	await resend.emails.send({
		from: 'Repaper Classroom <repaper-classroom@unlimitedstuffltd.com>',
		to: email,
		template: {
			id: 'invitation-email',
			variables: {
				NAME: name,
				ORGANIZATION: check[0].organization.name,
				LINK:
					'https://classroom.repaper.unlimitedstuffltd.com/invitation/' +
					params.org +
					'/' +
					invitation[0].id
			}
		}
	});

	return { createSuccess: true, success: true, email };
};

export const revoke = async ({ request, locals, params }: ActionData) => {
	const formData = await request.formData();
	const invitation = String(formData.get('invitation') ?? '');

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	const { data: check } = await locals.supabase
		.from('organization_memberships')
		.select('id')
		.eq('organization', params.org)
		.eq('user', user.id)
		.eq('owner', true);

	if (!check?.[0]) {
		return redirect(303, '/home');
	}

	const { error } = await locals.supabase
		.from('invitations')
		.delete()
		.eq('id', invitation)
		.eq('organization', params.org);

	if (error) {
		return redirect(303, '/error');
	}

	return { success: true };
};

export const renameMember = async ({ request, locals, params }: ActionData) => {
	const formData = await request.formData();
	const userId = String(formData.get('user') ?? '');
	const name = String(formData.get('name') ?? '');

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	const { data: check } = await locals.supabase
		.from('organization_memberships')
		.select('id')
		.eq('user', user.id)
		.eq('organization', params.org)
		.eq('owner', true);

	if (!check?.[0]) {
		return redirect(303, '/home');
	}

	const { data: check2 } = await locals.supabase
		.from('organization_memberships')
		.select('user')
		.eq('user', userId)
		.eq('organization', params.org);

	if (!check2?.[0]) {
		return fail(400, { renameMemberError: true, message: 'User does not exist.' });
	}

	const { error } = await locals.supabase
		.from('users')
		.update({
			name
		})
		.eq('id', userId);

	if (error) {
		return fail(500, { renameMemberError: true, message: error.message });
	}

	return { success: true };
};
