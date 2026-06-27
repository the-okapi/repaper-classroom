import { resolve } from '$app/paths';
import type { RequestHandler } from './$types';
import { json, redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = await request.json();

	const { error } = await locals.supabase.auth.signInWithPassword({
		email: data.email,
		password: data.password
	});

	if (error) {
		return json(
			{
				message: error.message
			},
			{ status: 400 }
		);
	} else {
		return redirect(303, resolve('/home'));
	}
};
