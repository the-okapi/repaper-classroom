import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { unwrap, unwrapNoData } from '$lib/error';

export const load: LayoutServerLoad = async ({ cookies, locals, route }) => {
	if (route.id === '/error') {
		return;
	}

	try {
		const { user } = unwrap(await locals.supabase.auth.getUser(), 36);

		if (!user) {
			return {
				cookies: cookies.getAll(),
				loggedIn: false
			};
		}

		const check = unwrap(
			await locals.supabase.from('users').select('can_delete').eq('id', user.id),
			37
		);

		const date = new Date(check[0].can_delete);

		if (new Date() < date || check[0].can_delete === null) {
			return {
				cookies: cookies.getAll(),
				loggedIn: true
			};
		}

		unwrapNoData(await locals.supabase.auth.signOut(), 38);
	} catch {
		return redirect(303, '/error');
	}

	return redirect(303, '/');
};
