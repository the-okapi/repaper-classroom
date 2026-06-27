import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const data = await request.formData();
        const email = String(data.get('email'));
        const password = String(data.get('password'));
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            return fail(400, { email, incorrect: true });
        }
        return { success: true };
	}
} satisfies Actions;
