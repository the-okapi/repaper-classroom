<script lang="ts">
    import { Label, Button } from 'bits-ui';

	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.title} - Repaper Classroom</title>
</svelte:head>

<div class="pt-25 px-10 flex gap-4">
	<div class="h-[80vh] w-full flex flex-col gap-4">
		<div class="flex h-full gap-4">
            <div class="h-full w-full bg-(--bg) border border-(--o) rounded-xl p-5 flex items-center">
                <form action="?/rename" method="POST" class="m-auto">
                    <h2 class="font-bold text-center text-2xl">Rename Organization</h2>
                    <div class="mx-auto my-5 w-fit">
                        <Label.Root for="name">Rename To:</Label.Root><br />
                        <input type="text" name="name" id="name" />
                    </div>
                    <Button.Root type="submit" class="block m-auto">Go</Button.Root>
                    {#if form?.renameError}
                        <p class="absolute text-(--red)">{form.message}</p>
                    {/if}
                </form>
            </div>
			<div class="h-full w-full bg-(--bg) border border-(--o) rounded-xl p-5"></div>
		</div>
		<div class="h-full w-full bg-(--bg) border border-(--o) rounded-xl"></div>
	</div>
	<div class="w-full h-[80vh] bg-(--bg) border border-(--o) rounded-xl"></div>
</div>
