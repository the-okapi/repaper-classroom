import type { RequestHandler } from './$types';
import { json, redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = await request.json();

	const {
		data: { user },
		error
	} = await locals.supabase.auth.signInWithPassword({
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
	}

	if (!user) {
		return redirect(303, '/');
	}

	const { data: check, error: checkError } = await locals.supabase
		.from('users')
		.select('can_delete')
		.eq('id', user.id);

	if (checkError) {
		return json({ message: checkError.message }, { status: 500 });
	}

	if (!check[0].can_delete) {
		return redirect(303, '/home');
	}

	const date = new Date(check[0].can_delete);

	if (new Date() < date) {
		return redirect(303, '/home');
	}

	const { error: logOutError } = await locals.supabase.auth.signOut();

	if (logOutError) {
		return json(
			{
				message: logOutError.message
			},
			{ status: 500 }
		);
	} else {
		return json(
			{
				message: 'Invalid email or password'
			},
			{ status: 400 }
		);
	}
};
