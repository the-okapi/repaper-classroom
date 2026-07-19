import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '');
		const email = String(formData.get('email') ?? '');
		const password = String(formData.get('password') ?? '');

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
			console.log(JSON.stringify(signUpError));
			return fail(400, { fail: true, message: signUpError.message, name, email });
		}

		return redirect(303, '/home');
	}
} satisfies Actions;
