import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, locals, route }) => {
	if (route.id === '/error') {
		return;
	}

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return {
			cookies: cookies.getAll(),
			loggedIn: false
		};
	}

	const { data: check, error } = await locals.supabase
		.from('users')
		.select('can_delete')
		.eq('id', user.id);

	if (error) {
		console.error(error, 'routes/layout error');
		return redirect(303, '/error');
	}

	const date = new Date(check[0].can_delete);

	if (new Date() < date || check[0].can_delete === null) {
		return {
			cookies: cookies.getAll(),
			loggedIn: true
		};
	}

	const { error: signOutError } = await locals.supabase.auth.signOut();

	if (signOutError) {
		console.error(signOutError, 'routes/layout sign out');
		return redirect(303, '/error');
	}

	return redirect(303, '/');
};
