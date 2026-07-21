import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, locals }) => {
		const { name, email, password } = Object.fromEntries(await request.formData());

		const { error: signUpError } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name
				}
			}
		});

		if (signUpError) {
			console.error(signUpError, 'signup/page.server signup');
			return fail(400, { fail: true, message: signUpError.message, name, email });
		}

		return redirect(303, '/home');
	}
} satisfies Actions;
