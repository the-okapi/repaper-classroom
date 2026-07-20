import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import resend from '$lib/resend';

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

	const { data: members, error: membersError } = await locals.supabase
		.from('organization_memberships')
		.select('user ( id, name, email ), owner')
		.eq('organization', params.id);

	if (membersError) {
		return redirect(303, '/error');
	}

	return {
		title: data[0].organization.name,
		members,
		user: user.id
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
	},
	create: async ({ locals, request, params }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '');
		const email = String(formData.get('email') ?? '');

		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		const { data: foundData, error: foundError } = await locals.supabase
			.from('users')
			.select('id')
			.eq('email', email);

		if (foundError) {
			return fail(500, { createError: true, message: foundError.message });
		}

		if (foundData.length > 0) {
			return fail(409, { createError: true, message: 'A user with that email already exists.' });
		}

		const { data: check } = await locals.supabase
			.from('organization_memberships')
			.select('organization ( name )')
			.eq('user', user.id)
			.eq('owner', true)
			.eq('organization', params.id);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		const { data: invitation, error } = await locals.supabase
			.from('invitations')
			.insert({
				name,
				email,
				organization: params.id
			})
			.select('id');

		if (error) {
			return fail(500, { createError: true, message: error.message });
		}

		await resend.emails.send({
			from: 'Repaper Classroom <repaper-classroom@unlimitedstuffltd.com>',
			to: email,
			template: {
				id: 'invitation-email',
				variables: {
					NAME: name,
					ORGANIZATION: check[0].organization.name,
					LINK:
						'https://classroom.repaper.unlimitedstuffltd.com/invitation/' +
						params.id +
						'/' +
						invitation[0].id
				}
			}
		});

		return { createSuccess: true, success: true, email };
	}
} satisfies Actions;
