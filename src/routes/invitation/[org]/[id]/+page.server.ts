import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

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

export const actions = {
	default: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '');
		const password = String(formData.get('password') ?? '');
		const confirmPassword = String(formData.get('confirmPassword') ?? '');

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
			return fail(500, { fail: true, message: error.message, email });
		}

		const { error: deleteError } = await locals.supabase
			.from('invitations')
			.delete()
			.eq('id', params.id);

		if (deleteError) {
			return fail(500, { fail: true, message: deleteError.message, email });
		}

		return redirect(303, '/home');
	}
} satisfies Actions;
