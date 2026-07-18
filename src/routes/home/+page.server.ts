import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		redirect(303, '/');
	}

	const { data: orgData, error: orgError } = await locals.supabase
		.from('organization_memberships')
		.select('organization ( id, name ), owner')
		.eq('user', user.id)
		.limit(1);

	if (orgError) {
		console.log(orgError, 'get org');
		redirect(303, '/error');
	}

	if (orgData.length === 0) {
		return { organization: null, classes: [] };
	}

	const organization = {
		owner: orgData[0].owner,
		id: orgData[0].organization.id,
		name: orgData[0].organization.name
	};

	const { data, error } = await locals.supabase
		.from('class_memberships')
		.select('class ( id, name )')
		.eq('user', user.id)
		.eq('owner', true);

	if (error) {
		console.log(error, 'select from class');
		redirect(303, '/error');
	}

	const classes = data.map((c) => c.class);

	return { classes, organization, title: 'Home' };
};

export const actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const className = String(formData.get('class-name') ?? '');
		const organization = String(formData.get('organization') ?? '');

		const {
			data: { user },
			error
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		} else if (error) {
			return fail(500, { createFailure: true, message: error.message });
		}

		const { error: insertError } = await locals.supabase.from('classes').insert({
			name: className,
			creator: user.id,
			organization
		});

		if (insertError) {
			console.log(insertError);
			return fail(500, { createFailure: true, message: insertError.message });
		}

		return { success: true };
	},
	organization: async ({ request, locals }) => {
		const formData = await request.formData();
		const orgName = String(formData.get('org-name') ?? '');

		const {
			data: { user },
			error
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		} else if (error) {
			return fail(500, { orgFailure: true, message: error.message });
		}

		const { error: insertError } = await locals.supabase.from('organizations').insert({
			name: orgName,
			creator: user.id
		});

		if (insertError) {
			return fail(500, { orgFailure: true, message: insertError.message });
		}

		return { success: true };
	},
	add: async ({ request, locals }) => {
		const formData = await request.formData();
		const e = String(formData.get('email') ?? '');
		const c = String(formData.get('class') ?? '');

		const { data, error } = await locals.supabase.rpc('check_email', { e, c });

		if (error) {
			console.log(error);
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
			return fail(400, { addFailure: true, message: addError.message });
		}

		return { success: true };
	},
	student: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '');
		const email = String(formData.get('email') ?? '');
		const c = String(formData.get('class') ?? '');

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
