import { redirect } from '@sveltejs/kit';
import type { RouteParams } from './$types';
import { object, string, safeParse } from 'valibot';

type ActionData = {
	request: Request;
	locals: App.Locals;
	params: RouteParams;
};

const AddSchema = object({
	
})

export const add = async ({ request, locals, params }: ActionData) => {
	
	
	const { data: { user } } = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	
};
