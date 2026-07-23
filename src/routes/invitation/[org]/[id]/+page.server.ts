import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { object, string, safeParse } from 'valibot';
import { unwrap, unwrapNoData } from '$lib/error';

export const load: PageServerLoad = async ({ locals, params }) => {
	try {
		const data = unwrap(
			await locals.supabase.rpc('check_invitation_exists', {
				o: params.org,
				i: params.id
			}),
			72
		);

		if (data.length === 0) {
			return redirect(303, '/');
		}

		return {
			title: 'Create Account'
		};
	} catch {
		return redirect(303, '/error');
	}
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

		try {
			const data = unwrap(
				await locals.supabase.rpc('check_invitation', {
					e: email,
					i: params.id,
					o: params.org
				}),
				73
			);

			if (data === '') {
				return fail(500, { fail: true, message: 'Incorrect Email', email });
			}

			unwrapNoData(
				await locals.supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							name: data,
							organization: params.org
						}
					}
				}),
				74
			);

			unwrapNoData(
				await locals.supabase.from('invitations').delete().eq('id', params.id),
				75
			);
		} catch (error: any) {
			return fail(500, { fail: true, message: error.message, email });
		}

		return redirect(303, '/home');
	}
} satisfies Actions;
