import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	const { error } = await locals.supabase.auth.signOut();

	if (error) {
		return json(
			{
				message: error.message
			},
			{ status: 500 }
		);
	}

	return new Response(null, { status: 200 });
};
