import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { object, string, safeParse } from 'valibot';

const SignupSchema = object({
	name: string(),
	email: string(),
	password: string()
});

export const actions = {
	default: async ({ request, locals }) => {
		const formData = safeParse(SignupSchema, Object.fromEntries(await request.formData()));

		if (!formData.success) {
			return fail(400, {
				fail: true,
				message: 'Must be text, not file',
				name: '',
				email: ''
			});
		}

		const { email, password, name } = formData.output;

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
