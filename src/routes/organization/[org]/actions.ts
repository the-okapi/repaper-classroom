import { redirect, fail } from '@sveltejs/kit';
import resend from '$lib/resend';
import { object, string, safeParse } from 'valibot';
import type { RouteParams } from './$types';
import { UserIdSchema } from '$lib/types';
import { unwrap, unwrapNoData } from '$lib/error';

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

	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 39);

		if (!user) {
			return redirect(303, '/');
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('organization ( name )')
				.eq('organization', params.org)
				.eq('user', user.id)
				.eq('owner', true),
			40
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		unwrapNoData(
			await locals.supabase
				.from('organizations')
				.update({
					name
				})
				.eq('id', params.org)
				.eq('name', check[0].organization.name),
			41
		);
	} catch (error: any) {
		return fail(500, { renameError: true, message: error.message });
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

	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 42);

		if (!user) {
			return redirect(303, '/');
		}

		const foundData = unwrap(
			await locals.supabase.from('users').select('id').eq('email', email),
			43
		);

		if (foundData.length > 0) {
			return fail(409, {
				createError: true,
				message: 'A user with that email already exists.'
			});
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('organization ( name )')
				.eq('user', user.id)
				.eq('owner', true)
				.eq('organization', params.org),
			44
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		const invitation = unwrap(
			await locals.supabase
				.from('invitations')
				.insert({
					name,
					email,
					organization: params.org
				})
				.select('id'),
			45
		);

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
	} catch (error: any) {
		return fail(500, { createError: true, message: error.message });
	}

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

	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 46);

		if (!user) {
			return redirect(303, '/');
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id')
				.eq('organization', params.org)
				.eq('user', user.id)
				.eq('owner', true),
			47
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		unwrapNoData(
			await locals.supabase
				.from('invitations')
				.delete()
				.eq('id', invitation)
				.eq('organization', params.org),
			48
		);
	} catch {
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

	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 49);

		if (!user) {
			return redirect(303, '/');
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id')
				.eq('user', user.id)
				.eq('organization', params.org)
				.eq('owner', true),
			50
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		const check2 = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('user')
				.eq('user', userId)
				.eq('organization', params.org),
			51
		);

		if (!check2?.[0]) {
			return fail(400, { renameMemberError: true, message: 'User does not exist.' });
		}

		unwrapNoData(
			await locals.supabase
				.from('users')
				.update({
					name
				})
				.eq('id', userId),
			52
		);
	} catch (error: any) {
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

	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 53);

		if (!user) {
			return redirect(303, '/');
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id')
				.eq('organization', params.org)
				.eq('owner', true)
				.eq('user', user.id),
			54
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		unwrapNoData(
			await locals.supabase
				.from('organization_memberships')
				.delete()
				.eq('organization', params.org)
				.eq('user', userId),
			55
		);

		const date = new Date();

		date.setDate(date.getDate() + 30);

		unwrapNoData(
			await locals.supabase
				.from('users')
				.update({ can_delete: date.toISOString() })
				.eq('id', userId),
			56
		);
	} catch {
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

	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 57);

		if (!user) {
			return redirect(303, '/');
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id')
				.eq('organization', params.org)
				.eq('user', user.id)
				.eq('owner', true),
			58
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		unwrapNoData(
			await locals.supabase.from('organization_memberships').insert({
				user: userId,
				organization: params.org,
				owner: false
			}),
			59
		);

		unwrapNoData(
			await locals.supabase
				.from('users')
				.update({
					can_delete: null
				})
				.eq('id', userId)
				.eq('organization', params.org),
			60
		);
	} catch {
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

	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 61);

		if (!user) {
			return redirect(303, '/');
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id')
				.eq('organization', params.org)
				.eq('owner', true)
				.eq('user', user.id),
			62
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		unwrapNoData(
			await locals.supabase
				.from('organization_memberships')
				.update({
					owner: true
				})
				.eq('user', userId)
				.eq('organization', params.org)
				.eq('owner', false),
			63
		);
	} catch {
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

	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 64);

		if (!user) {
			return redirect(303, '/');
		}

		if (userId === user.id) {
			return fail(400, { demoteFailure: true, message: 'You cannot demote yourself.' });
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id')
				.eq('organization', params.org)
				.eq('owner', true)
				.eq('user', user.id),
			65
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		unwrapNoData(
			await locals.supabase
				.from('organization_memberships')
				.update({
					owner: false
				})
				.eq('user', userId)
				.eq('organization', params.org)
				.eq('owner', true),
			66
		);
	} catch {
		return redirect(303, '/error');
	}

	return { success: true };
};
