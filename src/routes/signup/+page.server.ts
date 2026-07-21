import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import * as z from 'zod';

const Signup = z.object({
	name: z.string(),
	email: z.string(),
	password: z.string()
});

export const actions = {
	default: async ({ request, locals }) => {
		const formData = Signup.safeParse(Object.fromEntries(await request.formData()));

		if (!formData.success) {
			return fail(400, { fail: true, message: 'Must be text, not file' });
		}

		const { email, password, name } = formData.data;

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
