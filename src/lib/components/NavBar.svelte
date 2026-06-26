<script lang="ts">
    import { Popover } from 'bits-ui';
    import Book from '$lib/components/Book.svelte';
</script>

<Popover.Root>
    <Popover.Trigger class="absolute top-5 left-5 p-1.5 border border-(--o) rounded-lg cursor-pointer">
        <Book class="size-6 fill-(--p)" />
    </Popover.Trigger>
</Popover.Root>