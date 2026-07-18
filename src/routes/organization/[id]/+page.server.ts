import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
    const {
        data: { user }
    } = await locals.supabase.auth.getUser();

    if (!user) {
        redirect(303, '/home');
    }

    const { data, error } = await locals.supabase
        .from('organization_memberships')
        .select('organization ( name )')
        .eq('user', user.id)
        .eq('owner', true)
        .eq('organization', params.id);

    if (!data?.[0]) {
        redirect(303, '/home');
    }

    if (error) {
        redirect(303, '/error');
    }

    return {
        title: data[0].organization.name
    }
}