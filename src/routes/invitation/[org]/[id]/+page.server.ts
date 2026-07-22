import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { object, string, safeParse } from 'valibot';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { data, error } = await locals.supabase.rpc('check_invitation_exists', {
		o: params.org,
		i: params.id
	});

	if (error) {
		console.error(error, 'invitation/org/id page.server error');
		return redirect(303, '/error');
	}

	if (data.length === 0) {
		return redirect(303, '/');
	}

	return {
		title: 'Create Account'
	};
};

const InvitationSchema = object({
	email: string(),
	password: string(),
	confirmPassword: string()
});

export const actions = {
	default: async ({ request, locals, params }) => {
		const formData = safeParse(InvitationSchema, Object.fromEntries(await request.formData()));

		if (!formData.success) {
			return fail(400, {
				fail: true,
				message: 'Must be text, not file',
				email: ''
			});
		}

		const { email, password, confirmPassword } = formData.output;

		if (password !== confirmPassword) {
			return fail(400, {
				fail: true,
				message: 'Password and Confirm Password must be the same.',
				email
			});
		}

		const { data, error: checkError } = await locals.supabase.rpc('check_invitation', {
			e: email,
			i: params.id,
			o: params.org
		});

		if (checkError) {
			console.error(checkError, 'invitation/org/id/page.server check');
			return fail(500, { fail: true, message: checkError.message, email });
		}

		if (data === '') {
			return fail(500, { fail: true, message: 'Incorrect Email', email });
		}

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name: data,
					organization: params.org
				}
			}
		});

		if (error) {
			console.error(error, 'invitation/org/id/page.server error2');
			return fail(500, { fail: true, message: error.message, email });
		}

		const { error: deleteError } = await locals.supabase
			.from('invitations')
			.delete()
			.eq('id', params.id);

		if (deleteError) {
			console.error(error, 'invitation/org/id/page.server delete');
			return fail(500, { fail: true, message: deleteError.message, email });
		}

		return redirect(303, '/home');
	}
} satisfies Actions;
