import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '');
		const email = String(formData.get('email') ?? '');
		const password = String(formData.get('password') ?? '');
		const className = String(formData.get('class-name') ?? '');

		const { data, error: signUpError } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name
				}
			}
		});

		if (signUpError) {
			return fail(400, { fail: true, message: signUpError.message });
		}

		const { data: classData, error: insertError } = await locals.supabase
			.from('classes')
			.insert({
				name: className,
				owner: data.user?.id
			})
			.select('id');

		if (insertError) {
			return fail(400, { fail: true, message: insertError.message });
		}

		const { error } = await locals.supabase
			.from('users')
			.update({
				class: classData[0].id
			})
			.eq('id', data.user?.id);

		if (error) {
			return fail(400, { fail: true, message: error.message });
		}

		redirect(303, '/home');
	}
} satisfies Actions;
