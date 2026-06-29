import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: { user } } = await locals.supabase.auth.getUser();
	if (!user) {
		redirect(303, '/');
	}

	const { data } = await locals.supabase.from('users').select().eq('id', user.id);

	if (!data) {
		redirect(303, '/');
	}

	return { user: data[0] };
};

export const actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const className = String(formData.get('class-name') ?? '');

		const {
			data: { user },
			error
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		} else if (error) {
			return fail(500, { failure: true, message: error.message });
		}

		const { data, error: insertError } = await locals.supabase.from('classes').insert({
			name: className,
			owner: user.id
		}).select('id');

		if (insertError) {
			return fail(500, { failure: true, message: insertError.message });
		}

		const { error: updateError } = await locals.supabase.from('users').update({
			class: data[0].id
		}).eq('id', user.id);

		if (updateError) {
			return fail(500, { failure: true, message: updateError.message});
		}

		return { success: true };
	}
} satisfies Actions;
