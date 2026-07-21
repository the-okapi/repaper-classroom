import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as v from 'valibot';

export const load: PageServerLoad = async ({ locals }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	return { user: user.id };
};

const StudentSchema = v.object({
	name: v.string(),
	email: v.string(),
	c: v.string()
});

export const actions = {
	create: async ({ request, locals }) => {
		const { className, organization } = Object.fromEntries(await request.formData());

		const {
			data: { user },
			error
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		} else if (error) {
			console.error(error, 'home/page.server error2');
			return fail(500, { createFailure: true, message: error.message });
		}

		const { data: check } = await locals.supabase
			.from('organization_memberships')
			.select('id')
			.eq('organization', organization)
			.eq('owner', true)
			.eq('user', user.id);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		const { error: insertError } = await locals.supabase.from('classes').insert({
			name: className,
			creator: user.id,
			organization
		});

		if (insertError) {
			console.error(error, 'home/page.server insert');
			return fail(500, { createFailure: true, message: insertError.message });
		}

		return { success: true };
	},
	organization: async ({ request, locals }) => {
		const { orgName } = Object.fromEntries(await request.formData());

		const {
			data: { user },
			error
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		} else if (error) {
			console.error(error, 'home/page.server error3');
			return fail(500, { orgFailure: true, message: error.message });
		}

		const id = crypto.randomUUID();

		const { error: insertError } = await locals.supabase.from('organizations').insert({
			id,
			name: orgName,
			creator: user.id
		});

		if (insertError) {
			console.error(error, 'home/page.server insert2');
			return fail(500, { orgFailure: true, message: insertError.message });
		}

		const { error: updateError } = await locals.supabase
			.from('users')
			.update({
				organization: id
			})
			.eq('id', user.id);

		if (updateError) {
			console.error(error, 'home/page.server update');
			return fail(500, { orgFailure: true, message: updateError.message });
		}

		return { success: true };
	},
	add: async ({ request, locals }) => {
		const { email: e, class: c } = Object.fromEntries(await request.formData());

		const { data, error } = await locals.supabase.rpc('check_email', { e, c });

		if (error) {
			console.error(error, 'home/page.server error4');
			return fail(500, { addFailure: true, message: error.message });
		}

		if (!data) {
			return fail(400, {
				addFailure: true,
				message: 'User does not exists, or already is in class'
			});
		}

		const { error: addError } = await locals.supabase.from('class_memberships').insert({
			user: data,
			class: c,
			owner: false
		});

		if (addError) {
			console.error(addError, 'home/page.server add');
			return fail(400, { addFailure: true, message: addError.message });
		}

		return { success: true };
	},
	student: async ({ request, locals }) => {
		//const { name, email, class: c } = Object.fromEntries(await request.formData());

		const formData = v.safeParse(StudentSchema, Object.fromEntries(await request.formData()));

		if (!formData.success) {
			return fail(400, { studentFailure: true, message: 'Must be text, not file' });
		}

		const { name, email, c } = formData.output;

		const { data: check, error: checkError } = await locals.supabase.rpc('check_email', {
			e: email,
			c
		});

		if (checkError || check) {
			return fail(500, {
				studentFailure: true,
				message: checkError ? checkError.message : 'Student already exists'
			});
		}

		const { error: signUpError } = await locals.supabase.auth.signUp({
			email,
			password: crypto.randomUUID(),
			options: {
				data: {
					name
				}
			}
		});

		if (signUpError) {
			return fail(500, {
				studentFailure: true,
				message: signUpError.message
			});
		}

		return { success: true };
	}
} satisfies Actions;
