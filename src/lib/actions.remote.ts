import { form, getRequestEvent } from '$app/server';
import { object, string } from 'valibot';
import { redirect } from '@sveltejs/kit';
import { unwrap, unwrapNoData } from '$lib/error';

export const signOut = form(async () => {
	const { locals } = getRequestEvent();

	const { error } = await locals.supabase.auth.signOut();

	if (error) {
		console.error(error, 'Error Code 84');
		return { status: 500, message: error.message };
	}

	return redirect(303, '/');
});

const LogInSchema = object({
	email: string(),
	password: string()
});

export const logIn = form(LogInSchema, async ({ email, password }) => {
	const { locals } = getRequestEvent();

	try {
		const {
			data: { user },
			error
		} = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			return { status: 400, message: 'Invalid Email or Password' };
		}

		if (!user) {
			return redirect(303, '/');
		}

		const check = unwrap(
			await locals.supabase.from('users').select('can_delete').eq('id', user.id),
			85
		);

		if (!check[0].can_delete) {
			return redirect(303, '/home');
		}

		const date = new Date(check[0].can_delete);

		if (new Date() < date) {
			return redirect(303, '/home');
		}

		unwrapNoData(await locals.supabase.auth.signOut(), 86);

		return { status: 400, message: 'Invalid email or password' };
	} catch (error: any) {
		return { status: 500, message: error.message };
	}
});
