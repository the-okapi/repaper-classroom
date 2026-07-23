import { redirect, fail } from '@sveltejs/kit';
import resend from '$lib/resend';
import { object, string, safeParse } from 'valibot';
import type { RouteParams } from './$types';
import { UserIdSchema } from '$lib/types';

type ActionData = {
	request: Request;
	params: RouteParams;
	locals: App.Locals;
};

const RenameSchema = object({
	name: string()
});

export const rename = async ({ request, params, locals }: ActionData) => {
	const formData = safeParse(RenameSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return redirect(303, '/error');
	}

	const { name } = formData.output;

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

const CreateSchema = object({
	name: string(),
	email: string()
});

export const create = async ({ locals, request, params }: ActionData) => {
	const formData = safeParse(CreateSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { createError: true, message: 'Must be text, not file' });
	}

	const { name, email } = formData.output;

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
		console.error(foundError, 'actions found');
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
		console.error('actions error2');
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

const RevokeSchema = object({
	invitation: string()
});

export const revoke = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(RevokeSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return redirect(303, '/error');
	}

	const { invitation } = formData.output;

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
		console.error(error, 'actions error');
		return redirect(303, '/error');
	}

	return { success: true };
};

const RenameMemberSchema = object({
	user: string(),
	name: string()
});

export const renameMember = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(RenameMemberSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { renameMemberError: true, message: 'Must be text, not files' });
	}

	const { user: userId, name } = formData.output;

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
		console.error(error, 'actions error3');
		return fail(500, { renameMemberError: true, message: error.message });
	}

	return { success: true };
};

export const deleteMember = async ({ request, params, locals }: ActionData) => {
	const formData = safeParse(UserIdSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return redirect(303, '/error');
	}

	const { userId } = formData.output;

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
		.eq('owner', true)
		.eq('user', user.id);

	if (!check?.[0]) {
		return redirect(303, '/home');
	}

	const { error: deleteError } = await locals.supabase
		.from('organization_memberships')
		.delete()
		.eq('organization', params.org)
		.eq('user', userId);

	if (deleteError) {
		console.error(deleteError, 'actions delete');
		return redirect(303, '/error');
	}

	const date = new Date();

	date.setDate(date.getDate() + 30);

	const { error: updateError } = await locals.supabase
		.from('users')
		.update({ can_delete: date.toISOString() })
		.eq('id', userId);

	if (updateError) {
		console.error(updateError, 'actions update');
		return redirect(303, '/error');
	}

	return { success: true };
};

export const restore = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(UserIdSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return redirect(303, '/error');
	}

	const { userId } = formData.output;

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

	const { error: insertError } = await locals.supabase.from('organization_memberships').insert({
		user: userId,
		organization: params.org,
		owner: false
	});

	if (insertError) {
		console.error(insertError, 'actions insert');
		return redirect(303, '/error');
	}

	const { error: updateError } = await locals.supabase
		.from('users')
		.update({
			can_delete: null
		})
		.eq('id', userId)
		.eq('organization', params.org);

	if (updateError) {
		console.error(updateError, 'actions update');
		return redirect(303, '/error');
	}

	return { success: true };
};

export const promote = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(UserIdSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return redirect(303, '/error');
	}

	const { userId } = formData.output;

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
		.eq('owner', true)
		.eq('user', user.id);

	if (!check?.[0]) {
		return redirect(303, '/home');
	}

	const { error } = await locals.supabase
		.from('organization_memberships')
		.update({
			owner: true
		})
		.eq('user', userId)
		.eq('organization', params.org)
		.eq('owner', false);

	if (error) {
		console.log(error, 'actions promote');
		return redirect(303, '/error');
	}

	return { success: true };
};

export const demote = async ({ request, params, locals }: ActionData) => {
	const formData = safeParse(UserIdSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return redirect(303, '/error');
	}

	const { userId } = formData.output;

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	if (userId === user.id) {
		return fail(400, { demoteFailure: true, message: 'You cannot demote yourself.' });
	}

	const { data: check } = await locals.supabase
		.from('organization_memberships')
		.select('id')
		.eq('organization', params.org)
		.eq('owner', true)
		.eq('user', user.id);

	if (!check?.[0]) {
		return redirect(303, '/home');
	}

	const { error } = await locals.supabase
		.from('organization_memberships')
		.update({
			owner: false
		})
		.eq('user', userId)
		.eq('organization', params.org)
		.eq('owner', true);

	if (error) {
		console.error(error, 'actions error5');
		return redirect(303, '/error');
	}

	return { success: true };
};
