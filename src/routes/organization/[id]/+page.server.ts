import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/home');
	}

	const { data, error } = await locals.supabase
		.from('organization_memberships')
		.select('organization ( name )')
		.eq('user', user.id)
		.eq('owner', true)
		.eq('organization', params.id);

	if (!data?.[0]) {
		return redirect(303, '/home');
	}

	if (error) {
		return redirect(303, '/error');
	}

	const members = locals.supabase
		.from('organization_memberships')
		.select('user ( id, name, email ), owner')
		.eq('organization', params.id);

	return {
		title: data[0].organization.name,
		members
	};
};

export const actions = {
	rename: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '');

		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		const { data: check } = await locals.supabase
			.from('organization_memberships')
			.select('organization ( name )')
			.eq('organization', params.id)
			.eq('user', user.id)
			.eq('owner', true);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		const { error } = await locals.supabase
			.from('organizations')
			.update({
				name
			})
			.eq('id', params.id)
			.eq('name', check[0].organization.name);

		if (error) {
			return { renameError: true, message: error.message };
		}

		return { success: true };
	}
} satisfies Actions;
