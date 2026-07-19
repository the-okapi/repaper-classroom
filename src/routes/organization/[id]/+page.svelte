<script lang="ts">
	import { Label, Button } from 'bits-ui';
	import type { PageProps } from './$types';
	import { CreateMember } from '$lib/components';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.title} - Repaper Classroom</title>
</svelte:head>

<div class="flex gap-4 px-10 pt-25">
	<div
		class="flex h-[80vh] w-full items-center justify-center overflow-scroll overscroll-none rounded-xl border border-(--o) bg-(--bg) p-5"
	>
		<div class="h-full w-full">
			<h2 class="mb-5 text-center text-3xl font-bold">List of Members</h2>
			{#each data.members as member, i (i)}
				<div class="flex px-5 py-3">
					<div class="flex w-fit items-center">
						{#if member.owner}
							<p class="w-24 rounded-full bg-(--red) px-3 py-0.5 text-center text-base text-(--bg)">
								Admin
							</p>
						{:else}
							<p
								class="w-24 rounded-full bg-cyan-600 px-3 py-0.5 text-center text-base text-(--bg)"
							>
								Member
							</p>
						{/if}
					</div>
					<p class="m-auto mx-4 w-full overflow-x-scroll text-xl whitespace-nowrap">
						{member.user.name}
					</p>
					<Button.Root>Manage</Button.Root>
				</div>
				{#if i !== data.members.length - 1}
					<hr class="m-auto w-[90%]" />
				{/if}
			{/each}
		</div>
	</div>
	<div class="flex h-[80vh] w-full flex-col gap-4">
		<div class="flex h-full gap-4">
			<div class="flex h-full w-full items-center rounded-xl border border-(--o) bg-(--bg) p-5">
				<form action="?/rename" method="POST" class="m-auto">
					<h2 class="text-center text-2xl font-bold">Rename Organization</h2>
					<div class="mx-auto my-5 w-fit">
						<Label.Root for="name">Rename To:</Label.Root><br />
						<input type="text" name="name" id="name" />
					</div>
					<Button.Root type="submit" class="m-auto block">Go</Button.Root>
					{#if form?.renameError}
						<p class="absolute text-(--red)">{form.message}</p>
					{/if}
				</form>
			</div>
			<CreateMember {form} />
		</div>
		<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg)"></div>
	</div>
</div>
