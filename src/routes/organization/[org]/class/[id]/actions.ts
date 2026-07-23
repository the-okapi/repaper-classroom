import { fail, redirect } from '@sveltejs/kit';
import type { RouteParams } from './$types';
import { object, string, safeParse } from 'valibot';
import { HttpError, unwrap } from '$lib/error';
import { UserIdSchema } from '$lib/types';

type ActionData = {
	request: Request;
	locals: App.Locals;
	params: RouteParams;
};

const AddSchema = object({
	userId: string(),
	email: string()
});

export const add = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(AddSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { add: 'Must be text, not file', user: '' });
	}

	const { userId, email } = formData.output;

	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 1);

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
			2
		);

		if (!check?.[0]) {
			throw new HttpError('Invalid Permissions', 403);
		}

		const check2 = unwrap(
			await locals.supabase
				.from('classes')
				.select('organization')
				.eq('id', params.id)
				.eq('organization', params.org),
			9
		);

		if (!check2 || check2[0].organization !== params.org) {
			throw new HttpError('Class Not Found', 404);
		}

		const check3 = unwrap(
			await locals.supabase
				.from('users')
				.select('id')
				.eq('id', userId)
				.eq('email', email)
				.eq('organization', params.org),
			3
		);

		if (!check3?.[0]) {
			throw new HttpError('User not found', 400);
		}

		const check4 = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('class ( organization )')
				.eq('class', params.id)
				.eq('user', userId),
			4
		);

		if (check4?.[0]) {
			throw new HttpError('User is already in class', 409);
		}

		unwrap(
			await locals.supabase.from('class_memberships').insert({
				user: userId,
				class: params.id,
				owner: false
			}),
			5
		);
	} catch (error: any) {
		return fail(error.statusCode, { add: error.message, user: userId });
	}

	return { success: true };
};

export const remove = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(UserIdSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { remove: 'Must be text, not file' });
	}

	const { userId } = formData.output;

	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 6);

		if (!user) {
			return redirect(303, '/');
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id')
				.eq('user', user.id)
				.eq('owner', true)
				.eq('organization', params.org),
			7
		);

		if (!check?.[0]) {
			return new HttpError('Invalid Permissions', 403);
		}

		unwrap(
			await locals.supabase
				.from('class_memberships')
				.delete()
				.eq('user', userId)
				.eq('class', params.id),
			8
		);
	} catch (error: any) {
		return fail(error.statusCode, { remove: error.message, userId });
	}

	return { success: true };
};
