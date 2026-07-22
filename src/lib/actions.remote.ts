import { form, getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { redirect } from '@sveltejs/kit';

export const signOut = form(async () => {
	const { locals } = getRequestEvent();

	const { error } = await locals.supabase.auth.signOut();

	if (error) {
		return { status: 500, message: error.message };
	}

	return redirect(303, '/');
});

const LogInSchema = v.object({
	email: v.string(),
	password: v.string()
});

export const logIn = form(LogInSchema, async ({ email, password }) => {
	const { locals } = getRequestEvent();

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

	const { data: check, error: checkError } = await locals.supabase
		.from('users')
		.select('can_delete')
		.eq('id', user.id);

	if (checkError) {
		return { status: 500, message: checkError.message };
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
		return { status: 500, message: logOutError.message };
	} else {
		return { status: 400, message: 'Invalid email or password' };
	}
});
