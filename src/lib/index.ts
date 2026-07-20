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
