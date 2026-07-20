<script lang="ts">
	import { Button, Label } from 'bits-ui';

	let { members, user } = $props();

	let focus = $state(0);

	let m = $derived(members[focus]);
</script>

<div
	class="flex h-[80vh] w-full items-center justify-center overflow-scroll overscroll-none rounded-xl border border-(--o) bg-(--bg) p-5"
>
	{#if focus === -1}
		<div class="h-full w-full">
			<h2 class="mb-5 text-center text-3xl font-bold">List of Members</h2>
			{#each members as member, i (i)}
				<div class="flex px-5 py-3">
					<div class="flex w-fit items-center">
						{#if member.owner}
							<p
								class="w-24 cursor-default rounded-full bg-violet-500 px-3 py-0.5 text-center text-base text-(--bg) select-none"
							>
								Admin
							</p>
						{:else}
							<p
								class="w-24 cursor-default rounded-full bg-(--p) px-3 py-0.5 text-center text-base text-(--bg) select-none"
							>
								Member
							</p>
						{/if}
					</div>
					<p class="m-auto mx-4 w-full overflow-x-scroll text-xl whitespace-nowrap">
						<span class="font-bold">{member.user.name}</span>
						{#if member.user.id === user}
							<span class="text-base opacity-50">(You)</span>
						{/if} -
						<span class="overflow-hidden font-mono text-base text-ellipsis"
							>{member.user.email}</span
						>
					</p>
					<Button.Root onclick={() => (focus = i)}>Manage</Button.Root>
				</div>
				{#if i !== members.length - 1}
					<hr class="m-auto w-[90%] border-(--o)" />
				{/if}
			{/each}
		</div>
	{:else}
		<div class="relative h-full w-full">
			<h2 class="text-center text-3xl font-bold">{m.user.name}</h2>
			<h3 class="text-center font-mono text-lg">{m.user.email}</h3>
			<form action="?/renameMember" method="POST" class="m-auto my-8 w-fit">
				<Label.Root for="name">Rename To:</Label.Root>
				<div class="m-auto flex gap-1">
					<input name="name" id="name" required />
					<Button.Root type="submit">Go</Button.Root>
				</div>
				<input type="hidden" name="user" value={m.user.id} />
			</form>
			<div class="absolute bottom-5 w-full">
				<Button.Root onclick={() => (focus = -1)} class="m-auto block">Back</Button.Root>
			</div>
		</div>
	{/if}
</div>
