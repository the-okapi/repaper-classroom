<script lang="ts">
	import expand from '$lib/assets/icons/expand.svg';
	import check from '$lib/assets/icons/check.svg';
	import { Combobox } from 'bits-ui';

	let { options, value = $bindable(), ...props } = $props();

	let searchValue = $state('');

	type Member = { user: { id: string; name: string; email: string }; owner: boolean };

	const filteredOptions: Member[] = $derived(
		options
			.filter(
				(o: Member) =>
					o.user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
					o.user.email.toLowerCase().includes(searchValue.toLowerCase())
			)
			.slice(0, 10)
	);
</script>

<Combobox.Root
	type="single"
	{...props}
	bind:value
	onOpenChangeComplete={(o) => {
		if (!o) searchValue = '';
	}}
>
	<div class="relative">
		<Combobox.Input
			defaultValue={value}
			oninput={(e) => (searchValue = e.currentTarget.value)}
		/>
		<Combobox.Trigger class="absolute top-1 right-3 cursor-pointer">
			<img
				src={expand}
				alt="Open the select menu"
				class="inline size-6.5 rounded-md border border-(--o) bg-(--bg) p-1"
			/>
		</Combobox.Trigger>
	</div>
	<Combobox.Portal>
		<Combobox.Content data-select-content class="z-50 mt-2 w-48! border-0!">
			<Combobox.Viewport>
				{#each filteredOptions as option, i (i)}
					<Combobox.Item
						data-select-item
						value={option.user.name}
						class="w-48! hover:bg-(--fg)/5! {i === 0
							? 'rounded-t-xl border-t'
							: ''} {i === filteredOptions.length - 1
							? 'rounded-b-xl border-b'
							: ''} border-x"
					>
						{#snippet children({ selected })}
							<div class="z-60! flex w-fit">
								{#if selected}<img
										src={check}
										class="my-auto mr-2 size-5"
										alt="A checkmark"
									/>{:else}<img
										src={check}
										class="my-auto mr-2 size-5 opacity-0"
										alt="Nothing"
									/>{/if}
								{option.user.name}
							</div>
						{/snippet}
					</Combobox.Item>
				{/each}
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
