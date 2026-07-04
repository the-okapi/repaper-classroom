import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();
	if (!user) {
		console.log('redirect');
		redirect(303, '/');
	}

	const { data, error } = await locals.supabase
		.from('class_memberships')
		.select('class ( id, name )')
		.eq('user', user.id)
		.eq('owner', true);

	if (error) {
		console.log(error, 'select from class');
		redirect(303, '/error');
	}

	const classes = [];

	for (let i = 0; i < data.length; i++) {
		const { data: studentsData, error: studentsError } = await locals.supabase
			.from('class_memberships')
			.select('user ( id, name )')
			.eq('class', data[i].class.id);

		if (studentsError) {
			console.log(studentsError, 'select from class memberships');
			redirect(303, '/error');
		}

		classes.push({
			class: data[i].class,
			students: studentsData
		});
	}

	return { classes };
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
			return fail(500, { createFailure: true, message: error.message });
		}

		const { data, error: insertError } = await locals.supabase
			.from('classes')
			.insert({
				name: className
			})
			.select('id');

		if (insertError) {
			console.log(insertError);
			return fail(500, { createFailure: true, message: insertError.message });
		}

		const { error: updateError } = await locals.supabase.from('class_memberships').insert({
			user: user.id,
			class: data[0].id,
			owner: true
		});

		if (updateError) {
			return fail(500, { createFailure: true, message: updateError.message });
		}

		return { success: true };
	}
} satisfies Actions;
