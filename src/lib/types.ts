import { object, string } from 'valibot';

export const UserIdSchema = object({
	userId: string()
});

export type SelectItemType = {
	label: string;
	value: string;
};

export type OrganizationMember = {
	user: {
		id: string;
		name: string;
		email: string;
	};
	owner: boolean;
};
